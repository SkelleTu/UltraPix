import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "./video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, Edit, Trash2 } from "lucide-react";
import type { VideoProject } from "@shared/schema";

interface VideoPreviewDialogProps {
  video: VideoProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPreviewDialog({
  video,
  open,
  onOpenChange,
}: VideoPreviewDialogProps) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {video.title || "Sem título"}
          </DialogTitle>
          {video.description && (
            <DialogDescription className="text-base">
              {video.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          {video.videoUrl && video.status === "completed" ? (
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnailUrl || undefined}
              className="w-full aspect-video"
            />
          ) : (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  {video.status === "processing"
                    ? "Vídeo em processamento..."
                    : video.status === "failed"
                    ? "Falha ao gerar vídeo"
                    : "Vídeo não disponível"}
                </p>
                {video.thumbnailUrl && (
                  <img
                    src={video.thumbnailUrl}
                    alt="Thumbnail"
                    className="max-w-xs mx-auto rounded"
                  />
                )}
              </div>
            </div>
          )}

          {/* Video Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Detalhes do Vídeo</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd>
                    <Badge
                      variant={
                        video.status === "completed"
                          ? "default"
                          : video.status === "processing"
                          ? "secondary"
                          : video.status === "failed"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {video.status === "completed"
                        ? "Concluído"
                        : video.status === "processing"
                        ? "Processando"
                        : video.status === "failed"
                        ? "Erro"
                        : "Rascunho"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tipo:</dt>
                  <dd className="font-medium">
                    {video.type === "text-to-video"
                      ? "Text-to-Video"
                      : "Image-to-Video"}
                  </dd>
                </div>
                {video.duration && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duração:</dt>
                    <dd className="font-medium">{video.duration} segundos</dd>
                  </div>
                )}
                {video.resolution && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Resolução:</dt>
                    <dd className="font-medium">{video.resolution}</dd>
                  </div>
                )}
                {video.style && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Estilo:</dt>
                    <dd className="font-medium capitalize">{video.style}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Configurações</h3>
              <dl className="space-y-2 text-sm">
                {video.prompt && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Prompt:</dt>
                    <dd className="text-sm bg-muted p-2 rounded">
                      {video.prompt}
                    </dd>
                  </div>
                )}
                {video.effects && Array.isArray(video.effects) && video.effects.length > 0 ? (
                  <div>
                    <dt className="text-muted-foreground mb-1">Efeitos:</dt>
                    <dd className="flex flex-wrap gap-1">
                      {(video.effects as unknown[]).map((effect, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {String(effect)}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {video.cameraControls && typeof video.cameraControls === 'object' ? (
                  <div>
                    <dt className="text-muted-foreground mb-1">
                      Controles de Câmera:
                    </dt>
                    <dd className="text-sm bg-muted p-2 rounded">
                      Movimento: {String((video.cameraControls as any).movement || "N/A")}
                      {" | "}
                      Velocidade: {String((video.cameraControls as any).speed || "N/A")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              className="flex-1"
              disabled={video.status !== "completed"}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Vídeo
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={video.status !== "completed"}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
