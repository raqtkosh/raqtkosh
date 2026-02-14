import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim() || '';
    const page = parseInt(searchParams.get('page') || '1') || 1;
    const limit = 10;

    
    const whereClause = query 
      ? {
          OR: [
            { name: { contains: query } },
            { city: { contains: query } }
          ]
        }
      : {};

    const [centers, totalCount] = await Promise.all([
      db.donationCenter.findMany({
        where: whereClause,
        take: limit,
        skip: (page - 1) * limit,
        select: { 
          id: true, 
          name: true, 
          city: true, 
          state: true 
        },
        orderBy: { name: 'asc' }
      }),
      db.donationCenter.count({ 
        where: whereClause 
      })
    ]);

    return NextResponse.json({
      centers,
      hasMore: (page * limit) < totalCount
    });
  } catch (error) {
    console.error('Error fetching centers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch centers' },
      { status: 500 }
    );
  }
}