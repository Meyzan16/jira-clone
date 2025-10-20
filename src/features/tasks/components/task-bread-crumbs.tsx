import { Project } from "@/features/projects/types";
import { Task } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
interface TaskBreadCrumbsProps {
    project: Project;
    task: Task
}

export const TaskBreadCrumbs = ({project, task} : TaskBreadCrumbsProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext)!;

    const {mutate} = useDeleteTask();

    const  [ConfirmDialog, Confirm] = useConfirm(
        "Delete Task",
        "This action cannot be undone . ",
      );  

    const handelDeleteTask = async () => {
        const ok = await Confirm();
        if(!ok) return;
        setPageLevelLoader(true);
        mutate({param: {taskId: task.$id}}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`);
            }
        }); 
    }

    return (    
        <div className="flex items-center gap-x-2">
            <ConfirmDialog />
            <ProjectAvatar 
                name={project.name}
                image={project.imageUrl}
                className="size-6 lg:size-8"
                />

            <Link href={`/workspace/${workspaceId}/project/${project.$id}`}>
                <p className="text-sm lg:text-lg font-semibold  text-muted-foreground hover:opacity-75 transition">
                    {project.name}
                </p>
            </Link>

            <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />

            <p className="text-sm lg:text-lg font-semibold">
                {task.name}
            </p>

            <Button
                onClick={handelDeleteTask}
                disabled={pageLevelLoader}
                className="ml-auto"
                variant="destructive"
                size="md"
                >
                <TrashIcon className="size-4 lg:mr-2"/>
                        <span className="hidden lg:block">Delete Task</span>    
            </Button>
        </div>
    )
}