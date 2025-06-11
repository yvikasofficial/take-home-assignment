import type { User } from "@/types";
import { faker } from "@faker-js/faker";

const STORAGE_KEY = "fake_users";
const USERS_COUNT = 1000;

/**
 * Generate a single fake user
 * @returns {User} A single fake user
 */
export const generateFakeUser = (): User => {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    city: faker.location.city(),
    registeredDate: faker.date.past(),
  };
};

/**
 * Generate a list of fake users and store them in localStorage if they don't exist.
 * @returns {User[]} A list of fake users
 */
export default function generateFakeUsers(): User[] {
  const storedUsers = localStorage.getItem(STORAGE_KEY);
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    return users.map((user: User) => ({
      ...user,
      registeredDate: new Date(user.registeredDate),
    }));
  }

  const users = Array.from({ length: USERS_COUNT }, generateFakeUser);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return users;
}
