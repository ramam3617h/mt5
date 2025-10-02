import { useState } from 'react';
import { api, setAuthToken } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onToggleSignup: () => void;
}

export const Login = ({ onSuccess, onToggleSignup }: LoginProps) => {
  const { setUser, setTenants, setCurrentTenant } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login(email, password);

      if (data.error) {
        setError(data.error);
        return;
      }

      setUser(data.user);
      setAuthToken(data.session.access_token);

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.session.access_token);

      if (data.tenants && data.tenants.length > 0) {
        const tenantsData = data.tenants.map((t: any) => ({
          id: t.tenants.id,
          name: t.tenants.name,
          domain: t.tenants.domain,
          role: t.role,
        }));

        setTenants(tenantsData);
        setCurrentTenant(tenantsData[0]);
        localStorage.setItem('tenants', JSON.stringify(tenantsData));
      }

      onSuccess();
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-slate-900">CRM Pro</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Welcome Back</h2>
          <p className="text-slate-600 text-center mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onToggleSignup}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};
