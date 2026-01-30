import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getProduct, isValidProductCode } from "@/lib/payments/products";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider, productCode } = body;

    // Validate provider
    if (!["toss", "kakaopay"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    // Validate product code
    if (!isValidProductCode(productCode)) {
      return NextResponse.json(
        { error: "Invalid product code" },
        { status: 400 }
      );
    }

    const product = getProduct(productCode);

    // Generate unique order ID
    const providerOrderId = `ORDER_${nanoid()}`;

    // Create payment intent
    const intent = await prisma.paymentIntent.create({
      data: {
        userId: session.user.id,
        provider,
        productCode,
        amount: product.price,
        currency: "KRW",
        providerOrderId,
        status: "CREATED",
      },
    });

    // Return data needed for payment widget
    return NextResponse.json({
      orderId: providerOrderId,
      amount: product.price,
      orderName: product.name,
      customerName: session.user.name || "고객",
      customerEmail: session.user.email || undefined,
      intentId: intent.id,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
