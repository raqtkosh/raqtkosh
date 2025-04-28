import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Missing requestId" },
        { status: 400 }
      );
    }

    // 1. Fetch Request
    const request = await db.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // 2. Check Blood Stock
    const stock = await db.bloodInventory.findFirst({
      where: {
        bloodType: request.bloodType,
        quantity: { gte: request.quantity }, // Enough quantity available
      },
    });

    if (stock) {
      return NextResponse.json({
        message: 'Stock available, no notification sent'
      });
    }

    // 3. Find Matching Users
    const matchingUsers = await db.user.findMany({
      where: {
        bloodType: request.bloodType,
        role: 'USER',
      },
      select: {
        id: true,
        firstName: true,
        email: true,
      },
    });

    if (matchingUsers.length === 0) {
      return NextResponse.json({
        message: 'No matching users to notify'
      });
    }

    // 4. Create Notifications
    const notifications = matchingUsers.map(user => ({
      userId: user.id,
      title: 'Urgent Blood Request',
      message: `Hi ${user.firstName || 'Donor'}, blood group ${request.bloodType.replace('_', ' ')} urgently needed!`,
      type: 'BLOOD_REQUEST',
      isRead: false,
    }));

    await db.notification.createMany({
      data: notifications
    });

    return NextResponse.json({
      message: `${notifications.length} notifications sent successfully`
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}