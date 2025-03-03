"use client";

import React from "react";

// Komponen utama Avatar
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
));
Avatar.displayName = "Avatar";

// Komponen untuk menampilkan gambar Avatar
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<"img">
>(({ className = "", ...props }, ref) => (
  <img
    ref={ref}
    className={`aspect-square h-full w-full ${className}`}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

// Komponen fallback jika gambar tidak tersedia
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    {...props}
  >
    {children || "?"}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

// Ekspor semua komponen
export { Avatar, AvatarImage, AvatarFallback };
