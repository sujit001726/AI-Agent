import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Bot, MapPin, Mail, Shield, BarChart3, Globe, Sparkles, Cpu, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Features — LeadFlow AI",
  description: "Discover all the powerful features that make LeadFlow the best AI lead generation platform.",
};

const FEATURES_LIST = [
  {
    icon: Bot,
    title: "Claude AI Parsing",
    desc: "Simply type what you're looking for in plain English. Our Claude AI model understands your intent and extracts the location, business type, quantity, and quality filters automatically.",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    points: ["Natural language understanding", "Multi-language support", "Intent extraction", "Smart fallback parser"],
  },
  {
    icon: MapPin,
    title: "Google Maps Discovery",
    desc: "Powered by the Google Places API (New), LeadFlow searches across 200M+ businesses globally with real-time data including ratings, photos, opening hours, and contact info.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    points: ["200M+ business database", "Real-time data", "150+ countries", "Rating & review filters"],
  },
  {
    icon: Cpu,
    title: "Contact Enrichment",
    desc: "After discovering businesses, LeadFlow automatically crawls their websites to find email addresses, social profiles, and additional contact points using smart AI scraping.",
    color: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    points: ["Email discovery", "Website crawling", "Social profile detection", "Confidence scoring"],
  },
  {
    icon: Mail,
    title: "AI Personalized Outreach",
    desc: "Send thousands of personalized emails that feel handwritten. Each email is customized with business name, category, location, and a unique value proposition.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    points: ["Personalized by AI", "Sent via Resend", "Unsubscribe link", "Bounce handling"],
  },
  {
    icon: BarChart3,
    title: "Campaign Analytics",
    desc: "Track every campaign in real-time with detailed analytics on discovery progress, enrichment rates, email open rates, click rates, and conversion tracking.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
    points: ["Live progress tracking", "Email analytics", "Conversion tracking", "Export to CSV"],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Built with security-first principles. Your API keys are encrypted at rest, all data is transmitted over TLS, and we're fully GDPR compliant.",
    color: "from-violet-500/20 to-cyan-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    points: ["End-to-end encryption", "GDPR compliant", "SOC 2 certified", "Regular security audits"],
  },
  {
    icon: Clock,
    title: "Background Workers",
    desc: "Campaigns run asynchronously in the background using a Redis-powered job queue. Start a campaign and come back to find your leads ready — no waiting around.",
    color: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    points: ["Async job processing", "Redis queue", "Auto-retry on failure", "Real-time status updates"],
  },
  {
    icon: Globe,
    title: "Global Scale",
    desc: "Whether you're finding hotels in Nepal or law firms in New York, LeadFlow handles campaigns across any country, any language, any industry.",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    points: ["150+ countries", "Any business type", "Any language", "Concurrent campaigns"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-30" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <span className="font-bold text-white text-lg">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/pricing" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powerful Features
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-sora, inherit)" }}>
            Everything you need to<br />
            <span className="gradient-text">scale lead generation</span>
          </h1>
          <p className="text-slate-400 text-lg">From discovery to outreach, every step is powered by AI and automated for maximum efficiency.</p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES_LIST.map(f => (
              <div key={f.title} className="glass-card rounded-2xl p-7 card-hover group">
                <div className="flex items-start gap-5">
                  <div className={`feature-icon bg-gradient-to-br ${f.color} border ${f.border} shrink-0 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {f.points.map(p => (
                        <div key={p} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="text-xs text-slate-400">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration logos */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-8">Powered by world-class technologies</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Google Maps API", "Claude AI", "Resend", "PostgreSQL", "Redis", "NextAuth", "Prisma ORM", "BullMQ"].map(tech => (
              <div key={tech} className="glass px-4 py-2 rounded-xl text-slate-400 text-sm font-medium border border-white/5 hover:border-indigo-500/20 hover:text-white transition-all">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 glow-brand">
            <h2 className="text-3xl font-bold text-white mb-4">Start Using All Features</h2>
            <p className="text-slate-400 mb-8">Free plan includes 5 campaigns/month. No credit card needed.</p>
            <Link href="/" className="btn-primary flex items-center justify-center gap-2 max-w-xs mx-auto px-8 py-4 text-base">
              <Zap className="w-5 h-5" /> Launch First Campaign
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-slate-600 text-xs">© 2026 LeadFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
