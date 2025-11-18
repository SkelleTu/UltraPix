import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  videoGenerationRequestSchema,
  type VideoProject,
  type Template,
  type Effect
} from "@shared/schema";
import { 
  generateVideoFromText, 
  generateVideoFromImage,
  enhancePrompt,
  generateThumbnail
} from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============================================
  // VIDEO PROJECTS ROUTES
  // ============================================
  
  // Get all video projects
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideoProjects();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Get single video project
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideoProject(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  // Generate new video
  app.post("/api/videos/generate", async (req, res) => {
    try {
      // Validate request body
      const validatedData = videoGenerationRequestSchema.parse(req.body);
      
      // Enhance the prompt for better results
      const enhancedPrompt = await enhancePrompt(
        validatedData.prompt, 
        validatedData.style
      );

      // Create initial project record with processing status
      const project = await storage.createVideoProject({
        title: validatedData.title || `Video ${new Date().toLocaleDateString()}`,
        description: validatedData.description || validatedData.prompt,
        type: validatedData.type,
        status: 'processing',
        prompt: enhancedPrompt,
        sourceImageUrl: validatedData.sourceImageUrl || null,
        videoUrl: null,
        thumbnailUrl: null,
        duration: validatedData.duration,
        resolution: validatedData.resolution,
        style: validatedData.style || null,
        effects: validatedData.effects,
        cameraControls: validatedData.cameraControls || null,
        metadata: null,
      });

      // Start video generation process asynchronously
      // In a production app, this would be handled by a job queue
      (async () => {
        try {
          let generationResult;
          
          if (validatedData.type === 'text-to-video') {
            generationResult = await generateVideoFromText({
              prompt: enhancedPrompt,
              duration: validatedData.duration,
              resolution: validatedData.resolution,
              style: validatedData.style,
            });
          } else {
            generationResult = await generateVideoFromImage(
              validatedData.sourceImageUrl || '',
              enhancedPrompt,
              {
                duration: validatedData.duration,
                resolution: validatedData.resolution,
                style: validatedData.style,
              }
            );
          }

          // Generate thumbnail
          const thumbnailUrl = await generateThumbnail(enhancedPrompt);

          // Update project with completed status
          await storage.updateVideoProject(project.id, {
            status: 'completed',
            videoUrl: generationResult.videoUrl || `https://example.com/videos/${project.id}.mp4`,
            thumbnailUrl: thumbnailUrl || `https://example.com/thumbnails/${project.id}.jpg`,
            metadata: generationResult.metadata,
          });
        } catch (error) {
          console.error('Error during video generation:', error);
          await storage.updateVideoProject(project.id, {
            status: 'failed',
            metadata: { error: (error as Error).message },
          });
        }
      })();

      // Return the project immediately
      res.status(202).json(project);
    } catch (error) {
      console.error("Error generating video:", error);
      if ((error as any).name === 'ZodError') {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: (error as any).errors 
        });
      }
      res.status(500).json({ error: "Failed to generate video" });
    }
  });

  // Update video project
  app.patch("/api/videos/:id", async (req, res) => {
    try {
      const updated = await storage.updateVideoProject(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ error: "Failed to update video" });
    }
  });

  // Delete video project
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVideoProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // ============================================
  // TEMPLATES ROUTES
  // ============================================
  
  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const templates = category 
        ? await storage.getTemplatesByCategory(category)
        : await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // ============================================
  // EFFECTS ROUTES
  // ============================================
  
  // Get all effects
  app.get("/api/effects", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const trending = req.query.trending === 'true';
      
      let effects: Effect[];
      if (trending) {
        effects = await storage.getTrendingEffects();
      } else if (category) {
        effects = await storage.getEffectsByCategory(category);
      } else {
        effects = await storage.getAllEffects();
      }
      
      res.json(effects);
    } catch (error) {
      console.error("Error fetching effects:", error);
      res.status(500).json({ error: "Failed to fetch effects" });
    }
  });

  // Get single effect
  app.get("/api/effects/:id", async (req, res) => {
    try {
      const effect = await storage.getEffect(req.params.id);
      if (!effect) {
        return res.status(404).json({ error: "Effect not found" });
      }
      res.json(effect);
    } catch (error) {
      console.error("Error fetching effect:", error);
      res.status(500).json({ error: "Failed to fetch effect" });
    }
  });

  // ============================================
  // UTILITY ROUTES
  // ============================================
  
  // Enhance prompt
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const { prompt, style } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      
      const enhanced = await enhancePrompt(prompt, style);
      res.json({ enhanced });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      res.status(500).json({ error: "Failed to enhance prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
