"use client";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section>
      <h1 className="mb-8">
        {t("title")}
      </h1>
      <p className="mb-4">{t("description")}</p>
    </section>
  );
}
