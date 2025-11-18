import { 
  type VideoProject, 
  type InsertVideoProject,
  type Template,
  type InsertTemplate,
  type Effect,
  type InsertEffect
} from "@shared/schema";
import { randomUUID } from "crypto";

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
        ...template, 
        id
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
        ...effect, 
        id
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
      ...insertProject, 
      id
    };
    this.videoProjects.set(id, project);
    return project;
  }

  async updateVideoProject(id: string, updates: Partial<VideoProject>): Promise<VideoProject | undefined> {
    const project = this.videoProjects.get(id);
    if (!project) return undefined;

    const updated: VideoProject = {
      ...project,
      ...updates,
      id, // Ensure ID doesn't change
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
      ...insertTemplate, 
      id
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
      ...insertEffect, 
      id
    };
    this.effects.set(id, effect);
    return effect;
  }
}

export const storage = new MemStorage();
