import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Play, 
  Download, 
  Share2, 
  Clock, 
  Video,
  Search,
  Filter,
  Sparkles,
  Eye
} from "lucide-react";
import type { VideoProject } from "@shared/schema";

export default function Gallery() {
  const { data: videos, isLoading } = useQuery<VideoProject[]>({
    queryKey: ['/api/videos'],
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: "default" as const, label: "Concluído", icon: Video },
      processing: { variant: "secondary" as const, label: "Processando", icon: Clock },
      failed: { variant: "destructive" as const, label: "Erro", icon: Video },
      draft: { variant: "outline" as const, label: "Rascunho", icon: Video },
    };
    
    const config = variants[status as keyof typeof variants] || variants.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getResolutionBadge = (resolution: string) => {
    const colors = {
      '720p': 'bg-blue-500/10 text-blue-500',
      '1080p': 'bg-purple-500/10 text-purple-500',
      '4K': 'bg-pink-500/10 text-pink-500',
    };
    return colors[resolution as keyof typeof colors] || colors['1080p'];
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Galeria de Vídeos
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore vídeos criados com IA de última geração
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar vídeos..." 
                    className="pl-10"
                    data-testid="input-search-videos"
                  />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger data-testid="select-filter-status">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="recent">
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="oldest">Mais Antigos</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="duration">Duração</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!videos || videos.length === 0) && (
          <Card className="p-16">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                Nenhum vídeo ainda
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Comece criando seu primeiro vídeo com inteligência artificial
              </p>
              <Button data-testid="button-create-first-video">
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Primeiro Vídeo
              </Button>
            </div>
          </Card>
        )}

        {/* Video Grid */}
        {!isLoading && videos && videos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="group overflow-hidden hover-elevate transition-all duration-300"
                data-testid={`card-video-${video.id}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title || 'Video thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <Video className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-background/90"
                      data-testid={`button-play-${video.id}`}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-background/90"
                      data-testid={`button-view-${video.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}s
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1 mb-1" data-testid={`text-title-${video.id}`}>
                      {video.title || 'Sem título'}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(video.status)}
                    {video.resolution && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getResolutionBadge(video.resolution)}`}
                      >
                        {video.resolution}
                      </Badge>
                    )}
                    {video.style && (
                      <Badge variant="outline" className="text-xs">
                        {video.style}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={video.status !== 'completed'}
                      data-testid={`button-download-${video.id}`}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={video.status !== 'completed'}
                      data-testid={`button-share-${video.id}`}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && videos && videos.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="outline">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
