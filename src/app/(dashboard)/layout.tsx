"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useContext } from "react";
import { GlobalContext } from "../context";
import AlertComponent from "@/components/ui/alert";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { openAlert } = useContext(GlobalContext)!;

  return (
    <div className="min-h-screen">
      <div className="flex w-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>

      {openAlert.status == true && <AlertComponent />}
    </div>
  );
};

export default DashboardLayout;
