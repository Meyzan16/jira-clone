"use client";

import { useFormik } from "formik";
import { updateWorkSpaceSchema } from "../schemas";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { createOrUpdateWorkSpaceControls } from "@/constants/workSpacesControls";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useRouter } from "next/navigation";

import UploadImage from "@/components/ui/uploadImage";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { getFormikError } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

interface editWorkSpaceFromProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkSpaceForm = ({ onCancel , initialValues }: editWorkSpaceFromProps) => {
  const router = useRouter();
  const { pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext)!;

  const { mutate } = useUpdateWorkspace();

  const formik = useFormik<Workspace>({
    initialValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
    validate: (values) => {
      const result = updateWorkSpaceSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors;
      }
      return {};
    },
    onSubmit: (values) => {
      setPageLevelLoader(true);
      mutate(
        { form: values,
          param: { workspaceId: initialValues.$id },
        },
        {
          onSuccess: ({ data }) => {
            formik.resetForm();
            router.push(`/workspaces/${data.$id}`);
          },
        }
      );
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)} > 
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
          {createOrUpdateWorkSpaceControls.map((item, index) =>
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
                  values[item.id as keyof typeof values] as File | string | null
                }
                onChange={(file) => formik.setFieldValue(item.id, file)}
              />
            ) : null
          )}

          <DottedSeparator />

          <div className="flex items-center justify-between">
            <Button size="lg" variant="secondary" onClick={() => onCancel?.()} className={onCancel ? "block" : "invisible"}>
              Cancel
            </Button>

            <Button size="lg" variant="primary" type="submit" disabled={pageLevelLoader}>
              {pageLevelLoader === true ? (
                <CircleLoader color={"#ffffff"} loading={pageLevelLoader} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
