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
    const { pg_token, tid, orderId } = body;

    if (!pg_token || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields (pg_token, orderId)" },
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

    // Resolve tid: prefer body, fallback to DB
    const resolvedTid = tid || intent.providerTid;
    if (!resolvedTid) {
      return NextResponse.json(
        { error: "Missing tid" },
        { status: 400 }
      );
    }

    // Check if already processed (use tid as unique payment ID)
    const existingPayment = await prisma.payment.findUnique({
      where: { providerPaymentId: resolvedTid },
    });

    if (existingPayment) {
      return NextResponse.json({
        message: "Already processed",
        payment: existingPayment,
      });
    }

    // Approve payment with KakaoPay API
    const secretKey = process.env.KAKAOPAY_SECRET_KEY;
    const cid = process.env.KAKAOPAY_CID || "TC0ONETIME";

    if (!secretKey) {
      throw new Error("KAKAOPAY_SECRET_KEY not configured");
    }

    const kakaoResponse = await fetch(
      "https://open-api.kakaopay.com/online/v1/payment/approve",
      {
        method: "POST",
        headers: {
          Authorization: `SECRET_KEY ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cid,
          tid: resolvedTid,
          partner_order_id: orderId,
          partner_user_id: session.user.id,
          pg_token,
        }),
      }
    );

    if (!kakaoResponse.ok) {
      const errorData = await kakaoResponse.json();
      console.error("KakaoPay verification failed:", errorData);
      return NextResponse.json(
        { error: "Payment verification failed", details: errorData },
        { status: 400 }
      );
    }

    const verifiedPayment = await kakaoResponse.json();

    // Get product info
    const product = getProduct(intent.productCode);

    // Process payment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          userId: session.user.id,
          provider: "kakaopay",
          amount: intent.amount,
          currency: intent.currency,
          providerPaymentId: resolvedTid,
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
    console.error("KakaoPay confirm error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
