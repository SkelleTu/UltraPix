import { 
  type VideoProject, 
  type InsertVideoProject,
  type Template,
  type InsertTemplate,
  type Effect,
  type InsertEffect,
  type User,
  type InsertUser,
  videoProjects,
  templates,
  effects,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Video Projects
  getVideoProject(id: string): Promise<VideoProject | undefined>;
  getAllVideoProjects(): Promise<VideoProject[]>;
  getVideoProjectsByUserId(userId: string): Promise<VideoProject[]>;
  createVideoProject(project: InsertVideoProject): Promise<VideoProject>;
  updateVideoProject(id: string, project: Partial<VideoProject>): Promise<VideoProject | undefined>;
  deleteVideoProject(id: string): Promise<boolean>;
  
  // Templates
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Effects
  getEffect(id: string): Promise<Effect | undefined>;
  getAllEffects(): Promise<Effect[]>;
  getEffectsByCategory(category: string): Promise<Effect[]>;
  getTrendingEffects(): Promise<Effect[]>;
  createEffect(effect: InsertEffect): Promise<Effect>;
}

export class SqliteStorage implements IStorage {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private async ensureInitialized() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = this.initializeSampleData();
    try {
      await this.initPromise;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
      this.initPromise = null;
      throw error;
    }
  }

  private async initializeSampleData() {
    try {
      const existingTemplates = await db.select().from(templates);
    if (existingTemplates.length === 0) {
      const sampleTemplates: InsertTemplate[] = [
        {
          name: "Social Media Viral",
          description: "Template otimizado para redes sociais com efeitos virais",
          category: "social",
          thumbnailUrl: null,
          previewVideoUrl: null,
          defaultPrompt: "Crie um vídeo dinâmico e envolvente para redes sociais",
          defaultStyle: "cinematic",
          defaultEffects: ["ai-hug"],
          defaultCameraControls: { movement: "pan", speed: "normal" },
          popularityScore: 95,
        },
        {
          name: "Cinematic Trailer",
          description: "Template cinematográfico para trailers profissionais",
          category: "cinematic",
          thumbnailUrl: null,
          previewVideoUrl: null,
          defaultPrompt: "Crie um trailer cinematográfico épico",
          defaultStyle: "cinematic",
          defaultEffects: [],
          defaultCameraControls: { movement: "orbit", speed: "slow" },
          popularityScore: 88,
        },
        {
          name: "Anime Style",
          description: "Transforme suas ideias em estilo anime",
          category: "animation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          defaultPrompt: "Crie uma animação estilo anime",
          defaultStyle: "anime",
          defaultEffects: [],
          defaultCameraControls: { movement: "static", speed: "normal" },
          popularityScore: 75,
        },
      ];

      for (const template of sampleTemplates) {
        await db.insert(templates).values(template);
      }

      console.log(`✅ Initialized ${sampleTemplates.length} sample templates`);
    }

    const existingEffects = await db.select().from(effects);
    if (existingEffects.length === 0) {
      const sampleEffects: InsertEffect[] = [
        {
          name: "ai-hug",
          displayName: "AI Hug",
          description: "Crie abraços emocionantes entre pessoas usando IA",
          category: "trending",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 12500,
        },
        {
          name: "ai-kiss",
          displayName: "AI Kiss",
          description: "Efeito de beijo romântico gerado por IA",
          category: "trending",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 11200,
        },
        {
          name: "venom-effect",
          displayName: "Venom Effect",
          description: "Transformação estilo Venom com efeito simbiótico",
          category: "transformation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 9800,
        },
        {
          name: "body-morph",
          displayName: "Body Morph",
          description: "Transformação corporal completa",
          category: "transformation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 0,
          usageCount: 7200,
        },
      ];

      for (const effect of sampleEffects) {
        await db.insert(effects).values(effect);
      }

      console.log(`✅ Initialized ${sampleEffects.length} sample effects`);
    }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Video Project methods
  async getVideoProject(id: string): Promise<VideoProject | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(videoProjects).where(eq(videoProjects.id, id));
    return result[0];
  }

  async getAllVideoProjects(): Promise<VideoProject[]> {
    await this.ensureInitialized();
    return await db.select().from(videoProjects).orderBy(desc(videoProjects.createdAt));
  }

  async getVideoProjectsByUserId(userId: string): Promise<VideoProject[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(videoProjects)
      .where(eq(videoProjects.userId, userId))
      .orderBy(desc(videoProjects.createdAt));
  }

  async createVideoProject(project: InsertVideoProject): Promise<VideoProject> {
    await this.ensureInitialized();
    const result = await db.insert(videoProjects).values(project).returning();
    return result[0];
  }

  async updateVideoProject(id: string, updates: Partial<VideoProject>): Promise<VideoProject | undefined> {
    await this.ensureInitialized();
    const result = await db
      .update(videoProjects)
      .set(updates)
      .where(eq(videoProjects.id, id))
      .returning();
    return result[0];
  }

  async deleteVideoProject(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(videoProjects).where(eq(videoProjects.id, id)).returning();
    return result.length > 0;
  }

  // Template methods
  async getTemplate(id: string): Promise<Template | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async getAllTemplates(): Promise<Template[]> {
    await this.ensureInitialized();
    return await db.select().from(templates).orderBy(desc(templates.popularityScore));
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(templates)
      .where(eq(templates.category, category))
      .orderBy(desc(templates.popularityScore));
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    await this.ensureInitialized();
    const result = await db.insert(templates).values(template).returning();
    return result[0];
  }

  // Effect methods
  async getEffect(id: string): Promise<Effect | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(effects).where(eq(effects.id, id));
    return result[0];
  }

  async getAllEffects(): Promise<Effect[]> {
    await this.ensureInitialized();
    return await db.select().from(effects).orderBy(desc(effects.usageCount));
  }

  async getEffectsByCategory(category: string): Promise<Effect[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(effects)
      .where(eq(effects.category, category))
      .orderBy(desc(effects.usageCount));
  }

  async getTrendingEffects(): Promise<Effect[]> {
    await this.ensureInitialized();
    return await db
      .select()
      .from(effects)
      .where(eq(effects.isTrending, 1))
      .orderBy(desc(effects.usageCount));
  }

  async createEffect(effect: InsertEffect): Promise<Effect> {
    await this.ensureInitialized();
    const result = await db.insert(effects).values(effect).returning();
    return result[0];
  }
}

export const storage = new SqliteStorage();
