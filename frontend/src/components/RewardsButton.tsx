import { Sparkles } from "lucide-react";

export default function RewardsButton() {
  return (
    <button className="rewards-button" aria-label="Open rewards">
      <Sparkles size={17} />
      <span>Rewards</span>
    </button>
  );
}
