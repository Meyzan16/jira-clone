import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { useRouter } from "next/navigation";


type ResponseType = InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteLink = () => {
  const router = useRouter();
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;

  const queryClient = useQueryClient(); 

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });
      const body = await response.json();

      if (!response.ok) {
        throw new Error((body as { message: string }).message || "Failed to reset invite code");
      }

      return body as ResponseType;
      
    },
    onSuccess: ({data}) => {
      setOpenAlert({
        status: true,
        message: "invite code reset",
        severity: "success",
      });
      router.refresh();
      queryClient.invalidateQueries({queryKey : ["workspaces"]});  
      queryClient.invalidateQueries({queryKey : ["workspace", data.$id]});  
    },onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "Failed to reset invite code",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
