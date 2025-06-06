import "server-only";

import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from "@/config";
import getMember from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./types";

interface getProjectProps {
  projectId: string;
}

export const getProject = async ({ projectId }: getProjectProps) => {
  
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!member) throw new Error("Unthorized");

    return project;
};
