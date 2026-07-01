import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Check, ArrowRight, Sparkles, Globe, Shield, Zap as ZapIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — LeadFlow AI",
  description: "Simple, transparent pricing for AI lead generation. Start free, scale as you grow.",
};

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Perfect for trying out LeadFlow",
    color: "border-white/10",
    badge: null,
    features: [
      "5 campaigns/month",
      "100 leads per campaign",
      "Google Maps discovery",
      "Basic email outreach",
      "Standard support",
    ],
    cta: "Get Started Free",
    ctaStyle: "btn-secondary",
    href: "/login",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "For growing businesses",
    color: "border-indigo-500/40",
    badge: "Most Popular",
    features: [
      "Unlimited campaigns",
      "500 leads per campaign",
      "Google Maps + enrichment",
      "AI-personalized emails",
      "Analytics dashboard",
      "Priority support",
      "Team collaboration (3 seats)",
    ],
    cta: "Start Pro Trial",
    ctaStyle: "btn-primary",
    href: "/login",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    desc: "For large teams & agencies",
    color: "border-indigo-500/30",
    badge: null,
    features: [
      "Unlimited campaigns & leads",
      "Custom lead limits",
      "Full API access",
      "White-label option",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee (99.9%)",
      "Unlimited team seats",
    ],
    cta: "Contact Sales",
    ctaStyle: "btn-secondary",
    href: "/contact",
  },
];

const FAQS = [
  { q: "Do I need a Google Places API key?", a: "Yes! To use real Google Maps data, you need to enable the Places API (New) in your Google Cloud Console. It's free to set up and very affordable to use." },
  { q: "How does the AI parsing work?", a: "We use Claude AI to understand your plain-English instructions and extract the location, business category, and number of leads you need." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and never store sensitive credentials. Your data is only used to run your campaigns." },
  { q: "Can I cancel anytime?", a: "Yes! No lock-in contracts. You can cancel or downgrade your plan at any time from your account settings." },
  { q: "What countries are supported?", a: "LeadFlow works in 150+ countries wherever Google Maps has business data — which is essentially everywhere." },
];

export default function PricingPage() {
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
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-sora, inherit)" }}>
            Start free, <span className="gradient-text">scale as you grow</span>
          </h1>
          <p className="text-slate-400 text-lg">No hidden fees. No lock-in contracts. Cancel anytime.</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`glass-card rounded-2xl p-7 relative border ${plan.color} ${plan.badge ? "glow-brand scale-[1.02]" : "card-hover"} flex flex-col`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-7">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.href}
                  className={`${plan.ctaStyle} flex items-center justify-center gap-2 py-3 text-sm text-center`}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "SOC 2 Compliant", desc: "Enterprise-grade security", color: "text-purple-400" },
              { icon: Globe, title: "GDPR Ready", desc: "Full data privacy compliance", color: "text-blue-400" },
              { icon: ZapIcon, title: "99.9% Uptime", desc: "SLA-backed reliability", color: "text-indigo-400" },
            ].map(t => (
              <div key={t.title} className="glass-card rounded-xl p-5 flex items-center gap-4">
                <t.icon className={`w-8 h-8 ${t.color} shrink-0`} />
                <div>
                  <div className="text-white font-semibold text-sm">{t.title}</div>
                  <div className="text-slate-500 text-xs">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl p-6 card-hover">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 glow-brand">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
            <p className="text-slate-400 mb-8">No credit card required. Start discovering leads for free.</p>
            <Link href="/login" className="btn-primary flex items-center justify-center gap-2 max-w-xs mx-auto px-8 py-4 text-base">
              <Zap className="w-5 h-5" /> Get Started Free
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
