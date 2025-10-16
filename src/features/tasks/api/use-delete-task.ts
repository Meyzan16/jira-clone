import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { use, useContext } from "react";
import { GlobalContext } from "@/app/context";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
  const router = useRouter();
  const { setOpenAlert, setComponentLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({ param });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to delete task");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data }) => {
      setOpenAlert({
        status: true,
        message: "project task deleted",
        severity: "success",
      });

      // router.refresh();

      queryClient.invalidateQueries({queryKey : ["tasks"]});  
      queryClient.invalidateQueries({queryKey : ["task", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "deleted task failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setComponentLevelLoader({loading: false, id: "create-tasks"});
    },
  });

  return mutation;
};
