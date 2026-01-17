import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Users, Shield, Activity } from 'lucide-react';
import { formatRoleName, formatDateTime } from '@/utils/helpers';
import { statsService, DashboardStats, RecentActivity } from '@/api/statsService';
import { Loader } from '@/components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, selectedCompanyId, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          statsService.getDashboardStats(),
          statsService.getRecentActivity({ limit: 4 }),
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch (e) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    {
      label: isSuperAdmin() ? 'Total Companies' : 'Total Users',
      value: isSuperAdmin() ? stats?.totalCompanies ?? 0 : stats?.totalUsers ?? 0,
      icon: isSuperAdmin() ? Building2 : Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers ?? 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Roles',
      value: stats?.totalRoles ?? 0,
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      label: 'Activity',
      value: stats?.activityCount ?? 0,
      icon: Activity,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Role: {formatRoleName(user?.role || '')}
          {!isSuperAdmin() && selectedCompanyId && ' • Company Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-transparent rounded-full -mr-12 -mt-12 opacity-50"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft hover:shadow-xl transition-shadow duration-300">
        <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Activity</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
                <p className="text-xs text-gray-500">{formatDateTime(activity.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft hover:shadow-xl transition-shadow duration-300">
        <h2 className="mb-4 text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isSuperAdmin() && (
            <button className="group rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50 hover:shadow-lg hover:-translate-y-1">
              <Building2 className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-600 group-hover:scale-110 transition-all duration-300" />
              <p className="text-sm font-medium text-gray-900">Add Company</p>
            </button>
          )}
          <button className="group rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50 hover:shadow-lg hover:-translate-y-1">
            <Users className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-600 group-hover:scale-110 transition-all duration-300" />
            <p className="text-sm font-medium text-gray-900">Add User</p>
          </button>
          <button className="group rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blue-50 hover:shadow-lg hover:-translate-y-1">
            <Shield className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-600 group-hover:scale-110 transition-all duration-300" />
            <p className="text-sm font-medium text-gray-900">Manage Roles</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
