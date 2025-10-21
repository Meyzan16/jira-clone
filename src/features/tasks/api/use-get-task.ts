import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskPriority, TaskStatus } from "../types";

interface UseGetTasksProps {
    taskId: string;
};

export const useGetTask = ({taskId} : UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: {taskId}
      });

      if (!response || !response.ok) {
        throw new Error ("Failed to fetch task");  
      }
              
      const {data} =  await response.json();
       
      return data;
    },
  });

  return query;
};
