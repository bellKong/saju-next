import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { email, amount = 10 } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.user.update({
      where: { id: user.id },
      data: { creditBalance: { increment: amount } },
    });

    await tx.creditLedger.create({
      data: {
        userId: user.id,
        delta: amount,
        reason: "DEV_GRANT",
      },
    });

    return u;
  });

  return NextResponse.json({
    success: true,
    email: updated.email,
    creditBalance: updated.creditBalance,
  });
}
