"use client";

import { useApp } from "./AppProvider";
import { LOCALES, LOCALE_LABEL } from "@/lib/locales";

const SHORT = { "zh-CN": "简", "zh-TW": "繁", en: "EN", "fr-CA": "FR" } as const;

export function LangSwitch({ compact = false, large = false }: { compact?: boolean; large?: boolean }) {
  const { locale, setLocale } = useApp();
  return (
    <div role="group" aria-label="Language" className={`flex flex-wrap gap-1.5 ${compact ? "" : "justify-center"}`}>
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            lang={l}
            aria-pressed={active}
            aria-label={LOCALE_LABEL[l]}
            onClick={() => setLocale(l)}
            className={`min-h-11 rounded-full border font-medium transition-colors ${
              large ? "min-h-14 px-6 text-lg" : "px-3 text-sm"
            } ${
              active
                ? "border-cinnabar bg-cinnabar text-[#fffaf0]"
                : "border-gold/70 bg-paper/80 text-ink hover:bg-cream"
            } ${compact ? "min-w-11" : ""}`}
          >
            {compact ? SHORT[l] : LOCALE_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
