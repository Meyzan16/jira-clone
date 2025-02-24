'use client';


import { Badge } from "@/components/badge";
import CircleLoader from "@/components/circleloader";
import Input from "@/components/input";
import PulseLoader from "@/components/pulseloader";
import { loginFormControls } from "@/constants/authControls";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { GlobalContext } from "./context";
import AlertComponent from "@/components/alert";
import SelectComponent from "@/components/select";
import Button from "@/components/button";
import Skeleton from "@/components/skeleton";


const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
});


const Home = () => {

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
        })
        console.log("Form Data:", values);
        setTimeout(() => {
          setPageLevelLoader(false);
        },1000)
      },
  });
  

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="my-8">

      <PulseLoader text="Loading...testtt" color={"#FF5722"} loading={true} size={10} />

      <CircleLoader text="Loading..." color="#ff0000" loading={true} size={20} />

      <Badge variant="default">Default Badge</Badge>
      <Badge variant="secondary">Secondary Badge</Badge>
      <Badge variant="destructive">Destructive Badge</Badge>
      <Badge variant="outline">Outline Badge</Badge>

      <div className="lg:w-1/2 w-full px-12 py-12 lg:mx-0 ">
        <form onSubmit={handleSubmit}>
                {loginFormControls.map((item, index) =>
                  item.componentType === "input" ? (
                    <Input
                      key={index}
                      id={item.id}
                      label={item.label}
                      type={item.type}
                      value={values[item.id as keyof typeof values]}
                      onChange={handleChange}
                      errors={touched[item.id as keyof typeof values] ? errors[item.id as keyof typeof values] : undefined} 
                      touched={touched[item.id as keyof typeof values]}
                    />
                  ) : item.componentType === "select" ? (
                    <SelectComponent
                      name={item.id}
                      key={item.id}
                      options={item.options}
                      label={item.label}
                      onChange={handleChange}
                      value={values[item.id as keyof typeof values]}
                    />
                  ) : null
                )}

                <div className="w-full mt-5">
                <Button variant="default" type="submit" >

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
      </div>

      <Skeleton className="w-24 h-24 rounded-full" /> {/* Circle Skeleton */}
      <Skeleton className="w-full h-8" aria-hidden="true" />

    {openAlert.status == true && (
        <AlertComponent />
      )}
    </div>    

  );
}

export default Home;
