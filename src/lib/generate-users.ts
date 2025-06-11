import type { User } from "@/types";
import { faker } from "@faker-js/faker";

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

export default function generateUsers(count: number): User[] {
  return Array.from({ length: count }, generateFakeUser);
}
