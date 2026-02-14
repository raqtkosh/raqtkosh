import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [users, donations, requests, recentActivities] = await Promise.all([
      db.user.count(),
      db.donation.count(),
      db.request.count(),
      db.notification.findMany({
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title: true,
          message: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        users,
        donations,
        requests,
      },
      recentActivities: recentActivities.map(activity => ({
        text: activity.title,
        time: activity.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}