"use client";

import Image, {  ImageProps } from "next/image";
import React from "react";

// Komponen utama Avatar
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-8 w-8 shrink-0 overflow-hiddens ${className}`}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLDivElement,
  ImageProps
>(({ className = "", ...props }, ref) => {
  const { alt = "", ...rest } = props;

  return (
    <div
      ref={ref}
      className={`aspect-square h-full w-full ${className}`}
    >
      <Image
        fill
        sizes="40px"
        className="object-cover"
        alt={alt}
        {...rest}
      />
    </div>
  );
});
AvatarImage.displayName = "AvatarImage";



// Komponen fallback jika gambar tidak tersedia
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-full w-full items-center justify-center bg-muted rounded-lg  ${className}`}
    {...props}
  >
    {children || "?"}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

// Ekspor semua komponen
export { Avatar, AvatarImage, AvatarFallback };
