import styles from "./stepper.module.css";

interface StepperProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  min?: number;
  max?: number;
  className?: string;
}

export function Stepper({
  id,
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  min = 1,
  max = 50,
  className,
}: StepperProps) {
  const clamp = (raw: number) => Math.min(max, Math.max(min, raw));

  return (
    <div className={[styles.stepper, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={styles.button}
      >
        -
      </button>
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => {
          const raw = parseInt(e.target.value, 10);
          onChange(Number.isNaN(raw) ? 0 : clamp(raw));
        }}
        className={styles.input}
      />
      <button
        type="button"
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={styles.button}
      >
        +
      </button>
    </div>
  );
}
