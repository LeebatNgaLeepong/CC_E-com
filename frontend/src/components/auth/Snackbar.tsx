import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export default function Snackbar() {
  return (
    <aside aria-label="Sign-in notice" className="glass fixed bottom-6 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-3 whitespace-nowrap pl-5 pr-2 text-sm">
      <Lock size={16} aria-hidden />
      <span>Secure sign-in</span>
      <Link href="/admin/login" aria-label="Staff access" className="flex h-11 w-11 items-center justify-center rounded-full opacity-0 transition hover:opacity-100 focus-visible:opacity-100">
        <ShieldCheck size={18} aria-hidden />
      </Link>
    </aside>
  );
}
