import "server-only";
import type { Locale } from "@/lib/locales";

export const CALLI_CHARS = ["福", "和", "家", "春"] as const;
export type CalliChar = (typeof CALLI_CHARS)[number];
export const CALLI_GOAL = 2;

type Alt = { q: string; o: [string, string, string] };

// answer index is the position of the correct meaning inside `o`
export const CALLI: Record<CalliChar, { answer: 0 | 1 | 2; t: Record<Locale, Alt> }> = {
  福: {
    answer: 0,
    t: {
      "zh-CN": { q: "“福”字最常表达什么？", o: ["幸福与好运", "速度与力量", "离别与思念"] },
      "zh-TW": { q: "「福」字最常表達什麼？", o: ["幸福與好運", "速度與力量", "離別與思念"] },
      en: { q: "What does 福 most often express?", o: ["Happiness and good luck", "Speed and strength", "Parting and longing"] },
      "fr-CA": { q: "Qu'exprime le plus souvent 福 ?", o: ["Le bonheur et la chance", "La vitesse et la force", "La séparation et la nostalgie"] },
    },
  },
  和: {
    answer: 1,
    t: {
      "zh-CN": { q: "“和”字最接近哪个意思？", o: ["战争与争斗", "和平与和谐", "金钱与财富"] },
      "zh-TW": { q: "「和」字最接近哪個意思？", o: ["戰爭與爭鬥", "和平與和諧", "金錢與財富"] },
      en: { q: "Which meaning is closest to 和?", o: ["War and conflict", "Peace and harmony", "Money and wealth"] },
      "fr-CA": { q: "Quel sens est le plus proche de 和 ?", o: ["La guerre et le conflit", "La paix et l'harmonie", "L'argent et la richesse"] },
    },
  },
  家: {
    answer: 2,
    t: {
      "zh-CN": { q: "“家”字最接近哪个意思？", o: ["旅行与远方", "工作与学习", "家庭与归属"] },
      "zh-TW": { q: "「家」字最接近哪個意思？", o: ["旅行與遠方", "工作與學習", "家庭與歸屬"] },
      en: { q: "Which meaning is closest to 家?", o: ["Travel and distance", "Work and study", "Family and belonging"] },
      "fr-CA": { q: "Quel sens est le plus proche de 家 ?", o: ["Le voyage et l'éloignement", "Le travail et les études", "La famille et l'appartenance"] },
    },
  },
  春: {
    answer: 0,
    t: {
      "zh-CN": { q: "“春”字最接近哪个意思？", o: ["春天与新生", "秋天与收获", "冬天与寒冷"] },
      "zh-TW": { q: "「春」字最接近哪個意思？", o: ["春天與新生", "秋天與收穫", "冬天與寒冷"] },
      en: { q: "Which meaning is closest to 春?", o: ["Spring and renewal", "Autumn and harvest", "Winter and cold"] },
      "fr-CA": { q: "Quel sens est le plus proche de 春 ?", o: ["Le printemps et le renouveau", "L'automne et les récoltes", "L'hiver et le froid"] },
    },
  },
};

export function isCalliChar(v: unknown): v is CalliChar {
  return typeof v === "string" && (CALLI_CHARS as readonly string[]).includes(v);
}
