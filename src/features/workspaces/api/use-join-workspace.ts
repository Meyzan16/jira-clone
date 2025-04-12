import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";


type ResponseType = InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param,json }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param,json });
      const body = await response.json(); // <- baca JSON body

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to join workspace");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "joined workspace",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["workspaces"]});  
      queryClient.invalidateQueries({queryKey : ["workspace", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message,
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
