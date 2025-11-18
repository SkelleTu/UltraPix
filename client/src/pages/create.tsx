import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  Camera,
  Zap,
  Wand2,
  Upload,
  Play,
  Settings2
} from "lucide-react";

import { videoGenerationRequestSchema, type VideoGenerationRequest } from "@shared/schema";

// Extend the shared schema with UI-only fields for camera controls
const createVideoFormSchema = videoGenerationRequestSchema.extend({
  cameraMovement: z.enum(['static', 'pan', 'zoom', 'orbit']).optional(),
  cameraSpeed: z.enum(['slow', 'normal', 'fast']).optional(),
});

type CreateVideoForm = z.infer<typeof createVideoFormSchema>;

export default function Create() {
  const [activeTab, setActiveTab] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateVideoForm>({
    resolver: zodResolver(createVideoFormSchema),
    defaultValues: {
      type: 'text-to-video',
      resolution: '1080p',
      duration: 5,
      effects: [],
      cameraMovement: 'static',
      cameraSpeed: 'normal',
      prompt: '',
    },
  });

  const generateVideoMutation = useMutation({
    mutationFn: async (data: VideoGenerationRequest) => {
      return await apiRequest('POST', '/api/videos/generate', data);
    },
    onSuccess: () => {
      toast({
        title: "Vídeo em processamento!",
        description: "Seu vídeo está sendo gerado. Isso pode levar de 3 a 5 minutos.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao gerar vídeo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateVideoForm) => {
    const { cameraMovement, cameraSpeed, ...rest } = data;
    
    generateVideoMutation.mutate({
      ...rest,
      type: activeTab,
      effects: data.effects || [],
      cameraControls: cameraMovement ? {
        movement: cameraMovement,
        speed: cameraSpeed,
      } : undefined,
    });
  };

  const examplePrompts = {
    'text-to-video': [
      "Um gato dançando em uma cidade futurista com luzes neon",
      "Astronauta flutuando em um campo de flores no espaço",
      "Dragão voando sobre montanhas cobertas de neve ao pôr do sol",
    ],
    'image-to-video': [
      "Adicione movimento suave e natural à imagem",
      "Anime a cena com ventos suaves e iluminação dinâmica",
      "Crie uma sequência cinematográfica a partir desta foto",
    ],
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Criar Novo Vídeo
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Transforme suas ideias em vídeos profissionais com IA de última geração
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Creation Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Vídeo</CardTitle>
                <CardDescription>
                  Escolha o método de criação e personalize seu vídeo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Type Selection Tabs */}
                    <Tabs 
                      value={activeTab} 
                      onValueChange={(v) => {
                        setActiveTab(v as typeof activeTab);
                        form.setValue('type', v as typeof activeTab);
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text-to-video" data-testid="tab-text-to-video">
                          <Video className="w-4 h-4 mr-2" />
                          Text-to-Video
                        </TabsTrigger>
                        <TabsTrigger value="image-to-video" data-testid="tab-image-to-video">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Image-to-Video
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text-to-video" className="space-y-6 mt-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título do Projeto (Opcional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: Gato dançante futurista" 
                                  {...field} 
                                  data-testid="input-title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição do Vídeo</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva detalhadamente o vídeo que você quer criar..."
                                  className="min-h-32 resize-none"
                                  {...field}
                                  data-testid="textarea-prompt"
                                />
                              </FormControl>
                              <FormDescription>
                                Quanto mais detalhes, melhor o resultado. Mínimo: 10 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Example Prompts */}
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Exemplos de prompts:
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {examplePrompts['text-to-video'].map((example, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="cursor-pointer hover-elevate"
                                onClick={() => form.setValue('prompt', example)}
                                data-testid={`badge-example-${i}`}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                {example.substring(0, 30)}...
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="image-to-video" className="space-y-6 mt-6">
                        <FormField
                          control={form.control}
                          name="sourceImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL da Imagem</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <Input 
                                    placeholder="https://exemplo.com/imagem.jpg" 
                                    {...field} 
                                    data-testid="input-image-url"
                                  />
                                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover-elevate transition-all">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Ou arraste e solte uma imagem aqui
                                    </p>
                                    <Button variant="outline" size="sm" type="button">
                                      Selecionar Arquivo
                                    </Button>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instruções de Animação</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva como a imagem deve ser animada..."
                                  className="min-h-24 resize-none"
                                  {...field}
                                  data-testid="textarea-animation-prompt"
                                />
                              </FormControl>
                              <FormDescription>
                                Descreva o movimento, iluminação ou transformações desejadas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>

                    {/* Advanced Settings Accordion */}
                    <Accordion type="single" collapsible className="border-t pt-6">
                      <AccordionItem value="basic-settings" className="border-b-0">
                        <AccordionTrigger data-testid="accordion-basic-settings">
                          <div className="flex items-center">
                            <Settings2 className="w-4 h-4 mr-2" />
                            Configurações Básicas
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                          <FormField
                            control={form.control}
                            name="resolution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resolução</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger data-testid="select-resolution">
                                      <SelectValue placeholder="Selecione a resolução" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="720p">720p HD</SelectItem>
                                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                                    <SelectItem value="4K">4K Ultra HD</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duração: {field.value} segundos</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={3}
                                    max={60}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                    data-testid="slider-duration"
                                  />
                                </FormControl>
                                <FormDescription>
                                  De 3 a 60 segundos
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="style"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estilo Visual</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-style">
                                      <SelectValue placeholder="Selecione um estilo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cinematic">Cinemático</SelectItem>
                                    <SelectItem value="anime">Anime</SelectItem>
                                    <SelectItem value="realistic">Realista</SelectItem>
                                    <SelectItem value="artistic">Artístico</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="camera-settings" className="border-b-0">
                        <AccordionTrigger data-testid="accordion-camera-settings">
                          <div className="flex items-center">
                            <Camera className="w-4 h-4 mr-2" />
                            Controles de Câmera
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                          <FormField
                            control={form.control}
                            name="cameraMovement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Movimento da Câmera</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-camera-movement">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="static">Estático</SelectItem>
                                    <SelectItem value="pan">Pan (Lateral)</SelectItem>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="orbit">Órbita</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cameraSpeed"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Velocidade do Movimento</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-camera-speed">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="slow">Lento</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="fast">Rápido</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Generate Button */}
                    <div className="flex gap-4 pt-6 border-t">
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1"
                        disabled={generateVideoMutation.isPending}
                        data-testid="button-generate-video"
                      >
                        {generateVideoMutation.isPending ? (
                          <>
                            <Zap className="w-5 h-5 mr-2 animate-pulse" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Gerar Vídeo
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        data-testid="button-preview"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Tips & Templates */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-primary" />
                  Dicas Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-muted-foreground">
                      Seja específico: descreva cores, iluminação e ângulos de câmera
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-muted-foreground">
                      Use referências cinematográficas para resultados profissionais
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-muted-foreground">
                      Experimente diferentes estilos para encontrar o visual perfeito
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <p className="text-muted-foreground">
                      Movimentos lentos de câmera produzem resultados mais estáveis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Estimado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">720p</span>
                    <Badge variant="secondary">2-3 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">1080p</span>
                    <Badge variant="secondary">3-5 min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">4K</span>
                    <Badge variant="secondary">5-8 min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
