import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, relationship, birthDate, birthTime, calendarType, gender } = body;

    if (!name?.trim() || !birthDate || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const person = await prisma.person.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        relationship: relationship || "본인",
        birthDate,
        birthTime: birthTime || null,
        calendarType: calendarType || "양력",
        gender,
      },
    });

    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error("Person creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const persons = await prisma.person.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        readings: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            result: true,
            summary: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ persons });
  } catch (error) {
    console.error("Person fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
