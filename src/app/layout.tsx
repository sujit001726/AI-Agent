import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://leadflow.ai'),
  title: "LeadFlow AI — Find Leads Worldwide with Google Maps",
  description: "AI-powered lead generation platform. Discover businesses on Google Maps, enrich contact info automatically, and send personalized outreach at scale.",
  keywords: ["lead generation", "AI", "Google Maps", "business discovery", "email outreach", "sales automation", "CRM", "cold email", "B2B leads"],
  authors: [{ name: "LeadFlow AI Team" }],
  twitter: {
    card: "summary_large_image",
    title: "LeadFlow AI — Find Leads Worldwide",
    description: "AI-powered lead generation. Discover, enrich and email businesses at scale.",
  },
  openGraph: {
    title: "LeadFlow AI — Find Leads Worldwide",
    description: "Find any business anywhere on Google Maps. AI-powered lead generation in seconds.",
    type: "website",
    siteName: "LeadFlow AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
