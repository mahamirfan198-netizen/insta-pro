import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { username } = await params;
    const target = await prisma.user.findUnique({
      where: { username },
      select: { id: true, isPrivate: true },
    });

    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (target.id === me.id) return NextResponse.json({ error: "Cannot follow self" }, { status: 400 });

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: me.id, followingId: target.id },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ status: null });
    }

    const status = target.isPrivate ? "PENDING" : "ACCEPTED";
    await prisma.follow.create({
      data: { followerId: me.id, followingId: target.id, status },
    });

    await prisma.notification.create({
      data: {
        recipientId: target.id,
        actorId: me.id,
        type: status === "PENDING" ? "FOLLOW_REQUEST" : "FOLLOW",
      },
    });

    return NextResponse.json({ status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { username } = await params;
    const { action } = await req.json();

    const requester = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!requester) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: requester.id,
          followingId: me.id,
        },
      },
    });

    if (!follow) return NextResponse.json({ error: "No request" }, { status: 404 });

    if (action === "accept") {
      await prisma.follow.update({
        where: { id: follow.id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json({ status: "ACCEPTED" });
    }

    if (action === "reject") {
      await prisma.follow.delete({ where: { id: follow.id } });
      return NextResponse.json({ status: null });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}