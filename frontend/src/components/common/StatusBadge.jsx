export default function StatusBadge({ status, variant = "soft" }) {
  const styles = {
    soft: "bg-violet-100 text-violet-700 ring-violet-200",
    success: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-100 text-amber-700 ring-amber-200",
    danger: "bg-rose-100 text-rose-700 ring-rose-200",
    neutral: "bg-slate-200 text-slate-700 ring-slate-300",
  };

  const label = status?.replace(/[-_]/g, " ") || "Active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[variant] || styles.soft}`}
    >
      {label}
    </span>
  );
}
