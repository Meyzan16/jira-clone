"use client";

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/app/context";

const severityStyles: Record<string, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const severityIcons: Record<string, string> = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
};

const AlertComponent = () => {
  const { openAlert, setOpenAlert } = useContext(GlobalContext)!;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (openAlert.status) {
      setIsVisible(true); // Munculkan alert dengan animasi
      const timer = setTimeout(() => {
        setIsVisible(false); // Sembunyikan alert setelah 5 detik
        setTimeout(() => {
          setOpenAlert({ status: false, message: "", severity: "" });
        }, 300); // Delay sebelum menghapus data agar animasi smooth
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openAlert.status, setOpenAlert]);

  if (!openAlert.status) return null;
  return (
    <div
      className={`fixed left-1/2 top-0 transform -translate-x-1/2 w-auto px-6 py-3 rounded-full flex items-center shadow-lg transition-all duration-300 ${
        isVisible ? "translate-y-20 opacity-100" : "-translate-y-full opacity-0"
      } ${severityStyles[openAlert.severity]}`}
      data-severity={openAlert.severity}
    >
      <div className="flex gap-4 items-center justify-center">
        <span className="mr-2">{severityIcons[openAlert.severity]}</span>
        <span className="font-Poppins">{openAlert.message}</span>
        <button
          className="ml-auto text-lg font-bold"
          onClick={() => setIsVisible(false)}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default AlertComponent;
