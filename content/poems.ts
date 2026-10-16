import "server-only";
import type { Locale } from "@/lib/locales";

export type VerseId = "moon" | "willow" | "lotus" | "sun";
export type PaintingId = "moon" | "willow" | "lotus";

type Verse = { zh: string; tw: string; gloss: Record<"en" | "fr-CA", string>; poet: Record<Locale, string> };

export const VERSES: Record<VerseId, Verse> = {
  moon: {
    zh: "峨眉山月半轮秋，影入平羌江水流。",
    tw: "峨眉山月半輪秋，影入平羌江水流。",
    gloss: {
      en: "The half-moon of autumn hangs over Mount Emei; its glow falls into the river and flows along.",
      "fr-CA": "La demi-lune d'automne pend au-dessus du mont Emei; son reflet tombe dans la rivière et s'écoule.",
    },
    poet: { "zh-CN": "李白《峨眉山月歌》", "zh-TW": "李白〈峨眉山月歌〉", en: "Li Bai", "fr-CA": "Li Bai" },
  },
  willow: {
    zh: "碧玉妆成一树高，万条垂下绿丝绦。",
    tw: "碧玉妝成一樹高，萬條垂下綠絲絛。",
    gloss: {
      en: "A tall tree dressed in jade green; ten thousand branches hang like green silk ribbons.",
      "fr-CA": "Un grand arbre vêtu de jade; dix mille branches pendent comme des rubans de soie verte.",
    },
    poet: { "zh-CN": "贺知章《咏柳》", "zh-TW": "賀知章〈詠柳〉", en: "He Zhizhang", "fr-CA": "He Zhizhang" },
  },
  lotus: {
    zh: "接天莲叶无穷碧，映日荷花别样红。",
    tw: "接天蓮葉無窮碧，映日荷花別樣紅。",
    gloss: {
      en: "Lotus leaves reach the sky in endless green; flowers in the sun glow a rare red.",
      "fr-CA": "Les feuilles de lotus montent vers le ciel en un vert sans fin; au soleil, les fleurs rougeoient d'un éclat rare.",
    },
    poet: { "zh-CN": "杨万里《晓出净慈寺送林子方》", "zh-TW": "楊萬里〈曉出淨慈寺送林子方〉", en: "Yang Wanli", "fr-CA": "Yang Wanli" },
  },
  sun: {
    zh: "白日依山尽，黄河入海流。",
    tw: "白日依山盡，黃河入海流。",
    gloss: {
      en: "The white sun sinks behind the mountains; the Yellow River flows on into the sea.",
      "fr-CA": "Le soleil blanc disparaît derrière les montagnes; le fleuve Jaune coule vers la mer.",
    },
    poet: { "zh-CN": "王之涣《登鹳雀楼》", "zh-TW": "王之渙〈登鸛雀樓〉", en: "Wang Zhihuan", "fr-CA": "Wang Zhihuan" },
  },
};

type PaintingText = { title: string; hint: string; explain: string };

export const PAINTINGS: { id: PaintingId; answer: VerseId; file: string; t: Record<Locale, PaintingText> }[] = [
  {
    id: "moon",
    answer: "moon",
    file: "/paintings/moon.jpg",
    t: {
      "zh-CN": { title: "山月", hint: "看看天上：是半轮月，不是太阳。", explain: "画里远山、半轮月和江水，正对应“半轮秋”和“江水流”，是秋夜的静谧。" },
      "zh-TW": { title: "山月", hint: "看看天上：是半輪月，不是太陽。", explain: "畫裡遠山、半輪月和江水，正對應「半輪秋」和「江水流」，是秋夜的靜謐。" },
      en: { title: "Mountain Moon", hint: "Look at the sky: a half moon, not the sun.", explain: "Distant peaks, a half moon and flowing water match “half-moon of autumn” and “the river flows”: a quiet autumn night." },
      "fr-CA": { title: "Lune sur la montagne", hint: "Regardez le ciel : une demi-lune, pas le soleil.", explain: "Les sommets lointains, la demi-lune et l'eau qui coule évoquent « la demi-lune d'automne » : une nuit d'automne paisible." },
    },
  },
  {
    id: "willow",
    answer: "willow",
    file: "/paintings/willow.jpg",
    t: {
      "zh-CN": { title: "春柳", hint: "看看树：枝条像丝带一样垂下来。", explain: "细长柔软的枝条垂向水面，就是“万条垂下绿丝绦”，带着早春的清新。" },
      "zh-TW": { title: "春柳", hint: "看看樹：枝條像絲帶一樣垂下來。", explain: "細長柔軟的枝條垂向水面，就是「萬條垂下綠絲絛」，帶著早春的清新。" },
      en: { title: "Spring Willow", hint: "Look at the tree: its branches hang like ribbons.", explain: "Slender branches trailing toward the water are the “ten thousand green silk ribbons”, fresh with early spring." },
      "fr-CA": { title: "Saule de printemps", hint: "Regardez l'arbre : ses branches pendent comme des rubans.", explain: "Les branches fines qui frôlent l'eau sont les « dix mille rubans de soie verte », la fraîcheur du début du printemps." },
    },
  },
  {
    id: "lotus",
    answer: "lotus",
    file: "/paintings/lotus.jpg",
    t: {
      "zh-CN": { title: "荷塘", hint: "看看水面：大片圆圆的叶子和一朵红花。", explain: "满池的绿叶仿佛连到天边，一朵红荷在阳光下格外醒目，正是“别样红”。" },
      "zh-TW": { title: "荷塘", hint: "看看水面：大片圓圓的葉子和一朵紅花。", explain: "滿池的綠葉彷彿連到天邊，一朵紅荷在陽光下格外醒目，正是「別樣紅」。" },
      en: { title: "Lotus Pond", hint: "Look at the water: big round leaves and one red flower.", explain: "Green leaves seem to reach the horizon while one red lotus glows in the sun: the “rare red”." },
      "fr-CA": { title: "Étang aux lotus", hint: "Regardez l'eau : de grandes feuilles rondes et une fleur rouge.", explain: "Les feuilles vertes semblent atteindre l'horizon, et une fleur rouge éclate au soleil : le « rouge rare »." },
    },
  },
];

export const OPTION_ORDER: VerseId[] = ["moon", "willow", "lotus", "sun"];
export const POETRY_GOAL = PAINTINGS.length;
export const MAX_ATTEMPTS = 2;

export function verseText(id: VerseId, locale: Locale) {
  const v = VERSES[id];
  return {
    id,
    verse: locale === "zh-TW" ? v.tw : v.zh,
    gloss: locale === "en" || locale === "fr-CA" ? v.gloss[locale] : null,
    poet: v.poet[locale],
  };
}
