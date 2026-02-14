import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { BloodType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // 1. Authenticate admin
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    const admin = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    const { bloodType } = await req.json();

    if (!bloodType) {
      return NextResponse.json({ error: "Blood type is required" }, { status: 400 });
    }

   
    const eligibleDonors = await db.user.findMany({
      where: {
        bloodType: bloodType as BloodType,
        role: 'USER',
        OR: [
          { lastDonation: { lte: new Date(new Date().setMonth(new Date().getMonth() - 3)) } },
          { lastDonation: null }
        ]
      },
      select: {
        id: true,
        firstName: true
      }
    });

    
    if (eligibleDonors.length > 0) {
      const notifications = eligibleDonors.map(user => ({
        userId: user.id,
        title: 'Blood Donation Request',
        message: `Urgent need for ${bloodType.replace('_', '-')} blood. Please consider donating.`,
        type: 'BLOOD_REQUEST'
      }));

      await db.notification.createMany({
        data: notifications
      });
    }


    return NextResponse.json({
      success: true,
      donorCount: eligibleDonors.length,
      bloodType,
      message: eligibleDonors.length > 0
        ? `Notification sent to ${eligibleDonors.length} potential donors`
        : `No eligible donors found for ${bloodType.replace('_', '-')}`
    });

  } catch (error) {
    console.error('[BLOOD_REQUEST_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
