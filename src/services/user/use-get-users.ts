import generateFakeUsers from "@/lib/generate-fake-users";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => {
      return {
        users: generateFakeUsers(),
        totalPages: 1,
        currentPage: 1,
        totalUsers: 10,
      };
    },
  });
};
