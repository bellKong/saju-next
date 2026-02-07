import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      creditBalance: number
      birthDate?: string | null
      gender?: string | null
    } & DefaultSession["user"]
  }
}
