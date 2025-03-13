import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces["$post"]({ json });
      return await response.json();
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
      console.error("Login Failed:", error);
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
