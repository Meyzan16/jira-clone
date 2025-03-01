import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.auth.register)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });

      if (!response || !response.ok) {
        throw new Error("Invalid response from server");
      }

      try {
        return await response.json();
      } catch (error) {
        throw new Error("Failed to parse response JSON");
      }
    },
  });

  return mutation;
};
