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
  return <div className={styles.section}>{children}</div>;
}

IllustratedSection.Text = Text;
IllustratedSection.Media = Media;
