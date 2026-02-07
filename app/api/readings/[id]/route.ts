import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
      include: {
        share: true,
      },
    });

    if (!reading) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (reading.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Reading fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (reading.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.reading.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reading delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
