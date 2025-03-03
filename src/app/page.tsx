"use client";

import { Badge } from "@/components/ui/badge";
import CircleLoader from "@/components/ui/circleloader";
import Input from "@/components/ui/input";
import PulseLoader from "@/components/ui/pulseloader";
import { loginFormControls } from "@/constants/authControls";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { GlobalContext } from "./context";
import AlertComponent from "@/components/ui/alert";
import SelectComponent from "@/components/ui/select";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { useCurrent } from "@/features/auth/api/use-current";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/api/use-logout";

const Home = () => {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);

  return (
    <div className="my-8">
      Only visible to authenticated users
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
};

export default Home;
