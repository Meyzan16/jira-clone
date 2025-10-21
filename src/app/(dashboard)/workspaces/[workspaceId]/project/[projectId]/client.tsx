"use client"

import { PageError } from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { useGetProject } from "@/features/projects/api/use-get-project"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"
import { PencilIcon } from "lucide-react"
import Link from "next/link"

export const ProjectIdClient = () => {
    const projectId = useProjectId();

    const {data , isLoading} = useGetProject({projectId});

    if(isLoading) {
        return <PageLoader />
    }

    if(!data) {
            return <PageError message="Project Not Found" />
    }

    return (
        <div className="h-screen flex flex-col gap-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-x-2 bg-gray-200 text-dark hover:bg-gray-300 px-4 py-2 rounded-lg ">
              <ProjectAvatar
                name={data.name}
                image={data.imageUrl}
                className="size-10"
              />
              <p className="text-xs md:text-md font-semibold">{data.name}</p>
            </div>

            <div>
              <Button variant="secondary" size="sm" className="text-sm">
                <Link
                  href={`/workspaces/${data.workspaceId}/project/${data.$id}/settings`}
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <PencilIcon className="size-4 mr-2" />
                   <p className="text-xs md:text-md font-semibold">edit project </p>
                </Link>
              </Button>
            </div>
            
          </div>

          <TaskViewSwitcher hideProjectFilter />
        </div>
    )
}