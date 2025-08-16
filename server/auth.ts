import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { CONFIG } from "./config";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import fs from 'fs';
import path from 'path';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return bcrypt.compare(supplied, stored);
}

// Check admin credentials
export function checkAdminCredentials(username: string, password: string): boolean {
  try {
    const adminConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'admin-config.json'), 'utf8'));
    return username === adminConfig.username && password === adminConfig.password;
  } catch (error) {
    console.error('Error reading admin config:', error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: CONFIG.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // Check for admin user from JSON file
          let adminConfig;
          try {
            const adminData = fs.readFileSync(path.join(__dirname, 'admin-config.json'), 'utf8');
            adminConfig = JSON.parse(adminData);
          } catch (error) {
            // console.log('Admin config not found, proceeding without admin check');
            adminConfig = { admins: [] }; // Initialize as empty if file not found
          }

          // Check if user is admin
          console.log(`🔍 Checking admin login for: ${username}`);
          console.log(`📋 Available admins:`, adminConfig.admins?.map((a: any) => a.username));
          const adminUserEntry = adminConfig.admins?.find((admin: any) => 
            admin.username === username
          );

          if (adminUserEntry) {
            // Use the checkAdminCredentials function for password validation
            if (checkAdminCredentials(username, password)) {
              // Check if admin user exists in database
              let user = await storage.getUserByUsername(username);
              if (!user) {
                // Create admin user if it doesn't exist
                const hashedPassword = await hashPassword(password);
                user = await storage.createUser({
                  username: adminUserEntry.username,
                  email: adminUserEntry.email,
                  password: hashedPassword,
                });
                // Update user role to admin
                await storage.updateUserRole(user.id, "admin");
              } else {
                // Ensure user has admin role if they already exist
                if (user.role !== "admin") {
                  await storage.updateUserRole(user.id, "admin");
                  user = await storage.getUserByUsername(username); // Refresh user data
                }
              }
              return done(null, user);
            } else {
              // Incorrect password for admin
              return done(null, false, { message: "Nome de usuário ou senha incorretos" });
            }
          }

          // If not an admin, check for regular user
          console.log(`👤 Checking regular user login for: ${username}`);
          const user = await storage.getUserByUsername(username);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "Nome de usuário ou senha incorretos" });
          }
          return done(null, user);
        } catch (error) {
          console.error("Authentication error:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register route
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Este email já está em uso" });
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Este nome de usuário já está em uso" });
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Auto login after registration
      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Nome de usuário ou senha incorretos" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user route
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const { password: _, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  });
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Autenticação necessária" });
  }
  next();
}

// Middleware to require admin authentication
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Autenticação necessária" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
  }
  next();
}