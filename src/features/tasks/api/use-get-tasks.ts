import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskPriority, TaskStatus } from "../types";

interface UseGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    priority?: TaskPriority | null;
    search?: string | null;
    assigneeId?: string | null;
    dueDate?: string | null;
};

export const useGetTasks = ({workspaceId,projectId,status,priority,search,assigneeId,dueDate} : UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      priority,
      search,
      assigneeId,
      dueDate
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId, 
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          priority: priority ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });

      if (!response || !response.ok) {
        throw new Error ("Failed to fetch tasks");  
      }
              
      const {data} =  await response.json();
       
      return data;
    },
  });

  return query;
};
