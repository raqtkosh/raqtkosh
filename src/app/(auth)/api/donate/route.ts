import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { BloodType, DonationStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
 
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const body = await req.json();
    const { 
      hospitalId,
      bloodType,
      quantity = 1,
      patientName 
    } = body;

   
    if (!hospitalId || !bloodType) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    
    if (!Object.values(BloodType).includes(bloodType)) {
      return NextResponse.json(
        { error: 'Invalid blood type' },
        { status: 400 }
      );
    }

    
    if (quantity <= 0 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10 units' },
        { status: 400 }
      );
    }

    
    const hospital = await db.donationCenter.findUnique({
      where: { id: hospitalId }
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

   
    const donation = await db.donation.create({
      data: {
        userId: user.id,
        centerId: hospital.id,
        date: new Date(),
        bloodType,
        quantity: quantity * 450, 
        status: DonationStatus.PENDING, 
        pointsEarned: 10 
      }
    });

    return NextResponse.json(donation);

  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
