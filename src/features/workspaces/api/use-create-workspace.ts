import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import type { WorkspaceResponse } from "../interface"

type ResponseType = {
  data: WorkspaceResponse;
};


// type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;


export const useCreateWorkspace = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to create workspace");
      }

      return body as ResponseType;
      
    },
    onSuccess: () => {
      setOpenAlert({
        status: true,
        message: "workspace created",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["workspaces"]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "created workspace failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
