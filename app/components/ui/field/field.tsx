import styles from "./field.module.css";

interface FieldProps {
  id?: string;
  label: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id}>{label}</label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      {children}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
