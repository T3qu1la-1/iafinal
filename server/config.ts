import { config } from 'dotenv';

// Load .env file if it exists (fallback when not using Replit)
config();

export const CONFIG = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Security
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
  
  // AI APIs
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  RAIKKEN_KEY: process.env.RAIKKEN_KEY || 'pato1337',
  
  // WebAuthn (for production)
  REPLIT_DEV_DOMAIN: process.env.REPLIT_DEV_DOMAIN || '',
} as const;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'] as const;

for (const envVar of requiredEnvVars) {
  if (!CONFIG[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default CONFIG;