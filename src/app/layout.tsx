import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { profile } from "@/data/profile";
import { getSiteOrigin } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./redesign.css";
import "./intro-transition.css";
import "./archive.css";

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

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: {
    default: `${profile.name} — Software Engineer | DevOps & Cloud`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  ...(siteOrigin ? { alternates: { canonical: "/" } } : {}),
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
        <SmoothScrollProvider>
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
