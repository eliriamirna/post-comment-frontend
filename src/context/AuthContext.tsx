// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { customFetch } from '../utils/api';

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: IUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = jwtDecode<{ id: number; name: string; email: string }>(storedToken);
      setToken(storedToken);
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await customFetch(`/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.token) {
      throw new Error('Token não recebido');
    }
    
    localStorage.setItem('token', data.token);
    setToken(data.token);

    const decodedToken = jwtDecode<{ id: number; name: string; email: string }>(data.token);
    setUser({
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
    });

    setIsAuthenticated(true);

    navigate('/posts');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
