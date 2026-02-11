import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateSaju, type SajuResult } from "@/lib/saju-calculator";

function sajuResultToDb(personId: string, r: SajuResult) {
  return {
    personId,
    solarDate: r.solarDate,
    lunarDate: r.lunarDate,
    sajuYear: r.sajuYear,
    yearGan: r.yearPillar.gan,
    yearJi: r.yearPillar.ji,
    yearGanKr: r.yearPillar.ganKr,
    yearJiKr: r.yearPillar.jiKr,
    yearOhangGan: r.yearPillar.ohangGan,
    yearOhangJi: r.yearPillar.ohangJi,
    monthGan: r.monthPillar.gan,
    monthJi: r.monthPillar.ji,
    monthGanKr: r.monthPillar.ganKr,
    monthJiKr: r.monthPillar.jiKr,
    monthOhangGan: r.monthPillar.ohangGan,
    monthOhangJi: r.monthPillar.ohangJi,
    dayGan: r.dayPillar.gan,
    dayJi: r.dayPillar.ji,
    dayGanKr: r.dayPillar.ganKr,
    dayJiKr: r.dayPillar.jiKr,
    dayOhangGan: r.dayPillar.ohangGan,
    dayOhangJi: r.dayPillar.ohangJi,
    timeGan: r.timePillar?.gan ?? null,
    timeJi: r.timePillar?.ji ?? null,
    timeGanKr: r.timePillar?.ganKr ?? null,
    timeJiKr: r.timePillar?.jiKr ?? null,
    timeOhangGan: r.timePillar?.ohangGan ?? null,
    timeOhangJi: r.timePillar?.ohangJi ?? null,
    ohangMok: r.ohang["木"] ?? 0,
    ohangHwa: r.ohang["火"] ?? 0,
    ohangTo: r.ohang["土"] ?? 0,
    ohangGeum: r.ohang["金"] ?? 0,
    ohangSu: r.ohang["水"] ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToSajuResult(m: Record<string, any>): SajuResult {
  return {
    solarDate: m.solarDate,
    lunarDate: m.lunarDate,
    sajuYear: m.sajuYear,
    yearPillar: {
      gan: m.yearGan, ji: m.yearJi,
      ganKr: m.yearGanKr, jiKr: m.yearJiKr,
      ohangGan: m.yearOhangGan, ohangJi: m.yearOhangJi,
    },
    monthPillar: {
      gan: m.monthGan, ji: m.monthJi,
      ganKr: m.monthGanKr, jiKr: m.monthJiKr,
      ohangGan: m.monthOhangGan, ohangJi: m.monthOhangJi,
    },
    dayPillar: {
      gan: m.dayGan, ji: m.dayJi,
      ganKr: m.dayGanKr, jiKr: m.dayJiKr,
      ohangGan: m.dayOhangGan, ohangJi: m.dayOhangJi,
    },
    timePillar: m.timeGan ? {
      gan: m.timeGan, ji: m.timeJi,
      ganKr: m.timeGanKr, jiKr: m.timeJiKr,
      ohangGan: m.timeOhangGan, ohangJi: m.timeOhangJi,
    } : null,
    ohang: {
      "木": m.ohangMok,
      "火": m.ohangHwa,
      "土": m.ohangTo,
      "金": m.ohangGeum,
      "水": m.ohangSu,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { personId, birthDate, birthTime, calendarType, gender } =
      await req.json();

    if (!birthDate || !gender) {
      return NextResponse.json(
        { error: "birthDate and gender are required" },
        { status: 400 }
      );
    }

    // If personId provided, check for cached result
    if (personId) {
      const person = await prisma.person.findUnique({
        where: { id: personId, userId: session.user.id },
        include: { manseryeok: true },
      });

      if (!person) {
        return NextResponse.json({ error: "Person not found" }, { status: 404 });
      }

      if (person.manseryeok) {
        return NextResponse.json({
          success: true,
          sajuResult: dbToSajuResult(person.manseryeok),
        });
      }
    }

    // Calculate fresh
    const sajuResult = await calculateSaju({
      birthDate,
      birthTime: birthTime || "모름",
      calendarType: calendarType || "양력",
      gender,
    });

    // Save to Manseryeok table
    if (personId) {
      await prisma.manseryeok.create({
        data: sajuResultToDb(personId, sajuResult),
      });
    }

    return NextResponse.json({ success: true, sajuResult });
  } catch (error) {
    console.error("Saju preview error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "만세력 계산에 실패했습니다" },
      { status: 500 }
    );
  }
}
