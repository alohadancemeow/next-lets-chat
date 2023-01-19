import { Prisma, PrismaClient } from "@prisma/client";
// import { Session } from "next-auth";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";
import {
  conversationPopulated,
  participantPopulated,
} from "../src/graphql/resolvers/conversation";
import { messagePopulated } from "../src/graphql/resolvers/message";

export interface Session {
  user?: User;
}

// Contexts
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

// Users
export interface User {
  id?: string;
  username?: string;
  image?: string;
  name?: string;
  email?: string;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
export interface SearchUsersResponse {
  users: Array<User>;
}

// Conversations
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionData {
  conversationUpdated: {
    conversation: ConversationPopulated;
    addedUserIds: Array<string>;
    removedUserIds: Array<string>;
  };
}

export interface ConversationDeletedSubscriptionPayload {
  conversationDeleted: ConversationPopulated;
}

// Messages
export interface SendMessageArguments {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageSentSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
