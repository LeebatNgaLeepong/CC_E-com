import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../../back-end/src/db";
import { users } from "../../back-end/src/db/schema";
import { adminAllowList } from "../../back-end/src/lib/env";

type Role = "customer" | "seller" | "admin";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

function providerFor(id: "consumer" | "seller" | "admin", role: Role) {
  return Credentials({
    id,
    name: id,
    credentials: { email: {}, password: {} },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const db = await getDb();
      const email = parsed.data.email.toLowerCase();
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const passwordOk = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !passwordOk) return null;
      if (user.role !== role) return null;
      if (user.status !== "active") return null;
      if (role === "admin" && !adminAllowList.includes(email)) return null;

      return { id: user.id, email: user.email, name: user.name, role: user.role };
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    providerFor("consumer", "customer"),
    providerFor("seller", "seller"),
    providerFor("admin", "admin"),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.loginAt = Date.now();
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as Role;
      session.user.loginAt = token.loginAt as number;
      return session;
    },
  },
});
