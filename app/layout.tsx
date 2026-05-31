import "./global.css";
import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import { baseUrl } from "./sitemap";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

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

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-stone-900 bg-stone-50 dark:text-stone-100 dark:bg-stone-950 font-[family-name:var(--font-special-elite)]",
        specialElite.variable,
      )}
    >
      <body className="antialiased max-w-4xl mt-8 mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-4 xl:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
