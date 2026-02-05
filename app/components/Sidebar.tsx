'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  BarChart3,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = [
    {
      name: 'Business',
      href: '/',
      icon: Building2,
      active: pathname === '/',
    },
    {
      name: 'Business Approval',
      href: '/business-approval',
      icon: CheckSquare,
      active: pathname === '/business-approval',
    },
    {
      name: 'Stats',
      href: '/stats',
      icon: BarChart3,
      active: pathname === '/stats',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-xl font-bold text-white">CN</span>
        </div>
      </div>

      {/* Dashboard - non-clickable */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-orange-600">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </div>
      </div>

      {/* Divider */}
      <div className="px-4">
        <div className="border-t border-gray-200"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  item.active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
}
