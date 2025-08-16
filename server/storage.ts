import { type User, type InsertUser, type Conversation, type InsertConversation, type Message, type InsertMessage, users as pgUsers, conversations as pgConversations, messages as pgMessages, webauthnCredentials as pgWebauthnCredentials, loginHistory as pgLoginHistory, securityEvents as pgSecurityEvents } from "@shared/schema";
import { sqliteSessions, sqliteCache, sqliteTempSecrets, sqliteImageGen } from "@shared/sqlite-schema";
import type { WebAuthnCredential } from "./webauthn";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as pgDrizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import { eq, and, desc, sql } from "drizzle-orm";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: string, userId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: string, userId: string): Promise<void>;
  updateConversationTitle(conversationId: string, title: string): Promise<void>;
  updateConversationSystemPrompt(id: string, systemPrompt: string | null): Promise<Conversation | undefined>;

  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  updateUserProfile(userId: string, data: { name?: string; bio?: string; preferences?: Record<string, any> }): Promise<any>;
  getUserProfile(userId: string): Promise<any>;
  updateUserRole(userId: string, role: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getAllConversations(): Promise<Conversation[]>;
  getSystemStats(): Promise<any>;

  // Security methods
  updateUser2FA(userId: string, enabled: boolean): Promise<void>;
  updateUserBiometric(userId: string, enabled: boolean): Promise<void>;
  saveTOTPSecret(userId: string, secret: string): Promise<void>;
  getTOTPSecret(userId: string): Promise<string | undefined>;
  saveTempTOTPSecret(userId: string, secret: string): Promise<void>;
  getTempTOTPSecret(userId: string): Promise<string | undefined>;
  deleteTempTOTPSecret(userId: string): Promise<void>;
  deleteTOTPSecret(userId: string): Promise<void>;
  saveBackupCodes(userId: string, codes: string[]): Promise<void>;
  getBackupCodes(userId: string): Promise<string[]>;
  removeBackupCode(userId: string, code: string): Promise<void>;

  // WebAuthn methods
  saveWebAuthnCredential(credential: WebAuthnCredential): Promise<void>;
  getWebAuthnCredentials(userId: string): Promise<WebAuthnCredential[]>;
  getWebAuthnCredential(credentialId: string): Promise<WebAuthnCredential | undefined>;
  updateWebAuthnCredentialCounter(credentialId: string, counter: number): Promise<void>;
  deleteWebAuthnCredential(userId: string, credentialId: string): Promise<void>;

  // Login tracking
  recordLoginAttempt(userId: string, ipAddress: string, userAgent: string, method: string, success: boolean, failureReason?: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
  getLoginHistory(userId: string, limit?: number): Promise<any[]>;
}

// Database connections
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = join(__dirname, '../database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// SQLite for temporary data (sessions, cache, temp secrets)
const sqlite = new Database(join(dbDir, 'temp.db'));
const sqliteDb = drizzle(sqlite);

// PostgreSQL for permanent data (users, conversations, messages)
import { CONFIG } from './config';

if (!CONFIG.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
const pgConnection = neon(CONFIG.DATABASE_URL);
const pgDb = pgDrizzle(pgConnection);

// Create SQLite tables for temporary data
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_data TEXT,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS cache (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    expires_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS temp_secrets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    secret_type TEXT NOT NULL,
    secret_value TEXT NOT NULL,
    expires_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS image_generation (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL,
    error_message TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
`);

// Enable foreign keys for SQLite
sqlite.exec('PRAGMA foreign_keys = ON;');

console.log('✅ Dual database system initialized');
console.log('  - PostgreSQL: Permanent data (users, conversations, messages)');
console.log('  - SQLite: Temporary data (sessions, cache, temp secrets)');


export class DualStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await pgDb.select().from(pgUsers).where(eq(pgUsers.id, id)).limit(1);
    return result[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await pgDb.select().from(pgUsers).where(eq(pgUsers.username, username)).limit(1);
    return result[0] as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await pgDb.select().from(pgUsers).where(eq(pgUsers.email, email)).limit(1);
    return result[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const pgUser = {
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      name: null,
      bio: null,
      avatar: null,
      preferences: null,
      role: "user" as const,
      theme: "dark" as const,
      language: "pt-BR" as const,
      plan: "free" as const,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      biometricEnabled: false,
      encryptionKey: null,
      lastLoginAt: null,
      loginAttempts: 0,
      lockedUntil: null,
      emailVerified: false
    };

    const result = await pgDb.insert(pgUsers).values(pgUser).returning();
    return result[0] as User;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const result = await pgDb
      .select()
      .from(pgConversations)
      .where(eq(pgConversations.userId, userId))
      .orderBy(desc(pgConversations.updatedAt));
    return result as Conversation[];
  }

  async getConversation(id: string, userId: string): Promise<Conversation | undefined> {
    const result = await pgDb
      .select()
      .from(pgConversations)
      .where(and(eq(pgConversations.id, id), eq(pgConversations.userId, userId)))
      .limit(1);
    return result[0] as Conversation | undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const conversation = {
      title: insertConversation.title,
      userId: insertConversation.userId,
      systemPrompt: insertConversation.systemPrompt || null,
      contextMemory: null,
      tags: null,
      category: "general" as const,
      starred: false,
      archived: false
    };

    const result = await pgDb.insert(pgConversations).values(conversation).returning();
    return result[0] as Conversation;
  }

  async deleteConversation(id: string, userId: string): Promise<void> {
    // First delete all messages in this conversation
    await pgDb.delete(pgMessages).where(eq(pgMessages.conversationId, id));

    // Then delete the conversation
    await pgDb.delete(pgConversations).where(and(eq(pgConversations.id, id), eq(pgConversations.userId, userId)));
  }

  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    await pgDb
      .update(pgConversations)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(pgConversations.id, conversationId));
  }

  async updateConversationSystemPrompt(id: string, systemPrompt: string | null): Promise<Conversation | undefined> {
    const [updated] = await pgDb
      .update(pgConversations)
      .set({
        systemPrompt,
        updatedAt: new Date()
      })
      .where(eq(pgConversations.id, id))
      .returning();

    return updated;
  }


  async getMessages(conversationId: string): Promise<Message[]> {
    const result = await pgDb
      .select()
      .from(pgMessages)
      .where(eq(pgMessages.conversationId, conversationId))
      .orderBy(pgMessages.createdAt);
    return result as Message[];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message = {
      conversationId: insertMessage.conversationId,
      content: insertMessage.content,
      role: insertMessage.role,
      imageUrl: insertMessage.imageUrl ?? null,
      imagePrompt: null,
      imageStyle: null,
      metadata: null,
      reactions: null,
      encrypted: false,
      editedAt: null,
      parentId: null
    };

    const result = await pgDb.insert(pgMessages).values(message).returning();

    // Update conversation's updatedAt timestamp
    await pgDb
      .update(pgConversations)
      .set({ updatedAt: new Date() })
      .where(eq(pgConversations.id, insertMessage.conversationId));

    return result[0] as Message;
  }

  async updateUserProfile(userId: string, data: { name?: string; bio?: string; preferences?: Record<string, any> }): Promise<any> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.preferences !== undefined) updateData.preferences = JSON.stringify(data.preferences);

    await pgDb
      .update(pgUsers)
      .set(updateData)
      .where(eq(pgUsers.id, userId));

    // Return updated user
    return this.getUser(userId);
  }

  async getUserProfile(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (user && user.preferences && typeof user.preferences === 'string') {
      try {
        (user as any).preferences = JSON.parse(user.preferences);
      } catch {
        (user as any).preferences = {};
      }
    }
    return user;
  }

  // Security methods implementation
  async updateUser2FA(userId: string, enabled: boolean): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ twoFactorEnabled: enabled })
      .where(eq(pgUsers.id, userId));
  }

  async updateUserBiometric(userId: string, enabled: boolean): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ biometricEnabled: enabled })
      .where(eq(pgUsers.id, userId));
  }

  async saveTOTPSecret(userId: string, secret: string): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ twoFactorSecret: secret })
      .where(eq(pgUsers.id, userId));
  }

  async getTOTPSecret(userId: string): Promise<string | undefined> {
    const result = await pgDb.select({ secret: pgUsers.twoFactorSecret })
      .from(pgUsers)
      .where(eq(pgUsers.id, userId))
      .limit(1);
    return result[0]?.secret || undefined;
  }

  async saveTempTOTPSecret(userId: string, secret: string): Promise<void> {
    // Use SQLite for temporary secrets
    sqlite.prepare('DELETE FROM temp_secrets WHERE user_id = ? AND secret_type = ?').run(userId, 'totp_temp');
    sqlite.prepare('INSERT INTO temp_secrets (id, user_id, secret_type, secret_value) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), userId, 'totp_temp', secret);
  }

  async getTempTOTPSecret(userId: string): Promise<string | undefined> {
    const result = sqlite.prepare('SELECT secret_value FROM temp_secrets WHERE user_id = ? AND secret_type = ?').get(userId, 'totp_temp') as any;
    return result?.secret_value;
  }

  async deleteTempTOTPSecret(userId: string): Promise<void> {
    sqlite.prepare('DELETE FROM temp_secrets WHERE user_id = ? AND secret_type = ?').run(userId, 'totp_temp');
  }

  async deleteTOTPSecret(userId: string): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ twoFactorSecret: null })
      .where(eq(pgUsers.id, userId));
  }

  async saveBackupCodes(userId: string, codes: string[]): Promise<void> {
    // Use SQLite for backup codes (temporary secrets)
    sqlite.prepare('DELETE FROM temp_secrets WHERE user_id = ? AND secret_type = ?').run(userId, 'backup_codes');
    sqlite.prepare('INSERT INTO temp_secrets (id, user_id, secret_type, secret_value) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), userId, 'backup_codes', JSON.stringify(codes));
  }

  async getBackupCodes(userId: string): Promise<string[]> {
    const result = sqlite.prepare('SELECT secret_value FROM temp_secrets WHERE user_id = ? AND secret_type = ?').get(userId, 'backup_codes') as any;
    return result ? JSON.parse(result.secret_value) : [];
  }

  async removeBackupCode(userId: string, code: string): Promise<void> {
    const currentCodes = await this.getBackupCodes(userId);
    const updatedCodes = currentCodes.filter(c => c !== code);
    await this.saveBackupCodes(userId, updatedCodes);
  }

  // WebAuthn methods (using PostgreSQL for permanent credential storage)
  async saveWebAuthnCredential(credential: WebAuthnCredential): Promise<void> {
    const pgCredential = {
      id: credential.id,
      userId: credential.userId,
      credentialId: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter,
      deviceType: credential.deviceType,
      backedUp: credential.backedUp,
      transports: credential.transports || null,
      name: credential.name || null
    };

    await pgDb.insert(pgWebauthnCredentials).values(pgCredential);
  }

  async getWebAuthnCredentials(userId: string): Promise<WebAuthnCredential[]> {
    const results = await pgDb.select()
      .from(pgWebauthnCredentials)
      .where(eq(pgWebauthnCredentials.userId, userId));

    return results.map(row => ({
      id: row.id,
      userId: row.userId,
      credentialId: row.credentialId,
      publicKey: row.publicKey,
      counter: row.counter,
      deviceType: row.deviceType,
      backedUp: row.backedUp || false,
      transports: row.transports || undefined,
      name: row.name || undefined,
    }));
  }

  async getWebAuthnCredential(credentialId: string): Promise<WebAuthnCredential | undefined> {
    const result = await pgDb.select()
      .from(pgWebauthnCredentials)
      .where(eq(pgWebauthnCredentials.credentialId, credentialId))
      .limit(1);

    if (!result[0]) return undefined;

    const row = result[0];
    return {
      id: row.id,
      userId: row.userId,
      credentialId: row.credentialId,
      publicKey: row.publicKey,
      counter: row.counter,
      deviceType: row.deviceType,
      backedUp: row.backedUp || false,
      transports: row.transports || undefined,
      name: row.name || undefined,
    };
  }

  async updateWebAuthnCredentialCounter(credentialId: string, counter: number): Promise<void> {
    await pgDb.update(pgWebauthnCredentials)
      .set({ counter })
      .where(eq(pgWebauthnCredentials.credentialId, credentialId));
  }

  async deleteWebAuthnCredential(userId: string, credentialId: string): Promise<void> {
    await pgDb.delete(pgWebauthnCredentials)
      .where(and(eq(pgWebauthnCredentials.userId, userId), eq(pgWebauthnCredentials.credentialId, credentialId)));
  }

  // Login tracking (using PostgreSQL for permanent audit trail)
  async recordLoginAttempt(userId: string, ipAddress: string, userAgent: string, method: string, success: boolean, failureReason?: string): Promise<void> {
    const loginRecord = {
      userId,
      ipAddress,
      userAgent,
      method,
      success,
      failureReason: failureReason || null,
      sessionId: null,
      location: null
    };

    await pgDb.insert(pgLoginHistory).values(loginRecord);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(pgUsers.id, userId));
  }

  async getLoginHistory(userId: string, limit: number = 50): Promise<any[]> {
    const results = await pgDb.select()
      .from(pgLoginHistory)
      .where(eq(pgLoginHistory.userId, userId))
      .orderBy(desc(pgLoginHistory.createdAt))
      .limit(limit);

    return results.map(row => ({
      id: row.id,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      method: row.method,
      success: row.success,
      failureReason: row.failureReason,
      createdAt: row.createdAt,
    }));
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await pgDb.update(pgUsers)
      .set({ role })
      .where(eq(pgUsers.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    const result = await pgDb.select().from(pgUsers).orderBy(desc(pgUsers.createdAt));
    return result as User[];
  }

  async getAllConversations(): Promise<Conversation[]> {
    const result = await pgDb.select().from(pgConversations).orderBy(desc(pgConversations.createdAt));
    return result as Conversation[];
  }

  async getSystemStats(): Promise<any> {
    const totalUsers = await pgDb.select({ count: sql`count(*)` }).from(pgUsers);
    const totalConversations = await pgDb.select({ count: sql`count(*)` }).from(pgConversations);
    const totalMessages = await pgDb.select({ count: sql`count(*)` }).from(pgMessages);

    return {
      totalUsers: totalUsers[0]?.count || 0,
      totalConversations: totalConversations[0]?.count || 0,
      totalMessages: totalMessages[0]?.count || 0
    };
  }
}

export const storage = new DualStorage();