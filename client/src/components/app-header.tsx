import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Video, 
  Image, 
  Wand2,
  Menu,
  LogOut,
  User
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      setLocation("/auth/login");
    },
  });

  const navItems = [
    { path: "/", label: "Início", icon: Sparkles },
    { path: "/create", label: "Criar", icon: Video },
    { path: "/gallery", label: "Galeria", icon: Image },
    { path: "/effects", label: "Efeitos", icon: Wand2 },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-lg px-3 py-2 -ml-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold">
                Video<span className="text-primary">AI</span> Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className="gap-2"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive(item.path) ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                  {user && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => logoutMutation.mutate()}
                      data-testid="button-mobile-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
