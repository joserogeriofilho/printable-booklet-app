import "./global.css";
import type { Metadata } from "next";
import { baseUrl } from "./sitemap";

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
      <body className="max-w-4xl mt-8 mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-4 xl:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
