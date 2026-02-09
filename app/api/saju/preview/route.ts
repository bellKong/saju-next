import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateSaju } from "@/lib/saju-calculator";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { birthDate, birthTime, calendarType, gender } = await req.json();

    if (!birthDate || !gender) {
      return NextResponse.json(
        { error: "birthDate and gender are required" },
        { status: 400 }
      );
    }

    const sajuResult = await calculateSaju({
      birthDate,
      birthTime: birthTime || "모름",
      calendarType: calendarType || "양력",
      gender,
    });

    return NextResponse.json({ success: true, sajuResult });
  } catch (error: any) {
    console.error("Saju preview error:", error);
    return NextResponse.json(
      { error: error.message || "만세력 계산에 실패했습니다" },
      { status: 500 }
    );
  }
}
