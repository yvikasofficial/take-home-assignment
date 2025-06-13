import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import { generateFakeUser } from "@/lib/generate-fake-users";

const addUser = async (
  userData: Omit<User, "id" | "registeredDate">
): Promise<User> => {
  const newUser: User = {
    ...generateFakeUser(),
    ...userData,
    registeredDate: new Date(),
  };

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const storedUsers = localStorage.getItem("fake_users");
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    // Add new user at the beginning
    users.unshift(newUser);
    localStorage.setItem("fake_users", JSON.stringify(users));
  }
  return newUser;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
