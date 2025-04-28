// components/RewardsCard.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gift, Trophy, Zap, Star, BadgeCheck } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { RewardTier } from '@prisma/client';
import { JSX } from 'react/jsx-runtime';

interface RewardTierData {
  name: string;
  points: number;
  icon: JSX.Element;
  benefits: string[];
}

export default function RewardsCard() {
  const { userId } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rewardTier, setRewardTier] = useState<RewardTier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/users/${userId}/rewards`);
        if (!response.ok) throw new Error('Failed to fetch user rewards');
        const data = await response.json();
        
        setCurrentPoints(data.points);
        setRewardTier(data.rewardTier);
      } catch (error) {
        console.error('Error fetching user rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading rewards...</div>;
  }

  const rewardTiers: RewardTierData[] = [
    { 
      name: 'Bronze', 
      points: 50, 
      icon: <Star className="h-5 w-5 text-amber-500" />, 
      benefits: ['Profile Badge', 'Digital Certificate'] 
    },
    { 
      name: 'Silver', 
      points: 150, 
      icon: <Zap className="h-5 w-5 text-gray-400" />, 
      benefits: ['Priority Booking', '₹500 Gift Card'] 
    },
    { 
      name: 'Gold', 
      points: 300, 
      icon: <Trophy className="h-5 w-5 text-yellow-500" />, 
      benefits: ['Free Health Checkup', 'Exclusive Voucher'] 
    },
    { 
      name: 'Platinum', 
      points: 500, 
      icon: <BadgeCheck className="h-5 w-5 text-purple-500" />, 
      benefits: ['Emergency Priority', 'VIP Support'] 
    },
  ];

  const currentTierIndex = rewardTiers.findIndex(tier => currentPoints < tier.points) - 1;
  const currentTier = currentTierIndex >= 0 ? rewardTiers[currentTierIndex] : rewardTiers[rewardTiers.length - 1];
  const nextTier = rewardTiers[currentTierIndex + 1] || null;
  const progress = nextTier 
    ? Math.min(100, (currentPoints / nextTier.points) * 100)
    : 100;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Gift className="h-5 w-5 text-yellow-400" />
          Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/80">Current Points</span>
            <span className="font-bold text-yellow-400">{currentPoints} pts</span>
          </div>
          {nextTier ? (
            <>
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-sm text-white/80">
                <span>{currentTier.name} Tier</span>
                <span>{nextTier.points - currentPoints} pts to {nextTier.name}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-2 text-yellow-400">
              You've reached the highest tier!
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Current Benefits</h3>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            {currentTier.icon}
            <div>
              <h4 className="font-medium">{currentTier.name} Tier</h4>
              <ul className="text-sm text-white/80 list-disc list-inside">
                {currentTier.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-4">
            <h3 className="font-medium">Next Tier: {nextTier.name}</h3>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              {nextTier.icon}
              <div>
                <h4 className="font-medium">{nextTier.points} Points</h4>
                <ul className="text-sm text-white/80 list-disc list-inside">
                  {nextTier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}