import styles from "./github-button.module.css";

export function GitHubButton() {
  return (
    <a
      href="https://github.com/joserogeriofilho/printable-booklet-app"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.githubButton}
    >
      <img
        src="/images/github-logo.svg"
        alt="GitHub"
        className={styles.githubLogo}
      />
      Github
    </a>
  );
}
