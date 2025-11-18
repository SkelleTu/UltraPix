import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  TrendingUp, 
  Sparkles, 
  Heart,
  Users,
  Zap,
  Film,
  Search,
  Play
} from "lucide-react";
import type { Effect } from "@shared/schema";

export default function Effects() {
  const { data: effects, isLoading } = useQuery<Effect[]>({
    queryKey: ['/api/effects'],
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: Sparkles },
    { id: 'trending', name: 'Em Alta', icon: TrendingUp },
    { id: 'transformation', name: 'Transformações', icon: Wand2 },
    { id: 'social', name: 'Redes Sociais', icon: Users },
    { id: 'professional', name: 'Profissional', icon: Film },
  ];

  const trendingEffects = [
    {
      name: "AI Hug",
      description: "Crie abraços emocionantes entre pessoas",
      views: "10M+ visualizações",
      trending: true
    },
    {
      name: "AI Kiss",
      description: "Gere momentos românticos realistas",
      views: "8M+ visualizações",
      trending: true
    },
    {
      name: "Venom Effect",
      description: "Transformação estilo Venom",
      views: "1B+ visualizações",
      trending: true
    },
    {
      name: "Super Hero",
      description: "Torne-se um super-herói",
      views: "5M+ visualizações",
      trending: true
    },
    {
      name: "Body Morph",
      description: "Transformações corporais suaves",
      views: "7M+ visualizações",
      trending: true
    },
    {
      name: "Squish It",
      description: "Efeito de compressão divertido",
      views: "3M+ visualizações",
      trending: true
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Biblioteca de Efeitos
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Efeitos de IA virais e profissionais para seus vídeos
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar efeitos..." 
                className="pl-11 h-12 text-base"
                data-testid="input-search-effects"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
                data-testid={`tab-category-${category.id}`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {/* Trending Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl font-bold">Em Alta Agora</h2>
                <Badge variant="secondary" className="ml-2">
                  <Zap className="w-3 h-3 mr-1" />
                  Viral
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingEffects.map((effect, i) => (
                  <Card 
                    key={i} 
                    className="group overflow-hidden hover-elevate transition-all duration-300"
                    data-testid={`card-trending-effect-${i}`}
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="destructive" className="animate-pulse">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold mb-1">{effect.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {effect.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {effect.views}
                        </span>
                        <Button size="sm" data-testid={`button-apply-effect-${i}`}>
                          <Wand2 className="w-3 h-3 mr-1" />
                          Aplicar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Effects Grid */}
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Todos os Efeitos</h2>
              
              {isLoading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video w-full" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && (!effects || effects.length === 0) && (
                <Card className="p-16">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Wand2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      Efeitos em Desenvolvimento
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Nossa biblioteca de efeitos está sendo preparada. Em breve você terá acesso a dezenas de efeitos profissionais!
                    </p>
                  </div>
                </Card>
              )}

              {!isLoading && effects && effects.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {effects.map((effect) => (
                    <Card 
                      key={effect.id} 
                      className="group overflow-hidden hover-elevate transition-all duration-300"
                      data-testid={`card-effect-${effect.id}`}
                    >
                      <div className="relative aspect-video bg-muted">
                        {effect.previewVideoUrl ? (
                          <video 
                            src={effect.previewVideoUrl}
                            className="w-full h-full object-cover"
                            loop
                            muted
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                            <Wand2 className="w-12 h-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            size="icon" 
                            variant="secondary"
                            className="bg-background/90"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        {effect.isTrending === 1 && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="destructive" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Em Alta
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold mb-1">
                            {effect.displayName}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {effect.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant="outline" className="text-xs">
                            {effect.category}
                          </Badge>
                          <Button size="sm">
                            <Wand2 className="w-3 h-3 mr-1" />
                            Usar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Other category tabs would have similar content */}
          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <Card className="p-16">
                <div className="text-center">
                  <category.icon className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Efeitos desta categoria serão adicionados em breve
                  </p>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
