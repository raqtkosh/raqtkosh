import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req); 
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { addresses: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    if (!user.bloodType) return new NextResponse("Blood type not found for user", { status: 400 });

    const primaryAddress = user.addresses.find((address) => address.isPrimary);

    if (!primaryAddress) return new NextResponse("Primary address not found", { status: 400 });

    const newRequest = await db.request.create({
      data: {
        userId: user.id,
        bloodType: user.bloodType,
        quantity: 1, 
        urgency: "normal",
        addressId: primaryAddress.id,
        hospital: "Home",
        patientName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
        reason: "Home Donation Request",
      },
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
