import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Video Projects
export const videoProjects = pgTable("video_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'text-to-video', 'image-to-video', 'template'
  status: text("status").notNull().default('draft'), // 'draft', 'processing', 'completed', 'failed'
  prompt: text("prompt"),
  sourceImageUrl: text("source_image_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in seconds
  resolution: text("resolution").default('1080p'), // '720p', '1080p', '4K'
  style: text("style"), // 'cinematic', 'anime', 'realistic', 'artistic'
  effects: jsonb("effects").default([]), // array of effect names applied
  cameraControls: jsonb("camera_controls"), // zoom, pan, tilt settings
  metadata: jsonb("metadata"), // additional processing metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVideoProjectSchema = createInsertSchema(videoProjects).omit({
  id: true,
  createdAt: true,
});

export type InsertVideoProject = z.infer<typeof insertVideoProjectSchema>;
export type VideoProject = typeof videoProjects.$inferSelect;

// Auth Schemas
export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// Templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'social', 'marketing', 'cinematic', 'animation'
  thumbnailUrl: text("thumbnail_url"),
  previewVideoUrl: text("preview_video_url"),
  defaultPrompt: text("default_prompt"),
  defaultStyle: text("default_style"),
  defaultEffects: jsonb("default_effects").default([]),
  defaultCameraControls: jsonb("default_camera_controls"),
  popularityScore: integer("popularity_score").default(0),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Effects Library
export const effects = pgTable("effects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'trending', 'transformation', 'social', 'professional'
  thumbnailUrl: text("thumbnail_url"),
  previewVideoUrl: text("preview_video_url"),
  isTrending: integer("is_trending").default(0), // boolean stored as integer
  usageCount: integer("usage_count").default(0),
});

export const insertEffectSchema = createInsertSchema(effects).omit({
  id: true,
});

export type InsertEffect = z.infer<typeof insertEffectSchema>;
export type Effect = typeof effects.$inferSelect;

// Video Generation Request Schema (for API)
export const videoGenerationRequestSchema = z.object({
  type: z.enum(['text-to-video', 'image-to-video']),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  title: z.string().optional(),
  description: z.string().optional(),
  sourceImageUrl: z.string().optional(),
  resolution: z.enum(['720p', '1080p', '4K']).default('1080p'),
  duration: z.number().min(3).max(60).default(5),
  style: z.enum(['cinematic', 'anime', 'realistic', 'artistic']).optional(),
  effects: z.array(z.string()).default([]),
  cameraControls: z.object({
    movement: z.enum(['static', 'pan', 'zoom', 'orbit']).optional(),
    speed: z.enum(['slow', 'normal', 'fast']).optional(),
    angle: z.string().optional(),
  }).optional(),
});

export type VideoGenerationRequest = z.infer<typeof videoGenerationRequestSchema>;
