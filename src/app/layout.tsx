import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Worker Diamond | ブルーワーカーダイヤモンド",
  description: "AIリスキリングで市場価値を最大化する専属家庭教師",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-bg">{children}</body>
    </html>
  );
}
