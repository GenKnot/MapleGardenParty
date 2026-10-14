import { detectLocale } from "./index";
import { isLocale, type Locale } from "@/lib/locales";

const KEY = "fh_locale";
const SERVER_DEFAULT: Locale = "zh-CN";

let current: Locale = SERVER_DEFAULT;
let initialized = false;
const listeners = new Set<() => void>();

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {}
  current = isLocale(stored) ? stored : detectLocale();
}

function emit() {
  listeners.forEach((f) => f());
}

// Used with useSyncExternalStore: hydration renders getServerSnapshot, then React
// re-renders with getSnapshot, so the tree never mismatches the server HTML.
export const localeStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  getSnapshot(): Locale {
    init();
    return current;
  },
  getServerSnapshot(): Locale {
    return SERVER_DEFAULT;
  },
  set(l: Locale) {
    init();
    current = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    emit();
  },
  reset() {
    initialized = true;
    current = SERVER_DEFAULT;
    try {
      localStorage.removeItem(KEY);
    } catch {}
    emit();
  },
};
