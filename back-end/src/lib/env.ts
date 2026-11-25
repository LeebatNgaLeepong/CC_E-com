import { z } from "zod";

export const env = z
  .object({
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
    ADMIN_ALLOWED_EMAILS: z.string().default(""),
    ADMIN_SESSION_HOURS: z.coerce.number().default(2),
    LOGIN_MAX_ATTEMPTS: z.coerce.number().default(5),
    LOGIN_WINDOW_MINUTES: z.coerce.number().default(15),
  })
  .parse(process.env);

export const adminAllowList = env.ADMIN_ALLOWED_EMAILS
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
