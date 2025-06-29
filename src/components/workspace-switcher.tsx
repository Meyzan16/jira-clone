"use client"

import {RiAddCircleFill} from "react-icons/ri";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWorkspace } from "./ui/select-plus-images";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useMemo } from "react";

// Tipe item untuk list workspace
interface WorkspaceItem {
    $id: string;
    name: string;
    imageUrl: string;
  }

export const WorkSpaceSwitcher = () => {
    const workspaceId = useWorkspaceId();

    const router = useRouter();
    const {data : workspaces} = useGetWorkspace();

    const {open} = useCreateWorkspaceModal();
    
    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }

    const documents = useMemo(() => (
        workspaces?.documents as WorkspaceItem[] | undefined
      ), [workspaces]);

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill onClick={open} className="size-5  text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            <SelectWorkspace onValueChange={onSelect} value={workspaceId}  items={documents} >
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-2">
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    {
                        documents?.map((workspace) => (
                            <SelectItem key={workspace.$id} value={workspace.$id}>
                                <div className="flex justify-start items-center gap-3 font-medium">
                                    <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                                    <span className="truncate">{workspace.name}</span>
                                </div>
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </SelectWorkspace>
        </div>
    )
}