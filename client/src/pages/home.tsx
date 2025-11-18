import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Wand2, 
  Camera, 
  Zap, 
  Share2,
  Clock,
  Palette,
  Film,
  Stars,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Video,
      title: "Text-to-Video",
      description: "Transforme descrições em vídeos cinematográficos com IA de última geração",
      badge: "Novo"
    },
    {
      icon: ImageIcon,
      title: "Image-to-Video",
      description: "Anime imagens estáticas com física realista e movimentos naturais",
      badge: "Popular"
    },
    {
      icon: Wand2,
      title: "Efeitos de IA",
      description: "AI Hug, AI Kiss, transformações de corpo, efeitos de super-herói e muito mais",
      badge: "Trending"
    },
    {
      icon: Camera,
      title: "Controles Profissionais",
      description: "Zoom, pan, ângulos de câmera, slow motion e iluminação cinematográfica",
      badge: null
    },
    {
      icon: Film,
      title: "Editor com Timeline",
      description: "Edição visual com keyframes, camadas e extensão de vídeo",
      badge: null
    },
    {
      icon: Palette,
      title: "Estilos Diversos",
      description: "Cinemático, anime, realista, artístico e muito mais",
      badge: null
    },
    {
      icon: Zap,
      title: "Geração Rápida",
      description: "Processamento em 3-5 minutos com qualidade até 4K",
      badge: null
    },
    {
      icon: Share2,
      title: "Compartilhamento Social",
      description: "Exporte direto para TikTok, Instagram, YouTube e Twitter",
      badge: null
    }
  ];

  const stats = [
    { label: "Resolução Máxima", value: "4K" },
    { label: "Tempo Médio", value: "3-5 min" },
    { label: "Efeitos Disponíveis", value: "50+" },
    { label: "Templates", value: "100+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Overlay */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm border-primary/50">
            <Sparkles className="w-3 h-3 mr-1" />
            100% Gratuito • Sem Limites
          </Badge>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
            Crie Vídeos Incríveis
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
              com Inteligência Artificial
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            A plataforma mais avançada de geração de vídeos com IA. 
            Qualidade profissional 4K, efeitos cinematográficos, edição em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create">
              <Button 
                size="lg" 
                className="min-w-48 h-12 text-lg bg-primary/90 backdrop-blur-sm border border-primary-border"
                data-testid="button-start-creating"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Começar a Criar
              </Button>
            </Link>
            
            <Link href="/gallery">
              <Button 
                size="lg" 
                variant="outline" 
                className="min-w-48 h-12 text-lg bg-background/50 backdrop-blur-sm"
                data-testid="button-explore-gallery"
              >
                <Stars className="w-5 h-5 mr-2" />
                Ver Galeria
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-background/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Recursos Avançados
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Tudo que Você Precisa para
              <br />
              <span className="text-primary">Criar Vídeos Profissionais</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas de IA combinadas com controles profissionais 
              para resultados cinematográficos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                className="hover-elevate transition-all duration-300"
                data-testid={`card-feature-${i}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    {feature.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-card border border-card-border rounded-2xl p-12">
            <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Comece a Criar Agora
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sem necessidade de cadastro. Sem limites de uso. 
              Sem marcas d'água. 100% gratuito para sempre.
            </p>
            <Link href="/create">
              <Button 
                size="lg" 
                className="min-w-64 h-12 text-lg"
                data-testid="button-cta-create"
              >
                Criar Meu Primeiro Vídeo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
