import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { io } from "next/cache";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportForm from "@/components/support/SupportForm";
import { MESSENGER_URL, SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/site";

export const metadata = { title: "Support" };
export const instant = false;

export default async function SupportPage() {
  await io();
  const session = await auth();
  const prefill = session?.user.role === "customer"
    ? { name: session.user.name ?? undefined, email: session.user.email ?? undefined }
    : {};

  const ways = [
    { icon: Mail, label: "Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    SUPPORT_PHONE && { icon: Phone, label: "Phone", value: SUPPORT_PHONE, href: `tel:${SUPPORT_PHONE.replace(/\s/g, "")}` },
    MESSENGER_URL && { icon: MessageCircle, label: "Messenger", value: "Chat with us", href: MESSENGER_URL },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1180px] px-6 pb-28 pt-40 md:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">Support</p>
        <h1 className="mt-3 font-serif text-5xl tracking-[-0.03em] md:text-7xl">How can we help?</h1>
        <p className="mt-5 max-w-xl text-ink-soft">Questions about an order, sizing or a return? Send us a message and we&rsquo;ll get back to you.</p>
        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_340px]">
          <SupportForm prefill={prefill} />
          <aside className="space-y-4" aria-label="Other ways to reach us">
            {ways.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="flex min-h-14 items-center gap-4 rounded-card bg-card p-5 shadow-sm">
                <Icon size={22} aria-hidden />
                <span><span className="block text-sm text-ink-soft">{label}</span><span className="block font-medium">{value}</span></span>
              </a>
            ))}
            {SUPPORT_HOURS && (
              <div className="flex items-center gap-4 rounded-card bg-card p-5 shadow-sm">
                <Clock size={22} aria-hidden />
                <span><span className="block text-sm text-ink-soft">Hours</span><span className="block font-medium">{SUPPORT_HOURS}</span></span>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
