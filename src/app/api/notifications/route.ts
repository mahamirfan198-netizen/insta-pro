import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        actor: { select: { id: true, username: true, displayName: true } },
      },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}