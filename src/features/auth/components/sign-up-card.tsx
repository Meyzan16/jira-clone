"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import Button from "@/components/ui/button";
import { useFormik } from "formik";
import { GlobalContext } from "@/app/context";
import { signUpFormControls } from "@/constants/authControls";
import Input from "@/components/ui/input";
import Link from "next/link";
import CircleLoader from "@/components/ui/circleloader";
import { z } from "zod";
import { signUpSchema } from "../schema";
import { useRegister } from "../api/use-register";



const SignUpCard = () => {
  const { openAlert, setOpenAlert, pageLevelLoader, setPageLevelLoader } =
    useContext(GlobalContext)!;

  const {mutate} = useRegister();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      const result = signUpSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors; // Konversi error
      }
      return {};
    },
    onSubmit: (values) => {
      setPageLevelLoader(true);
      setOpenAlert({
        status: true,
        message: "Login Berhasil",
        severity: "success",
      });

      mutate(
        { json: values },
        {
          onSuccess: (data) => {
            console.log("Form Data server:", data); // Response dari server
          },
          onError: (error) => {
            console.error("Login Failed:", error);
          },
        }
      );

      setTimeout(() => {
        setPageLevelLoader(false);
      }, 1000);

      console.log("open alert end", openAlert.status);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="md:w-[487px] w-full h-full  border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up , you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700 hover:cursor-pointer">
              Privacy Policy
            </span>
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
                <CircleLoader color={"#ffffff"} loading={pageLevelLoader} />
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

      <div className="px-7 mb-4">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account ?
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp;Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
