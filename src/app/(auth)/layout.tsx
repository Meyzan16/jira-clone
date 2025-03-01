"use client";

import AlertComponent from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Image from "next/image";
import React, { useContext } from "react";
import { GlobalContext } from "../context";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { openAlert } = useContext(GlobalContext)!;
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <main className="bg-neutral-100 min-h-screen ">
      <div className="mx-auto max-w-screen-2xl p-6">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" height={60} width={152} alt="logo" />
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Link href={isSignIn ? "/sign-up" : "sign-in"}>
                {isSignIn ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14 font-sans">
          {children}
        </div>
      </div>

      {openAlert.status == true && <AlertComponent />}
    </main>
  );
};

export default AuthLayout;
