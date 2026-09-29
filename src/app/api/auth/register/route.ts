import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, displayName } = body;

    if (!username || !email || !password || !displayName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 chars, lowercase only" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
      select: { username: true, email: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: existing.username === username
            ? "Username already taken"
            : "Email already in use",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        displayName,
        passwordHash: await hashPassword(password),
      },
      select: { id: true, username: true, email: true, displayName: true },
    });

    await createSession(user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}