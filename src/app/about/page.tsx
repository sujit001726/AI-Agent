import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Globe, Shield, Sparkles, TrendingUp, Users, Mail, Heart, Target, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About LeadFlow — AI Lead Generation Platform",
  description: "Learn how LeadFlow uses AI to power global lead generation and business outreach.",
};

const TEAM = [
  { name: "Alex Chen", role: "CEO & Co-Founder", avatar: "AC", color: "from-emerald-500 to-teal-600" },
  { name: "Priya Patel", role: "CTO & Co-Founder", avatar: "PP", color: "from-blue-500 to-indigo-600" },
  { name: "Marcus Johnson", role: "Head of AI", avatar: "MJ", color: "from-purple-500 to-pink-600" },
  { name: "Sarah Kim", role: "Head of Growth", avatar: "SK", color: "from-orange-500 to-amber-600" },
];

const MILESTONES = [
  { year: "2023", event: "LeadFlow founded with a vision to democratize lead generation", icon: "🚀" },
  { year: "2024 Q1", event: "Launched AI-powered instruction parsing using Claude AI", icon: "🧠" },
  { year: "2024 Q2", event: "Integrated Google Maps API for real-time business discovery", icon: "🗺️" },
  { year: "2024 Q3", event: "Reached 1M+ leads discovered milestone", icon: "🎯" },
  { year: "2024 Q4", event: "Expanded to 150+ countries with global infrastructure", icon: "🌍" },
  { year: "2025", event: "Launched enterprise plan serving Fortune 500 companies", icon: "🏆" },
];

const VALUES = [
  { icon: Target, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20", title: "Precision First", desc: "We believe in accurate data. Every lead we surface is verified and reliable." },
  { icon: Globe, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", title: "Global by Design", desc: "Built from day one to work anywhere in the world, in any language." },
  { icon: Shield, color: "text-purple-400", bg: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/20", title: "Privacy Respect", desc: "We only surface publicly available data. No shady data brokers, ever." },
  { icon: Heart, color: "text-rose-400", bg: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/20", title: "Customer Obsessed", desc: "Every feature we build starts with a real customer problem we're trying to solve." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-30" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-lg">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl bg-emerald-500 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-[1.1]"
            style={{ fontFamily: "var(--font-sora, inherit)" }}>
            We&#39;re Making Lead Generation<br />
            <span className="gradient-text">Accessible to Everyone</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            LeadFlow was born from frustration with expensive, outdated lead generation tools.
            We built the platform we always wished existed — powered by AI, backed by Google Maps.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: "2.5M+", l: "Leads Discovered", i: Users },
              { v: "150+", l: "Countries", i: Globe },
              { v: "50K+", l: "Active Users", i: TrendingUp },
              { v: "99.9%", l: "Uptime", i: Shield },
            ].map(({ v, l, i: Icon }) => (
              <div key={l} className="stat-card text-center">
                <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-3xl font-extrabold gradient-text-green mb-1">{v}</div>
                <div className="text-slate-500 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Leveling the playing field for businesses worldwide
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                We believe every business deserves access to quality leads, not just the ones with huge marketing budgets. LeadFlow makes it possible for a one-person startup in Kathmandu to find customers in New York just as easily as a Fortune 500 company.
              </p>
              <p className="text-slate-400 leading-relaxed">
                By combining the power of Google Maps with state-of-the-art AI, we&#39;ve created a platform that understands plain English instructions and turns them into actionable, qualified leads in seconds.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 glow-brand">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">How it works in 3 steps</div>
                  <div className="text-xs text-slate-500">Simple, powerful, fast</div>
                </div>
              </div>
              {[
                { n: "1", title: "Type your instruction", desc: "\"Find 50 hotels in Tokyo with high ratings\"", color: "text-emerald-400" },
                { n: "2", title: "AI discovers leads", desc: "Google Maps + Claude AI finds matching businesses", color: "text-blue-400" },
                { n: "3", title: "Reach them instantly", desc: "Personalized outreach emails sent automatically", color: "text-purple-400" },
              ].map(step => (
                <div key={step.n} className="flex gap-4 mb-5 last:mb-0">
                  <div className={`w-7 h-7 rounded-full glass flex items-center justify-center text-xs font-bold ${step.color} shrink-0 mt-0.5 border border-white/10`}>
                    {step.n}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{step.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Everything we build is guided by these principles.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map(v => (
              <div key={v.title} className="glass-card rounded-2xl p-6 card-hover group">
                <div className={`feature-icon bg-gradient-to-br ${v.bg} border ${v.border} mb-4 group-hover:scale-110 transition-transform`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-slate-400">From a small idea to a global platform.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-blue-500/30 to-transparent" />
            <div className="space-y-8 pl-16">
              {MILESTONES.map((m, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-10 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-sm">
                    {m.icon}
                  </div>
                  <div className="glass-card rounded-xl p-4 card-hover">
                    <div className="text-xs font-bold text-emerald-400 mb-1">{m.year}</div>
                    <div className="text-white text-sm leading-relaxed">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-slate-400">The people building the future of lead generation.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map(member => (
              <div key={member.name} className="glass-card rounded-2xl p-6 text-center card-hover group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {member.avatar}
                </div>
                <div className="text-white font-semibold text-sm">{member.name}</div>
                <div className="text-slate-500 text-xs mt-1">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 glow-brand">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-slate-400 mb-8">Join thousands of businesses discovering leads with LeadFlow.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base">
                <Zap className="w-5 h-5" /> Start Free Today
              </Link>
              <Link href="/contact" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-sm">
                Talk to Sales <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-slate-600 text-xs">© 2026 LeadFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
