import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Film } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      return await apiRequest("POST", "/api/auth/register", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao VideoAI Pro!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ username, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-serif">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                VideoAI Pro
              </span>
            </h1>
          </div>
          <CardTitle>Criar sua conta</CardTitle>
          <CardDescription>Cadastre-se para começar a criar vídeos incríveis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Nome de usuário
              </label>
              <Input
                id="username"
                type="text"
                placeholder="seuusuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                data-testid="input-username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                data-testid="input-password"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 8 caracteres
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
              data-testid="button-register"
            >
              {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Button
              variant="ghost"
              className="p-0 h-auto font-semibold text-primary"
              onClick={() => setLocation("/auth/login")}
              data-testid="link-login"
            >
              Faça login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
