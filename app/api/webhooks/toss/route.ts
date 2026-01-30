import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProduct } from "@/lib/payments/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, data } = body;

    console.log("Toss webhook received:", eventType, data);

    // Handle payment status changes
    if (eventType === "PAYMENT_STATUS_CHANGED") {
      const { paymentKey, orderId, status } = data;

      // Find existing payment
      const payment = await prisma.payment.findUnique({
        where: { providerPaymentId: paymentKey },
        include: { paymentIntent: true },
      });

      if (!payment) {
        console.log("Payment not found for webhook:", paymentKey);
        return NextResponse.json({ received: true });
      }

      // Handle cancellation
      if (status === "CANCELED" || status === "PARTIAL_CANCELED") {
        await prisma.$transaction(async (tx) => {
          // Update payment status
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "CANCELED" },
          });

          // If credits were already given, we need to handle refund
          // Check if credits were consumed
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
            // Log that credits were already consumed
            console.warn(
              `Cannot refund credits for payment ${payment.id}: already consumed`
            );
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Toss webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
