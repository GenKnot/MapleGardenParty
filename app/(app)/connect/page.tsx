"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";

const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export default function Connect() {
  const { me, t, locale } = useApp();
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", wechat: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error" | "invalid">("idle");

  if (!me) return null;

  if (me.kiosk) {
    return (
      <div className="card mt-4 p-6 text-center">
        <h1 className="font-serif text-2xl font-bold">{t("connect.title")}</h1>
        <p className="mt-3">{t("kiosk.private")}</p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const hasContact = f.email.trim() || f.wechat.trim() || f.phone.trim();
    if (!hasContact || !consent) return setStatus("invalid");
    setStatus("busy");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY,
          subject: "枫华雅集 · 后续活动通知意向",
          from_name: "枫华雅集",
          name: f.name.trim(),
          email: f.email.trim(),
          wechat: f.wechat.trim(),
          phone: f.phone.trim(),
          consent: "yes (unchecked by default, ticked by visitor)",
          locale,
          botcheck: "",
        }),
      });
      const j = await r.json();
      if (!j.success) throw new Error();
      setF({ name: "", email: "", wechat: "", phone: "" });
      setConsent(false);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const field = "mt-1 w-full min-h-12 rounded-xl border border-gold bg-white px-4 text-lg outline-none focus:border-cinnabar";

  return (
    <div className="rise">
      <h1 className="font-serif text-2xl font-bold">{t("connect.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("connect.intro")}</p>

      {!KEY ? (
        <p className="card mt-4 p-5 text-muted">{t("connect.unavailable")}</p>
      ) : status === "done" ? (
        <section className="card mt-4 p-6 text-center">
          <p className="font-serif text-xl font-bold text-cinnabar">{t("connect.thanks")}</p>
          <button className="btn btn-primary mt-4" onClick={() => router.push("/explore")}>
            {t("nav.explore")}
          </button>
        </section>
      ) : (
        <form onSubmit={submit} className="card mt-4 space-y-4 p-5">
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
          <label className="block">
            {t("connect.name")}
            <input className={field} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={60} autoComplete="off" />
          </label>
          <label className="block">
            {t("connect.email")}
            <input type="email" inputMode="email" className={field} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} maxLength={120} autoComplete="off" />
          </label>
          <label className="block">
            {t("connect.wechat")}
            <input className={field} value={f.wechat} onChange={(e) => setF({ ...f, wechat: e.target.value })} maxLength={60} autoComplete="off" />
          </label>
          <label className="block">
            {t("connect.phone")}
            <input type="tel" inputMode="tel" className={field} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} maxLength={30} autoComplete="off" />
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-[#a83c32]"
            />
            <span className="text-sm">{t("connect.consent")}</span>
          </label>

          {(status === "invalid" || status === "error") && (
            <p role="alert" className="text-sm text-cinnabar">
              {status === "invalid" ? t("connect.needOne") : t("connect.error")}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={status === "busy"} className="btn btn-primary flex-1">
              {status === "busy" ? t("common.loading") : t("connect.submit")}
            </button>
            <button type="button" onClick={() => router.push("/explore")} className="btn btn-ghost flex-1">
              {t("connect.skip")}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted">{t("connect.privacy")}</p>
        </form>
      )}
    </div>
  );
}
