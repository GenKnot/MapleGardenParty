import "server-only";
import type { Locale } from "@/lib/locales";

type Note = { title: string; note: string };

// To use dedicated artwork, drop images in public/puzzle/ and change `file` and `aspect` (width / height).
export const PUZZLES: { id: string; file: string; aspect: string; t: Record<Locale, Note> }[] = [
  {
    id: "moon",
    file: "/paintings/moon.jpg",
    aspect: "5 / 6",
    t: {
      "zh-CN": { title: "山月", note: "李白离开家乡远行时写下“峨眉山月半轮秋”，半轮秋月一路相随，寄托着对故乡与友人的思念。" },
      "zh-TW": { title: "山月", note: "李白離開家鄉遠行時寫下「峨眉山月半輪秋」，半輪秋月一路相隨，寄託著對故鄉與友人的思念。" },
      en: { title: "Mountain Moon", note: "Li Bai wrote “the half-moon of autumn over Mount Emei” as he left home. The moon travels with him, carrying thoughts of home and friends." },
      "fr-CA": { title: "Lune sur la montagne", note: "Li Bai écrivit « la demi-lune d'automne sur le mont Emei » en quittant son pays. La lune l'accompagne, porteuse de nostalgie pour les siens." },
    },
  },
  {
    id: "willow",
    file: "/paintings/willow.jpg",
    aspect: "5 / 6",
    t: {
      "zh-CN": { title: "春柳", note: "贺知章把柳树比作“碧玉”装扮的美人，把垂下的枝条比作绿丝带，写出了早春的生机。" },
      "zh-TW": { title: "春柳", note: "賀知章把柳樹比作「碧玉」裝扮的美人，把垂下的枝條比作綠絲帶，寫出了早春的生機。" },
      en: { title: "Spring Willow", note: "He Zhizhang pictures the willow as a beauty dressed in jade and its hanging branches as green ribbons, capturing the energy of early spring." },
      "fr-CA": { title: "Saule de printemps", note: "He Zhizhang voit le saule comme une beauté parée de jade, ses branches pendantes comme des rubans verts : l'élan du début du printemps." },
    },
  },
  {
    id: "lotus",
    file: "/paintings/lotus.jpg",
    aspect: "5 / 6",
    t: {
      "zh-CN": { title: "荷塘", note: "杨万里在西湖边送别友人，写下荷叶无穷碧、荷花别样红的盛夏景象，色彩明艳。" },
      "zh-TW": { title: "荷塘", note: "楊萬里在西湖邊送別友人，寫下荷葉無窮碧、荷花別樣紅的盛夏景象，色彩明豔。" },
      en: { title: "Lotus Pond", note: "Yang Wanli, bidding a friend farewell by West Lake, painted high summer in words: endless green leaves and flowers glowing a rare red." },
      "fr-CA": { title: "Étang aux lotus", note: "Yang Wanli, disant adieu à un ami au bord du lac de l'Ouest, a peint le plein été : feuilles d'un vert sans fin et fleurs d'un rouge rare." },
    },
  },
];

export const TILES = 9;
