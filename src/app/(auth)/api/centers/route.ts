import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    
    // Extract the pincode parameter
    const pincode = searchParams.get('pincode');
    
    // Default condition if pincode is provided
    const whereCondition = pincode
      ? {
          postalCode: {
            startsWith: pincode
          }
        }
      : {};

    // If pincode exists, apply that filter; otherwise, fetch all centers
    const centers = await db.donationCenter.findMany({
      where: whereCondition,
      take: pageSize,  // Limit the number of records per page
      skip: (page - 1) * pageSize,  // Calculate the skip for pagination
      orderBy: {
        name: 'asc'  // Sorting order for names
      }
    });

    return NextResponse.json(centers);
  } catch (error) {
    console.error('[CENTERS_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
