"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { LangSwitch } from "@/components/LangSwitch";
import type { Locale } from "@/lib/locales";

type Entry = {
  id: string;
  name: Record<Locale, string>;
  title: string;
  author: string;
  url: string;
  license: "CC0" | "CC BY-SA 4.0" | "PD";
  licenseUrl?: string;
  note?: "virtual";
  modified?: boolean;
};

const ENTRIES: Entry[] = [
  {
    id: "guzheng",
    name: { "zh-CN": "古筝", "zh-TW": "古箏", en: "Guzheng", "fr-CA": "Guzheng" },
    title: "Guzheng (virtual instrument)",
    author: "neolein",
    url: "https://freesound.org/people/neolein/sounds/472707/",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    note: "virtual",
  },
  {
    id: "pipa",
    name: { "zh-CN": "琵琶", "zh-TW": "琵琶", en: "Pipa", "fr-CA": "Pipa" },
    title: "Pipa - sound.ogg",
    author: "Francesc Fort",
    url: "https://commons.wikimedia.org/wiki/File:Pipa_-_sound.ogg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    modified: true,
  },
  {
    id: "erhu",
    name: { "zh-CN": "二胡", "zh-TW": "二胡", en: "Erhu", "fr-CA": "Erhu" },
    title: "Erhu",
    author: "Hybridkin",
    url: "https://freesound.org/people/Hybridkin/sounds/748144/",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "dizi",
    name: { "zh-CN": "笛子", "zh-TW": "笛子", en: "Dizi", "fr-CA": "Dizi" },
    title: "Dizi",
    author: "Hypnotriod",
    url: "https://freesound.org/people/Hypnotriod/sounds/384941/",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "guqin",
    name: { "zh-CN": "古琴", "zh-TW": "古琴", en: "Guqin", "fr-CA": "Guqin" },
    title: "Zheng diao.ogg",
    author: "Charlie Huang",
    url: "https://commons.wikimedia.org/wiki/File:Zheng_diao.ogg",
    license: "PD",
  },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Credits() {
  const { t, locale } = useApp();
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-16 pt-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <Link href="/" className="font-serif text-lg font-bold tracking-[0.15em]">
          {t("brand.name")}
        </Link>
        <LangSwitch compact />
      </header>

      <h1 className="font-serif text-2xl font-bold">{t("credits.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("credits.intro")}</p>

      <ul className="mt-5 space-y-3">
        {ENTRIES.map((e) => (
          <li key={e.id} className="card p-4">
            <p className="font-serif text-lg font-bold">
              {e.name[locale]}
              {e.note && <span className="ml-2 text-sm font-normal text-muted">· {t("credits.virtual")}</span>}
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="inline text-muted">{t("credits.by")}：</dt>
                <dd className="inline">{e.author}</dd>
              </div>
              <div>
                <dt className="inline text-muted">{t("credits.source")}：</dt>
                <dd className="inline break-all">
                  <a href={e.url} className="underline" {...ext}>
                    {e.title}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline text-muted">{t("credits.license")}：</dt>
                <dd className="inline">
                  {e.license === "PD" ? (
                    t("credits.publicDomain")
                  ) : (
                    <a href={e.licenseUrl} className="underline" {...ext}>
                      {e.license}
                    </a>
                  )}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm">{t("credits.modified")}</p>
      <p className="mt-2 text-sm">{t("credits.shareAlike")}</p>
    </main>
  );
}
