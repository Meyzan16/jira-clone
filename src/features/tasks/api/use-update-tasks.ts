import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
  const  router = useRouter();
  const { setOpenAlert, setComponentLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({ json, param });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to updated task");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "project task updated",
        severity: "success",
      });

      router.refresh();
      
      queryClient.invalidateQueries({queryKey : ["tasks"]});  
      queryClient.invalidateQueries({queryKey : ["tasks", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "updated task failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setComponentLevelLoader({loading: false, id: "create-tasks"});
    },
  });

  return mutation;
};
