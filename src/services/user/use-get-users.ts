import generateFakeUsers from "@/lib/generate-fake-users";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, User } from "@/types";

/**
 * Get paginated users from the fake data generator
 * @param {number} page - The page number
 * @param {number} pageSize - The number of users per page
 * @returns {ApiResponse<User>} A response containing the users, total pages, current page, and total users
 */
const getPaginatedUsers = (page = 1, pageSize = 10): ApiResponse<User> => {
  const allUsers = generateFakeUsers();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    users: allUsers.slice(start, end),
    totalPages: Math.ceil(allUsers.length / pageSize),
    currentPage: page,
    totalUsers: allUsers.length,
  };
};

export const useGetUsers = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => getPaginatedUsers(page, pageSize),
  });
};
