import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api/client';

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  return localStorage.getItem('token');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getStoredToken);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const data = await apiPost<AuthResponse>('/api/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string): Promise<void> => {
      const data = await apiPost<AuthResponse>('/api/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    },
    []
  );

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  }, [navigate]);

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
