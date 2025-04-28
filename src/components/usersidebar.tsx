'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import {
  Home,
  Droplet,
  HeartHandshake,
  User,
  Gift,
  Trophy,
  MapPin,
  Share2,
  LogOut,
} from 'lucide-react';

export default function UserSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard/user', icon: <Home className="h-5 w-5" /> },
    { name: 'Donate Blood', href: '/dashboard/user/donateblood', icon: <Droplet className="h-5 w-5" /> },
    { name: 'Request Blood', href: '/dashboard/user/request-blood', icon: <HeartHandshake className="h-5 w-5" /> },
    { name: 'My Rewards', href: '/dashboard/user/rewards', icon: <Gift className="h-5 w-5" /> },
    { name: 'Achievements', href: '/dashboard/user/achievements', icon: <Trophy className="h-5 w-5" /> },
    { name: 'Request', href: '/dashboard/user/userrequests', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Refer Friends', href: '/dashboard/user/refer', icon: <Share2 className="h-5 w-5" /> },
    { name: 'Profile', href: '/dashboard/user/profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 border-r bg-white shadow-md z-50">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-red-600">RAQTKOSH</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
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

      <div className="p-6 border-t">
        <SignOutButton>
          <button className="flex items-center gap-2 text-red-600 hover:underline">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </SignOutButton>
      </div>

      <div className="p-4 text-xs text-center text-gray-400">
        © {new Date().getFullYear()} RaqtKosh
      </div>
    </div>
  );
}
