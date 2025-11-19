import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery<{
    id: string;
    username: string;
    email: string;
  } | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
