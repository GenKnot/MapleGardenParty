import type { Locale } from "@/lib/locales";
import { en } from "./en";
import { frCA } from "./fr-CA";
import { zhCN, type Dict, type DictKey } from "./zh-CN";
import { zhTW } from "./zh-TW";

export type { DictKey };
export const DICTS: Record<Locale, Dict> = { "zh-CN": zhCN, "zh-TW": zhTW, en, "fr-CA": frCA };

export function translate(locale: Locale, key: DictKey, vars?: Record<string, string | number>): string {
  let s: string = DICTS[locale][key] ?? zhCN[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function detectLocale(): Locale {
  const l = (typeof navigator !== "undefined" ? navigator.language : "").toLowerCase();
  if (l.startsWith("zh")) return /tw|hk|mo|hant/.test(l) ? "zh-TW" : "zh-CN";
  if (l.startsWith("fr")) return "fr-CA";
  if (l.startsWith("en")) return "en";
  return "zh-CN";
}
