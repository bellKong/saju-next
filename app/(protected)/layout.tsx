import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Header
        isLoggedIn={true}
        creditBalance={session.user.creditBalance}
        userName={session.user.name}
      />
      <main className="pb-safe">{children}</main>
      <BottomNav />
    </>
  );
}
