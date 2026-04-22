import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/src/types';
import { User, LoginCredentials } from '@/src/features/auth/types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  devLogin: (role: UserRole) => void;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user, tenant } = await authService.getProfile();
          setUser(user);
          if (tenant?.id) {
            localStorage.setItem('tenant_id', tenant.id);
          }
        } catch (err) {
          console.error('Failed to restore session', err);
          localStorage.removeItem('token');
          localStorage.removeItem('tenant_id');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const { token, user, tenant } = await authService.login(credentials);
      localStorage.setItem('token', token);
      if (tenant?.id) {
        localStorage.setItem('tenant_id', tenant.id);
      }
      setUser(user);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const devLogin = (role: UserRole) => {
    let mockUser: User = {
      id: role === UserRole.ADMIN ? 'dev-admin' : 'dev-customer',
      name: role === UserRole.ADMIN ? 'Admin (Quick Access)' : 'Customer (Quick Access)',
      email: role === UserRole.ADMIN ? 'admin@cp.jp' : 'customer@cp.jp',
      role: role
    };

    const mockTenantId = role === UserRole.CUSTOMER ? '01KGGZJPC1CB2DKG9D7W7K28JG' : null;

    localStorage.setItem('token', 'dev-token-' + Date.now());
    if (mockTenantId) {
      localStorage.setItem('tenant_id', mockTenantId);
    }
    setUser(mockUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('tenant_id');
      setUser(null);
    }
  };

  const role = user?.role ? (user.role.toUpperCase() as UserRole) : null;

  return (
    <AuthContext.Provider value={{ user, role, login, devLogin, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
