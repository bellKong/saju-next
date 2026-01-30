"use client";

import { createContext, useContext } from "react";

interface SessionData {
  isLoggedIn: boolean;
  creditBalance: number;
  userName: string | null;
  userImage: string | null;
}

const SessionContext = createContext<SessionData>({
  isLoggedIn: false,
  creditBalance: 0,
  userName: null,
  userImage: null,
});

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionData;
}) {
  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}
