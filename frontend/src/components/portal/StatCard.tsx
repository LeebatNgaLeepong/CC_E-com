export default function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card bg-card p-6 shadow-sm">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-2 font-serif text-4xl tracking-tight">{value}</p>
    </div>
  );
}
