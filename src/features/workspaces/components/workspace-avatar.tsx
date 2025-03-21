"use client";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { twMerge } from "tailwind-merge";
interface WorkSpaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkSpaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={twMerge(
          "size-10 relative rounded-lg overflow-hidden",
          className
        )}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={twMerge("size-10 rounded-lg", className)}>
        <AvatarFallback className="text-white bg-blue-400 font-semibold text-lg uppercase">
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
};
