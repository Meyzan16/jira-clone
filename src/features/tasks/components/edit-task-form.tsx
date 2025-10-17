"use client";

import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useCreateTasks } from "../api/use-create-tasks";
import { createTaskSchema } from "../schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { createOrUpdateTaskControls } from "@/constants/tasksControl";
import { DatePicker } from "@/components/ui/date-picker";
import SelectComponent from "@/components/ui/select";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useUpdateTask } from "../api/use-update-tasks";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  initialValues: Task; // task yang sedang diedit
}

type FormValues = {
  name: string;
  workspaceId: string;
  dueDate?: Date;
  assigneeId: string;
  status: "" | TaskStatus;
  priority: "" | TaskPriority;
  projectId: string;
};

function toFormValues(task: Task | undefined, workspaceId: string): FormValues {
  if (!task) {
    return {
      name: "",
      workspaceId,
      dueDate: undefined,
      assigneeId: "",
      status: "",
      priority: "",
      projectId: "",
    };
  }
  return {
    name: task.name ?? "",
    workspaceId,
    // pastikan Date object
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    assigneeId: task.assigneeId ?? task.assignee?.id ?? "",
    status: (task.status as TaskStatus) ?? "",
    priority: (task.priority as TaskPriority) ?? "",
    projectId: task.projectId ?? task.project?.id ?? "",
  };
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const { setComponentLevelLoader, componentLevelLoader } =
    useContext(GlobalContext)!;

  const { mutate, isPending } = useUpdateTask();

  //useMemo hanya dihitung ulang saat initialValues/workspaceId berubah (hemat render).
  const initialFormValues = useMemo(
    () => toFormValues(initialValues, workspaceId),
    [initialValues, workspaceId]
  );

  const formik = useFormik<FormValues>({
    initialValues: initialFormValues,
    enableReinitialize: true, // <- biar form ikut berubah ketika props initialValues berubah
    validate: (values) => {
      const { workspaceId, ...valuesToValidate } = values;
      const result = createTaskSchema
        .omit({ workspaceId: true, description: true })
        .safeParse(valuesToValidate);

      if (!result.success) {
        return result.error.flatten().fieldErrors as Partial<
          Record<keyof FormValues, string>
        >;
      }
      return {};
    },
    onSubmit: (values) => {
      const json = {
        name: values.name,
        dueDate: values.dueDate ?? undefined,   
        assigneeId: values.assigneeId || undefined,
        status: values.status || undefined,     
        priority: values.priority || undefined, 
        projectId: values.projectId || undefined
      };

      const param = { taskId: initialValues.$id };
      setComponentLevelLoader({ loading: true, id: "edit-tasks" });
      mutate(
        { json, param }, 
        {
          onSuccess: () => {  
            formik.resetForm();
            onCancel?.();
          },
          onSettled: () => {
            setComponentLevelLoader({ loading: false, id: "" });
          },
        }
      );
    },
  });

  const {
    setFieldValue,
    errors,
    touched,
    values,
    handleChange,
    handleSubmit,
  } = formik;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit task</CardTitle>
      </CardHeader>

      <div className="px-7 py-4">
        <DottedSeparator />
      </div>

      <CardContent className="px-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {createOrUpdateTaskControls.map((item) =>
            item.componentType === "input" ? (
              <Input
                key={item.id} // <- pakai id, bukan index
                id={item.id}
                label={item.label}
                type={item.type}
                value={values[item.id as keyof FormValues] as string}
                onChange={handleChange}
                errors={
                  touched[item.id as keyof FormValues]
                    ? (errors[item.id as keyof FormValues] as string | undefined)
                    : undefined
                }
                touched={touched[item.id as keyof FormValues]}
              />
            ) : item.componentType === "date" ? (
              <div key={item.id} className="space-y-1">
                <DatePicker
                  value={values[item.id as keyof FormValues] as Date | undefined}
                  onChange={(date) => setFieldValue(item.id, date)}
                />
                {touched[item.id as keyof FormValues] &&
                  errors[item.id as keyof FormValues] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[item.id as keyof FormValues] as string}
                    </p>
                  )}
              </div>
            ) : item.componentType === "select" ? (
              <div key={item.id} className="space-y-1">
                <SelectComponent
                  placeholder={item.placeholder}
                  label={item.label}
                  // pastikan value string
                  value={
                    (values[item.id as keyof FormValues] as string | undefined) ??
                    ""
                  }
                  onChange={(e) => setFieldValue(item.id, e.target.value)}
                  options={
                    item.id === "assigneeId"
                      ? memberOptions // [{id,name}]
                      : item.id === "projectId"
                      ? projectOptions // [{id,name,imageUrl}]
                      : item.options
                  }
                  errors={
                    touched[item.id as keyof FormValues]
                      ? (errors[item.id as keyof FormValues] as
                          | string
                          | undefined)
                      : undefined
                  }
                  touched={touched[item.id as keyof FormValues]}
                />
              </div>
            ) : null
          )}

          <DottedSeparator />

          <div className="flex items-center justify-between">
            <Button
              size="lg"
              variant="secondary"
              onClick={onCancel}
              className={onCancel ? "block" : "invisible"}
              type="button"
            >
              Cancel
            </Button>

            <Button size="lg" variant="primary" type="submit" disabled={isPending}>
              {componentLevelLoader.loading &&
              componentLevelLoader.id === "edit-tasks" ? (
                <CircleLoader color={"#ffffff"} loading={true} />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
