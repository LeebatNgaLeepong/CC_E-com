export default function ArchPlaceholder({
  className = "",
}: {
  tone?: "white";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`arch-placeholder ${className}`}>
      <span className="arch-sleeve arch-sleeve-left" />
      <span className="arch-body" />
      <span className="arch-sleeve arch-sleeve-right" />
    </div>
  );
}
