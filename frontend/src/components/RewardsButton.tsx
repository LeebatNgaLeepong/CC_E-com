import { Sparkles } from "lucide-react";

export default function RewardsButton() {
  return (
    <button className="glass glass-strong glass-press fixed bottom-6 right-6 z-50 flex min-h-12 items-center gap-2 px-6 text-base font-semibold text-ink" aria-label="Open rewards">
      <Sparkles size={20} aria-hidden />
      <span className="hidden sm:inline">Rewards</span>
    </button>
  );
}
