import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { registerSchema, loginSchema } from "@shared/schema";

// Express session user type
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Please log in" });
};

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Register user
export async function registerUser(data: { username: string; email: string; password: string }) {
  const validated = registerSchema.parse(data);
  
  // Check if user already exists
  const existingEmail = await storage.getUserByEmail(validated.email);
  if (existingEmail) {
    throw new Error("Email already registered");
  }
  
  const existingUsername = await storage.getUserByUsername(validated.username);
  if (existingUsername) {
    throw new Error("Username already taken");
  }
  
  // Hash password and create user
  const passwordHash = await hashPassword(validated.password);
  const user = await storage.createUser({
    username: validated.username,
    email: validated.email,
    passwordHash,
  });
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

// Login user
export async function loginUser(data: { email: string; password: string }) {
  const validated = loginSchema.parse(data);
  
  const user = await storage.getUserByEmail(validated.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  const isValid = await comparePassword(validated.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}
