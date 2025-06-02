"use client";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { twMerge } from "tailwind-merge";
interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={twMerge(
          "size-10 text-md relative  overflow-hidden",
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={twMerge("size-8", className)}>
        <AvatarFallback className="text-white bg-primarygreen font-semibold text-md uppercase">
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
};
