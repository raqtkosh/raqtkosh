import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BloodType } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const inventory = await db.bloodInventory.findMany({
      include: {
        center: {
          select: {
            name: true,
            city: true,
            state: true
          }
        }
      },
      orderBy: { lastUpdated: 'desc' }
    });
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { centerId, bloodType, quantity } = await req.json();

    if (!centerId || !bloodType || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid data. Please provide centerId, bloodType, and positive quantity" },
        { status: 400 }
      );
    }

    
    const existingRecord = await db.bloodInventory.findFirst({
      where: {
        centerId,
        bloodType
      }
    });

    let result;
    if (existingRecord) {
     
      result = await db.bloodInventory.update({
        where: { id: existingRecord.id },
        data: {
          quantity: { increment: quantity },
          lastUpdated: new Date()
        },
        include: { center: true }
      });
    } else {
     
      result = await db.bloodInventory.create({
        data: {
          centerId,
          bloodType,
          quantity,
          lastUpdated: new Date()
        },
        include: { center: true }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}
