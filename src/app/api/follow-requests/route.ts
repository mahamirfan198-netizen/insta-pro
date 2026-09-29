import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const requests = await prisma.follow.findMany({
      where: {
        followingId: me.id,
        status: "PENDING",
      },
      include: {
        follower: {
          select: { id: true, username: true, displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}