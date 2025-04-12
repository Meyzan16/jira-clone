"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { twMerge } from "tailwind-merge";
interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  name,
  className,
  fallbackClassName
}: MemberAvatarProps) => {

  return (
    <Avatar className={twMerge("size-5 transition border-neutral-300 rounded-full", className)}>
        <AvatarFallback className={twMerge("bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center", fallbackClassName)}>
            {name.charAt(0).toUpperCase()}
        </AvatarFallback>
    </Avatar>
  )
};
