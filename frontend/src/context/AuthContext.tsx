import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import axiosClient from '../api/axiosClient';

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem('access_token')
  );
  const [username, setUsername] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axiosClient
        .get<{ username: string }>('/auth/me')
        .then((res) => setUsername(res.data.username))
        .catch(() => {
          logout();
        });
    }
  }, [isAuthenticated, logout]);

  const login = useCallback(async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setIsAuthenticated(true);
    const res = await axiosClient.get<{ username: string }>('/auth/me');
    setUsername(res.data.username);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
