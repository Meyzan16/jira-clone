"use client";

import { RiAddCircleFill } from "react-icons/ri";
import React from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import Link from "next/link";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

const Projects = () => {
  const pathname = usePathname();

  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p   >
        <RiAddCircleFill
          onClick={open}
          className="size-5  text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/project/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={`
                                flex items-center gap-3 px-3 rounded-lg py-2 font-medium hover:opacity-75 transition cursor-pointer text-neutral-500
                                ${
                                  isActive &&
                                  "bg-primarygreen  shadow-sm hover:opacity-100 text-white"
                                } `}
            >
                <ProjectAvatar image={project.imageUrl} name={project.name} />
                <span className="truncate font-medium">{project.name}</span>
             
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Projects;
