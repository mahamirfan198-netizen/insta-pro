import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const now = new Date();
    const stories = await prisma.story.findMany({
      where: { expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        author: {
          select: { id: true, username: true, displayName: true },
        },
      },
    });
    return NextResponse.json({ stories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const story = await prisma.story.create({
      data: {
        authorId: user.id,
        imageUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
      },
    });
    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}