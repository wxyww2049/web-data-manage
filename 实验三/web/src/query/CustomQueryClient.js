import { QueryClient } from "@tanstack/react-query";
import { request } from "./request";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const data = await request({
          url: queryKey?.url,
          params: queryKey?.params,
          header: queryKey?.headers ?? {},
        });

        if (typeof data.code === "undefined") return data;

        if (data.code !== 0) throw new Error(data.code + ":" + data.message);
        return data.data;
      },
      retry: (failureCount, error) => !error.message && failureCount < 5,
      staleTime: 1000,
      refetchOnWindowFocus: false,
    },
  },
});
