import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const me = await getCurrentUser();
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        isPrivate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMe = me?.id === user.id;

    const [postsCount, followersCount, followingCount] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id } }),
      prisma.follow.count({ where: { followingId: user.id, status: "ACCEPTED" } }),
      prisma.follow.count({ where: { followerId: user.id, status: "ACCEPTED" } }),
    ]);

    let followStatus: string | null = null;
    if (me && !isMe) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: me.id, followingId: user.id },
        },
      });
      followStatus = follow?.status || null;
    }

    const isFollowing = followStatus === "ACCEPTED";
    const canViewPosts = !user.isPrivate || isMe || isFollowing;

    const posts = canViewPosts
      ? await prisma.post.findMany({
          where: { authorId: user.id },
          orderBy: { createdAt: "desc" },
          take: 30,
        })
      : [];

    return NextResponse.json({
      user,
      posts,
      postsCount,
      followersCount,
      followingCount,
      isFollowing,
      followStatus,
      isMe,
      canViewPosts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}