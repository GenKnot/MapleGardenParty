"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { BottomNav } from "@/components/BottomNav";
import { LangSwitch } from "@/components/LangSwitch";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, me, t, resetVisitor } = useApp();
  const router = useRouter();

  const wasKiosk = useRef(false);
  useEffect(() => {
    if (me) wasKiosk.current = me.kiosk;
    else if (ready) router.replace(wasKiosk.current ? "/kiosk" : "/");
  }, [ready, me, router]);

  if (!ready || !me) {
    return <p className="grid min-h-dvh place-items-center text-muted">{t("common.loading")}</p>;
  }

  return (
    <>
      <div className="mx-auto min-h-dvh max-w-3xl px-4 pb-28 pt-4">
        <header className="mb-4 flex items-center justify-between gap-3">
          <span className="font-serif text-lg font-bold tracking-[0.15em] text-ink">{t("brand.name")}</span>
          <div className="flex items-center gap-2">
            <LangSwitch compact />
            {me.kiosk && (
              <button onClick={resetVisitor} className="btn btn-ghost min-h-11 px-4 text-sm">
                {t("kiosk.next")}
              </button>
            )}
          </div>
        </header>
        {children}
      </div>
      <BottomNav />
    </>
  );
}
