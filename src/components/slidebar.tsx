'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Droplet, ClipboardList, Settings } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Users',
      href: '/dashboard/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Inventory',
      href: '/dashboard/admin/inventory',
      icon: <Droplet className="h-5 w-5" />,
    },
    {
      name: 'Requests',
      href: '/dashboard/admin/requests',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: 'Donation Requests',
      href: '/dashboard/admin/donation-request',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: 'Emergency Request',
      href: '/dashboard/admin/blood-requests',
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  return (
    <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 border-r bg-white shadow-md z-50">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
              pathname === item.href
                ? 'bg-red-100 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} RaqtKosh
      </div>
    </div>
  );
}