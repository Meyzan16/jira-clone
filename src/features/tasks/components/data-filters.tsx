import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { DatePicker } from "@/components/ui/date-picker";

import { SelectWorkspace, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select-plus-images";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskPriority, TaskStatus } from "../types";
import { taskPriorityOptions, taskStatusOptions } from "@/utility/convert-options";

interface DataFiltersProps {
    hideProjectFilter?: boolean
}

export const DataFilters = ({hideProjectFilter} : DataFiltersProps) => {
    const workspaceId = useWorkspaceId();
    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name,
    }))

    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name,
    }))

    const [{
        status,
        priority,
        assigneeId,
        projectId,
        dueDate
    }, setFilters] = useTaskFilters()

    const onStatusChange = (value: string) => {
        setFilters({
            status: value === "all" ? null : value as TaskStatus}
         ) 
    }

    const onPriorityChange = (value: string) => {
        setFilters({
            priority: value === "all" ? null : value as TaskPriority}
         ) 
    }

    const onAssigneeChange = (value: string) => {
        setFilters({
            assigneeId: value === "all" ? null : value as string}
         ) 
    }

    const onProjectChange = (value: string) => {
        setFilters({
            projectId: value === "all" ? null : value as string}
         ) 
    }



    if(isLoading) return null ;

    return (
        <div className="flex flex-col lg:flex-row  gap-2">
            {/* status */}
            <SelectWorkspace
                defaultValue={status ?? undefined}
                onValueChange={(value) => onStatusChange(value)}
            >
                <SelectTrigger className="h-8">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="size-7 pr-2" />
                        <SelectValue placeholder="All statuses" />
                    </div>
                </SelectTrigger>
                <SelectContent fitContent>
                    <SelectItem value="all"> All statues</SelectItem>
                    <SelectSeparator />
                   {taskStatusOptions.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                        {status.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectWorkspace>

            {/* priority */}
            <SelectWorkspace
                defaultValue={priority ?? undefined}
                onValueChange={(value) => onPriorityChange(value)}
            >
                <SelectTrigger className="h-8">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="size-7 pr-2" />
                        <SelectValue placeholder="All priority" />
                    </div>
                </SelectTrigger>
                <SelectContent fitContent>
                    <SelectItem value="all"> All priority</SelectItem>
                    <SelectSeparator />
                   {taskPriorityOptions.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                        {priority.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectWorkspace>

            {/* assigne */}
             <SelectWorkspace
                defaultValue={assigneeId ?? undefined}
                onValueChange={(value) => onAssigneeChange(value)}
            >
                <SelectTrigger className="h-8">
                    <div className="flex items-center pr-2">
                        <UserIcon className="size-7 pr-2" />
                        <SelectValue placeholder="All assignee" />
                    </div>
                </SelectTrigger>
                <SelectContent fitContent>
                    <SelectItem value="all"> All assignee</SelectItem>
                    <SelectSeparator />
                   {memberOptions?.map((member) => (
                        <SelectItem key={member.value} value={member.value}>
                        {member.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectWorkspace>

            {/* project */}
            {!hideProjectFilter && (
                <SelectWorkspace
                    defaultValue={projectId ?? undefined}
                    onValueChange={(value) => onProjectChange(value)}
                >
                    <SelectTrigger className="h-8">
                        <div className="flex items-center pr-2">
                            <FolderIcon className="size-7 pr-2" />
                            <SelectValue placeholder="All projects" />
                        </div>
                    </SelectTrigger>
                    <SelectContent fitContent>
                        <SelectItem value="all"> All projects</SelectItem>
                        <SelectSeparator />
                    {projectOptions?.map((project) => (
                            <SelectItem key={project.value} value={project.value}>
                            {project.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectWorkspace>
            )}

            {/* Date picker */}
            <DatePicker 
                placeholder="Due Date"
                className="h-8 w-full"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) => {
                    setFilters({dueDate: date ? date.toISOString() : null})
                }}
            />
        </div>
    )

    

}