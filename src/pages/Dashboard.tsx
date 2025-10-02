import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Users, Activity, TrendingUp, UserCheck } from 'lucide-react';

interface Analytics {
  totalCustomers: number;
  totalActivities: number;
  totalUsers: number;
  customersByStatus: {
    lead: number;
    prospect: number;
    active: number;
    inactive: number;
  };
  recentActivitiesCount: number;
}

export const Dashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.analytics.getDashboard();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Customers',
      value: analytics?.totalCustomers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Recent Activities',
      value: analytics?.recentActivitiesCount || 0,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      name: 'Team Members',
      value: analytics?.totalUsers || 0,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Customers',
      value: analytics?.customersByStatus.active || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Overview of your CRM metrics and performance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Customers by Status</h2>
          <div className="space-y-4">
            {analytics && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Leads</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {analytics.customersByStatus.lead}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Prospects</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {analytics.customersByStatus.prospect}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {analytics.customersByStatus.active}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Inactive</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {analytics.customersByStatus.inactive}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium">
              Add New Customer
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium">
              Log Activity
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium">
              Invite Team Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
