import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props //digunakan untuk atribut tambahan
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-primary text-white hover:bg-primary/90",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2 w-10 h-10 flex items-center justify-center",
  };

  return (
    <button
      className={twMerge(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
