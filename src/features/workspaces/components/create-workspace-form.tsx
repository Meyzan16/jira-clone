"use client";

import { useFormik } from "formik";
import {useRef} from "react";
import { createWorkSpaceSchema } from "../schemas";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { createWorkSpaceControls } from "@/constants/workSpacesControls";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useCreateWorkspace } from "../api/use-create-workspace";
import Image from "next/image";

import { ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UploadImage from "@/components/ui/uploadImage";

interface createWorkSpaceFromProps {
  onCancel?: () => void;
}

export const CreateWorkSpaceForm = ({ onCancel }: createWorkSpaceFromProps) => {
  const { setOpenAlert, pageLevelLoader, setPageLevelLoader } =
    useContext(GlobalContext)!;
  const { mutate } = useCreateWorkspace();

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    validate: (values) => {
      const result = createWorkSpaceSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors; // Konversi error agar kompatibel dengan Formik
      }
      return {};
    },
    onSubmit: (values) => {
      setPageLevelLoader(true);
      console.log(values);
      
      mutate({ form: values }, {
        onSuccess:() => {
          formik.resetForm();
          //TODO: redirecting  to new workspace
        }
      });
    },
  });



  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7 py-4">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {createWorkSpaceControls.map((item, index) =>
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
                  value={values[item.id as keyof typeof values] as File | string | null}
                  onChange={(file) => formik.setFieldValue(item.id, file)}
                />
            ): null
          )}

          <DottedSeparator />

          <div className="flex items-center justify-between">
            <Button size="lg" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>

            <Button size="lg" variant="primary" type="submit">
              {pageLevelLoader === true ? (
                <CircleLoader color={"#ffffff"} loading={pageLevelLoader} />
              ) : (
                "Create Workspace"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
