import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  ...(profile.siteUrl ? { metadataBase: new URL(profile.siteUrl) } : {}),
  title: {
    default: `${profile.name} — A little curiosity, a lot of possibility`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  openGraph: {
    title: `${profile.name} — Personal Portfolio`,
    description: profile.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — Personal Portfolio`,
    description: profile.description,
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#f8fafc" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
