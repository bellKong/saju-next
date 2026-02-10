import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProduct } from "@/lib/payments/products";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = process.env.WEBHOOK_KAKAOPAY_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `SECRET_KEY ${webhookSecret}`) {
        console.error("KakaoPay webhook: invalid secret");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const { event_type, data } = body;

    console.log("KakaoPay webhook received:", event_type, data);

    // Handle payment cancellation
    if (event_type === "payment.canceled") {
      const { tid } = data;

      // Find existing payment
      const payment = await prisma.payment.findUnique({
        where: { providerPaymentId: tid },
        include: { paymentIntent: true },
      });

      if (!payment) {
        console.log("Payment not found for webhook:", tid);
        return NextResponse.json({ received: true });
      }

      await prisma.$transaction(async (tx) => {
        // Update payment status
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "CANCELED" },
        });

        // Handle credit refund
        const product = getProduct(payment.paymentIntent!.productCode);
        const creditsToRefund = product.credits;

        // Get current user balance
        const user = await tx.user.findUnique({
          where: { id: payment.userId },
        });

        if (!user) return;

        // Only refund if user has enough credits (not consumed yet)
        if (user.creditBalance >= creditsToRefund) {
          // Deduct credits
          await tx.user.update({
            where: { id: payment.userId },
            data: {
              creditBalance: {
                decrement: creditsToRefund,
              },
            },
          });

          // Add ledger entry
          await tx.creditLedger.create({
            data: {
              userId: payment.userId,
              delta: -creditsToRefund,
              reason: "REFUND_REVERSAL",
              paymentId: payment.id,
            },
          });
        } else {
          console.warn(
            `Cannot refund credits for payment ${payment.id}: already consumed`
          );
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("KakaoPay webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
