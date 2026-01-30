import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getProduct } from "@/lib/payments/products";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find payment intent
    const intent = await prisma.paymentIntent.findUnique({
      where: { providerOrderId: orderId },
    });

    if (!intent) {
      return NextResponse.json(
        { error: "Payment intent not found" },
        { status: 404 }
      );
    }

    if (intent.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify amount matches
    if (intent.amount !== amount) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // Check if already processed
    const existingPayment = await prisma.payment.findUnique({
      where: { providerPaymentId: paymentKey },
    });

    if (existingPayment) {
      return NextResponse.json({
        message: "Already processed",
        payment: existingPayment,
      });
    }

    // Verify with Toss Payments API
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error("TOSS_SECRET_KEY not configured");
    }

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error("Toss verification failed:", errorData);
      return NextResponse.json(
        { error: "Payment verification failed", details: errorData },
        { status: 400 }
      );
    }

    const verifiedPayment = await tossResponse.json();

    // Get product info
    const product = getProduct(intent.productCode);

    // Process payment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          userId: session.user.id,
          provider: "toss",
          amount: intent.amount,
          currency: intent.currency,
          providerPaymentId: paymentKey,
          paymentIntentId: intent.id,
          status: "CONFIRMED",
          raw: verifiedPayment,
          confirmedAt: new Date(),
        },
      });

      // Add credit ledger entry
      await tx.creditLedger.create({
        data: {
          userId: session.user.id,
          delta: product.credits,
          reason: "PURCHASE",
          paymentId: payment.id,
        },
      });

      // Update user credit balance
      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: {
          creditBalance: {
            increment: product.credits,
          },
        },
      });

      // Update intent status
      await tx.paymentIntent.update({
        where: { id: intent.id },
        data: { status: "COMPLETED" },
      });

      return { payment, creditBalance: updatedUser.creditBalance };
    });

    return NextResponse.json({
      success: true,
      payment: result.payment,
      creditBalance: result.creditBalance,
      creditsAdded: product.credits,
    });
  } catch (error) {
    console.error("Toss confirm error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
