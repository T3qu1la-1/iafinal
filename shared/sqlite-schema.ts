import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// SQLite schemas - for temporary data, cache, sessions
export const sqliteSessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  sessionData: text("session_data"), // JSON string
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sqliteCache = sqliteTable("cache", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(), // JSON string
  expiresAt: integer("expires_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sqliteTempSecrets = sqliteTable("temp_secrets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  secretType: text("secret_type").notNull(), // 'totp_temp', 'backup_codes', etc.
  secretValue: text("secret_value").notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sqliteImageGen = sqliteTable("image_generation", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Assuming 'users' table is defined elsewhere and imported
// For the sake of completeness, let's assume a minimal users table definition here if not provided
// If 'users' is defined in another file, ensure it's imported correctly.
// For this example, I'll define a placeholder if it's not in the provided snippet.
// If 'users' is already defined and imported, this placeholder should be removed.
// const users = sqliteTable("users", { id: text("id").primaryKey() });

// Placeholder for users table definition if not provided in original snippet
// In a real scenario, this would likely be imported from another schema file.
const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  // other user fields...
});


export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow().notNull(),
  imageCount: integer("image_count").default(0).notNull(),
  lastActivity: integer("last_activity", { mode: "timestamp" }).defaultNow().notNull(),
  systemPrompt: text("system_prompt"),
});


export type SqliteSession = typeof sqliteSessions.$inferSelect;
export type SqliteCache = typeof sqliteCache.$inferSelect;
export type SqliteTempSecret = typeof sqliteTempSecrets.$inferSelect;
export type SqliteImageGen = typeof sqliteImageGen.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;