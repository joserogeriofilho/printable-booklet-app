import { routing } from "../src/i18n/routing";

export const baseUrl = "https://portfolio-blog-starter.vercel.app";

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
