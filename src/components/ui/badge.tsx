"use client";

import React from "react";
import { TaskStatus, TaskPriority } from "@/features/tasks/types";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | TaskStatus | TaskPriority;
}

const statusVariantClasses: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "border-transparent bg-red-400 text-primary hover:bg-red-400/80",
  [TaskStatus.IN_PROGRESS]: "border-transparent bg-yellow-400 text-primary hover:bg-yellow-400/80",
  [TaskStatus.IN_PREVIEW]: "border-transparent bg-blue-400 text-primary hover:bg-blue-400/80",
  [TaskStatus.DONE]: "border-transparent bg-emerald-400 text-primary hover:bg-emerald-400/80",
  [TaskStatus.BACKLOG]: "border-transparent bg-pink-400 text-primary hover:bg-pink-400/80",
};

const priorityVariantClasses: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "border-transparent bg-green-200 text-green-800 hover:bg-green-300",
  [TaskPriority.MEDIUM]: "border-transparent bg-yellow-400 text-orange-800 hover:bg-orange-300",
  [TaskPriority.HIGH]: "border-transparent bg-red-200 text-red-800 hover:bg-red-300",
};

const Badge: React.FC<BadgeProps> = ({ variant = "default", className, ...props }) => {
  const baseClasses =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  let variantClasses = "";

  if (variant === "secondary") {
    variantClasses = "border-transparent bg-secondaryDefault text-white hover:bg-secondary/80";
  } else if (variant === "destructive") {
    variantClasses = "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80";
  } else if (variant === "outline") {
    variantClasses = "text-foreground border border-gray-300";
  } else if ((Object.values(TaskStatus) as string[]).includes(variant)) {
    variantClasses = statusVariantClasses[variant as TaskStatus];
  } else if ((Object.values(TaskPriority) as string[]).includes(variant)) {
    variantClasses = priorityVariantClasses[variant as TaskPriority];
  } else {
    variantClasses = "border-transparent bg-primaryGreen text-primary-foreground shadow hover:bg-primary/80";
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className || ""}`} {...props} />
  );
};

export { Badge };
