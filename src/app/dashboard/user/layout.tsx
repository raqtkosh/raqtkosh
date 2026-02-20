'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import UserSidebar from '@/components/usersidebar';
import { Loader2 } from 'lucide-react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SignedIn>
        <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow z-50">
          <UserSidebar />
        </div>
        <main className="flex-1 ml-64 py-8 px-6">
          {children}
        </main>
      </SignedIn>

      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </SignedOut>
    </div>
  );
}