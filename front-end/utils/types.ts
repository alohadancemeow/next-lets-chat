import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

// Context
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

// Create username
export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

// Search users
export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchUser>;
}

export interface SearchUser {
  id: string;
  username: string;
}
