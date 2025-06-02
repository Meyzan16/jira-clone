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

import UploadImage from "@/components/ui/uploadImage";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schema";
import { createOrUpdateProjectControls } from "@/constants/projectsControls";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface createProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: createProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { pageLevelLoader, setComponentLevelLoader , componentLevelLoader } = useContext(GlobalContext)!;

  const { mutate } = useCreateProject();

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      workspaceId: workspaceId,
    },
    validate: (values) => {
      const result = createProjectSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors; // Konversi error agar kompatibel dengan Formik
      }
      return {};
    },
    onSubmit: (values) => {
      setComponentLevelLoader({loading: true, id: "create-project"});
      mutate(
        { form: values },
        {
          onSuccess: () => {
            formik.resetForm();
            // TODO : redirect to project screen
          },
        }
      );
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
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
                    ? errors[item.id as keyof typeof values]
                    : undefined
                }
                touched={touched[item.id as keyof typeof values]}
              />
            ) : item.componentType === "file" ? (
              <UploadImage
                key={index}
                id={item.id}
                label={item.label}
                value={
                  values[item.id as keyof typeof values] as File | string | null
                }
                onChange={(file) => formik.setFieldValue(item.id, file)}
              />
            ) : null
          )}

          <DottedSeparator />

          <div className="flex items-center justify-between">
            <Button size="lg" variant="secondary" onClick={onCancel} className={onCancel ? "block" : "invisible"}>
              Cancel
            </Button>

            <Button size="lg" variant="primary" type="submit">
              {componentLevelLoader.loading && componentLevelLoader.id === 'create-project' ? <CircleLoader color={"#D3D3D3"} loading={true} /> : "Create" }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
