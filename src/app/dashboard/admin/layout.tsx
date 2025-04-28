import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/slidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Redirect if not an admin
  if (user?.privateMetadata?.role !== 'ADMIN') {
    redirect('/dashboard/user');
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-900">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
