import { useQuery } from "@tanstack/react-query";
import { fetchLatestUpdate } from "@/api/updates";

export function useLatestUpdate() {
  return useQuery({
    queryKey: ["latest-update"],
    queryFn: () => fetchLatestUpdate(),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
