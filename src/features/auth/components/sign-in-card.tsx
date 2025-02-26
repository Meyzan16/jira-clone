"use client";

import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import DottedSeparator from "@/components/dotted-separator";
import Button from "@/components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GlobalContext } from "@/app/context";
import { loginFormControls } from "@/constants/authControls";
import Input from "@/components/input";
import PulseLoader from "@/components/pulseloader";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignInCard = () => {
  const [pageLevelLoader, setPageLevelLoader] = useState(false);

  const { openAlert, setOpenAlert } = useContext(GlobalContext)!;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      personalgoal: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setPageLevelLoader(true);
      setOpenAlert({
        status: true,
        message: "Login Berhasil",
        severity: "success",
      });
      console.log("Form Data:", values);
      setTimeout(() => {
        setPageLevelLoader(false);
      }, 1000);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="md:w-[487px] lg:w-full lg:h-full w-full h-full  border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
      </CardHeader>
      <div className="px-7 mb-4">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {loginFormControls.map((item, index) =>
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
            ) : null
          )}

          <div className="w-full mt-5">
            <Button variant="primary" type="submit">
              {pageLevelLoader === true ? (
                <PulseLoader
                  text={"Login"}
                  color={"#ffffff"}
                  loading={pageLevelLoader}
                />
              ) : (
                "Loginnn"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
