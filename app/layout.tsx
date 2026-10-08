import "./global.css";
import type { Metadata } from "next";
import { baseUrl } from "./sitemap";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Printable Booklet — Make zines & booklets",
    template: "%s | Printable Booklet",
  },
  description: "Create printable booklets from your images. Perfect for zines, mini photo books, and DIY publications.",
  openGraph: {
    title: "Printable Booklet",
    description: "Create printable booklets from your images. Perfect for zines, mini photo books, and DIY publications.",
    url: baseUrl,
    siteName: "Printable Booklet",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
