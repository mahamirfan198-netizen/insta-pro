import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const { caption, location, imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        caption: caption || null,
        location: location || null,
        imageUrl,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}