import generateFakeUsers from "@/lib/generate-fake-users";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: generateFakeUsers,
  });
};
