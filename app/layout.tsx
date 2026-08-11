import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "玲儿专属｜把喜欢写进每一个明天",
  description: "一封从晚霞写到星空的恋爱惊喜。",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "玲儿专属", description: "把喜欢，写进每一个明天。", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "玲儿专属", description: "把喜欢，写进每一个明天。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
