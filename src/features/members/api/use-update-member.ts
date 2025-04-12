import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";


type ResponseType = InferResponseType<(typeof client.api.members)[":memberId"]["$patch"], 200>;
type RequestType = InferRequestType<(typeof client.api.members)[":memberId"]["$patch"]>;

export const useUpdateMember = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param , json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({ param, json });
      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to update member");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "member updated",
        severity: "success",
      });
      queryClient.invalidateQueries({queryKey : ["members"]});  
      queryClient.invalidateQueries({queryKey : ["member", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "update member failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
