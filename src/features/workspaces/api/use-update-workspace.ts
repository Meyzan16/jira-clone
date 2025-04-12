import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import type { WorkspaceResponse } from "../interface"


type ResponseType = InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({ form, param });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to update workspace");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "workspace updated",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["workspaces"]});  
      queryClient.invalidateQueries({queryKey : ["workspace", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "updated workspace failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
