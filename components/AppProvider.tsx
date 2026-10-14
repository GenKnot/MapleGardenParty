"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { translate, type DictKey } from "@/lib/i18n";
import { localeStore } from "@/lib/i18n/store";
import type { Locale } from "@/lib/locales";
import type { GameId } from "@/lib/games";

export type Me = {
  nickname: string;
  locale: Locale;
  kiosk: boolean;
  shortCode: string;
  stamps: GameId[];
  eligible: boolean;
  redeemStatus: "issued" | "redeemed" | null;
};

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  me: Me | null;
  /** True once hydration is complete and the first session lookup has finished. */
  ready: boolean;
  refresh: () => Promise<Me | null>;
  resetVisitor: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

async function fetchMe(): Promise<Me | null> {
  try {
    const r = await fetch("/api/me", { cache: "no-store" });
    const j = await r.json();
    if (!j.participant) return null;
    return { ...j.participant, stamps: j.stamps, eligible: j.eligible, redeemStatus: j.redeemStatus };
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

export function AppProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(localeStore.subscribe, localeStore.getSnapshot, localeStore.getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [me, setMe] = useState<Me | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchMe().then((m) => {
      if (m) {
        setMe(m);
        localeStore.set(m.locale);
      }
      setFetched(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    localeStore.set(l);
    setMe((m) => (m ? { ...m, locale: l } : m));
    fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: l }),
    }).catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    const m = await fetchMe();
    setMe(m);
    return m;
  }, []);

  const resetVisitor = useCallback(async () => {
    try {
      await fetch("/api/session", { method: "DELETE" });
    } catch {}
    try {
      sessionStorage.clear();
    } catch {}
    localeStore.reset();
    // Full reload on purpose: Next keeps visited routes mounted in memory, and a
    // shared tablet must not retain any of the previous visitor's input.
    window.location.replace("/kiosk");
  }, []);

  const t = useCallback(
    (key: DictKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );

  const ready = hydrated && fetched;
  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, t, me, ready, refresh, resetVisitor }),
    [locale, setLocale, t, me, ready, refresh, resetVisitor],
  );

  return (
    <AppCtx.Provider value={value}>
      {children}
      <KioskIdle />
    </AppCtx.Provider>
  );
}

const IDLE_MS = 90_000;
const COUNTDOWN_S = 15;

function KioskIdle() {
  const { me, t, resetVisitor } = useApp();
  const [left, setLeft] = useState<number | null>(null);
  const lastActive = useRef(0);
  const kiosk = me?.kiosk === true;

  useEffect(() => {
    if (!kiosk) return;
    lastActive.current = Date.now();
    const bump = () => {
      lastActive.current = Date.now();
      setLeft(null);
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const timer = setInterval(() => {
      const idle = Date.now() - lastActive.current;
      if (idle >= IDLE_MS) {
        const remaining = COUNTDOWN_S - Math.floor((idle - IDLE_MS) / 1000);
        if (remaining <= 0) {
          clearInterval(timer);
          setLeft(null);
          resetVisitor();
        } else setLeft(remaining);
      }
    }, 500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(timer);
    };
  }, [kiosk, resetVisitor]);

  if (!kiosk || left === null) return null;
  return (
    <div role="alertdialog" aria-live="assertive" className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-6">
      <div className="card max-w-md p-8 text-center">
        <p className="text-xl font-semibold">{t("kiosk.idle", { s: left })}</p>
        <button
          className="btn btn-primary mt-6"
          onClick={() => {
            lastActive.current = Date.now();
            setLeft(null);
          }}
        >
          {t("kiosk.stay")}
        </button>
      </div>
    </div>
  );
}
