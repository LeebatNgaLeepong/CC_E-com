import type { DefaultSession } from "next-auth";

type Role = "customer" | "seller" | "admin";

declare module "next-auth" {
  interface User { role: Role }
  interface Session {
    user: { id: string; role: Role; loginAt: number } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT { role?: Role; loginAt?: number }
}
