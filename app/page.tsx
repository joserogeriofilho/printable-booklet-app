"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const localeMap: Record<string, string> = {
  pt: "pt",
  "pt-BR": "pt",
  "pt-PT": "pt",
  es: "es",
  "es-ES": "es",
  "es-MX": "es",
  "es-AR": "es",
};

function detectLocale(): string {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language;
  return localeMap[lang] || "en";
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const locale = detectLocale();
    router.replace(`/${locale}/`);
  }, [router]);

  return null;
}
