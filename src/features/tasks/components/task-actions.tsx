"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ExternalLinkIcon,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-9999" sideOffset={5}>
          <DropdownMenuItem onClick={() => {}} disabled={false} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} disabled={false} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {}} disabled={false} className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Tasks
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Tasks
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
