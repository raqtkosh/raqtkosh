import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { BloodType, DonationStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // Authentication check
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { 
      hospitalId,
      bloodType,
      quantity = 1,
      patientName // You can ignore patientName if not needed in donation
    } = body;

    // Validate required fields
    if (!hospitalId || !bloodType) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Validate blood type
    if (!Object.values(BloodType).includes(bloodType)) {
      return NextResponse.json(
        { error: 'Invalid blood type' },
        { status: 400 }
      );
    }

    // Validate quantity (assuming each unit = 450ml)
    if (quantity <= 0 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10 units' },
        { status: 400 }
      );
    }

    // Get hospital details
    const hospital = await db.donationCenter.findUnique({
      where: { id: hospitalId }
    });

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    // Verify user exists in database
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Create the blood donation
    const donation = await db.donation.create({
      data: {
        userId: user.id,
        centerId: hospital.id,
        date: new Date(),
        bloodType,
        quantity: quantity * 450, // Each unit = 450 ml
        status: DonationStatus.PENDING, // default
        pointsEarned: 10 // default
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
