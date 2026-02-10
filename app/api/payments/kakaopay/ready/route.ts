import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // Find and validate payment intent
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

    if (intent.provider !== "kakaopay") {
      return NextResponse.json(
        { error: "Invalid provider for this intent" },
        { status: 400 }
      );
    }

    // Call KakaoPay ready API
    const secretKey = process.env.KAKAOPAY_SECRET_KEY;
    const cid = process.env.KAKAOPAY_CID || "TC0ONETIME";
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL;

    if (!secretKey) {
      throw new Error("KAKAOPAY_SECRET_KEY not configured");
    }

    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL or NEXT_PUBLIC_BASE_URL not configured");
    }

    const kakaoResponse = await fetch(
      "https://open-api.kakaopay.com/online/v1/payment/ready",
      {
        method: "POST",
        headers: {
          Authorization: `SECRET_KEY ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cid,
          partner_order_id: orderId,
          partner_user_id: session.user.id,
          item_name: `크레딧 충전 (${intent.productCode})`,
          quantity: 1,
          total_amount: intent.amount,
          tax_free_amount: 0,
          approval_url: `${baseUrl}/billing/kakaopay/callback?orderId=${orderId}`,
          cancel_url: `${baseUrl}/billing/kakaopay/cancel`,
          fail_url: `${baseUrl}/billing/kakaopay/fail`,
        }),
      }
    );

    if (!kakaoResponse.ok) {
      const errorData = await kakaoResponse.json();
      console.error("KakaoPay ready failed:", errorData);
      return NextResponse.json(
        { error: "KakaoPay ready failed", details: errorData },
        { status: 400 }
      );
    }

    const readyData = await kakaoResponse.json();

    // Save tid to intent for later approval
    await prisma.paymentIntent.update({
      where: { id: intent.id },
      data: {
        providerTid: readyData.tid,
        status: "REQUESTED",
      },
    });

    return NextResponse.json({
      tid: readyData.tid,
      redirectUrl: readyData.next_redirect_mobile_url,
      redirectUrlPc: readyData.next_redirect_pc_url,
    });
  } catch (error) {
    console.error("KakaoPay ready error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
