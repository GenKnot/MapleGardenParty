import type { GameId } from "./games";

export const CARD_W = 1080;
export const CARD_H = 1440;

const SERIF = '"Songti SC","Songti TC","Noto Serif CJK SC","Noto Serif SC","Source Han Serif SC","STSong","Iowan Old Style",Georgia,serif';
const C = { paper: "#faf7f0", cream: "#f4eee5", cinnabar: "#a83c32", gold: "#c6a477", goldDeep: "#9a7a4c", ink: "#292620", muted: "#766d61" };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image " + src));
    img.src = src;
  });
}

function newCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  return { canvas, ctx: canvas.getContext("2d")! };
}

function tokens(text: string): string[] {
  return text.match(/[⺀-鿿＀-￯　-〿]|[^\s⺀-鿿＀-￯　-〿]+|\s+/g) ?? [];
}

function charWrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const tk of tokens(text)) {
    const test = line + tk;
    if (ctx.measureText(test).width > maxWidth && line.trim()) {
      lines.push(line.trim());
      line = tk.trim() ? tk : "";
    } else line = test;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

// Prefer breaking after punctuation so a short blessing reads as whole phrases.
export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const clauses = text.trim().split(/(?<=[，、；：。！？,;:.!?])\s*/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const clause of clauses) {
    if (ctx.measureText(clause).width > maxWidth) {
      if (line) lines.push(line);
      line = "";
      lines.push(...charWrap(ctx, clause, maxWidth));
    } else if (line && ctx.measureText(line + " " + clause).width > maxWidth) {
      lines.push(line);
      line = clause;
    } else {
      line = line ? (/[\u2e80-\u9fff\uff00-\uffef]$/.test(line) ? line + clause : line + " " + clause) : clause;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number, start: number, min: number) {
  for (let size = start; size >= min; size -= 4) {
    ctx.font = `700 ${size}px ${SERIF}`;
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = `700 ${min}px ${SERIF}`;
  return { size: min, lines: wrapLines(ctx, text, maxWidth).slice(0, maxLines) };
}

// A stylised five-lobed maple leaf, centred on (0,0) with radius ~1.
const LEAF: [number, number][] = [
  [0, -1], [0.16, -0.6], [0.5, -0.78], [0.4, -0.3], [0.98, -0.2], [0.62, 0.12], [0.8, 0.52], [0.28, 0.42], [0.06, 0.82],
];
export function leaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, fill: string, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(size, size);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, -1);
  for (const [px, py] of LEAF.slice(1)) ctx.lineTo(px, py);
  ctx.lineTo(0, 0.95);
  for (const [px, py] of [...LEAF.slice(1)].reverse()) ctx.lineTo(-px, py);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = fill;
  ctx.lineWidth = 0.05;
  ctx.beginPath();
  ctx.moveTo(0, 0.9);
  ctx.lineTo(0, 1.35);
  ctx.stroke();
  ctx.restore();
}

function seal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ch: string, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "#fffaf0";
  ctx.font = `700 ${size * 0.64}px ${SERIF}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ch, x + size / 2, y + size / 2 + size * 0.04);
  ctx.restore();
}

function frame(ctx: CanvasRenderingContext2D, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(44, 44, CARD_W - 88, CARD_H - 88);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(60, 60, CARD_W - 120, CARD_H - 120);
  ctx.restore();
}

export type Template = "ink" | "paper" | "night";

export async function renderGreeting(o: { template: Template; text: string; sign: string; footer: string }) {
  const { canvas, ctx } = newCanvas();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  let textColor = C.ink;
  let subColor = C.muted;
  let accent = C.cinnabar;

  if (o.template === "ink") {
    const bg = await loadImage("/images/welcome.jpg");
    const scale = Math.max(CARD_W / bg.width, CARD_H / bg.height);
    const w = bg.width * scale;
    const h = bg.height * scale;
    ctx.drawImage(bg, (CARD_W - w) / 2, CARD_H - h, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, CARD_H * 0.72);
    g.addColorStop(0, "rgba(250,247,240,0.97)");
    g.addColorStop(0.62, "rgba(250,247,240,0.93)");
    g.addColorStop(1, "rgba(250,247,240,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    frame(ctx, "rgba(154,122,76,0.7)");
  } else if (o.template === "paper") {
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    frame(ctx, C.gold);
    leaf(ctx, 170, 190, 92, -0.5, C.cinnabar, 0.9);
    leaf(ctx, 260, 120, 52, 0.4, C.gold, 0.9);
    leaf(ctx, CARD_W - 170, CARD_H - 190, 92, 2.6, C.cinnabar, 0.9);
    leaf(ctx, CARD_W - 250, CARD_H - 120, 52, 3.5, C.gold, 0.9);
  } else {
    ctx.fillStyle = "#1f1c18";
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const g = ctx.createRadialGradient(CARD_W / 2, CARD_H * 0.4, 80, CARD_W / 2, CARD_H * 0.4, 800);
    g.addColorStop(0, "rgba(198,164,119,0.18)");
    g.addColorStop(1, "rgba(198,164,119,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    frame(ctx, "#c6a477");
    for (const [x, y, s, r] of [[200, 210, 120, -0.6], [880, 300, 70, 0.7], [820, 1180, 110, 2.5], [230, 1120, 64, 3.8], [540, 160, 50, 0.1]] as const) {
      leaf(ctx, x, y, s, r, "#a83c32", 0.75);
    }
    textColor = "#e9d5ae";
    subColor = "#c6a477";
    accent = "#d86a5e";
  }

  // Blessing text
  const maxW = CARD_W - 280;
  const { size, lines } = fitText(ctx, o.text, maxW, 5, 92, 48);
  ctx.font = `700 ${size}px ${SERIF}`;
  ctx.fillStyle = textColor;
  const lh = size * 1.6;
  const blockH = lines.length * lh;
  let y = CARD_H * 0.33 - blockH / 2 + size;
  for (const line of lines) {
    ctx.fillText(line, CARD_W / 2, y);
    y += lh;
  }

  // Signature
  if (o.sign.trim()) {
    ctx.font = `500 44px ${SERIF}`;
    ctx.fillStyle = subColor;
    ctx.textAlign = "right";
    ctx.fillText("—— " + o.sign.trim().slice(0, 24), CARD_W - 150, y + 60);
    ctx.textAlign = "center";
  }

  seal(ctx, CARD_W / 2 - 38, 118, 76, "枫", accent);

  // Footer
  if (o.template === "ink") {
    ctx.fillStyle = "rgba(250,247,240,0.86)";
    ctx.fillRect(60, CARD_H - 150, CARD_W - 120, 90);
  }
  ctx.font = `500 36px ${SERIF}`;
  ctx.fillStyle = o.template === "night" ? subColor : C.goldDeep;
  ctx.fillText(o.footer, CARD_W / 2, CARD_H - 94);

  return canvas;
}

export async function renderSouvenir(o: {
  brand: string;
  sub: string;
  cardTitle: string;
  forLabel: string;
  name: string;
  stampsLine: string;
  stamps: GameId[];
  dateText: string;
}) {
  const { canvas, ctx } = newCanvas();
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const bg = await loadImage("/images/welcome.jpg");
  const scale = CARD_W / bg.width;
  const bh = bg.height * scale;
  ctx.drawImage(bg, 0, CARD_H - bh, CARD_W, bh);
  const g = ctx.createLinearGradient(0, 0, 0, CARD_H);
  g.addColorStop(0, "rgba(250,247,240,1)");
  g.addColorStop(0.62, "rgba(250,247,240,0.96)");
  g.addColorStop(1, "rgba(250,247,240,0.15)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  frame(ctx, "rgba(154,122,76,0.75)");

  ctx.textAlign = "center";
  ctx.fillStyle = C.ink;
  ctx.font = `700 120px ${SERIF}`;
  ctx.fillText(o.brand, CARD_W / 2, 250);
  ctx.font = `500 40px ${SERIF}`;
  ctx.fillStyle = C.goldDeep;
  ctx.fillText(o.sub, CARD_W / 2, 320);

  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 150, 368);
  ctx.lineTo(CARD_W / 2 + 150, 368);
  ctx.stroke();
  seal(ctx, CARD_W / 2 - 34, 392, 68, "枫", C.cinnabar);

  ctx.font = `500 52px ${SERIF}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(o.cardTitle, CARD_W / 2, 540);

  ctx.font = `500 38px ${SERIF}`;
  ctx.fillStyle = C.muted;
  ctx.fillText(o.forLabel, CARD_W / 2, 640);
  const nameFit = fitText(ctx, o.name, CARD_W - 300, 2, 96, 52);
  ctx.font = `700 ${nameFit.size}px ${SERIF}`;
  ctx.fillStyle = C.cinnabar;
  let y = 740;
  for (const line of nameFit.lines) {
    ctx.fillText(line, CARD_W / 2, y);
    y += nameFit.size * 1.2;
  }

  // Earned stamps, up to 4 per row
  const imgs = await Promise.all(o.stamps.map((id) => loadImage(`/stamps/${id}-earned.svg`).catch(() => null)));
  const per = Math.min(4, Math.max(1, imgs.length));
  const cell = 190;
  const gap = 30;
  const rowW = per * cell + (per - 1) * gap;
  const top = y + 40;
  imgs.forEach((im, i) => {
    if (!im) return;
    const row = Math.floor(i / per);
    const col = i % per;
    const inRow = Math.min(per, imgs.length - row * per);
    const w = inRow * cell + (inRow - 1) * gap;
    const x0 = (CARD_W - (inRow === per ? rowW : w)) / 2;
    ctx.drawImage(im, x0 + col * (cell + gap), top + row * (cell + gap), cell, cell);
  });

  ctx.font = `500 40px ${SERIF}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(o.stampsLine, CARD_W / 2, CARD_H - 190);
  ctx.font = `500 34px ${SERIF}`;
  ctx.fillStyle = C.goldDeep;
  ctx.fillText(o.dateText, CARD_W / 2, CARD_H - 120);

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png"));
}

export async function saveOrShare(blob: Blob, filename: string, mode: "save" | "share") {
  const file = new File([blob], filename, { type: "image/png" });
  if (mode === "share" && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
