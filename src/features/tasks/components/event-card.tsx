import { Project } from "@/features/projects/types";
import { TaskStatus } from "../types";
import { twMerge } from "tailwind-merge";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
interface EventCardProps {
    title: string;
    project: { id: string; name: string; imageUrl?: string };
    assignee: { id: string; name: string };
    status: string;
    priority: string;
    id: string;
}

const colorMap: Record<string, string> = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_PREVIEW]: "border-l-blue-500",
    [TaskStatus.DONE]: "border-l-emerald-500",
}

export const EventCard = ({ title, project, assignee, status, priority, id }: EventCardProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const  onClick = (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    }

    return (
        <div className="px-2">
            <div onClick={onClick} className={twMerge("p-1.5 text-xs bg-white text-primary border rounded-md  border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition", colorMap[status])}>
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <MemberAvatar 
                        className="size-6"
                        fallbackClassName="text-xs"
                        name={assignee.name}
                    />
                    <div className="size-1 rounded-full bg-neutral-300"></div>
                    <ProjectAvatar
                        name={project?.name}
                        image={project.imageUrl}
                    />
                </div>
            </div>
        </div>
    )
};