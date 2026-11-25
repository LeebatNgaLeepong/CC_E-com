import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import RoleTabs from "@/components/auth/RoleTabs";

export const metadata = { title: "Create account" };
export const instant = false;

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const { as } = await searchParams;
  const seller = as === "seller";

  return (
    <AuthShell>
      <h1 className="text-center font-serif text-4xl tracking-[-0.03em]">
        {seller ? "Apply to sell" : "Create your account"}
      </h1>
      {seller && (
        <p className="mt-3 text-center text-sm text-ink-soft">
          We review every application before your shop goes live.
        </p>
      )}
      <RoleTabs active={seller ? "seller" : "consumer"} basePath="/register" />
      <RegisterForm seller={seller} />
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href={seller ? "/login?as=seller" : "/login"}
          className="font-semibold text-ink underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
