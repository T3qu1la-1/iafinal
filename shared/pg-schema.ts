import { sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// PostgreSQL schemas - for permanent data
export const pgUsers = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  bio: text("bio"),
  avatar: text("avatar"),
  preferences: text("preferences"), // JSON string
  theme: text("theme").default("dark"),
  language: text("language").default("pt-BR"),
  plan: text("plan").default("free"),
  role: text("role").default("user"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  biometricEnabled: boolean("biometric_enabled").default(false),
  encryptionKey: text("encryption_key"),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pgConversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => pgUsers.id).notNull(),
  title: text("title").notNull(),
  systemPrompt: text("system_prompt"),
  contextMemory: text("context_memory"),
  tags: text("tags"), // JSON array
  category: text("category").default("general"),
  starred: boolean("starred").default(false),
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pgMessages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => pgConversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  imageUrl: text("image_url"),
  imagePrompt: text("image_prompt"),
  imageStyle: text("image_style"),
  metadata: text("metadata"), // JSON
  reactions: text("reactions"), // JSON
  encrypted: boolean("encrypted").default(false),
  editedAt: timestamp("edited_at"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pgWebauthnCredentials = pgTable("webauthn_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => pgUsers.id, { onDelete: "cascade" }),
  credentialId: text("credential_id").unique().notNull(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").default(false),
  transports: text("transports"), // JSON array
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pgLoginHistory = pgTable("login_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => pgUsers.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  location: text("location"),
  method: text("method").notNull(),
  success: boolean("success").notNull(),
  failureReason: text("failure_reason"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pgSecurityEvents = pgTable("security_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => pgUsers.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  details: text("details"), // JSON
  severity: text("severity").default("info"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schemas for validation
export const insertPgUserSchema = createInsertSchema(pgUsers).pick({
  username: true,
  email: true,
  password: true,
});

export const selectPgUserSchema = createSelectSchema(pgUsers);

export type InsertPgUser = z.infer<typeof insertPgUserSchema>;
export type PgUser = typeof pgUsers.$inferSelect;
export type PgConversation = typeof pgConversations.$inferSelect;
export type PgMessage = typeof pgMessages.$inferSelect;