'use client';


import { Badge } from "@/components/ui/badge";
import CircleLoader from "@/components/ui/circleloader";
import Input from "@/components/ui/input";
import PulseLoader from "@/components/ui/pulseloader";
import { loginFormControls } from "@/constants/authControls";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { GlobalContext } from "./context";
import AlertComponent from "@/components/ui/alert";
import SelectComponent from "@/components/ui/select";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";




const Home = () => {

  const [pageLevelLoader, setPageLevelLoader] = useState(false);

  const { openAlert, setOpenAlert } = useContext(GlobalContext)!;



  return (
    <div className="my-8">

      <PulseLoader text="Loading...testtt" color={"#FF5722"} loading={true} size={10} />

      <CircleLoader text="Loading..." color="#ff0000" loading={true} size={20} />

      <Badge variant="default">Default Badge</Badge>
      <Badge variant="secondary">Secondary Badge</Badge>
      <Badge variant="destructive">Destructive Badge</Badge>
      <Badge variant="outline">Outline Badge</Badge>

      <Skeleton className="w-24 h-24 rounded-full" /> {/* Circle Skeleton */}
      <Skeleton className="w-full h-8" aria-hidden="true" />

      <div className="flex gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="muted">muted</Button>
            <Button variant="outline">outline</Button>
            <Button variant="teritrary">teritrary</Button>
      </div>

    {openAlert.status == true && (
        <AlertComponent />
      )}
    </div>    

  );
}

export default Home;
