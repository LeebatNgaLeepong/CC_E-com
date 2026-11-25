import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = { title: "Application received" };

export default function SubmittedPage() {
  return (
    <AuthShell>
      <h1 className="text-center font-serif text-4xl tracking-[-0.03em]">Application received</h1>
      <p className="mt-4 text-center text-ink-soft">
        Thank you. We’ll review your shop and you’ll be able to sign in once it’s approved.
      </p>
      <Link
        href="/login?as=seller"
        className="btn-primary mt-8 flex min-h-12 items-center justify-center rounded-full font-semibold"
      >
        Back to sign in
      </Link>
    </AuthShell>
  );
}
