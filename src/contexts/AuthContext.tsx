import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken, setTenantId } from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTenants: (tenants: Tenant[]) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedTenants = localStorage.getItem('tenants');
    const storedTenant = localStorage.getItem('currentTenant');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }

    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    }

    if (storedTenant) {
      const tenant = JSON.parse(storedTenant);
      setCurrentTenantState(tenant);
      setTenantId(tenant.id);
    }

    setIsLoading(false);
  }, []);

  const setCurrentTenant = (tenant: Tenant | null) => {
    setCurrentTenantState(tenant);
    if (tenant) {
      localStorage.setItem('currentTenant', JSON.stringify(tenant));
      setTenantId(tenant.id);
    } else {
      localStorage.removeItem('currentTenant');
      setTenantId(null);
    }
  };

  const logout = () => {
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tenants');
    localStorage.removeItem('currentTenant');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenants,
        currentTenant,
        isLoading,
        setUser,
        setTenants,
        setCurrentTenant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
