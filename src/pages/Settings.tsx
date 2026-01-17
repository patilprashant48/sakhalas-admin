import { useAuth } from '@/hooks/useAuth';
import { User, Bell, Lock, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: User,
      description: 'Update your personal information',
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Manage notification preferences',
    },
    {
      title: 'Security',
      icon: Lock,
      description: 'Change password and security settings',
    },
    {
      title: 'Preferences',
      icon: SettingsIcon,
      description: 'Customize your dashboard experience',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-600">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="mt-1 text-xs text-primary-600">
              {user?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <button
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-primary-100 p-3">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
