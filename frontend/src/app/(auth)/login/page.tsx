import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RoleTabs from "@/components/auth/RoleTabs";
import LoginForm from "@/components/auth/LoginForm";
import Snackbar from "@/components/auth/Snackbar";

export const metadata = { title: "Sign in" };
export const instant = false;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ as?: string; callbackUrl?: string; registered?: string }> }) {
  const { as, callbackUrl, registered } = await searchParams;
  const portal = as === "seller" ? "seller" : "consumer";
  return (
    <>
      <AuthShell>
        <div className="text-center"><span className="block font-serif text-2xl">Conscious</span><span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.35em]">Clothing</span></div>
        <h1 className="mt-8 text-center font-serif text-4xl">{portal === "seller" ? "Seller sign in" : "Welcome back"}</h1>
        <RoleTabs active={portal} />
        {registered && (
          <p role="status" className="mt-4 rounded-control bg-card/70 px-4 py-3 text-center text-sm">
            Thanks! You can sign in now. If you registered before, use your original password.
          </p>
        )}
        <LoginForm portal={portal} callbackUrl={callbackUrl} />
        <p className="mt-6 text-center text-sm text-ink-soft">
          {portal === "seller" ? <>New seller? <Link href="/register?as=seller" className="font-semibold text-ink underline">Apply to sell</Link></> : <>New here? <Link href="/register" className="font-semibold text-ink underline">Create an account</Link></>}
        </p>
      </AuthShell>
      <Snackbar />
    </>
  );
}
