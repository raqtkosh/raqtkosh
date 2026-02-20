import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const feedbacks = await db.user.findMany({
      where: {
        feedback: {
          not: null,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        feedback: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
    });

    const normalized = feedbacks
      .filter((item) => item.feedback && item.feedback.trim().length > 0)
      .map((item) => ({
        id: item.id,
        name: `${item.firstName || ""} ${item.lastName || ""}`.trim() || "Anonymous Donor",
        profileImageUrl: item.profileImageUrl,
        feedback: item.feedback as string,
      }));

    return NextResponse.json({ feedbacks: normalized });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json({ feedbacks: [] }, { status: 500 });
  }
}
