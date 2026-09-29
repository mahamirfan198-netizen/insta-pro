import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await req.json();
    const { body: text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
        data: { postId, authorId: user.id, body: text.trim() },
        include: {
          author: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}