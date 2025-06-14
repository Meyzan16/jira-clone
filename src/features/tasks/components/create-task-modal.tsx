"use client";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";
import { CreateTaskFormWrapper } from "./create-task-modal-wrapper";

export const CreateTaskModal = () => {
    const { isOpen, setIsOpen, close} = useCreateTasksModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskFormWrapper onCancel={close} />
        </ResponsiveModal>)
}