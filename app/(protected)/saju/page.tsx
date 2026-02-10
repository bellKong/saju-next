import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SajuClient from "@/components/SajuClient";

export default async function SajuPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const persons = await prisma.person.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      readings: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          result: true,
          summary: true,
          input: true,
          createdAt: true,
        },
      },
      manseryeok: true,
    },
  });
  //test

  return (
    <SajuClient
      creditBalance={session.user.creditBalance}
      initialPersons={persons.map((p) => ({
        id: p.id,
        name: p.name,
        relationship: p.relationship,
        birthDate: p.birthDate,
        birthTime: p.birthTime,
        calendarType: p.calendarType,
        gender: p.gender,
        manseryeok: p.manseryeok
          ? {
              solarDate: p.manseryeok.solarDate,
              lunarDate: p.manseryeok.lunarDate,
              sajuYear: p.manseryeok.sajuYear,
              yearPillar: {
                gan: p.manseryeok.yearGan, ji: p.manseryeok.yearJi,
                ganKr: p.manseryeok.yearGanKr, jiKr: p.manseryeok.yearJiKr,
                ohangGan: p.manseryeok.yearOhangGan, ohangJi: p.manseryeok.yearOhangJi,
              },
              monthPillar: {
                gan: p.manseryeok.monthGan, ji: p.manseryeok.monthJi,
                ganKr: p.manseryeok.monthGanKr, jiKr: p.manseryeok.monthJiKr,
                ohangGan: p.manseryeok.monthOhangGan, ohangJi: p.manseryeok.monthOhangJi,
              },
              dayPillar: {
                gan: p.manseryeok.dayGan, ji: p.manseryeok.dayJi,
                ganKr: p.manseryeok.dayGanKr, jiKr: p.manseryeok.dayJiKr,
                ohangGan: p.manseryeok.dayOhangGan, ohangJi: p.manseryeok.dayOhangJi,
              },
              timePillar: p.manseryeok.timeGan ? {
                gan: p.manseryeok.timeGan, ji: p.manseryeok.timeJi!,
                ganKr: p.manseryeok.timeGanKr!, jiKr: p.manseryeok.timeJiKr!,
                ohangGan: p.manseryeok.timeOhangGan!, ohangJi: p.manseryeok.timeOhangJi!,
              } : null,
              ohang: {
                "木": p.manseryeok.ohangMok,
                "火": p.manseryeok.ohangHwa,
                "土": p.manseryeok.ohangTo,
                "金": p.manseryeok.ohangGeum,
                "水": p.manseryeok.ohangSu,
              },
            }
          : null,
        latestReading: p.readings[0]
          ? {
              id: p.readings[0].id,
              result: p.readings[0].result as { content: string } | null,
              summary: p.readings[0].summary,
              input: p.readings[0].input as Record<string, string>,
              createdAt: p.readings[0].createdAt.toISOString(),
            }
          : null,
      }))}
    />
  );
}
