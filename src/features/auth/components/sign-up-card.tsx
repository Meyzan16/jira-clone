"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import {Button} from "@/components/ui/button";
import { useFormik } from "formik";
import { GlobalContext } from "@/app/context";
import { signUpFormControls } from "@/constants/authControls";
import Input from "@/components/ui/input";
import Link from "next/link";
import CircleLoader from "@/components/ui/circleloader";
import { signUpSchema } from "../schema";
import { useRegister } from "../api/use-register";



const SignUpCard = () => {
  const { pageLevelLoader, setPageLevelLoader } =
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
      mutate(
        { json: values }
      );
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Card className="md:w-[487px] w-full h-full  border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center pt-4">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
      </CardHeader>
        <CardDescription className="items-center text-center pb-4 ">
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
            <Button size="lg" variant="primary" type="submit">
              {pageLevelLoader === true ? (
                <CircleLoader color={"#D3D3D3"} loading={pageLevelLoader} />
              ) : (
                "Register"
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
