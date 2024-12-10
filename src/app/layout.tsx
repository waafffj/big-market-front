import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
const inter = Inter({ subsets : ['latin']})
export const metadata: Metadata = {
  title: " 星愿池抽奖云平台",
  description: "create by Java",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
