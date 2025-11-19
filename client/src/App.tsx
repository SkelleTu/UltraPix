import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Home from "@/pages/home";
import Create from "@/pages/create";
import Gallery from "@/pages/gallery";
import Effects from "@/pages/effects";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AppHeader />
      <Component />
    </>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/">
        {() => (isLoading || isAuthenticated ? <ProtectedRoute component={Home} /> : <Login />)}
      </Route>
      <Route path="/create">
        {() => <ProtectedRoute component={Create} />}
      </Route>
      <Route path="/gallery">
        {() => <ProtectedRoute component={Gallery} />}
      </Route>
      <Route path="/effects">
        {() => <ProtectedRoute component={Effects} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
