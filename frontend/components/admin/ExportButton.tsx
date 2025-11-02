import { downloadCSV } from "@/lib/utils";
interface ExportButtonProps {
  data: any[];
  filename: string;
}
export function ExportButton({ data, filename }: ExportButtonProps) {
  return (
    <button
      className="btn btn-outline btn-sm"
      onClick={() => downloadCSV(data, filename)}
    >
      Export CSV
    </button>
  );
}
