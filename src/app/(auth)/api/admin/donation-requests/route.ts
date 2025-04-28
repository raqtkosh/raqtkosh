import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DonationStatus, BloodType } from '@prisma/client';

export async function GET() {
  try {
    const donations = await db.donation.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        center: {
          select: {
            name: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
