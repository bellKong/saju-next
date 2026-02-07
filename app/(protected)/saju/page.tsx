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
