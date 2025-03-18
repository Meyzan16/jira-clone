"use client";

import { ResponsiveModal } from "@/components/ui/responsive-modal";

import { CreateWorkSpaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
    const {isOpen, setIsOpen} = useCreateWorkspaceModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkSpaceForm />
        </ResponsiveModal>
    )
}