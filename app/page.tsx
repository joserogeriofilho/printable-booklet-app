"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const supportedLocales = ["en", "pt", "es"];

function detectLocale(): string {
  if (typeof navigator === "undefined") return "en";
  const locale = navigator.language?.substring(0, 2) || "en";
  return supportedLocales.includes(locale) ? locale : "en";
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const locale = detectLocale();
    router.replace(`/${locale}/`);
  }, [router]);

  return null;
}
