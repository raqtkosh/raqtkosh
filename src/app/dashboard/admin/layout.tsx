import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/slidebar';
import { db } from '@/lib/db';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in?redirect=/dashboard/admin');
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { role: true },
  });

  // Redirect if not an admin
  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
    redirect('/dashboard/user');
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-900">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
