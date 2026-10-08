import styles from "./buy-me-a-coffee.module.css";

export function BuyMeACoffee() {
  return (
    <a
      href="https://www.buymeacoffee.com/roger.sama"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        className={styles.image}
        alt="Buy Me a Coffee"
      />
    </a>
  );
}
