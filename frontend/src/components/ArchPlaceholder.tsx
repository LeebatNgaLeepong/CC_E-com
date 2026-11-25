export default function ArchPlaceholder({
  className = "",
  tone = "white",
}: {
  tone?: "rose" | "sage" | "white";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`arch-placeholder arch-${tone} ${className}`}>
      <span className="arch-sleeve arch-sleeve-left" />
      <span className="arch-body" />
      <span className="arch-sleeve arch-sleeve-right" />
    </div>
  );
}
