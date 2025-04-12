import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";


type ResponseType = InferResponseType<(typeof client.api.members)[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({ param });
      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to delete member");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "member deleted",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["members"]});  
      queryClient.invalidateQueries({queryKey : ["member", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "deleted member failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
