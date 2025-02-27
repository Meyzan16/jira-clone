"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import React, { useContext, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import DottedSeparator from "@/components/dotted-separator";
import Button from "@/components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GlobalContext } from "@/app/context";
import { loginFormControls, signUpFormControls } from "@/constants/authControls";
import Input from "@/components/input";
import Link from "next/link";
import CircleLoader from "@/components/circleloader";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});

const SignUpCard = () => {
  const { openAlert, setOpenAlert, pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext)!;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setPageLevelLoader(true);
      setOpenAlert({ status: true, message: "Login Berhasil", severity: "success"});

      console.log("Form Data:", values);

      setTimeout(() => {
        setPageLevelLoader(false); // Loader berhent
      }, 1000);

      console.log('open alert end', openAlert.status)

    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="md:w-[487px] w-full h-full  border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Sign Up
        </CardTitle>
        <CardDescription>
            By signing up , you agree to our {" "}
            <Link href="/privacy">
              <span className="text-blue-700 hover:cursor-pointer">Privacy Policy</span>
            </Link>{" "}
            and{" "}
            <Link href="/terms">
              <span className="text-blue-700 hover:cursor-pointer">
                Terms of Service  
              </span>
            </Link>{" "}

        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-4">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {signUpFormControls.map((item, index) =>
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

          <div className="flex flex-col mt-5">
            <Button variant="primary" type="submit">
              {pageLevelLoader === true ? (
                <CircleLoader
                  color={"#ffffff"}
                  loading={pageLevelLoader}
                />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <div className="px-7 mb-4">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4 ">
        <Button disabled={false} variant="outline" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>

        <Button disabled={false} variant="outline" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
