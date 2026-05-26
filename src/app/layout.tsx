import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getProfile } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Omar Ibrahim | Offensive Security Portfolio",
    template: "%s | Omar Ibrahim"
  },
  description:
    "Content-driven portfolio and blog for a penetration tester and red team operator.",
  keywords: [
    "penetration tester",
    "red team operator",
    "offensive security",
    "portfolio",
    "security blog"
  ]
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${monoFont.variable}`}>
        <div className="site-grid" />
        <SiteHeader alias={profile.alias} />
        <main>{children}</main>
        <SiteFooter name={profile.name} socials={profile.socials} />
      </body>
    </html>
  );
}
