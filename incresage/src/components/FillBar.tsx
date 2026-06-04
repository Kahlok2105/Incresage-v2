interface FillBarProps {
  value: number;
  label?: string;
}

export function FillBar({ value, label }: FillBarProps) {
  const percent = Math.round(value * 100);

  return (
    <div className="fill-bar">
      <div
        className="fill-bar__inner"
        style={{ width: `${percent}%` }}
      />
      <span className="fill-bar__label">{label ?? `${percent}%`}</span>
    </div>
  );
}
