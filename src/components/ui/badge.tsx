"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge: React.FC<BadgeProps> = ({ variant = "default", className, ...props }) => {
  const baseClasses =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  let variantClasses = "";

  switch (variant) {
    case "secondary":
      variantClasses = "border-transparent bg-secondaryDefault text-white hover:bg-secondary/80";
      break;
    case "destructive":
      variantClasses = "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80";
      break;
    case "outline":
      variantClasses = "text-foreground border border-gray-300";
      break;
    default:
      variantClasses = "border-transparent bg-primaryGreen text-primary-foreground shadow hover:bg-primary/80";
  }

  return <div className={`${baseClasses} ${variantClasses} ${className || ""}`} {...props} />;
};

export { Badge };
