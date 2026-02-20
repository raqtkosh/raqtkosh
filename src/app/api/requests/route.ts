import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';


export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requests = await db.request.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { hospitalId, bloodType, quantity, patientName, urgency, reason, governmentId, prescriptionUrl } = body;

    const hospital = await db.donationCenter.findUnique({ where: { id: hospitalId } });
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    const address = await db.address.create({
      data: {
        userId: dbUser.id,
        street: hospital.address,
        city: hospital.city,
        state: hospital.state,
        postalCode: hospital.postalCode,
        country: 'India',
      },
    });

    const request = await db.request.create({
      data: {
        userId: dbUser.id,
        bloodType,
        quantity,
        urgency,
        patientName,
        reason,
        governmentId,
        prescriptionUrl,
        hospital: hospital.name,
        addressId: address.id,
      },
      include: {
        address: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
