// Import PostgreSQL schemas and re-export as main types
import { 
  pgUsers, 
  pgConversations, 
  pgMessages, 
  pgWebauthnCredentials, 
  pgLoginHistory, 
  pgSecurityEvents,
  insertPgUserSchema,
  selectPgUserSchema,
  type InsertPgUser,
  type PgUser,
  type PgConversation,
  type PgMessage
} from "./pg-schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export PostgreSQL schemas as main schemas for the application
export const users = pgUsers;
export const conversations = pgConversations;
export const messages = pgMessages;
export const webauthnCredentials = pgWebauthnCredentials;
export const loginHistory = pgLoginHistory;
export const securityEvents = pgSecurityEvents;

// Re-export PostgreSQL user schemas
export const insertUserSchema = insertPgUserSchema;
export const selectUserSchema = selectPgUserSchema;

// User profile schema for storing additional user information
export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  preferences: z.record(z.any()).optional(),
});

export const insertConversationSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  userId: z.string().uuid("User ID must be a valid UUID"),
  systemPrompt: z.string().optional(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
  imageUrl: true,
});

// Schema for image generation requests
export const imageGenerationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  width: z.number().min(256).max(2048).default(1024),
  height: z.number().min(256).max(2048).default(1024),
  steps: z.number().min(1).max(50).default(20),
});

// Export types based on PostgreSQL schemas
export type InsertUser = InsertPgUser;
export type User = PgUser;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = PgConversation;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = PgMessage;