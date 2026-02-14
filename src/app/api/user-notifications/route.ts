import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = getAuth();

  if (!userId) {
    return new Response(JSON.stringify({ notifications: [] }), { status: 401 });
  }

  try {
    const notifications = await db.notification.findMany({
      where: {
        user: {
          clerkId: userId
        },
        isRead: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify({ notifications }), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications', error);
    return new Response(JSON.stringify({ notifications: [] }), { status: 500 });
  }
}
