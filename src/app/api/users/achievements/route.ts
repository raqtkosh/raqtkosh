import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { RewardTier } from "@prisma/client"; // ✅ Import Enum properly

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as unknown as NextApiRequest);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        requests: { where: { status: 'FULFILLED' } },
        referrals: { where: { status: 'COMPLETED' } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure fulfilled requests are added as donations
    for (const request of user.requests) {
      const existingDonation = await db.donation.findFirst({
        where: {
          userId: user.id,
          date: request.fulfilledAt ?? undefined,
          bloodType: request.bloodType,
        },
      });

      if (!existingDonation) {
        await db.donation.create({
          data: {
            userId: user.id,
            date: request.fulfilledAt ?? new Date(),
            bloodType: request.bloodType,
            quantity: 450,
            status: 'COMPLETED',
            pointsEarned: 50,
          },
        });
      }
    }

    // Calculate points
    const completedRequests = user.requests.length;
    const requestPoints = completedRequests * 50;
    const referralPoints = user.referrals.length * 100;
    const totalPoints = requestPoints + referralPoints;

    // Determine reward tier properly
    let rewardTier: RewardTier = RewardTier.BRONZE;
    if (totalPoints >= 5000) rewardTier = RewardTier.PLATINUM;
    else if (totalPoints >= 2500) rewardTier = RewardTier.GOLD;
    else if (totalPoints >= 1000) rewardTier = RewardTier.SILVER;

    // Update user only if changed
    if (user.points !== totalPoints || user.rewardTier !== rewardTier) {
      await db.user.update({
        where: { clerkId: userId },
        data: {
          points: totalPoints,
          rewardTier: rewardTier,
        },
      });
    }

    return NextResponse.json({
      completedRequests,
      referralPoints,
      requestPoints,
      totalPoints,
      rewardTier,
    });

  } catch (error) {
    console.error('Error calculating achievements:', error);
    return NextResponse.json(
      { error: 'Failed to calculate achievements' },
      { status: 500 }
    );
  }
}
