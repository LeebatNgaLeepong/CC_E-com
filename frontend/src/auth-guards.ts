import { auth } from "./auth";
import { env } from "../../back-end/src/lib/env";

type Role = "customer" | "seller" | "admin";

export function isAdminSessionExpired(loginAt: number) {
  const maxMs = env.ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  return !Number.isFinite(loginAt) || Date.now() - loginAt > maxMs;
}

export async function requireRole(role: Role) {
  const session = await auth();
  if (!session || session.user.role !== role) throw new Error("Forbidden");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireRole("admin");
  if (isAdminSessionExpired(user.loginAt)) throw new Error("Session expired");
  return user;
}
