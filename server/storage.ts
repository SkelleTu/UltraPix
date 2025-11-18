import { 
  type VideoProject, 
  type InsertVideoProject,
  type Template,
  type InsertTemplate,
  type Effect,
  type InsertEffect,
  videoProjects,
  templates,
  effects
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Video Projects
  getVideoProject(id: string): Promise<VideoProject | undefined>;
  getAllVideoProjects(): Promise<VideoProject[]>;
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

export class MemStorage implements IStorage {
  private videoProjects: Map<string, VideoProject>;
  private templates: Map<string, Template>;
  private effects: Map<string, Effect>;

  constructor() {
    this.videoProjects = new Map();
    this.templates = new Map();
    this.effects = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample templates
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

    sampleTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, { 
        id,
        name: template.name,
        description: template.description ?? null,
        category: template.category,
        thumbnailUrl: template.thumbnailUrl ?? null,
        previewVideoUrl: template.previewVideoUrl ?? null,
        defaultPrompt: template.defaultPrompt ?? null,
        defaultStyle: template.defaultStyle ?? null,
        defaultEffects: template.defaultEffects ?? [],
        defaultCameraControls: template.defaultCameraControls ?? null,
        popularityScore: template.popularityScore ?? 0,
      });
    });

    // Initialize sample effects
    const sampleEffects: InsertEffect[] = [
      {
        name: "ai-hug",
        displayName: "AI Hug",
        description: "Crie abraços emocionantes entre pessoas",
        category: "trending",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 10000000,
      },
      {
        name: "ai-kiss",
        displayName: "AI Kiss",
        description: "Gere momentos românticos realistas",
        category: "trending",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 8000000,
      },
      {
        name: "venom-effect",
        displayName: "Venom Effect",
        description: "Transformação estilo Venom",
        category: "transformation",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 1000000000,
      },
      {
        name: "super-hero",
        displayName: "Super Hero",
        description: "Torne-se um super-herói",
        category: "transformation",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 5000000,
      },
      {
        name: "body-morph",
        displayName: "Body Morph",
        description: "Transformações corporais suaves",
        category: "transformation",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 7000000,
      },
      {
        name: "squish-it",
        displayName: "Squish It",
        description: "Efeito de compressão divertido",
        category: "social",
        thumbnailUrl: null,
        previewVideoUrl: null,
        isTrending: 1,
        usageCount: 3000000,
      },
    ];

    sampleEffects.forEach(effect => {
      const id = randomUUID();
      this.effects.set(id, { 
        id,
        name: effect.name,
        displayName: effect.displayName,
        description: effect.description ?? null,
        category: effect.category,
        thumbnailUrl: effect.thumbnailUrl ?? null,
        previewVideoUrl: effect.previewVideoUrl ?? null,
        isTrending: effect.isTrending ?? 0,
        usageCount: effect.usageCount ?? 0,
      });
    });
  }

  // Video Projects
  async getVideoProject(id: string): Promise<VideoProject | undefined> {
    return this.videoProjects.get(id);
  }

  async getAllVideoProjects(): Promise<VideoProject[]> {
    return Array.from(this.videoProjects.values());
  }

  async createVideoProject(insertProject: InsertVideoProject): Promise<VideoProject> {
    const id = randomUUID();
    const project: VideoProject = { 
      id,
      title: insertProject.title,
      description: insertProject.description ?? null,
      type: insertProject.type,
      status: insertProject.status ?? 'draft',
      prompt: insertProject.prompt ?? null,
      sourceImageUrl: insertProject.sourceImageUrl ?? null,
      videoUrl: insertProject.videoUrl ?? null,
      thumbnailUrl: insertProject.thumbnailUrl ?? null,
      duration: insertProject.duration ?? null,
      resolution: insertProject.resolution ?? '1080p',
      style: insertProject.style ?? null,
      effects: insertProject.effects ?? [],
      cameraControls: insertProject.cameraControls ?? null,
      metadata: insertProject.metadata ?? null,
    };
    this.videoProjects.set(id, project);
    return project;
  }

  async updateVideoProject(id: string, updates: Partial<VideoProject>): Promise<VideoProject | undefined> {
    const project = this.videoProjects.get(id);
    if (!project) return undefined;

    // Create immutable copy with safe merge, ensuring required fields remain populated
    const updated: VideoProject = {
      id: project.id, // Ensure ID doesn't change
      title: updates.title !== undefined ? updates.title : project.title,
      description: updates.description !== undefined ? updates.description : project.description,
      type: updates.type !== undefined ? updates.type : project.type,
      status: updates.status !== undefined ? updates.status : project.status,
      prompt: updates.prompt !== undefined ? updates.prompt : project.prompt,
      sourceImageUrl: updates.sourceImageUrl !== undefined ? updates.sourceImageUrl : project.sourceImageUrl,
      videoUrl: updates.videoUrl !== undefined ? updates.videoUrl : project.videoUrl,
      thumbnailUrl: updates.thumbnailUrl !== undefined ? updates.thumbnailUrl : project.thumbnailUrl,
      duration: updates.duration !== undefined ? updates.duration : project.duration,
      resolution: updates.resolution !== undefined ? updates.resolution : project.resolution,
      style: updates.style !== undefined ? updates.style : project.style,
      effects: updates.effects !== undefined ? updates.effects : project.effects,
      cameraControls: updates.cameraControls !== undefined ? updates.cameraControls : project.cameraControls,
      metadata: updates.metadata !== undefined ? updates.metadata : project.metadata,
    };
    
    this.videoProjects.set(id, updated);
    return updated;
  }

  async deleteVideoProject(id: string): Promise<boolean> {
    return this.videoProjects.delete(id);
  }

  // Templates
  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).sort(
      (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
    );
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values())
      .filter(t => t.category === category)
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { 
      id,
      name: insertTemplate.name,
      description: insertTemplate.description ?? null,
      category: insertTemplate.category,
      thumbnailUrl: insertTemplate.thumbnailUrl ?? null,
      previewVideoUrl: insertTemplate.previewVideoUrl ?? null,
      defaultPrompt: insertTemplate.defaultPrompt ?? null,
      defaultStyle: insertTemplate.defaultStyle ?? null,
      defaultEffects: insertTemplate.defaultEffects ?? [],
      defaultCameraControls: insertTemplate.defaultCameraControls ?? null,
      popularityScore: insertTemplate.popularityScore ?? 0,
    };
    this.templates.set(id, template);
    return template;
  }

  // Effects
  async getEffect(id: string): Promise<Effect | undefined> {
    return this.effects.get(id);
  }

  async getAllEffects(): Promise<Effect[]> {
    return Array.from(this.effects.values()).sort(
      (a, b) => (b.usageCount || 0) - (a.usageCount || 0)
    );
  }

  async getEffectsByCategory(category: string): Promise<Effect[]> {
    return Array.from(this.effects.values())
      .filter(e => e.category === category)
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  }

  async getTrendingEffects(): Promise<Effect[]> {
    return Array.from(this.effects.values())
      .filter(e => e.isTrending === 1)
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  }

  async createEffect(insertEffect: InsertEffect): Promise<Effect> {
    const id = randomUUID();
    const effect: Effect = { 
      id,
      name: insertEffect.name,
      displayName: insertEffect.displayName,
      description: insertEffect.description ?? null,
      category: insertEffect.category,
      thumbnailUrl: insertEffect.thumbnailUrl ?? null,
      previewVideoUrl: insertEffect.previewVideoUrl ?? null,
      isTrending: insertEffect.isTrending ?? 0,
      usageCount: insertEffect.usageCount ?? 0,
    };
    this.effects.set(id, effect);
    return effect;
  }
}

export class PgStorage implements IStorage {
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
      await db.insert(templates).values(sampleTemplates);
    }

    const existingEffects = await db.select().from(effects);
    if (existingEffects.length === 0) {
      const sampleEffects: InsertEffect[] = [
        {
          name: "ai-hug",
          displayName: "AI Hug",
          description: "Crie abraços emocionantes entre pessoas",
          category: "trending",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 10000000,
        },
        {
          name: "ai-kiss",
          displayName: "AI Kiss",
          description: "Gere momentos românticos realistas",
          category: "trending",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 8000000,
        },
        {
          name: "venom-effect",
          displayName: "Venom Effect",
          description: "Transformação estilo Venom",
          category: "transformation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 1000000000,
        },
        {
          name: "super-hero",
          displayName: "Super Hero",
          description: "Torne-se um super-herói",
          category: "transformation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 5000000,
        },
        {
          name: "body-morph",
          displayName: "Body Morph",
          description: "Transformações corporais suaves",
          category: "transformation",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 7000000,
        },
        {
          name: "squish-it",
          displayName: "Squish It",
          description: "Efeito de compressão divertido",
          category: "social",
          thumbnailUrl: null,
          previewVideoUrl: null,
          isTrending: 1,
          usageCount: 3000000,
        },
      ];
      await db.insert(effects).values(sampleEffects);
    }
    } catch (error) {
      console.error('Error in initializeSampleData:', error);
      throw error;
    }
  }

  async getVideoProject(id: string): Promise<VideoProject | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(videoProjects).where(eq(videoProjects.id, id));
    return result[0];
  }

  async getAllVideoProjects(): Promise<VideoProject[]> {
    await this.ensureInitialized();
    try {
      const result = await db.select().from(videoProjects);
      return result || [];
    } catch (error: any) {
      // Known bug in Neon HTTP driver: when table is empty, it returns null instead of []
      // and processQueryResult tries to call .map() on null
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty table bug detected, returning empty array');
        return [];
      }
      // For any other database errors, propagate them so routes can return 500
      throw error;
    }
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

  async getTemplate(id: string): Promise<Template | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async getAllTemplates(): Promise<Template[]> {
    await this.ensureInitialized();
    try {
      const result = await db.select().from(templates).orderBy(desc(templates.popularityScore));
      return result || [];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty result bug detected in getAllTemplates');
        return [];
      }
      throw error;
    }
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    await this.ensureInitialized();
    try {
      const result = await db
        .select()
        .from(templates)
        .where(eq(templates.category, category))
        .orderBy(desc(templates.popularityScore));
      return result || [];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty result bug detected in getTemplatesByCategory');
        return [];
      }
      throw error;
    }
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    await this.ensureInitialized();
    const result = await db.insert(templates).values(template).returning();
    return result[0];
  }

  async getEffect(id: string): Promise<Effect | undefined> {
    await this.ensureInitialized();
    const result = await db.select().from(effects).where(eq(effects.id, id));
    return result[0];
  }

  async getAllEffects(): Promise<Effect[]> {
    await this.ensureInitialized();
    try {
      const result = await db.select().from(effects).orderBy(desc(effects.usageCount));
      return result || [];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty result bug detected in getAllEffects');
        return [];
      }
      throw error;
    }
  }

  async getEffectsByCategory(category: string): Promise<Effect[]> {
    await this.ensureInitialized();
    try {
      const result = await db
        .select()
        .from(effects)
        .where(eq(effects.category, category))
        .orderBy(desc(effects.usageCount));
      return result || [];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty result bug detected in getEffectsByCategory');
        return [];
      }
      throw error;
    }
  }

  async getTrendingEffects(): Promise<Effect[]> {
    await this.ensureInitialized();
    try {
      const result = await db
        .select()
        .from(effects)
        .where(eq(effects.isTrending, 1))
        .orderBy(desc(effects.usageCount));
      return result || [];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null (reading 'map')")) {
        console.warn('Neon driver empty result bug detected in getTrendingEffects');
        return [];
      }
      throw error;
    }
  }

  async createEffect(effect: InsertEffect): Promise<Effect> {
    await this.ensureInitialized();
    const result = await db.insert(effects).values(effect).returning();
    return result[0];
  }
}

export const storage = new PgStorage();
