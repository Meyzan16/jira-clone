"use client";

import { useFormik } from "formik";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useRouter } from "next/navigation";

import UploadImage from "@/components/ui/uploadImage";
import { Project } from "../types";
import { updateProjectSchema } from "../schema"; 
import { useUpdateProject } from "../api/use-update-project";
import { getFormikError } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import Input from "@/components/ui/input";
import { createOrUpdateProjectControls } from "@/constants/projectsControls";
import { useDeleteProject } from "../api/use-delete-project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormProps) => {
  console.log("initialValues", initialValues);
  const router = useRouter();
  const { pageLevelLoader, componentLevelLoader, setComponentLevelLoader, setPageLevelLoader } = useContext(GlobalContext)!;

  const { mutate } = useUpdateProject();

  const { mutate: deleteProject } = useDeleteProject();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undone"
  );

   const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    setPageLevelLoader(true);
    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValues.workspaceId}`;
        },
      }
    )
  };


  const formik = useFormik<Project>({
    initialValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
    validate: (values) => {
      const result = updateProjectSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors;
      }
      return {};
    },
    onSubmit: (values) => {
      setComponentLevelLoader({loading: true, id: "updated-project"});
      mutate(
        { form: values, param: { projectId: initialValues.$id } }
      );
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;


  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.workspaceId}/project/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7 py-4">
          <DottedSeparator />
        </div>
        <CardContent className="px-7">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {createOrUpdateProjectControls.map((item, index) =>
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
                      ? getFormikError(errors[item.id as keyof typeof values])
                      : undefined
                  }
                  touched={!!touched[item.id as keyof typeof values]}
                />
              ) : item.componentType === "file" ? (
                <UploadImage
                  key={index}
                  id={item.id}
                  label={item.label}
                  value={
                    values[item.id as keyof typeof values] as
                      | File
                      | string
                      | null
                  }
                  onChange={(file) => formik.setFieldValue(item.id, file)}
                />
              ) : null
            )}

            <DottedSeparator />

            <div className="flex items-center justify-between">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onCancel?.()}
                className={onCancel ? "block" : "invisible"}
              >
                Cancel
              </Button>

              <Button
                size="md"
                variant="primary"
                type="submit"
                disabled={pageLevelLoader}
              >
                {componentLevelLoader.loading && componentLevelLoader.id === 'updated-project' ? <CircleLoader color={"#D3D3D3"} loading={true} /> : "Updated Changes" }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all data
              associated .
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
