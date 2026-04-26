import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { PostHogProvider } from "./posthog-provider";
import { PostHogPageView } from "./posthog-pageview";
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
  metadataBase: new URL("https://love.carana26.com"),
  alternates: {
    canonical: "https://love.carana26.com",
  },
  title: "Carlos & Ana - Para el Amor de Mi Vida 💕",
  description: "Como el universo es infinito, así es mi amor por ti. Cada día una nueva maravilla del universo dedicada para ti.",
  icons: {
    icon: "/ceo.png",
  },
  openGraph: {
    title: "Carlos & Ana - Para el Amor de Mi Vida 💕",
    description: "Como el universo es infinito, así es mi amor por ti. Cada día una nueva maravilla del universo dedicada para ti.",
    images: [
      {
        url: "/ceo.png",
        width: 1200,
        height: 630,
        alt: "Carlos & Ana - Un amor infinito como el universo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <SpeedInsights />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
