import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await req.json();
    const { displayName, bio, isPrivate } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: displayName?.trim() || user.displayName,
        bio: bio ?? null,
        isPrivate: Boolean(isPrivate),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        isPrivate: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}