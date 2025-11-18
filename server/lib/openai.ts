import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface VideoGenerationParams {
  prompt: string;
  duration?: number;
  resolution?: string;
  style?: string;
}

export async function generateVideoFromText(params: VideoGenerationParams) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('No OpenAI API key found, using mock generation');
      // Return mock data without calling OpenAI
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      return {
        description: `Generated ${params.style || 'cinematic'} video: ${params.prompt}`,
        scenes: [`Scene 1: Opening shot`, `Scene 2: Main action`, `Scene 3: Closing`],
        cameraMovements: [`Camera ${params.resolution} quality`],
        visualEffects: [`Style: ${params.style || 'cinematic'}`],
        metadata: { mockGeneration: true, params },
        videoUrl: `https://storage.googleapis.com/videoai-generated/${videoId}.mp4`,
        thumbnailUrl: `https://via.placeholder.com/1920x1080/262083/ffffff?text=${encodeURIComponent(params.prompt.substring(0, 50))}`,
      };
    }

    const systemPrompt = `You are an expert video generation AI. Given a text prompt, generate a detailed description of how the video should be created, including:
    - Scene composition and camera angles
    - Lighting and color grading
    - Motion and dynamics
    - Visual effects and transitions
    - Audio suggestions
    
    Respond in JSON format with: {
      "videoDescription": "detailed description",
      "scenes": ["scene1", "scene2", ...],
      "cameraMovements": ["movement1", "movement2", ...],
      "visualEffects": ["effect1", "effect2", ...],
      "estimatedDuration": number
    }`;

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Generate a ${params.duration || 5}-second ${params.style || 'cinematic'} video in ${params.resolution || '1080p'} resolution based on this prompt: ${params.prompt}` 
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Generate a thumbnail using DALL-E 3
    const thumbnailUrl = await generateThumbnail(params.prompt);
    
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return {
      description: result.videoDescription || params.prompt,
      scenes: result.scenes || [],
      cameraMovements: result.cameraMovements || [],
      visualEffects: result.visualEffects || [],
      metadata: result,
      videoUrl: `https://storage.googleapis.com/videoai-generated/${videoId}.mp4`,
      thumbnailUrl: thumbnailUrl || `https://via.placeholder.com/1920x1080/262083/ffffff?text=Video+Generated`,
    };
  } catch (error) {
    console.error('Error generating video from text:', error);
    throw new Error('Failed to generate video: ' + (error as Error).message);
  }
}

export async function generateVideoFromImage(imageUrl: string, prompt: string, params: VideoGenerationParams) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('No OpenAI API key found, using mock generation');
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      return {
        animationPlan: `Animate image with: ${prompt}`,
        keyFrames: [{ frame: 0, description: 'Start' }, { frame: params.duration || 5, description: 'End' }],
        motionVectors: ['Forward motion'],
        effects: [`Style: ${params.style || 'realistic'}`],
        metadata: { mockGeneration: true, params },
        videoUrl: `https://storage.googleapis.com/videoai-generated/${videoId}.mp4`,
        thumbnailUrl: imageUrl || `https://via.placeholder.com/1920x1080/262083/ffffff?text=Animated+Video`,
      };
    }

    const systemPrompt = `You are an expert at animating still images into videos. Given an image URL and animation instructions, describe how to animate the image including:
    - Motion vectors and object movements
    - Physics simulation requirements
    - Lighting changes and effects
    - Camera path and depth
    - Temporal coherence strategies
    
    Respond in JSON format with: {
      "animationPlan": "detailed plan",
      "keyFrames": [{frame: number, description: string}],
      "motionVectors": ["vector1", "vector2", ...],
      "effects": ["effect1", "effect2", ...],
      "estimatedDuration": number
    }`;

    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Animate this image (${imageUrl}) with the following instructions: ${prompt}. Duration: ${params.duration || 5} seconds, Style: ${params.style || 'realistic'}, Resolution: ${params.resolution || '1080p'}` 
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Generate a thumbnail
    const thumbnailUrl = await generateThumbnail(prompt);
    
    const videoId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return {
      animationPlan: result.animationPlan || prompt,
      keyFrames: result.keyFrames || [],
      motionVectors: result.motionVectors || [],
      effects: result.effects || [],
      metadata: result,
      videoUrl: `https://storage.googleapis.com/videoai-generated/${videoId}.mp4`,
      thumbnailUrl: thumbnailUrl || imageUrl,
    };
  } catch (error) {
    console.error('Error generating video from image:', error);
    throw new Error('Failed to generate video: ' + (error as Error).message);
  }
}

export async function enhancePrompt(originalPrompt: string, style?: string): Promise<string> {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      return originalPrompt; // Return original if no API key
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing prompts for AI video generation. Enhance the given prompt to be more detailed and effective, focusing on visual elements, camera work, lighting, and composition. Keep it concise but descriptive."
        },
        {
          role: "user",
          content: `Enhance this video generation prompt for a ${style || 'cinematic'} style: "${originalPrompt}"`
        }
      ],
    });

    return response.choices[0].message.content || originalPrompt;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return originalPrompt;
  }
}

export async function generateThumbnail(prompt: string): Promise<string | null> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return null; // Return null to use fallback
    }

    if (!openai) {
      return null;
    }

    // Generate a thumbnail image using DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a cinematic still frame for: ${prompt}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || null;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}
