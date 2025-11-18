import { useEffect, useState, useCallback } from "react";
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
  const [ws, setWs] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/progress`;
    
    console.log('[ws] Connecting to:', wsUrl);
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('[ws] Connected to progress server');
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
          // Invalidate videos query to refresh the gallery
          queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
          console.log(`[ws] Video ${completion.videoId} completed!`);
        } else if (message.type === 'error') {
          const error: ErrorUpdate = message.data;
          console.error(`[ws] Error for video ${error.videoId}:`, error.error);
          // Invalidate to show error state
          queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
        }
      } catch (error) {
        console.error('[ws] Error parsing message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('[ws] WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('[ws] Disconnected from progress server');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log('[ws] Attempting to reconnect...');
        connect();
      }, 3000);
    };

    setWs(websocket);

    return websocket;
  }, [queryClient]);

  useEffect(() => {
    const websocket = connect();

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [connect]);

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

  return {
    getProgress,
    clearProgress,
    progressMap,
    isConnected: ws?.readyState === WebSocket.OPEN,
  };
}
