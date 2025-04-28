import { NextResponse } from 'next/server';
//import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest } from 'next';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        rewards: {
          include: {
            reward: true,
          },
          orderBy: {
            redeemedAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const availableRewards = await db.reward.findMany({
      where: {
        pointsCost: { gte: 500 },
        isActive: true,
      },
    });

    return NextResponse.json({
      user: {
        points: user.points || 0,
        rewardTier: user.rewardTier || 'BRONZE',
        rewards: user.rewards || [],
      },
      availableRewards,
    });
  } catch (err) {
    console.error('[REWARDS_GET_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = getAuth(req as unknown as NextApiRequest);
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rewardId } = await req.json();

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reward = await db.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (user.points < reward.pointsCost) {
      return NextResponse.json(
        { error: 'Not enough points' },
        { status: 400 }
      );
    }

    const [userReward, updatedUser] = await db.$transaction([
      db.userReward.create({
        data: {
          userId: user.id,
          rewardId: reward.id,
        },
        include: {
          reward: true,
        },
      }),
      db.user.update({
        where: { id: user.id },
        data: {
          points: { decrement: reward.pointsCost },
        },
      }),
    ]);

    await db.notification.create({
      data: {
        userId: user.id,
        title: 'Reward Redeemed',
        message: `You redeemed ${reward.name} for ${reward.pointsCost} points.`,
        type: 'reward',
      },
    });

    return NextResponse.json({
      userReward,
      reward: userReward.reward,
    });
  } catch (err) {
    console.error('[REWARDS_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
