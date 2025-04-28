import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs/server";
import { ProfileForm } from '@/components/ProfileForm';

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
    return null;
  }

  const userData = await db.user.findUnique({
    where: { clerkId: user.id },
    include: { 
      addresses: {
        orderBy: { isPrimary: 'desc' }
      }
    }
  });

  if (!userData) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileForm userData={userData} />
      </div>
    </div>
  );
}
