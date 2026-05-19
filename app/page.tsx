"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

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

  return (
    <Script
      type="text/javascript"
      src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
      data-name="bmc-button"
      data-slug="roger.sama"
      data-color="#FFDD00"
      data-emoji=""
      data-font="Cookie"
      data-text="Buy me a coffee"
      data-outline-color="#000000"
      data-font-color="#000000"
      data-coffee-color="#ffffff"
    ></Script>
  );
}
