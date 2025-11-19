import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Film,
  Download,
} from "lucide-react";

interface GenerationStage {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  icon: React.ElementType;
}

interface GenerationProgressProps {
  projectId: string;
  title: string;
  status: "processing" | "failed";
  progress: number;
}

export function GenerationProgress({
  projectId,
  title,
  status,
  progress,
}: GenerationProgressProps) {
  const currentStage = progress < 25 ? "enhancing" : progress < 50 ? "generating" : progress < 75 ? "compositing" : "finalizing";
  const overallProgress = progress;
  const stages: GenerationStage[] = [
    {
      id: "enhancing",
      name: "Melhorando Prompt",
      status: currentStage === "enhancing" ? "processing" : "completed",
      progress: currentStage === "enhancing" ? overallProgress : 100,
      icon: Sparkles,
    },
    {
      id: "generating",
      name: "Gerando Frames",
      status:
        currentStage === "generating"
          ? "processing"
          : currentStage === "enhancing"
          ? "pending"
          : "completed",
      progress: currentStage === "generating" ? overallProgress : currentStage === "enhancing" ? 0 : 100,
      icon: ImageIcon,
    },
    {
      id: "compositing",
      name: "Criando Vídeo",
      status:
        currentStage === "compositing"
          ? "processing"
          : ["enhancing", "generating"].includes(currentStage)
          ? "pending"
          : "completed",
      progress: currentStage === "compositing" ? overallProgress : ["enhancing", "generating"].includes(currentStage) ? 0 : 100,
      icon: Film,
    },
    {
      id: "finalizing",
      name: "Finalizando",
      status:
        currentStage === "finalizing"
          ? "processing"
          : overallProgress >= 95
          ? "completed"
          : "pending",
      progress: currentStage === "finalizing" ? overallProgress : overallProgress >= 95 ? 100 : 0,
      icon: Download,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "failed":
        return <Circle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Progresso da Geração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="relative">
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div
                    className={`absolute left-[10px] top-10 bottom-0 w-0.5 ${
                      stage.status === "completed"
                        ? "bg-green-500"
                        : stage.status === "processing"
                        ? "bg-gradient-to-b from-primary to-muted"
                        : "bg-muted"
                    }`}
                  />
                )}

                {/* Stage Content */}
                <div className="flex items-start gap-4 relative z-10">
                  {/* Status Icon */}
                  <div className="mt-1">{getStatusIcon(stage.status)}</div>

                  {/* Stage Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      {stage.status === "processing" && (
                        <Badge variant="secondary" className="animate-pulse">
                          Em Progresso
                        </Badge>
                      )}
                      {stage.status === "completed" && (
                        <Badge variant="default">Concluído</Badge>
                      )}
                    </div>

                    {/* Stage Progress */}
                    {stage.status === "processing" && (
                      <div>
                        <Progress value={stage.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(stage.progress || 0)}% completo
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Time */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tempo Estimado:</span>
            <span className="font-medium">
              {overallProgress < 25
                ? "3-5 minutos"
                : overallProgress < 50
                ? "2-4 minutos"
                : overallProgress < 75
                ? "1-2 minutos"
                : "Menos de 1 minuto"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
