export default function StatusBadge({ status }) {
  const color =
    status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700';

  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}
