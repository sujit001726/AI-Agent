import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadFlow AI — Find Leads Worldwide with Google Maps",
  description: "AI-powered lead generation platform. Type a plain-English instruction. LeadFlow discovers businesses on Google Maps, enriches contact info, and sends personalized outreach — automatically.",
  keywords: ["lead generation", "AI", "Google Maps", "business discovery", "email outreach", "sales automation"],
  authors: [{ name: "LeadFlow AI Team" }],
  openGraph: {
    title: "LeadFlow AI — Find Leads Worldwide",
    description: "Find any business anywhere on Google Maps. AI-powered lead generation in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
