import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const { setOpenAlert, setPageLevelLoader } = useContext(GlobalContext)!;
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });

      if(!response.ok){
        throw new Error ("Failed to login")
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setOpenAlert({
        status: true,
        message: data.message || "Login berhasil",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/");
        queryClient.invalidateQueries({ queryKey: ["current"] });
      },1000)
    },
    onError: (error) => {
      setOpenAlert({
        status: true,
        message: error.message || "Login failed",
        severity: "error",
      });
    },
    onSettled: () => {
      setPageLevelLoader(false);
    },
  });

  return mutation;
};
