// src/app/api/user/addresses/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isPrimary: true,
      },
      orderBy: {
        isPrimary: 'desc',
      },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { street, city, state, postalCode, country, isPrimary } = body;

    // Validate required fields
    if (!street || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // If setting as primary, unset any existing primary address
    if (isPrimary) {
      await db.address.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        userId,
        street,
        city,
        state,
        postalCode,
        country: country || 'India',
        isPrimary: isPrimary || false,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}