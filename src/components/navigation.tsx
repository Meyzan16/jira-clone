"use client";

import { SettingsIcon, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "My settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "My members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathName = usePathname();

  return (
    <div className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathName === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={`flex items-center gap-2.5 p-2.5 rounded-md font-poppins text-nowrap hover:text-dark  transition text-neutral-500 
                ${isActive && "bg-white shadow-sm hover:opacity-100 text-primarygreen"} `}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
