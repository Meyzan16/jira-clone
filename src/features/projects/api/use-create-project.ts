import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;


export const useCreateProject = () => {
  const { setOpenAlert, setComponentLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$post"]({ form });

      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to create workspace");
      }

      return body as ResponseType;
      
    },
    onSuccess: () => {
      setOpenAlert({
        status: true,
        message: "project created",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["projects"]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "created project failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setComponentLevelLoader({loading: false, id: "create-project"});
    },
  });

  return mutation;
};
