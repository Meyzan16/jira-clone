"use client";

import { useFormik } from "formik";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useRouter } from "next/navigation";

import { useCreateTasks } from "../api/use-create-tasks";
import { createTaskSchema } from "../schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { createOrUpdateTaskControls } from "@/constants/tasksControl";
import { DatePicker } from "@/components/ui/date-picker";
import SelectComponent from "@/components/ui/select";
import { TaskPriority, TaskStatus } from "../types";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}

export const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const { setComponentLevelLoader, componentLevelLoader } =
    useContext(GlobalContext)!;

  const { mutate, isPending } = useCreateTasks();

  const formik = useFormik({
    initialValues: {
      name: "",
      workspaceId,
      dueDate: undefined,
      assigneeId: "",
      status: "",
      priority: "",
      projectId: "",
    },
    validate: (values) => {
      const { workspaceId, ...valuesToValidate } = values;
      const result = createTaskSchema
        .omit({ workspaceId: true })
        .safeParse(valuesToValidate);

      if (!result.success) {
        return result.error.flatten().fieldErrors;
      }
      return {};
    },
    onSubmit: (values) => {
       const payload = {
        ...values,
        status: values.status as TaskStatus,
        priority: values.priority as TaskPriority,
      };
      setComponentLevelLoader({ loading: true, id: "create-tasks" });
      mutate(
        { json: payload },
        {
          onSuccess: () => {
            formik.resetForm();
            onCancel?.();
          },
        }
      );
    },
  });

  const { setFieldValue, errors, touched, values, handleChange, handleSubmit } =
    formik;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7 py-4">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {createOrUpdateTaskControls.map((item, index) =>
            item.componentType === "input" ? (
              <Input
                key={index}
                id={item.id}
                label={item.label}
                type={item.type}
                value={values[item.id as keyof typeof values]}
                onChange={handleChange}
                errors={
                  touched[item.id as keyof typeof values]
                    ? errors[item.id as keyof typeof values]
                    : undefined
                }
                touched={touched[item.id as keyof typeof values]}
              />
            ) : item.componentType === "date" ? (
              <div key={index} className="space-y-1">
                <DatePicker
                  onInput
                  value={
                    values[item.id as keyof typeof values] as Date | undefined
                  }
                  onChange={(date) => setFieldValue(item.id, date)}
                />
                {touched[item.id as keyof typeof values] &&
                  errors[item.id as keyof typeof values] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[item.id as keyof typeof values]}
                    </p>
                  )}
              </div>
            ) : item.componentType === "select" ? (
              <div key={index} className="space-y-1">
                <SelectComponent
                  key={item.id}
                  placeholder={item.placeholder}
                  label={item.label}
                  value={values[item.id as keyof typeof values] ?? ""}
                  onChange={(e) => setFieldValue(item.id, e.target.value)}
                  options={
                    item.id === "assigneeId" ? 
                      memberOptions
                    : item.id === "projectId" ?
                      projectOptions
                    : item.options
                  }
                  errors={
                    touched[item.id as keyof typeof values]
                      ? errors[item.id as keyof typeof values]
                      : undefined
                  }
                  touched={touched[item.id as keyof typeof values]}
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
            >
              Cancel
            </Button>

            <Button size="lg" variant="primary" type="submit">
              {componentLevelLoader.loading &&
              componentLevelLoader.id === "create-tasks" ? (
                <CircleLoader color={"#ffffff"} loading={true} />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
