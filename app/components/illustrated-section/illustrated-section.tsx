import styles from "./illustrated-section.module.css";

function Text({ children }: { children: React.ReactNode }) {
  return (
    <div>{children}</div>
  );
}

function Media({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.media}>
      {children}
    </div>
  );
}

export function IllustratedSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      {children}
      <img className={styles.paperFold} src="/images/paper-fold.svg" alt="" />
    </div>
  );
}

IllustratedSection.Text = Text;
IllustratedSection.Media = Media;
