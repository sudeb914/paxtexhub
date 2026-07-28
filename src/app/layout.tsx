import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InitialSitePreloader } from "@/components/shared/initial-site-preloader";
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
  title: {
    default: "AutoHub — Find Your Dream Car",
    template: "%s | AutoHub",
  },
  description: "A modern marketplace for buying and selling trusted vehicles.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <InitialSitePreloader />
        {children}
      </body>
    </html>
  );
}
