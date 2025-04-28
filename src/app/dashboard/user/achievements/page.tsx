'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface AchievementData {
  completedRequests: number;
  referralPoints: number;
  requestPoints: number;
  totalPoints: number;
  rewardTier: string;
}

export default function AchievementsPage() {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [achievements, setAchievements] = useState<AchievementData | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/users/achievements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch achievements');
        }

        setAchievements(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching achievements:', err);
        setError(err.message || 'Failed to load your achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-black">Loading your achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!achievements) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-black">No achievements data found.</p>
      </div>
    );
  }

  // Helper function to format tier names
  const formatTierName = (tier: string) => {
    return tier.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">🏆 Your Achievements</h1>

        {achievements.totalPoints > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2 text-black">Blood Requests</h2>
                <p className="text-gray-600">Completed Requests:</p>
                <p className="text-3xl font-bold text-blue-800">{achievements.completedRequests}</p>
                <p className="text-gray-600 mt-2">Points Earned:</p>
                <p className="text-2xl font-bold text-green-700">{achievements.requestPoints} pts</p>
              </div>

              <div className="p-6 bg-purple-50 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2 text-black">Referrals</h2>
                <p className="text-gray-600">Referral Points:</p>
                <p className="text-3xl font-bold text-purple-800">{achievements.referralPoints} pts</p>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 rounded-xl shadow text-center">
              <h2 className="text-lg font-semibold mb-4 text-black">Total Points</h2>
              <p className="text-4xl font-extrabold text-yellow-600">{achievements.totalPoints} pts</p>
            </div>

            <div className="p-6 bg-indigo-50 rounded-xl shadow text-center">
              <h2 className="text-lg font-semibold mb-4 text-black">Reward Tier</h2>
              <div className="flex flex-col items-center">
                <span className="text-5xl mb-2">🎖️</span>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatTierName(achievements.rewardTier)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-100 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No points earned yet</h2>
            <p className="text-gray-500">
              Start by fulfilling blood requests or inviting friends to earn achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
