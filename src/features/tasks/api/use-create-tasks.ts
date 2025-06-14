import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTasks = () => {
  const { setOpenAlert, setComponentLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["$post"]({ json });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to create task");
      }

      return body as ResponseType;
      
    },
    onSuccess: () => {
      setOpenAlert({
        status: true,
        message: "project task created",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["tasks"]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "created task failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setComponentLevelLoader({loading: false, id: "create-tasks"});
    },
  });

  return mutation;
};
