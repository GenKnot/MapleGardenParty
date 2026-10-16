import "server-only";
import type { Locale } from "@/lib/locales";
import type { RoundQuestion } from "@/lib/server/rounds";

type InstrumentId = "guzheng" | "pipa" | "erhu" | "dizi" | "guqin" | "yangqin";

const NAMES: Record<InstrumentId, Record<Locale, string>> = {
  guzheng: { "zh-CN": "古筝", "zh-TW": "古箏", en: "Guzheng (zither)", "fr-CA": "Guzheng (cithare)" },
  pipa: { "zh-CN": "琵琶", "zh-TW": "琵琶", en: "Pipa (lute)", "fr-CA": "Pipa (luth)" },
  erhu: { "zh-CN": "二胡", "zh-TW": "二胡", en: "Erhu (two-string fiddle)", "fr-CA": "Erhu (vièle à deux cordes)" },
  dizi: { "zh-CN": "笛子", "zh-TW": "笛子", en: "Dizi (bamboo flute)", "fr-CA": "Dizi (flûte de bambou)" },
  guqin: { "zh-CN": "古琴", "zh-TW": "古琴", en: "Guqin (seven-string zither)", "fr-CA": "Guqin (cithare à sept cordes)" },
  yangqin: { "zh-CN": "扬琴", "zh-TW": "揚琴", en: "Yangqin (hammered dulcimer)", "fr-CA": "Yangqin (tympanon)" },
};

const PROMPT: Record<Locale, string> = {
  "zh-CN": "你听到的是哪件乐器？",
  "zh-TW": "你聽到的是哪件樂器？",
  en: "Which instrument do you hear?",
  "fr-CA": "Quel instrument entendez-vous?",
};

type Def = { id: InstrumentId; options: [InstrumentId, InstrumentId, InstrumentId, InstrumentId]; e: Record<Locale, string> };

// Each id maps to public/audio/<id>.mp3 (5–10 s clips; credits are listed on /credits).
const DEFS: Def[] = [
  {
    id: "guzheng",
    options: ["guzheng", "pipa", "dizi", "erhu"],
    e: {
      "zh-CN": "古筝有几十根弦，指尖拨弦，音色清澈流动，像流水。",
      "zh-TW": "古箏有幾十根弦，指尖撥弦，音色清澈流動，像流水。",
      en: "The guzheng has dozens of strings plucked by the fingertips. Its tone is clear and flowing, like water.",
      "fr-CA": "Le guzheng a des dizaines de cordes pincées du bout des doigts. Son timbre clair et fluide évoque l'eau qui coule.",
    },
  },
  {
    id: "pipa",
    options: ["erhu", "pipa", "guqin", "dizi"],
    e: {
      "zh-CN": "琵琶抱在怀中竖着弹奏，快速轮指能弹出像急雨一样的密集音符。",
      "zh-TW": "琵琶抱在懷中豎著彈奏，快速輪指能彈出像急雨一樣的密集音符。",
      en: "The pipa is held upright and plucked. Rapid finger rolls make notes patter like a sudden rain.",
      "fr-CA": "Le pipa se joue à la verticale, en pinçant les cordes. Les roulements rapides évoquent une averse soudaine.",
    },
  },
  {
    id: "erhu",
    options: ["dizi", "yangqin", "erhu", "pipa"],
    e: {
      "zh-CN": "二胡只有两根弦，用琴弓拉奏，音色婉转，像人在低声诉说。",
      "zh-TW": "二胡只有兩根弦，用琴弓拉奏，音色婉轉，像人在低聲訴說。",
      en: "The erhu has two strings and is played with a bow. Its tone is soft and expressive, like a voice.",
      "fr-CA": "L'erhu n'a que deux cordes et se joue à l'archet. Son timbre doux et expressif rappelle la voix humaine.",
    },
  },
  {
    id: "dizi",
    options: ["guzheng", "dizi", "yangqin", "guqin"],
    e: {
      "zh-CN": "笛子用竹子制成，吹出明亮悠扬的声音，常让人想到山野和鸟鸣。",
      "zh-TW": "笛子用竹子製成，吹出明亮悠揚的聲音，常讓人想到山野和鳥鳴。",
      en: "The dizi is made of bamboo. Its bright, lilting sound often brings to mind hills and birdsong.",
      "fr-CA": "Le dizi est fait de bambou. Son son clair et chantant évoque les collines et le chant des oiseaux.",
    },
  },
  {
    id: "guqin",
    options: ["yangqin", "erhu", "pipa", "guqin"],
    e: {
      "zh-CN": "古琴有七根弦，声音低沉安静，自古是文人修身养性的乐器。",
      "zh-TW": "古琴有七根弦，聲音低沉安靜，自古是文人修身養性的樂器。",
      en: "The guqin has seven strings and a deep, quiet voice. For centuries scholars played it for calm and reflection.",
      "fr-CA": "Le guqin a sept cordes et une voix grave et calme. Depuis des siècles, les lettrés en jouent pour s'apaiser et méditer.",
    },
  },
];

const LOCALES: Locale[] = ["zh-CN", "zh-TW", "en", "fr-CA"];

export const MUSIC: RoundQuestion[] = DEFS.map((d) => ({
  id: d.id,
  answer: d.options.indexOf(d.id),
  media: { audio: `/audio/${d.id}.mp3` },
  t: Object.fromEntries(
    LOCALES.map((l) => [l, { q: PROMPT[l], o: d.options.map((o) => NAMES[o][l]), e: d.e[l] }]),
  ) as RoundQuestion["t"],
}));

export const MUSIC_GOAL = 3;
