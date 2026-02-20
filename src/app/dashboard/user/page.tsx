// app/dashboard/user/page.tsx
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserDashboard from '@/components/UserDashboard';

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Fetch user data with all related information
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    include: {
      donations: {
        where: { status: 'COMPLETED' },
        orderBy: { date: 'desc' }
      },
      rewards: true
    }
  });

  if (!dbUser) {
    redirect('/dashboard/user/profile');
  }

  // Calculate statistics from database records
  const totalDonations = dbUser.donations.length;
  const livesImpacted = totalDonations * 3; // Each donation can help 3 people
  const points = dbUser.points;
  //const rewardTier = dbUser.rewardTier?default 'None';// Default to 'None' if no rewards found
  const rewardTier = dbUser.rewardTier || 'NONE'; 
  const tierThresholds = [0, 500, 1500, 3000, 5000];
  const nextTierThreshold = tierThresholds.find((threshold) => threshold > points) ?? 0;
  const nextReward = nextTierThreshold > 0 ? nextTierThreshold - points : 0;
  
  // Determine reward tier based on points (using the actual enum values from schema)
  

  // Format dates
  const lastDonation = dbUser.lastDonation?.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) || 'Never';

  const nextDonation = dbUser.nextDonation?.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) || 'Now';

  // Calculate health status and donation eligibility
  const healthStatus = getHealthStatus(dbUser.lastDonation);
  const canDonate = canUserDonate(dbUser.lastDonation);

  // Prepare data for dashboard
  const userData = {
    points,
    bloodType: dbUser.bloodType?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') || 'Unknown',
    nextDonationDate: nextDonation,
    totalDonations, // Now properly fetched from donations count
    livesImpacted,  // Calculated from actual donations
    rewardTier,     // Determined from actual points
    nextReward,
    healthStatus,
    lastDonation,
    canDonate
  };

  return <UserDashboard userData={userData} />;
}

// Helper functions
function getHealthStatus(lastDonation: Date | null): string {
  if (!lastDonation) return 'Good';
  const monthsSinceLastDonation = (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsSinceLastDonation < 6 ? 'Excellent' : 'Good';
}

function canUserDonate(lastDonation: Date | null): boolean {
  if (!lastDonation) return true;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return lastDonation < threeMonthsAgo;
}
