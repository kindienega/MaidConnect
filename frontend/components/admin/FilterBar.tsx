interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
  options: Record<string, string[]>;
}
export function FilterBar({ filters, onChange, options }: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-4">
      {Object.entries(options).map(([key, values]) => (
        <select
          key={key}
          value={filters[key] || ""}
          onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
          className="select select-bordered"
        >
          {values.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ))}
      {/* Add search input, date pickers, etc. as needed */}
    </div>
  );
}
