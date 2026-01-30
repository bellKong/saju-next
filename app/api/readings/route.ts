import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  generateSaju,
  generateCompatibility,
  generateFortune,
} from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, input } = body;

    // Validate type
    if (!["SAJU", "COMPAT", "FORTUNE"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Deduct credit in transaction with row-level locking
    let userId: string;
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Lock user row and check balance
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.creditBalance <= 0) {
          throw new Error("Insufficient credits");
        }

        // Deduct credit
        await tx.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            creditBalance: {
              decrement: 1,
            },
          },
        });

        return { userId: user.id };
      });

      userId = result.userId;
    } catch (error: any) {
      if (error.message === "Insufficient credits") {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 400 }
        );
      }
      throw error;
    }

    // Generate reading with OpenAI (outside transaction)
    let aiResult: string | null;
    let summary: string;

    try {
      if (type === "SAJU") {
        aiResult = await generateSaju(input);
        summary = `사주팔자 - ${input.birthDate}`;
      } else if (type === "COMPAT") {
        aiResult = await generateCompatibility(input);
        summary = `궁합 - ${input.person1.birthDate} & ${input.person2.birthDate}`;
      } else {
        // FORTUNE
        aiResult = await generateFortune(input);
        summary = `오늘의 운세 - ${input.birthDate}`;
      }
    } catch (openaiError) {
      console.error("OpenAI error:", openaiError);

      // Refund credit on OpenAI failure
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: {
            creditBalance: {
              increment: 1,
            },
          },
        });

        // Log refund in ledger
        await tx.creditLedger.create({
          data: {
            userId,
            delta: 1,
            reason: "ERROR_REFUND",
          },
        });
      });

      return NextResponse.json(
        { error: "Failed to generate reading. Credit has been refunded." },
        { status: 500 }
      );
    }

    // Save reading and create ledger entry
    const reading = await prisma.$transaction(async (tx) => {
      const newReading = await tx.reading.create({
        data: {
          userId,
          type,
          input,
          result: { content: aiResult },
          summary,
        },
      });

      // Create ledger entry
      await tx.creditLedger.create({
        data: {
          userId,
          delta: -1,
          reason: "CONSUME",
          readingId: newReading.id,
        },
      });

      return newReading;
    });

    return NextResponse.json({
      success: true,
      reading,
    });
  } catch (error) {
    console.error("Reading creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {
      userId: session.user.id,
    };

    if (type && ["SAJU", "COMPAT", "FORTUNE"].includes(type)) {
      where.type = type;
    }

    if (cursor) {
      where.id = {
        lt: cursor,
      };
    }

    const readings = await prisma.reading.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        share: true,
      },
    });

    return NextResponse.json({
      readings,
      nextCursor: readings.length === limit ? readings[readings.length - 1].id : null,
    });
  } catch (error) {
    console.error("Reading fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
