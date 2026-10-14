import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/components/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "枫华雅集 · Fenghua Yaji",
  description: "中华文化数字游园会 · Montréal · 10月17日",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf7f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
