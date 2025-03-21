import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });

      if(!response.ok){
        throw new Error ("Failed to register")
      }

      return await response.json();
    },
    onSuccess: () => {
      setOpenAlert({
        status: true,
        message: "Register successfully",
        severity: "success",
      });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "Registed failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
