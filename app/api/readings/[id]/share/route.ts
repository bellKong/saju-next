import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if reading exists and belongs to user
    const reading = await prisma.reading.findUnique({
      where: { id },
      include: { share: true },
    });

    if (!reading) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (reading.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!reading.isShareable) {
      return NextResponse.json({ error: "Not shareable" }, { status: 400 });
    }

    // Check if already shared
    if (reading.share && !reading.share.revokedAt) {
      return NextResponse.json({
        shareUrl: `/share/${reading.share.shareId}`,
        share: reading.share,
      });
    }

    // Create new share
    const shareId = nanoid(12);
    const share = await prisma.share.create({
      data: {
        userId: session.user.id,
        readingId: id,
        shareId,
      },
    });

    return NextResponse.json({
      shareUrl: `/share/${shareId}`,
      share,
    });
  } catch (error) {
    console.error("Share creation error:", error);
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

    // Check if reading exists and belongs to user
    const reading = await prisma.reading.findUnique({
      where: { id },
      include: { share: true },
    });

    if (!reading) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (reading.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!reading.share) {
      return NextResponse.json({ error: "Not shared" }, { status: 400 });
    }

    // Revoke share
    const share = await prisma.share.update({
      where: { id: reading.share.id },
      data: { revokedAt: new Date() },
    });

    return NextResponse.json({ success: true, share });
  } catch (error) {
    console.error("Share revocation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
