import { useQuery } from "@tanstack/react-query";
import generateFakeUsers from "@/lib/generate-fake-users";
import type { User } from "@/types";

// Separate function to fetch user by ID
const fetchUserById = async (userId: string): Promise<User | undefined> => {
  // Simulate API call by finding user from the stored fake users
  const users = generateFakeUsers();
  const user = users.find((u) => u.id === userId);

  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 200);
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
  });
};
