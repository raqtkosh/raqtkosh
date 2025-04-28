import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { RequestStatus } from '@prisma/client';

// PATCH /api/requests/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure params are properly destructured
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
    }

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status }: { status: RequestStatus } = body;

    const updatedRequest = await db.request.update({
      where: { id },
      data: {
        status,
        assignedTo: status !== 'PENDING' ? userId : null,
        fulfilledAt: status === 'FULFILLED' ? new Date() : null,
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        address: true,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/requests/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure params are properly destructured
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
    }

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const request = await db.request.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        address: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
