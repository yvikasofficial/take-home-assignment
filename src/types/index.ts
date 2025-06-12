export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: Date;
}

export interface ApiResponse<T> {
  users: T[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}
