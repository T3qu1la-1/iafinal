import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { CONFIG } from "./config";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);

const app = express();



// Trust proxy for accurate client IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: CONFIG.NODE_ENV === 'production' 
    ? CONFIG.ALLOWED_ORIGINS
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // Only compress responses larger than 1KB
}));

// Enhanced Rate limiting
const createRateLimit = (windowMs: number, max: number, message: string) => 
  rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      log(`⚠️  Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json({ 
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString(),
      });
    },
  });

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP, please try again later."
);

const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 auth attempts per window
  "Too many authentication attempts, please try again later."
);

const chatLimiter = createRateLimit(
  60 * 1000, // 1 minute
  20, // 20 chat messages per minute
  "VAI COM CALMA FIO, SOU UM SÓ."
);

const imageLimiter = createRateLimit(
  60 * 1000, // 1 minute
  3, // 3 image generation requests per minute
  "Too many image generation requests, please slow down."
);

// Apply rate limits
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api/conversations/*/messages', chatLimiter);
app.use('/api/generate-image', imageLimiter);
app.use('/api', generalLimiter);

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      const error = new Error('Invalid JSON payload');
      (error as any).status = 400;
      throw error;
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 1000
}));

// Simplified request logging - only important events
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;
  const ip = req.ip || 'unknown';

  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const status = res.statusCode;
    const timestamp = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

    // Only log important API events
    if (path.startsWith("/api")) {
      // Skip routine checks and health endpoints
      if (path.includes('/health') || path.includes('/user') || path === '/api/conversations') {
        return;
      }

      // Log errors (4xx, 5xx)
      if (status >= 400) {
        const errorMsg = capturedJsonResponse?.error || capturedJsonResponse?.message || 'Unknown error';
        log(`❌ ${timestamp} [${method}] ${path} - ${status} :: ${errorMsg}`);
        return;
      }

      // Only log image generation (keep this one as it's less frequent and more relevant)
      if (path.includes('/generate-image') && status === 200) {
        log(`🎨 ${timestamp} Imagem gerada com sucesso`);
      }
    }
  });

  next();
});

// Health check endpoint with detailed system info
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    environment: CONFIG.NODE_ENV,
    version: '2.0.0',
    features: {
      database: 'SQLite3',
      authentication: 'Passport.js + bcrypt',
      ai_provider: 'Google Gemini 2.0 Flash',
      security: 'Helmet + CORS + Rate Limiting'
    }
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'Catalyst IA Chat',
    version: '2.0.0',
    status: 'operational',
    endpoints: {
      auth: '/api/login, /api/register, /api/logout, /api/user',
      chat: '/api/conversations, /api/conversations/:id/messages',
      health: '/health'
    },
    rateLimit: {
      general: '100 requests / 15 minutes',
      auth: '5 attempts / 15 minutes',
      chat: '10 messages / minute'
    }
  });
});

(async () => {
  try {
    log("🚀 Starting Catalyst IA Server...");

    // This will be handled later in the function
    const server = await registerRoutes(app);

    // Setup Vite for development or serve static files for production
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Fallback to serve index.html for SPA routing
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        res.status(404).json({ error: "API route not found" });
      } else {
        const indexPath = app.get("env") === "development" 
          ? path.resolve("client/index.html")
          : path.resolve("client/dist/index.html");
        res.sendFile(indexPath);
      }
    });

    // Server startup
    const port = CONFIG.PORT;
    const host = '0.0.0.0';

    server.listen(port, host, () => {
      log(`🌟 Catalyst IA Server successfully started!`);
      log(`📡 Server listening on http://${host}:${port}`);
      log(`🌍 Environment: ${CONFIG.NODE_ENV}`);
      log(`💾 Database: PostgreSQL (Neon) + SQLite (temp data)`);
      log(`🔐 Security: Helmet + CORS + Rate Limiting enabled`);
      log(`🤖 AI Provider: Google Gemini 2.0 Flash`);
      log(`✅ All systems operational - Ready to serve requests!`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      log(`⚠️  ${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        log(`✅ Server closed gracefully`);
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        log(`❌ Forcing shutdown after timeout`);
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      log(`🔴 Uncaught Exception: ${error.message}`);
      console.error(error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      log(`🔴 Unhandled Rejection at: ${promise}, reason: ${reason}`);
      process.exit(1);
    });

  } catch (error) {
    log(`🔴 Failed to start server: ${error}`);
    console.error(error);
    process.exit(1);
  }
})();