"use client";

import AlertComponent from "@/components/ui/alert";
import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import { GlobalContext } from "../context";
import { useContext } from "react";

interface StandloneLayoutProps {
  children?: React.ReactNode;
}

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  const { openAlert } = useContext(GlobalContext)!;

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
            <Link href="/">
                <Image src="/logo.svg" alt="logo" height={56} width={152}/>
            </Link>
            <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>

      {openAlert.status == true && <AlertComponent />}
    </main>
  );
};

export default StandloneLayout;
