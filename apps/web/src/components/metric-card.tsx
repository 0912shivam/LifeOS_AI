import { Card } from './ui/card';

export function MetricCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="text-3xl font-semibold text-white">{value}</div>
      {note ? <p className="text-sm text-slate-400">{note}</p> : null}
    </Card>
  );
}