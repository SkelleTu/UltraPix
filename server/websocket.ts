import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface ProgressUpdate {
  videoId: string;
  stage: "enhancing" | "generating" | "compositing" | "finalizing" | "completed" | "failed";
  progress: number;
  message?: string;
}

export class VideoProgressWebSocket {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: "/ws/progress"
    });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("[ws] Client connected");
      this.clients.add(ws);

      ws.on("close", () => {
        console.log("[ws] Client disconnected");
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("[ws] WebSocket error:", error);
        this.clients.delete(ws);
      });
    });
  }

  sendProgress(update: ProgressUpdate) {
    const message = JSON.stringify({
      type: "progress",
      data: update,
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`[ws] Sent progress update for video ${update.videoId}: ${update.stage} - ${update.progress}%`);
  }

  sendError(videoId: string, error: string) {
    const message = JSON.stringify({
      type: "error",
      data: { videoId, error },
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  sendCompletion(videoId: string, videoUrl: string, thumbnailUrl: string) {
    const message = JSON.stringify({
      type: "completed",
      data: { videoId, videoUrl, thumbnailUrl },
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(`[ws] Sent completion notification for video ${videoId}`);
  }
}

export let wsServer: VideoProgressWebSocket | null = null;

export function initializeWebSocket(server: Server) {
  wsServer = new VideoProgressWebSocket(server);
  console.log("[ws] WebSocket server initialized");
  return wsServer;
}
