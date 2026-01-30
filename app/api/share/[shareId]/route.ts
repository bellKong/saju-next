import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    const share = await prisma.share.findUnique({
      where: { shareId },
      include: {
        reading: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!share || share.revokedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Return reading data (could mask sensitive info here)
    return NextResponse.json({
      reading: share.reading,
      sharedBy: share.user.name,
      createdAt: share.createdAt,
    });
  } catch (error) {
    console.error("Share fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
