import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/requests
export async function GET(req: Request) {
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

// POST /api/requests
export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { hospitalId, bloodType, quantity, patientName, urgency, reason } = body;

    const hospital = await db.donationCenter.findUnique({ where: { id: hospitalId } });
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    const request = await db.request.create({
      data: {
        userId,
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
            userId,
          },
        },
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
