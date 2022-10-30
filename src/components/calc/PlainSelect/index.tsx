export const PlainSelect = ({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label?: string }) => (
  <label className="input-group-xs input-group w-1/2">
    {label && <span className="input-addon w-28 border border-neutral">{label}</span>}
    <select className="select-bordered select select-xs" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((f, i) => (
        <option key={i} value={f}>
          {f}
        </option>
      ))}
    </select>
  </label>
);
