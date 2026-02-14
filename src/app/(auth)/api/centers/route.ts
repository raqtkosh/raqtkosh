import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
  
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    
    const pincode = searchParams.get('pincode');
    
   
    const whereCondition = pincode
      ? {
          postalCode: {
            startsWith: pincode
          }
        }
      : {};

    
    const centers = await db.donationCenter.findMany({
      where: whereCondition,
      take: pageSize,  
      skip: (page - 1) * pageSize,  
      orderBy: {
        name: 'asc'  
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
