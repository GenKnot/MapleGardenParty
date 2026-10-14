"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppProvider";
import type { DictKey } from "@/lib/i18n";

const ITEMS: { href: string; key: DictKey; icon: React.ReactNode }[] = [
  {
    href: "/explore",
    key: "nav.explore",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
      </>
    ),
  },
  {
    href: "/stamps",
    key: "nav.stamps",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="10" rx="2" />
        <path d="M9 13.5v3.5M15 13.5v3.5M6 20.5h12" />
      </>
    ),
  },
  {
    href: "/redeem",
    key: "nav.redeem",
    icon: (
      <>
        <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
        <path d="M3.5 13h17M12 9v11M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0" />
      </>
    ),
  },
  {
    href: "/connect",
    key: "nav.connect",
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
];

export function BottomNav() {
  const path = usePathname();
  const { t } = useApp();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-paper/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-3xl">
        {ITEMS.map((it) => {
          const active = path === it.href || (it.href === "/explore" && path.startsWith("/games"));
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${
                  active ? "text-cinnabar" : "text-muted"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {it.icon}
                </svg>
                {t(it.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
