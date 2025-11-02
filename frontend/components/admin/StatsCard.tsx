interface StatsCardProps {
  title: string;
  value: string | number;
}
export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col items-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
