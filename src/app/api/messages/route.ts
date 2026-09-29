import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const withUsername = searchParams.get("with");

    if (!withUsername) {
      // List all conversations (unique users I've talked to)
      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: user.id }, { receiverId: user.id }],
        },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, username: true, displayName: true } },
          receiver: { select: { id: true, username: true, displayName: true } },
        },
      });

      // Group by conversation partner
      const seen = new Set<string>();
      const conversations: any[] = [];
      for (const m of messages) {
        const partner = m.senderId === user.id ? m.receiver : m.sender;
        if (!seen.has(partner.id)) {
          seen.add(partner.id);
          conversations.push({
            partner,
            lastMessage: m.body,
            lastMessageAt: m.createdAt,
          });
        }
      }
      return NextResponse.json({ conversations });
    }

    // Get messages with specific user
    const partner = await prisma.user.findUnique({
      where: { username: withUsername },
      select: { id: true, username: true, displayName: true },
    });
    if (!partner) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: partner.id },
          { senderId: partner.id, receiverId: user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages, partner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { receiverUsername, body } = await req.json();
    if (!receiverUsername || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const receiver = await prisma.user.findUnique({
      where: { username: receiverUsername },
      select: { id: true },
    });
    if (!receiver) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId: receiver.id,
        body,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}