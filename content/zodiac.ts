import type { Locale } from "@/lib/locales";

type Entry = { name: string; fact: string };

export const ZODIAC: Record<Locale, Entry[]> = {
  "zh-CN": [
    { name: "鼠", fact: "机灵敏捷，排在生肖之首，象征智慧与新的开始。" },
    { name: "牛", fact: "勤恳踏实，是农耕文化的重要伙伴，象征勤劳与坚持。" },
    { name: "虎", fact: "威猛勇敢，被称为“百兽之王”，象征力量与正气。" },
    { name: "兔", fact: "温和敏捷，月宫里有玉兔捣药的传说，象征平和与吉祥。" },
    { name: "龙", fact: "唯一的神话生物，象征吉祥、尊贵与进取。" },
    { name: "蛇", fact: "灵活沉静，又称“小龙”，象征智慧与神秘。" },
    { name: "马", fact: "奔跑迅疾，是自由与奋进的象征，常用“马到成功”祝福。" },
    { name: "羊", fact: "温顺善良，“羊”与“祥”相通，象征吉祥与和睦。" },
    { name: "猴", fact: "聪明灵巧，《西游记》中的孙悟空家喻户晓，象征机智。" },
    { name: "鸡", fact: "报晓守时，“鸡”与“吉”谐音，象征守信与吉祥。" },
    { name: "狗", fact: "忠诚可靠，是人类最亲近的朋友，象征忠诚与守护。" },
    { name: "猪", fact: "憨厚福气，象征富足与团圆，是家的丰收象征。" },
  ],
  "zh-TW": [
    { name: "鼠", fact: "機靈敏捷，排在生肖之首，象徵智慧與新的開始。" },
    { name: "牛", fact: "勤懇踏實，是農耕文化的重要夥伴，象徵勤勞與堅持。" },
    { name: "虎", fact: "威猛勇敢，被稱為「百獸之王」，象徵力量與正氣。" },
    { name: "兔", fact: "溫和敏捷，月宮裡有玉兔搗藥的傳說，象徵平和與吉祥。" },
    { name: "龍", fact: "唯一的神話生物，象徵吉祥、尊貴與進取。" },
    { name: "蛇", fact: "靈活沉靜，又稱「小龍」，象徵智慧與神祕。" },
    { name: "馬", fact: "奔跑迅疾，是自由與奮進的象徵，常用「馬到成功」祝福。" },
    { name: "羊", fact: "溫順善良，「羊」與「祥」相通，象徵吉祥與和睦。" },
    { name: "猴", fact: "聰明靈巧，《西遊記》中的孫悟空家喻戶曉，象徵機智。" },
    { name: "雞", fact: "報曉守時，「雞」與「吉」諧音，象徵守信與吉祥。" },
    { name: "狗", fact: "忠誠可靠，是人類最親近的朋友，象徵忠誠與守護。" },
    { name: "豬", fact: "憨厚福氣，象徵富足與團圓，是家的豐收象徵。" },
  ],
  en: [
    { name: "Rat", fact: "Quick-witted and first in the cycle, it stands for cleverness and fresh starts." },
    { name: "Ox", fact: "Diligent and dependable, a partner in farming life. It stands for hard work and perseverance." },
    { name: "Tiger", fact: "Brave and powerful, called the king of beasts. It stands for strength and righteousness." },
    { name: "Rabbit", fact: "Gentle and quick. A jade rabbit is said to live on the moon, symbolizing peace and luck." },
    { name: "Dragon", fact: "The only mythical animal of the twelve. It stands for good fortune, dignity and ambition." },
    { name: "Snake", fact: "Supple and calm, nicknamed the little dragon. It stands for wisdom and mystery." },
    { name: "Horse", fact: "Fast and free, a symbol of drive. People wish “success upon arrival” with horse imagery." },
    { name: "Goat", fact: "Gentle and kind. The character for goat is linked to auspiciousness and harmony." },
    { name: "Monkey", fact: "Clever and agile, like Sun Wukong of Journey to the West. It stands for wit." },
    { name: "Rooster", fact: "Heralds the dawn on time. Its name sounds like “lucky”, standing for reliability." },
    { name: "Dog", fact: "Loyal and dependable, humanity's closest friend. It stands for faithfulness and protection." },
    { name: "Pig", fact: "Easygoing and fortunate, standing for abundance and family gatherings." },
  ],
  "fr-CA": [
    { name: "Rat", fact: "Vif et premier du cycle, il symbolise l'ingéniosité et les nouveaux départs." },
    { name: "Bœuf", fact: "Travailleur et fiable, compagnon de la vie agricole. Il symbolise la persévérance." },
    { name: "Tigre", fact: "Courageux et puissant, roi des animaux. Il symbolise la force et la droiture." },
    { name: "Lapin", fact: "Doux et agile. On dit qu'un lapin de jade vit sur la lune : paix et bonne fortune." },
    { name: "Dragon", fact: "Le seul animal mythique des douze. Il symbolise la chance, la dignité et l'ambition." },
    { name: "Serpent", fact: "Souple et calme, surnommé le petit dragon. Il symbolise la sagesse et le mystère." },
    { name: "Cheval", fact: "Rapide et libre, symbole d'élan. On souhaite la réussite avec l'image du cheval." },
    { name: "Chèvre", fact: "Douce et bienveillante, associée à la bonne fortune et à l'harmonie." },
    { name: "Singe", fact: "Malin et agile, comme Sun Wukong dans La Pérégrination vers l'Ouest. Il symbolise l'esprit vif." },
    { name: "Coq", fact: "Annonce l'aube à l'heure. Son nom évoque le mot « chanceux » : fiabilité." },
    { name: "Chien", fact: "Loyal et fidèle, meilleur ami de l'humain. Il symbolise la fidélité et la protection." },
    { name: "Cochon", fact: "Bon vivant et chanceux, symbole d'abondance et de réunion familiale." },
  ],
};

export const ZODIAC_MIN_YEAR = 1920;
export const ZODIAC_MAX_YEAR = 2026;

export function zodiacIndex(year: number): number {
  return (((year - 4) % 12) + 12) % 12;
}
