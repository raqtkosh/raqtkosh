// app/api/hospitals/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode');
    
    if (!pincode) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      );
    }

    const hospitals = await db.donationCenter.findMany({
      where: {
        postalCode: {
          startsWith: pincode
        }
      },
      select: {
        id: true,
        name: true,
        address: true
      },
      take: 10
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

