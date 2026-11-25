import { signOut } from "@/auth";

export default function SignOutButton({ redirectTo = "/login" }: { redirectTo?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo });
      }}
    >
      <button className="inline-flex min-h-11 items-center rounded-full bg-ink/5 px-5 text-sm font-semibold transition hover:bg-ink/10">
        Sign out
      </button>
    </form>
  );
}
