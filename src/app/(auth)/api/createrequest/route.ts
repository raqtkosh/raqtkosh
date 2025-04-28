import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { BloodType } from '@prisma/client';

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
      patientName,
      urgency = 'normal',
      reason = ''
    } = body;

    // Validate required fields
    if (!hospitalId || !bloodType || !patientName) {
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

    // Validate quantity
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

    // Create the blood request
    const request = await db.request.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        bloodType,
        quantity,
        urgency,
        patientName,
        reason,
        hospital: hospital.name,
        address: {
          create: {
            street: hospital.address,
            city: hospital.city,
            state: hospital.state,
            postalCode: hospital.postalCode,
            country: 'India',
            userId: user.id
          }
        }
      },
      include: {
        address: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(request);

  } catch (error) {
    console.error('Error creating blood request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}