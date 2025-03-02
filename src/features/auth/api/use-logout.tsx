import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
    const queryClient = useQueryClient();
    
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      if (!response || !response.ok) {
        throw new Error("Invalid response from server");
      } 
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["current"]});
    }
  });

  return mutation;
};
