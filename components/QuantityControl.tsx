"use client";

interface QuantityControlProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityControlProps) {
  return (
    <div
      className="inline-flex items-center"
      style={{
        border: "2.5px solid #1a1a1a",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "2px 2px 0 #1a1a1a",
      }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors"
        style={{
          background: value <= min ? "#f5f5f5" : "var(--green-light)",
          borderRight: "2px solid #1a1a1a",
          color: value <= min ? "#bbb" : "var(--green-dark)",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        −
      </button>
      <span
        className="w-10 text-center font-bold text-base"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors"
        style={{
          background: "var(--green-primary)",
          borderLeft: "2px solid #1a1a1a",
          color: "#fff",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        +
      </button>
    </div>
  );
}
