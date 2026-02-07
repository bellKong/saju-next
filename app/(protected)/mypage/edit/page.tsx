import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileEditClient from "@/components/ProfileEditClient";

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      birthDate: true,
      gender: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ProfileEditClient user={user} />;
}
