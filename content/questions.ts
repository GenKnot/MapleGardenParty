import "server-only";
import type { Locale } from "@/lib/locales";

type Text = { q: string; o: [string, string, string, string]; e: string };
export type Question = { id: number; answer: 0 | 1 | 2 | 3; t: Record<Locale, Text> };

export const QUESTIONS: Question[] = [
  {
    id: 1,
    answer: 0,
    t: {
      "zh-CN": { q: "春节最具代表性的传统颜色是什么？", o: ["红色", "白色", "黑色", "蓝色"], e: "春节要贴红对联、挂红灯笼、发红包。红色象征喜庆、驱邪与好运，这和“年兽怕红色”的民间传说有关。" },
      "zh-TW": { q: "春節最具代表性的傳統顏色是什麼？", o: ["紅色", "白色", "黑色", "藍色"], e: "春節要貼紅春聯、掛紅燈籠、發紅包。紅色象徵喜慶、驅邪與好運，這和「年獸怕紅色」的民間傳說有關。" },
      en: { q: "Which colour is most closely associated with Chinese New Year?", o: ["Red", "White", "Black", "Blue"], e: "Red couplets, lanterns and envelopes fill the festival. Red stands for joy, good luck and warding off evil, echoing the folk tale of the Nian beast who feared red." },
      "fr-CA": { q: "Quelle couleur est la plus associée au Nouvel An chinois?", o: ["Le rouge", "Le blanc", "Le noir", "Le bleu"], e: "Distiques, lanternes et enveloppes sont rouges. Cette couleur symbolise la joie, la chance et la protection, en écho à la légende de la bête Nian qui craignait le rouge." },
    },
  },
  {
    id: 2,
    answer: 1,
    t: {
      "zh-CN": { q: "中秋节人们常吃什么？", o: ["粽子", "月饼", "汤圆", "饺子"], e: "中秋夜月亮最圆，圆形的月饼象征团圆。家人围坐赏月、分食月饼，是延续千年的中秋习俗。" },
      "zh-TW": { q: "中秋節人們常吃什麼？", o: ["粽子", "月餅", "湯圓", "水餃"], e: "中秋夜月亮最圓，圓形的月餅象徵團圓。家人圍坐賞月、分食月餅，是延續千年的中秋習俗。" },
      en: { q: "What do people traditionally eat at the Mid-Autumn Festival?", o: ["Zongzi", "Mooncakes", "Tangyuan", "Dumplings"], e: "The moon is at its roundest on Mid-Autumn night, and round mooncakes stand for family reunion. Sharing them while moon-gazing is a centuries-old custom." },
      "fr-CA": { q: "Que mange-t-on traditionnellement à la fête de la Mi-Automne?", o: ["Des zongzi", "Des gâteaux de lune", "Des tangyuan", "Des raviolis"], e: "La lune est la plus ronde ce soir-là, et les gâteaux de lune ronds symbolisent les retrouvailles. On les partage en famille en admirant la lune." },
    },
  },
  {
    id: 3,
    answer: 2,
    t: {
      "zh-CN": { q: "端午节最有代表性的传统体育活动是什么？", o: ["放风筝", "踢毽子", "赛龙舟", "打陀螺"], e: "端午节赛龙舟，传说是为了纪念诗人屈原。如今龙舟比赛已成为国际赛事，蒙特利尔每年夏天也有龙舟节。" },
      "zh-TW": { q: "端午節最有代表性的傳統體育活動是什麼？", o: ["放風箏", "踢毽子", "划龍舟", "打陀螺"], e: "端午節划龍舟，傳說是為了紀念詩人屈原。如今龍舟競賽已成為國際賽事，蒙特婁每年夏天也有龍舟節。" },
      en: { q: "Which activity is most closely tied to the Dragon Boat Festival?", o: ["Kite flying", "Shuttlecock kicking", "Dragon boat racing", "Spinning tops"], e: "Dragon boat racing is said to commemorate the poet Qu Yuan. It is now an international sport, and Montreal hosts its own dragon boat festival every summer." },
      "fr-CA": { q: "Quelle activité est la plus liée à la fête des bateaux-dragons?", o: ["Le cerf-volant", "Le jeu du volant", "La course de bateaux-dragons", "La toupie"], e: "La course de bateaux-dragons rappelle, dit-on, le poète Qu Yuan. C'est aujourd'hui un sport international, et Montréal a son propre festival chaque été." },
    },
  },
  {
    id: 4,
    answer: 2,
    t: {
      "zh-CN": { q: "十二生肖中排在第一位的是哪种动物？", o: ["牛", "虎", "鼠", "兔"], e: "传说玉帝召集动物赴宴，鼠机灵地躲在牛背上，抢先一步跳下，成为生肖之首。" },
      "zh-TW": { q: "十二生肖中排在第一位的是哪種動物？", o: ["牛", "虎", "鼠", "兔"], e: "傳說玉帝召集動物赴宴，鼠機靈地躲在牛背上，搶先一步跳下，成為生肖之首。" },
      en: { q: "Which animal comes first in the Chinese zodiac?", o: ["Ox", "Tiger", "Rat", "Rabbit"], e: "Legend says the Jade Emperor held a race. The clever rat hitched a ride on the ox's back and leapt ahead at the finish, winning first place." },
      "fr-CA": { q: "Quel animal ouvre le zodiaque chinois?", o: ["Le bœuf", "Le tigre", "Le rat", "Le lapin"], e: "Selon la légende, l'Empereur de Jade organisa une course. Le rat, rusé, monta sur le dos du bœuf puis le devança juste avant l'arrivée." },
    },
  },
  {
    id: 5,
    answer: 0,
    t: {
      "zh-CN": { q: "十二生肖中，哪一种是传说中的神话生物？", o: ["龙", "虎", "蛇", "马"], e: "十二生肖里只有龙在现实中不存在。龙是中华文化的象征，代表吉祥、力量与权威，华人常称自己为“龙的传人”。" },
      "zh-TW": { q: "十二生肖中，哪一種是傳說中的神話生物？", o: ["龍", "虎", "蛇", "馬"], e: "十二生肖裡只有龍在現實中不存在。龍是中華文化的象徵，代表吉祥、力量與權威，華人常自稱「龍的傳人」。" },
      en: { q: "Which zodiac animal is a mythical creature?", o: ["Dragon", "Tiger", "Snake", "Horse"], e: "The dragon is the only zodiac animal that does not exist in nature. It stands for luck, power and authority, and Chinese people often call themselves its descendants." },
      "fr-CA": { q: "Quel animal du zodiaque est une créature mythique?", o: ["Le dragon", "Le tigre", "Le serpent", "Le cheval"], e: "Le dragon est le seul animal du zodiaque qui n'existe pas dans la nature. Il incarne la chance, la puissance et l'autorité dans la culture chinoise." },
    },
  },
  {
    id: 6,
    answer: 1,
    t: {
      "zh-CN": { q: "中国书法传统上使用的书写工具是什么？", o: ["钢笔", "毛笔", "铅笔", "粉笔"], e: "毛笔与墨、纸、砚合称“文房四宝”。笔锋柔软，力度和速度不同，写出的线条粗细浓淡就不同。" },
      "zh-TW": { q: "中國書法傳統上使用的書寫工具是什麼？", o: ["鋼筆", "毛筆", "鉛筆", "粉筆"], e: "毛筆與墨、紙、硯合稱「文房四寶」。筆鋒柔軟，力道和速度不同，寫出的線條粗細濃淡就不同。" },
      en: { q: "Which tool is traditionally used for Chinese calligraphy?", o: ["Fountain pen", "Brush", "Pencil", "Chalk"], e: "The brush, ink, paper and inkstone are known as the Four Treasures of the Study. A soft brush gives thick or thin strokes depending on pressure and speed." },
      "fr-CA": { q: "Quel outil utilise-t-on traditionnellement pour la calligraphie chinoise?", o: ["Le stylo-plume", "Le pinceau", "Le crayon", "La craie"], e: "Le pinceau, l'encre, le papier et la pierre à encre forment les « quatre trésors du lettré ». La souplesse du pinceau permet des traits épais ou fins." },
    },
  },
  {
    id: 7,
    answer: 3,
    t: {
      "zh-CN": { q: "下列哪一项属于中国古代“四大发明”？", o: ["瓷器", "丝绸", "茶叶", "造纸术"], e: "四大发明是造纸术、印刷术、火药和指南针。造纸术让知识更容易记录和传播，影响了整个世界。" },
      "zh-TW": { q: "下列哪一項屬於中國古代「四大發明」？", o: ["瓷器", "絲綢", "茶葉", "造紙術"], e: "四大發明是造紙術、印刷術、火藥和指南針。造紙術讓知識更容易記錄和傳播，影響了整個世界。" },
      en: { q: "Which of these is one of China's Four Great Inventions?", o: ["Porcelain", "Silk", "Tea", "Papermaking"], e: "The Four Great Inventions are papermaking, printing, gunpowder and the compass. Paper made knowledge easier to record and spread around the world." },
      "fr-CA": { q: "Laquelle de ces réponses fait partie des quatre grandes inventions chinoises?", o: ["La porcelaine", "La soie", "Le thé", "Le papier"], e: "Les quatre grandes inventions sont le papier, l'imprimerie, la poudre à canon et la boussole. Le papier a facilité la transmission du savoir dans le monde." },
    },
  },
  {
    id: 8,
    answer: 0,
    t: {
      "zh-CN": { q: "绿茶、红茶等传统茶饮来自哪种植物的叶子？", o: ["茶树", "竹子", "桑树", "荷花"], e: "绿茶、红茶、乌龙茶都来自同一种植物——茶树，区别在于采摘后的加工方式，如发酵程度不同。" },
      "zh-TW": { q: "綠茶、紅茶等傳統茶飲來自哪種植物的葉子？", o: ["茶樹", "竹子", "桑樹", "荷花"], e: "綠茶、紅茶、烏龍茶都來自同一種植物——茶樹，差別在於採摘後的加工方式，例如發酵程度不同。" },
      en: { q: "Green tea and black tea are made from the leaves of which plant?", o: ["The tea plant", "Bamboo", "Mulberry", "Lotus"], e: "Green, black and oolong teas all come from the same plant. The difference lies in how the leaves are processed after picking, such as how much they are oxidized." },
      "fr-CA": { q: "Les thés vert et noir proviennent des feuilles de quelle plante?", o: ["Le théier", "Le bambou", "Le mûrier", "Le lotus"], e: "Les thés vert, noir et oolong viennent tous du théier. Ils diffèrent par le traitement des feuilles après la cueillette, notamment l'oxydation." },
    },
  },
  {
    id: 9,
    answer: 2,
    t: {
      "zh-CN": { q: "元宵节最常见的传统活动是什么？", o: ["赛龙舟", "登高", "赏花灯", "扫墓"], e: "农历正月十五是元宵节，是春节后的第一个月圆之夜。人们挂灯笼、赏花灯、猜灯谜，还要吃汤圆。" },
      "zh-TW": { q: "元宵節最常見的傳統活動是什麼？", o: ["划龍舟", "登高", "賞花燈", "掃墓"], e: "農曆正月十五是元宵節，是春節後的第一個月圓之夜。人們掛燈籠、賞花燈、猜燈謎，還要吃湯圓。" },
      en: { q: "What is the most typical activity of the Lantern Festival?", o: ["Dragon boat racing", "Climbing mountains", "Admiring lanterns", "Visiting graves"], e: "The Lantern Festival falls on the 15th day of the first lunar month, the first full moon after the New Year. People hang lanterns, solve riddles and eat tangyuan." },
      "fr-CA": { q: "Quelle activité est la plus typique de la fête des Lanternes?", o: ["La course de bateaux-dragons", "L'ascension d'une montagne", "L'admiration des lanternes", "La visite des tombes"], e: "Elle a lieu le 15e jour du premier mois lunaire, première pleine lune de l'année. On accroche des lanternes, on résout des énigmes et on mange des tangyuan." },
    },
  },
  {
    id: 10,
    answer: 3,
    t: {
      "zh-CN": { q: "中国传统婚礼中常见的吉祥颜色是什么？", o: ["白色", "蓝色", "黑色", "红色"], e: "传统婚礼上，新人穿红衣、贴红双喜字、盖红盖头。红色代表喜庆、幸福与美满的生活。" },
      "zh-TW": { q: "中國傳統婚禮中常見的吉祥顏色是什麼？", o: ["白色", "藍色", "黑色", "紅色"], e: "傳統婚禮上，新人穿紅衣、貼紅雙喜字、蓋紅蓋頭。紅色代表喜慶、幸福與美滿的生活。" },
      en: { q: "Which colour is considered lucky at a traditional Chinese wedding?", o: ["White", "Blue", "Black", "Red"], e: "At traditional weddings the couple wears red and the double-happiness character is posted in red. Red stands for joy, happiness and a fulfilling married life." },
      "fr-CA": { q: "Quelle couleur porte bonheur lors d'un mariage chinois traditionnel?", o: ["Le blanc", "Le bleu", "Le noir", "Le rouge"], e: "Les mariés portent du rouge et le caractère du double bonheur est affiché en rouge. Cette couleur représente la joie, le bonheur et une vie comblée." },
    },
  },
  {
    id: 11,
    answer: 0,
    t: {
      "zh-CN": { q: "中国结主要象征什么？", o: ["吉祥与祝福", "速度与力量", "孤独与离别", "勇气与战争"], e: "中国结用一根绳编成，样式繁多，常挂在家中或作礼物。绳结的“结”与“吉”谐音，寄托平安吉祥的祝福。" },
      "zh-TW": { q: "中國結主要象徵什麼？", o: ["吉祥與祝福", "速度與力量", "孤獨與離別", "勇氣與戰爭"], e: "中國結用一條繩編成，樣式繁多，常掛在家中或當作禮物。繩結的「結」與「吉」諧音，寄託平安吉祥的祝福。" },
      en: { q: "What does a Chinese knot mainly symbolize?", o: ["Good fortune and blessings", "Speed and strength", "Loneliness and parting", "Courage and war"], e: "A Chinese knot is woven from a single cord in many designs. It is hung at home or given as a gift to express wishes for safety, luck and happiness." },
      "fr-CA": { q: "Que symbolise principalement un nœud chinois?", o: ["La bonne fortune et les vœux", "La vitesse et la force", "La solitude et la séparation", "Le courage et la guerre"], e: "Le nœud chinois est tressé à partir d'une seule corde. On l'accroche chez soi ou on l'offre pour souhaiter bonheur, sécurité et prospérité." },
    },
  },
  {
    id: 12,
    answer: 2,
    t: {
      "zh-CN": { q: "中国传统国画最典型的绘画材料是什么？", o: ["油彩", "蜡笔", "水墨", "丙烯"], e: "国画以毛笔蘸水墨，画在宣纸或绢上。墨色可以浓淡变化，所谓“墨分五色”，留白也是画面的一部分。" },
      "zh-TW": { q: "中國傳統國畫最典型的繪畫材料是什麼？", o: ["油彩", "蠟筆", "水墨", "壓克力"], e: "國畫以毛筆蘸水墨，畫在宣紙或絹上。墨色可以濃淡變化，所謂「墨分五色」，留白也是畫面的一部分。" },
      en: { q: "What is the most typical material of traditional Chinese painting?", o: ["Oil paint", "Crayon", "Ink and wash", "Acrylic"], e: "Painters use brush and ink on rice paper or silk. Ink can shift from deep to pale, and the empty space left on the paper is part of the picture." },
      "fr-CA": { q: "Quel est le matériau le plus typique de la peinture chinoise traditionnelle?", o: ["La peinture à l'huile", "Les crayons de cire", "L'encre et le lavis", "L'acrylique"], e: "On peint au pinceau avec de l'encre sur papier de riz ou sur soie. L'encre varie du plus foncé au plus pâle, et le vide fait partie de la composition." },
    },
  },
  {
    id: 13,
    answer: 1,
    t: {
      "zh-CN": { q: "竹子在中国传统文化中常象征什么？", o: ["懒散与逃避", "坚韧与气节", "贪婪与自私", "骄傲与炫耀"], e: "竹子四季常青、中空有节、遇风而不折，被视为君子的象征，代表坚韧、正直与谦虚。" },
      "zh-TW": { q: "竹子在中國傳統文化中常象徵什麼？", o: ["懶散與逃避", "堅韌與氣節", "貪婪與自私", "驕傲與炫耀"], e: "竹子四季常青、中空有節、遇風而不折，被視為君子的象徵，代表堅韌、正直與謙虛。" },
      en: { q: "What does bamboo often symbolize in traditional Chinese culture?", o: ["Laziness and escape", "Resilience and integrity", "Greed and selfishness", "Pride and showing off"], e: "Bamboo stays green all year, is hollow and jointed, and bends in the wind without breaking. It is seen as a gentleman's plant, standing for resilience and integrity." },
      "fr-CA": { q: "Que symbolise souvent le bambou dans la culture chinoise traditionnelle?", o: ["La paresse et la fuite", "La résilience et l'intégrité", "L'avidité et l'égoïsme", "L'orgueil et la vantardise"], e: "Le bambou reste vert toute l'année et plie sans rompre. Il est vu comme la plante du lettré vertueux, symbole de résilience, de droiture et d'humilité." },
    },
  },
  {
    id: 14,
    answer: 2,
    t: {
      "zh-CN": { q: "古筝属于哪一类乐器？", o: ["吹奏乐器", "打击乐器", "弹拨弦乐器", "拉弦乐器"], e: "古筝有几十根弦，演奏者用手指或指甲拨弦发声，左手按弦可以改变音高，音色清澈灵动。" },
      "zh-TW": { q: "古箏屬於哪一類樂器？", o: ["吹奏樂器", "打擊樂器", "彈撥弦樂器", "拉弦樂器"], e: "古箏有幾十根弦，演奏者用手指或指甲撥弦發聲，左手按弦可以改變音高，音色清澈靈動。" },
      en: { q: "What kind of instrument is the guzheng?", o: ["Wind", "Percussion", "Plucked string", "Bowed string"], e: "The guzheng has dozens of strings that the player plucks with fingers or picks. Pressing a string with the other hand bends the pitch, giving a clear, flowing tone." },
      "fr-CA": { q: "Quel type d'instrument est le guzheng?", o: ["À vent", "À percussion", "À cordes pincées", "À cordes frottées"], e: "Le guzheng compte des dizaines de cordes que l'on pince avec les doigts. La main gauche presse les cordes pour modifier la hauteur, d'où un son clair et fluide." },
    },
  },
  {
    id: 15,
    answer: 0,
    t: {
      "zh-CN": { q: "二胡通常用什么方式演奏？", o: ["用琴弓拉奏", "用手指弹拨", "用嘴吹气", "用鼓槌敲击"], e: "二胡只有两根弦，琴弓夹在两弦之间来回拉动发声。它的音色婉转，像人在低声诉说。" },
      "zh-TW": { q: "二胡通常用什麼方式演奏？", o: ["用琴弓拉奏", "用手指彈撥", "用嘴吹氣", "用鼓槌敲擊"], e: "二胡只有兩根弦，琴弓夾在兩弦之間來回拉動發聲。它的音色婉轉，像人在低聲訴說。" },
      en: { q: "How is the erhu usually played?", o: ["With a bow", "By plucking", "By blowing", "With drumsticks"], e: "The erhu has two strings, and its bow passes between them to make sound. Its tone is soft and expressive, often compared to a human voice." },
      "fr-CA": { q: "Comment joue-t-on habituellement de l'erhu?", o: ["Avec un archet", "En pinçant les cordes", "En soufflant", "Avec des baguettes"], e: "L'erhu n'a que deux cordes et son archet passe entre elles pour produire le son. Son timbre doux et expressif rappelle la voix humaine." },
    },
  },
  {
    id: 16,
    answer: 1,
    t: {
      "zh-CN": { q: "京剧演员在脸上绘制的彩色图案叫什么？", o: ["剪纸", "脸谱", "年画", "皮影"], e: "脸谱用颜色表现人物性格：红色代表忠勇，黑色代表刚直，白色代表奸诈。观众一眼就能认出角色。" },
      "zh-TW": { q: "京劇演員在臉上繪製的彩色圖案叫什麼？", o: ["剪紙", "臉譜", "年畫", "皮影"], e: "臉譜用顏色表現人物性格：紅色代表忠勇，黑色代表剛直，白色代表奸詐。觀眾一眼就能認出角色。" },
      en: { q: "What are the painted face designs of Peking opera performers called?", o: ["Paper cuttings", "Facial makeup (lianpu)", "New Year prints", "Shadow puppets"], e: "Colours show character: red for loyalty and courage, black for integrity, white for cunning. Audiences can recognise a role at a glance." },
      "fr-CA": { q: "Comment appelle-t-on les maquillages peints des acteurs de l'opéra de Pékin?", o: ["Les papiers découpés", "Les maquillages (lianpu)", "Les estampes du Nouvel An", "Les ombres chinoises"], e: "Les couleurs révèlent le caractère : rouge pour la loyauté et le courage, noir pour l'intégrité, blanc pour la ruse. Le public reconnaît le rôle d'un coup d'œil." },
    },
  },
  {
    id: 17,
    answer: 2,
    t: {
      "zh-CN": { q: "清明节传统上与哪些活动相关？", o: ["赛龙舟与吃粽子", "赏月与吃月饼", "祭祖与踏青", "贴春联与守岁"], e: "清明在春天，人们扫墓祭祖，缅怀先人，也趁着春光外出踏青、放风筝，既悼念也亲近自然。" },
      "zh-TW": { q: "清明節傳統上與哪些活動相關？", o: ["划龍舟與吃粽子", "賞月與吃月餅", "祭祖與踏青", "貼春聯與守歲"], e: "清明在春天，人們掃墓祭祖，緬懷先人，也趁著春光外出踏青、放風箏，既悼念也親近自然。" },
      en: { q: "Which activities are traditionally linked to Qingming?", o: ["Dragon boats and zongzi", "Moon-gazing and mooncakes", "Honouring ancestors and spring outings", "Couplets and staying up late"], e: "Qingming falls in spring. Families sweep tombs and remember their ancestors, then enjoy the season with walks in nature and kite flying." },
      "fr-CA": { q: "Quelles activités sont traditionnellement liées à Qingming?", o: ["Bateaux-dragons et zongzi", "Contemplation de la lune et gâteaux de lune", "Hommage aux ancêtres et sorties au printemps", "Distiques et veillée"], e: "Qingming a lieu au printemps. On nettoie les tombes pour honorer les ancêtres, puis on profite de la belle saison en se promenant et en faisant voler des cerfs-volants." },
    },
  },
  {
    id: 18,
    answer: 0,
    t: {
      "zh-CN": { q: "每个农历年对应几个生肖？", o: ["一个", "两个", "三个", "十二个"], e: "十二生肖按顺序轮流，每年对应一种动物，十二年一轮。比如2026年是马年，下一个马年是2038年。" },
      "zh-TW": { q: "每個農曆年對應幾個生肖？", o: ["一個", "兩個", "三個", "十二個"], e: "十二生肖按順序輪流，每年對應一種動物，十二年一輪。例如2026年是馬年，下一個馬年是2038年。" },
      en: { q: "How many zodiac animals correspond to each lunar year?", o: ["One", "Two", "Three", "Twelve"], e: "The twelve animals take turns, one per year, in a twelve-year cycle. For example, 2026 is the Year of the Horse and the next is 2038." },
      "fr-CA": { q: "Combien d'animaux du zodiaque correspondent à chaque année lunaire?", o: ["Un", "Deux", "Trois", "Douze"], e: "Les douze animaux se succèdent, un par année, selon un cycle de douze ans. Par exemple, 2026 est l'année du Cheval et la prochaine sera 2038." },
    },
  },
  {
    id: 19,
    answer: 3,
    t: {
      "zh-CN": { q: "“福”字通常表达什么祝愿？", o: ["学业进步", "旅途平安", "财源广进", "幸福与好运"], e: "“福”字寄托了人们对幸福、平安和好运的期盼。春节时常把它倒着贴，取“福到了”的谐音。" },
      "zh-TW": { q: "「福」字通常表達什麼祝願？", o: ["學業進步", "旅途平安", "財源廣進", "幸福與好運"], e: "「福」字寄託了人們對幸福、平安和好運的期盼。春節時常把它倒著貼，取「福到了」的諧音。" },
      en: { q: "What wish does the character 福 (fu) usually express?", o: ["Academic success", "A safe journey", "Great wealth", "Happiness and good fortune"], e: "The character 福 carries hopes for happiness, safety and good luck. At New Year it is often hung upside down, because “upside down” sounds like “arrived”." },
      "fr-CA": { q: "Quel souhait le caractère 福 (fu) exprime-t-il généralement?", o: ["La réussite scolaire", "Un bon voyage", "La richesse", "Le bonheur et la bonne fortune"], e: "Le caractère 福 porte les vœux de bonheur, de sécurité et de chance. Au Nouvel An, on l'affiche souvent à l'envers, car « renversé » sonne comme « arrivé »." },
    },
  },
  {
    id: 20,
    answer: 1,
    t: {
      "zh-CN": { q: "春联一般贴在什么地方？", o: ["窗户玻璃", "门框两侧", "屋顶瓦片", "院子地面"], e: "春联是成对的吉祥对句，写在红纸上，贴在大门两侧，上面常再加一幅横批，迎接新年。" },
      "zh-TW": { q: "春聯一般貼在什麼地方？", o: ["窗戶玻璃", "門框兩側", "屋頂瓦片", "院子地面"], e: "春聯是成對的吉祥對句，寫在紅紙上，貼在大門兩側，上方常再加一幅橫批，迎接新年。" },
      en: { q: "Where are spring couplets usually posted?", o: ["On window glass", "On both sides of the door", "On roof tiles", "On the courtyard floor"], e: "Spring couplets are pairs of auspicious lines written on red paper and posted on either side of the door, often with a horizontal banner above, to welcome the new year." },
      "fr-CA": { q: "Où affiche-t-on généralement les distiques de printemps?", o: ["Sur les vitres", "De chaque côté de la porte", "Sur les tuiles du toit", "Au sol dans la cour"], e: "Ces distiques de bon augure sont écrits sur du papier rouge et collés de part et d'autre de la porte, souvent avec une bannière horizontale au-dessus, pour accueillir la nouvelle année." },
    },
  },
];

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);
export const PASS_CORRECT = 5;
