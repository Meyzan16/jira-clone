import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";


type ResponseType = InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["$delete"]>;

export const useDeleteWorkspace = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({ param });
      const body = await response.json(); // <- baca JSON body

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to delete workspace");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "workspace success deleted",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["workspaces"]});  
      queryClient.invalidateQueries({queryKey : ["workspace", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "deleted workspace failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
