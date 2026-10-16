import "server-only";
import type { Locale } from "@/lib/locales";
import type { RoundQuestion } from "@/lib/server/rounds";

type FestivalId = "spring" | "lantern" | "qingming" | "dragon" | "midautumn" | "doubleninth";

const NAMES: Record<FestivalId, Record<Locale, string>> = {
  spring: { "zh-CN": "春节", "zh-TW": "春節", en: "Spring Festival (Chinese New Year)", "fr-CA": "Fête du Printemps (Nouvel An chinois)" },
  lantern: { "zh-CN": "元宵节", "zh-TW": "元宵節", en: "Lantern Festival", "fr-CA": "Fête des Lanternes" },
  qingming: { "zh-CN": "清明节", "zh-TW": "清明節", en: "Qingming (Tomb-Sweeping Day)", "fr-CA": "Fête de Qingming" },
  dragon: { "zh-CN": "端午节", "zh-TW": "端午節", en: "Dragon Boat Festival", "fr-CA": "Fête des bateaux-dragons" },
  midautumn: { "zh-CN": "中秋节", "zh-TW": "中秋節", en: "Mid-Autumn Festival", "fr-CA": "Fête de la Mi-Automne" },
  doubleninth: { "zh-CN": "重阳节", "zh-TW": "重陽節", en: "Double Ninth Festival", "fr-CA": "Fête du Double Neuf" },
};

const PROMPT: Record<Locale, string> = {
  "zh-CN": "这些图案指的是哪个节日？",
  "zh-TW": "這些圖案指的是哪個節日？",
  en: "Which festival do these pictures point to?",
  "fr-CA": "À quelle fête ces images font-elles penser?",
};

type Def = {
  id: FestivalId;
  emoji: string;
  options: [FestivalId, FestivalId, FestivalId, FestivalId];
  e: Record<Locale, string>;
};

// `emoji` is a placeholder; if public/riddles/<id>.png exists the app shows it instead.
const DEFS: Def[] = [
  {
    id: "midautumn",
    emoji: "🌕🥮",
    options: ["dragon", "midautumn", "lantern", "qingming"],
    e: {
      "zh-CN": "农历八月十五，月亮最圆，人们赏月、吃月饼，盼望家人团圆。",
      "zh-TW": "農曆八月十五，月亮最圓，人們賞月、吃月餅，盼望家人團圓。",
      en: "On the 15th of the eighth lunar month the moon is roundest. People admire it and share mooncakes, wishing for family reunion.",
      "fr-CA": "Le 15e jour du huitième mois lunaire, la lune est la plus ronde. On l'admire en partageant des gâteaux de lune, en rêvant de retrouvailles.",
    },
  },
  {
    id: "dragon",
    emoji: "🐉🚣",
    options: ["spring", "qingming", "dragon", "doubleninth"],
    e: {
      "zh-CN": "农历五月初五，人们赛龙舟、吃粽子，纪念诗人屈原。",
      "zh-TW": "農曆五月初五，人們划龍舟、吃粽子，紀念詩人屈原。",
      en: "On the 5th of the fifth lunar month people race dragon boats and eat zongzi, remembering the poet Qu Yuan.",
      "fr-CA": "Le 5e jour du cinquième mois lunaire, on fait des courses de bateaux-dragons et on mange des zongzi, en souvenir du poète Qu Yuan.",
    },
  },
  {
    id: "lantern",
    emoji: "🏮✨",
    options: ["midautumn", "qingming", "lantern", "dragon"],
    e: {
      "zh-CN": "农历正月十五，家家户户挂灯笼、赏花灯、猜灯谜，还要吃汤圆。",
      "zh-TW": "農曆正月十五，家家戶戶掛燈籠、賞花燈、猜燈謎，還要吃湯圓。",
      en: "On the 15th of the first lunar month, lanterns are hung, riddles are solved and tangyuan are eaten.",
      "fr-CA": "Le 15e jour du premier mois lunaire, on accroche des lanternes, on résout des énigmes et on mange des tangyuan.",
    },
  },
  {
    id: "spring",
    emoji: "🧧🧨",
    options: ["midautumn", "spring", "qingming", "doubleninth"],
    e: {
      "zh-CN": "春节是农历新年，要贴春联、放鞭炮、发红包，一家人团聚过年。",
      "zh-TW": "春節是農曆新年，要貼春聯、放鞭炮、發紅包，一家人團聚過年。",
      en: "Spring Festival is the lunar new year: couplets go up, firecrackers pop and red envelopes are given as families reunite.",
      "fr-CA": "La Fête du Printemps est le Nouvel An lunaire : on affiche des distiques, on tire des pétards et on offre des enveloppes rouges en famille.",
    },
  },
  {
    id: "qingming",
    emoji: "🌧️🌿🪁",
    options: ["spring", "dragon", "midautumn", "qingming"],
    e: {
      "zh-CN": "清明在春天，细雨绿草之间，人们祭祖扫墓，也外出踏青、放风筝。",
      "zh-TW": "清明在春天，細雨綠草之間，人們祭祖掃墓，也外出踏青、放風箏。",
      en: "Qingming falls in spring. Among light rain and fresh grass, people honour ancestors, then enjoy outings and kite flying.",
      "fr-CA": "Qingming a lieu au printemps. Sous la pluie fine et l'herbe tendre, on honore les ancêtres, puis on se promène et on fait voler des cerfs-volants.",
    },
  },
  {
    id: "doubleninth",
    emoji: "🏔️🌼",
    options: ["doubleninth", "lantern", "spring", "dragon"],
    e: {
      "zh-CN": "农历九月初九是重阳节，人们登高望远、赏菊，也是敬老的日子。",
      "zh-TW": "農曆九月初九是重陽節，人們登高望遠、賞菊，也是敬老的日子。",
      en: "The 9th of the ninth lunar month is the Double Ninth Festival: people climb hills, admire chrysanthemums and honour the elderly.",
      "fr-CA": "Le 9e jour du neuvième mois lunaire est la Fête du Double Neuf : on gravit les collines, on admire les chrysanthèmes et on honore les aînés.",
    },
  },
];

const LOCALES: Locale[] = ["zh-CN", "zh-TW", "en", "fr-CA"];

export const RIDDLES: RoundQuestion[] = DEFS.map((d) => ({
  id: d.id,
  answer: d.options.indexOf(d.id),
  media: { emoji: d.emoji, image: `/riddles/${d.id}.png` },
  t: Object.fromEntries(
    LOCALES.map((l) => [l, { q: PROMPT[l], o: d.options.map((o) => NAMES[o][l]), e: d.e[l] }]),
  ) as RoundQuestion["t"],
}));

export const RIDDLES_GOAL = 3;
