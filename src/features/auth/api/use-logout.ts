import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const {setOpenAlert} = useContext(GlobalContext)!;

  const queryClient = useQueryClient();
  const router = useRouter();  
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      if(!response.ok){
        throw new Error ("Failed to logout")
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setOpenAlert({
        status: true,
        message: "Logged Out",
        severity: "success",
      });
      setTimeout(() => {
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["current"] });
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      },1000)
    },
    onError: (error) => {
      setOpenAlert({
        status: true,
        message: "Failed to logged out",
        severity: "error",
      });
    },
  });

  return mutation;
};
