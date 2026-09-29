import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({ users: [], posts: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { displayName: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, displayName: true },
      take: 20,
    });

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { caption: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        author: { select: { username: true, displayName: true } },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users, posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}