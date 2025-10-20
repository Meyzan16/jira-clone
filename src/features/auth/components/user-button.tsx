"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DottedSeparator from "@/components/ui/dotted-separator";
import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import CircleLoader from "@/components/ui/circleloader";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UserButton = () => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <CircleLoader color={"#D3D3D3"} loading={true} />
      </div>
    );
  }

  if (!user || !user.data) {
    return null;
  }

  // Ambil name dan email dari objek `data`
  const { name, email } = user.data;

  // Ambil karakter pertama dari name atau email untuk fallback avatar
  const avatarFallback =
    name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] ">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center ">
            <p className="text-sm font-medium text-neutral-900">
              {name || "user"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
