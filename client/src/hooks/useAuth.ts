import { useQuery } from "@tanstack/react-query";

interface AuthData {
  success: boolean;
  authenticated: boolean;
  seller?: any;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthData>({
    queryKey: ['/api/session'],
    retry: false,
  });

  return {
    user: data?.seller,
    isLoading,
    isAuthenticated: data?.authenticated || false,
    error,
  };
}