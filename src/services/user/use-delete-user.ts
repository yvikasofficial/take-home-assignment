import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

interface DeleteUserParams {
  id: string;
}

const deleteUser = async ({ id }: DeleteUserParams): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const storedUsers = localStorage.getItem("fake_users");
  if (!storedUsers) {
    throw new Error("No users found");
  }

  const users: User[] = JSON.parse(storedUsers);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Get the user to be deleted before removing it
  const deletedUser = users[userIndex];

  // Remove the user from the array
  users.splice(userIndex, 1);
  localStorage.setItem("fake_users", JSON.stringify(users));

  return deletedUser;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
