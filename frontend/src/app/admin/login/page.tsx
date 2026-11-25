import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Staff sign-in", robots: { index: false, follow: false } };
export const instant = false;

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  return (
    <AuthShell tone="dark">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Staff only</p>
      <h1 className="mt-3 text-center font-serif text-4xl">Admin sign in</h1>
      {expired && <p className="mt-4 text-center text-sm text-white/80">Your session expired. Please sign in again.</p>}
      <LoginForm portal="admin" tone="dark" />
    </AuthShell>
  );
}
