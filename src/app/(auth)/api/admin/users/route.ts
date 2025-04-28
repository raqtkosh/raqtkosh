import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        bloodType: true,
        role: true,
        points: true,
        rewardTier: true,
        lastDonation: true,
        nextDonation: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}