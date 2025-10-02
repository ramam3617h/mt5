import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, CircleUser as UserCircle, LogOut, Building2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const { user, currentTenant, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Customers', icon: Users, page: 'customers' },
    { name: 'User Management', icon: UserCircle, page: 'users' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">CRM Pro</span>
              </div>
              <div className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.page)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.page
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentTenant && (
                <div className="text-sm">
                  <span className="text-slate-500">Tenant:</span>
                  <span className="ml-1 font-medium text-slate-900">{currentTenant.name}</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {currentTenant.role}
                  </span>
                </div>
              )}
              <div className="text-sm text-slate-600">{user?.email}</div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
