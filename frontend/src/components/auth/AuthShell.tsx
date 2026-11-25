export default function AuthShell({
  tone = "light",
  children,
}: {
  tone?: "light" | "dark";
  children: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-16 ${dark ? "admin-bg text-white" : "hero-bg"}`}>
      <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-end justify-center gap-8 ${dark ? "opacity-40" : "opacity-90"}`}>
        <div className="h-[55vh] w-[26vw] max-w-[360px] translate-y-10 rounded-t-full bg-[var(--pink)]" />
        <div className="h-[45vh] w-[26vw] max-w-[360px] translate-y-10 rounded-t-full bg-[var(--sage)]" />
        <div className="h-[55vh] w-[26vw] max-w-[360px] translate-y-10 rounded-t-full bg-card" />
      </div>
      <main className={`glass relative w-full max-w-md p-8 md:p-10 ${dark ? "glass-dark" : "glass-strong"}`}>
        {children}
      </main>
    </div>
  );
}
