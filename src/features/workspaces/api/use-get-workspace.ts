import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetWorkspace = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response || !response.ok) {
        throw new Error ("Failed to fetch workspaces");
      }
              
      const {data} =  await response.json();
       
      return data;
    },
  });

  return query;
};
