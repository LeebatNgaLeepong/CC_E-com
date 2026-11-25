export default function Field({
  label,
  tone = "light",
  ...props
}: { label: string; tone?: "light" | "dark" } & React.InputHTMLAttributes<HTMLInputElement>) {
  const dark = tone === "dark";
  return (
    <label htmlFor={props.name} className="block text-sm font-medium">
      {label}
      <input
        id={props.name}
        {...props}
        className={`mt-2 block min-h-12 w-full rounded-control px-4 text-base outline-none focus-visible:ring-2 ${dark ? "bg-[#26262b] text-white ring-white placeholder:text-white/50" : "bg-card text-ink ring-1 ring-ink/10 focus-visible:ring-2 focus-visible:ring-ink"}`}
      />
    </label>
  );
}
