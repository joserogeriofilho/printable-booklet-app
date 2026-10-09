import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "icon";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  [key: string]: unknown;
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  as,
  href,
  ...rest
}: ButtonProps) {
  const Component = (as ?? (href ? "a" : "button")) as React.ElementType;
  const cls = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <Component
      className={cls}
      href={href}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {children}
    </Component>
  );
}
