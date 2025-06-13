import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

interface EditUserParams {
  id: string;
  userData: Partial<Omit<User, "id" | "registeredDate">>;
}

const editUser = async ({ id, userData }: EditUserParams): Promise<User> => {
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

  // Update the user with new data, keeping the original id and registeredDate
  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
    id: users[userIndex].id,
    registeredDate: users[userIndex].registeredDate,
  };

  users[userIndex] = updatedUser;
  localStorage.setItem("fake_users", JSON.stringify(users));

  return updatedUser;
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
