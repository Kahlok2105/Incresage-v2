interface FillBarProps {
  value: number;
}

export function FillBar({ value }: FillBarProps) {
  const percent = Math.round(value * 100);

  return (
    <div className="fill-bar">
      <div
        className="fill-bar__inner"
        style={{ width: `${percent}%` }}
      />
      <span className="fill-bar__label">{percent}%</span>
    </div>
  );
}