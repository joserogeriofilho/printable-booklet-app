import { routing } from "../src/i18n/routing";

const DEFAULT_BASE_URL = "https://printable-booklet.vercel.app";
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

export const dynamic = "force-static";

export default async function sitemap() {
  const paths = ["", "/about-me"];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date().toISOString().split("T")[0],
    }))
  );
}
