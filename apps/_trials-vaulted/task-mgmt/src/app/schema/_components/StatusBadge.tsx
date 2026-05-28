import type { Status } from '../_data/pillars';

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  complete:      { label: 'Complete',     classes: 'bg-green-100 text-green-800 border border-green-200' },
  'in-progress': { label: 'In Progress',  classes: 'bg-amber-100 text-amber-800 border border-amber-200' },
  planned:       { label: 'Planned',      classes: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
