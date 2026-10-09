import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://badspiral.takadev.jp/"),
  title: "悪循環画像ジェネレータ",
  description: "悪循環画像を簡単に生成します",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "悪循環画像ジェネレータ",
    description: "悪循環画像を簡単に生成します",
    url: "https://badspiral.takadev.jp/",
    siteName: "badspiral.takadev.jp",
    images: [{ url: "/ogp.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
