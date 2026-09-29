import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id: postId } = await params;

    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId: user.id },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ liked: false });
    }

    await prisma.$transaction([
      prisma.like.create({ data: { postId, userId: user.id } }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}