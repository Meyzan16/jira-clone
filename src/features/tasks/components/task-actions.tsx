"use client";

import {
  ExternalLinkIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteTask } from "../api/use-delete-task";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/app/context";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModal } from "../hooks/use-edit-tasks-modal";



interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const {open} = useEditTaskModal();

  const { setPageLevelLoader } = useContext(GlobalContext)!;

  const  [ConfirmDialog, Confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone . ",
  ); 

  const {mutate, isPending} = useDeleteTask();

  useEffect(() => {
    setPageLevelLoader(isPending);
  }, [isPending, setPageLevelLoader]);


  const onDelete = async () => {
    const ok = await Confirm();
    if(!ok) return;
    mutate({param: {taskId: id}}); 
  }

  const onOpenTask =  () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/project/${projectId}`);
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-9999" sideOffset={5}>
          <DropdownMenuItem onClick={onOpenTask} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onOpenProject}  className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => open(id)} className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Tasks
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
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
