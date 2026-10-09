import { Button } from "../ui/button";
import styles from "./github-button.module.css";

export function GitHubButton() {
  return (
    <Button
      as="a"
      href="https://github.com/joserogeriofilho/printable-booklet-app"
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      className={styles.githubButton}
    >
      <img
        src="/images/github-logo.svg"
        alt=""
        className={styles.githubLogo}
      />
      Github
    </Button>
  );
}
