import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ProgressUpdate {
  videoId: string;
  stage: "enhancing" | "generating" | "compositing" | "finalizing" | "completed" | "failed";
  progress: number;
  message?: string;
}

interface CompletionUpdate {
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface ErrorUpdate {
  videoId: string;
  error: string;
}

export function useVideoProgress() {
  const [progressMap, setProgressMap] = useState<Map<string, ProgressUpdate>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/progress`;
    
    const connect = () => {
      // Clear existing timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Don't reconnect if already connected
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      console.log('[ws] Connecting to:', wsUrl);
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('[ws] Connected to progress server');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[ws] Received message:', message);

          if (message.type === 'progress') {
            const update: ProgressUpdate = message.data;
            setProgressMap((prev) => {
              const newMap = new Map(prev);
              newMap.set(update.videoId, update);
              return newMap;
            });
          } else if (message.type === 'completed') {
            const completion: CompletionUpdate = message.data;
            queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
            console.log(`[ws] Video ${completion.videoId} completed!`);
            // Clear progress after completion
            setProgressMap((prev) => {
              const newMap = new Map(prev);
              newMap.delete(completion.videoId);
              return newMap;
            });
          } else if (message.type === 'error') {
            const error: ErrorUpdate = message.data;
            console.error(`[ws] Error for video ${error.videoId}:`, error.error);
            queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
            // Clear progress after error
            setProgressMap((prev) => {
              const newMap = new Map(prev);
              newMap.delete(error.videoId);
              return newMap;
            });
          }
        } catch (error) {
          console.error('[ws] Error parsing message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('[ws] WebSocket error:', error);
        setIsConnected(false);
      };

      websocket.onclose = () => {
        console.log('[ws] Disconnected from progress server');
        setIsConnected(false);
        wsRef.current = null;

        // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
        const backoff = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current++;
        
        console.log(`[ws] Reconnecting in ${backoff}ms (attempt ${reconnectAttemptsRef.current})...`);
        reconnectTimeoutRef.current = setTimeout(connect, backoff);
      };

      wsRef.current = websocket;
    };

    connect();

    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [queryClient]);

  const getProgress = (videoId: string): ProgressUpdate | undefined => {
    return progressMap.get(videoId);
  };

  const clearProgress = (videoId: string) => {
    setProgressMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(videoId);
      return newMap;
    });
  };

  // Get the most recent progress (for display in UI)
  const currentProgress = Array.from(progressMap.values()).find(
    (p) => p.stage !== "completed" && p.stage !== "failed"
  );

  // Convert to format expected by GenerationProgress component
  const formattedProgress = currentProgress ? {
    projectId: currentProgress.videoId,
    title: "Gerando vídeo",
    status: currentProgress.stage === "failed" ? "failed" as const : "processing" as const,
    progress: currentProgress.progress,
  } : null;

  return {
    getProgress,
    clearProgress,
    progressMap,
    isConnected,
    currentProgress: formattedProgress,
  };
}
