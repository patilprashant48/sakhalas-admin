import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  LogOut,
  User,
  Building2,
  Check,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/helpers';
import { Company } from '@/types';
import { companyService } from '@/api/companyService';
import toast from 'react-hot-toast';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin, selectedCompanyId, setSelectedCompany } = useAuth();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCompanySwitcherOpen, setIsCompanySwitcherOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const companySwitcherRef = useRef<HTMLDivElement>(null);

  const [companies, setCompanies] = useState<Company[]>([]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  // Load companies for Super Admin
  useEffect(() => {
    const loadCompanies = async () => {
      if (!isSuperAdmin()) return;
      try {
        const res = await companyService.getAll({ page: 1, pageSize: 50 });
        setCompanies(res.data.data);
      } catch (err) {
        // Silently fail; switcher will show empty
      }
    };
    loadCompanies();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (companySwitcherRef.current && !companySwitcherRef.current.contains(event.target as Node)) {
        setIsCompanySwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCompanySwitch = (companyId: string) => {
    setSelectedCompany(companyId);
    setIsCompanySwitcherOpen(false);
    toast.success('Company switched successfully');
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-xl px-4 shadow-soft sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Company Switcher - Super Admin only */}
        {isSuperAdmin() && (
          <div className="relative" ref={companySwitcherRef}>
            <button
              onClick={() => setIsCompanySwitcherOpen(!isCompanySwitcherOpen)}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Building2 className="h-4 w-4" />
              <span>{selectedCompany ? selectedCompany.name : 'Select Company'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isCompanySwitcherOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Switch Company
                  </div>
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanySwitch(company.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100',
                        company.id === selectedCompanyId && 'bg-primary-50 text-primary-600'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{company.name}</div>
                          <div className="text-xs text-gray-500">{company.domain}</div>
                        </div>
                      </div>
                      {company.id === selectedCompanyId && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <span className="hidden md:block">
              {user?.firstName} {user?.lastName}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="mt-1 text-xs font-medium text-primary-600">
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
