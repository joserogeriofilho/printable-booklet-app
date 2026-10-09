import styles from "./select.module.css";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export function Select({ className, children, ...rest }: SelectProps) {
  const cls = [styles.select, className].filter(Boolean).join(" ");
  return (
    <select className={cls} {...rest}>
      {children}
    </select>
  );
}
