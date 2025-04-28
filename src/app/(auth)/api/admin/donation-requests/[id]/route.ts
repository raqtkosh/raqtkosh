import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Await the params object as per Next.js's requirement for dynamic routes
  const { id } = await params;

  try {
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedDonation = await db.donation.update({
      where: { id },
      data: { status },
      include: { center: true, user: true },
    });

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation status' },
      { status: 500 }
    );
  }
}
