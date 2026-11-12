
import type {
  User,
  AuthUser,
  LoginCredentials,
} from "../types/auth.types";

const mockUsers: User[] = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "ADMIN",
  },
  {
    id: "U002",
    name: "Manager User",
    email: "manager@gmail.com",
    password: "Manager@123",
    role: "MANAGER",
  },
  {
    id: "U003",
    name: "Rahul Sharma",
    email: "agent@gmail.com",
    password: "Agent@123",
    role: "AGENT",
  },
  {
    id: "U004",
    name: "Priya Kumar",
    email: "priya@gmail.com",
    password: "Agent@123",
    role: "AGENT",
  },
  {
    id: "U005",
    name: "Arun Kumar",
    email: "arun@gmail.com",
    password: "Agent@123",
    role: "AGENT",
  },
];

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthUser> => {
  // Simulate an API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find(
    (item) =>
      item.email.toLowerCase() === credentials.email.toLowerCase() &&
      item.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Return user details without exposing the password
  const authenticatedUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return authenticatedUser;
};

export const getAgents = (): User[] => {
  return mockUsers.filter((user) => user.role === "AGENT");
};
