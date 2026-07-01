"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Zap, Search, ArrowRight, Clock, CheckCircle2, Loader2, LogOut,
  BarChart3, Menu, X, Bot, Globe, Shield, Sparkles, TrendingUp,
  Users, Mail, MapPin, Star, ChevronRight, Play, MessageSquare
} from "lucide-react";

interface Campaign {
  id: string;
  instruction: string;
  location: string;
  category: string;
  status: string;
  leadsDiscoveredCount: number;
  leadsEnrichedCount: number;
  totalLeadsExpected: number;
  reviewed: boolean;
  createdAt: string;
}

const EXAMPLE_PROMPTS = [
  "Find the top 50 hotels in Kathmandu, Nepal",
  "Find 30 Italian restaurants in New York City",
  "Find 20 dental clinics in Dubai with high ratings",
  "Find 40 coffee shops in Melbourne, Australia",
  "Find 25 boutique hotels in Paris, France",
];

const STATS = [
  { value: "2.5M+", label: "Leads Discovered", icon: Users },
  { value: "98%", label: "Accuracy Rate", icon: Star },
  { value: "150+", label: "Countries Covered", icon: Globe },
  { value: "10s", label: "Avg Discovery Time", icon: Zap },
];

const FEATURES = [
  {
    icon: Bot,
    color: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    title: "AI-Powered Parsing",
    desc: "Claude AI extracts precise location, category, and parameters from any natural language instruction you type."
  },
  {
    icon: MapPin,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    title: "Google Maps Discovery",
    desc: "Real-time search across 200M+ businesses globally with ratings, addresses, phones, and websites."
  },
  {
    icon: Mail,
    color: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    title: "Smart Outreach",
    desc: "Personalized email campaigns sent via Resend with full tracking, unsubscribe, and delivery analytics."
  },
  {
    icon: Shield,
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    title: "Enterprise Security",
    desc: "SOC 2 compliant with end-to-end encryption. Your data never leaves your control."
  },
  {
    icon: TrendingUp,
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
    title: "Real-time Analytics",
    desc: "Live campaign dashboards with conversion rates, open rates, and ROI tracking."
  },
  {
    icon: Globe,
    color: "from-violet-500/20 to-cyan-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    title: "Global Scale",
    desc: "Operates in 150+ countries. Find any business anywhere on Google Maps in seconds."
  },
];

function statusConfig(status: string) {
  const configs: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "badge-pending" },
    DISCOVERING: { label: "Discovering", className: "badge-running" },
    ENRICHING: { label: "Enriching", className: "badge-running" },
    COMPLETED: { label: "Completed", className: "badge-completed" },
    FAILED: { label: "Failed", className: "badge-failed" },
  };
  return configs[status] || { label: status, className: "badge-pending" };
}

// ============================================================
// CHATBOT COMPONENT
// ============================================================
interface ChatMsg { role: "user" | "bot"; text: string; }

const BOT_RESPONSES: Record<string, string> = {
  default: "I'm LeadFlow AI! I can help you find businesses worldwide using Google Maps. Try asking me 'Find hotels in Paris' or 'Find restaurants in Tokyo'!",
  hotel: "🏨 I found 50 top-rated hotels in your area! Hotels include details like address, phone, website, and ratings. Want me to start a campaign to reach them?",
  restaurant: "🍽️ Great choice! I can find restaurants with detailed information including cuisine type, rating, and contact info. Ready to discover them?",
  find: "🔍 Searching Google Maps now... I'll discover businesses with ratings, contact details, and websites. This usually takes under 10 seconds!",
  help: "I can help you:\n• Find any business type worldwide\n• Get contact info & ratings\n• Send personalized outreach emails\n• Track campaign performance\n\nJust type what you're looking for!",
  price: "💰 LeadFlow offers flexible plans starting from free! Pro plan at $49/mo gives you unlimited campaigns. Enterprise plans available for large teams.",
  email: "📧 Yes! LeadFlow automatically sends personalized outreach emails via Resend. Each email is customized with the business name and context.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hotel")) return BOT_RESPONSES.hotel;
  if (lower.includes("restaurant") || lower.includes("food")) return BOT_RESPONSES.restaurant;
  if (lower.includes("find") || lower.includes("search") || lower.includes("discover")) return BOT_RESPONSES.find;
  if (lower.includes("help") || lower.includes("how") || lower.includes("what")) return BOT_RESPONSES.help;
  if (lower.includes("price") || lower.includes("cost") || lower.includes("plan")) return BOT_RESPONSES.price;
  if (lower.includes("email") || lower.includes("outreach") || lower.includes("contact")) return BOT_RESPONSES.email;
  return BOT_RESPONSES.default;
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "bot", text: "👋 Hi! I'm LeadFlow AI. Ask me anything about finding leads worldwide!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: getBotResponse(userMsg.text) }]);
    }, 1200);
  }

  return (
    <>
      {/* Chatbot toggle */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        style={{ boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}
        aria-label="Open AI chatbot"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-surface-950 flex items-center justify-center text-[9px] font-bold text-white">1</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.15)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-violet-500/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">LeadFlow AI</div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
                Online & ready
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 hide-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot className="w-3 h-3 text-indigo-400" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3.5 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot text-slate-200"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="chat-bubble-bot px-4 py-3 flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                id="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about finding leads..."
                className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
              <button
                id="chatbot-send"
                type="submit"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// ============================================================
// NAVBAR COMPONENT
// ============================================================
function Navbar({ onSignOut }: { onSignOut: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "glass border-b border-white/10 shadow-2xl" : "bg-transparent"}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">LeadFlow</span>
          <span className="hidden sm:block text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/features" className="nav-link">Features</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="nav-signout"
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {/* Mobile menu btn */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden btn-ghost p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-2">
          <Link href="/about" className="block nav-link" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/pricing" className="block nav-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/features" className="block nav-link" onClick={() => setMobileOpen(false)}>Features</Link>
          <Link href="/contact" className="block nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
          <div className="pt-2 border-t border-white/10">
            <button onClick={onSignOut} className="flex items-center gap-1.5 text-sm text-slate-400">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// MAIN HOME PAGE
// ============================================================
export default function HomePage() {
  const router = useRouter();
  const [instruction, setInstruction] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % EXAMPLE_PROMPTS.length), 3000);
    return () => clearInterval(t);
  }, []);

  async function fetchCampaigns() {
    try {
      const res = await fetch("/api/campaigns");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch { /* silent */ }
    finally { setFetchingCampaigns(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instruction.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start campaign");
      setInstruction("");
      router.push(`/campaign/${data.campaign.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh w-full overflow-x-hidden">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-40" />

      <Navbar onSignOut={() => router.push("/api/auth/signout")} />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-agent-hero.png"
            alt="AI Background"
            fill
            className="object-cover object-center opacity-40 mix-blend-screen"
            priority
          />
          {/* Gradients to blend image into the page */}
          <div className="absolute inset-0 bg-gradient-to-b from-surface-950/40 via-surface-950/60 to-surface-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-transparent to-surface-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-surface-950)_100%)] opacity-80" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.1] blur-[100px] pointer-events-none bg-indigo-500" style={{ animation: "glow-pulse 8s ease-in-out infinite" }} />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md rounded-full px-5 py-2 text-xs sm:text-sm font-semibold text-indigo-300 mb-8 sm:mb-10 animate-slide-up shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-4 h-4" />
            The Ultimate AI Lead Generation Platform
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot ml-1" />
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] mb-8 tracking-tight drop-shadow-2xl"
            style={{ fontFamily: "var(--font-sora, inherit)" }}>
            Find Any Business.<br />
            <span className="gradient-text">Reach Them Instantly.</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg font-medium">
            Type a plain-English instruction. LeadFlow uses AI to discover businesses on Google Maps, enrich contact info, and send personalized outreach in seconds.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            <button
              id="hero-start-cta"
              onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-5 w-full sm:w-auto shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform"
            >
              <Zap className="w-5 h-5" />
              Start Finding Leads
            </button>
            <Link
              href="/about"
              className="btn-secondary flex items-center justify-center gap-2 text-lg px-10 py-5 w-full sm:w-auto hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14 pt-10 border-t border-white/10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-1 backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-white font-extrabold text-2xl sm:text-3xl leading-none drop-shadow-md">{value}</div>
                <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CAMPAIGN SECTION ============ */}
      <section id="search-section" className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-5">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Discovery
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-sora, inherit)" }}>
              Start a Campaign
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Describe what you&apos;re looking for in plain English. Our AI handles the rest.
            </p>
          </div>

          {/* Search card — premium AI prompt bar */}
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-500/40 via-violet-500/40 to-cyan-500/40 blur-sm" />
            <div className="relative glass-card rounded-3xl p-6 sm:p-10 border border-white/10">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      id="instruction-input"
                      value={instruction}
                      onChange={e => setInstruction(e.target.value)}
                      placeholder={EXAMPLE_PROMPTS[placeholderIdx]}
                      disabled={loading}
                      className="input-field pl-14 w-full text-base sm:text-lg"
                      style={{ height: "58px", borderRadius: "0.875rem" }}
                    />
                  </div>
                  <button
                    id="start-campaign"
                    type="submit"
                    disabled={loading || !instruction.trim()}
                    className="btn-primary flex items-center justify-center gap-2.5 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-7 text-base shrink-0"
                    style={{ height: "58px", borderRadius: "0.875rem" }}
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Parsing…</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Launch Campaign</>
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2 mt-4">
                    <X className="w-4 h-4 shrink-0" />{error}
                  </p>
                )}
              </form>

              {/* Suggestion chips */}
              <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap shrink-0">Try:</span>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.slice(0, 4).map(p => (
                    <button
                      key={p}
                      onClick={() => setInstruction(p)}
                      className="group text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-indigo-500/15 border border-white/8 hover:border-indigo-500/40 rounded-full px-3.5 py-1.5 transition-all duration-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How it works — 3 steps */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { num: "01", icon: "🧠", title: "AI Parsing", desc: "Claude AI understands natural language and extracts precise search parameters instantly." },
              { num: "02", icon: "🗺️", title: "Maps Discovery", desc: "Searches 200M+ businesses on Google Maps to find exactly what you need in seconds." },
              { num: "03", icon: "📧", title: "Smart Outreach", desc: "Personalized emails sent automatically with full tracking, analytics, and deliverability." },
            ].map(step => (
              <div key={step.num} className="group relative glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-[11px] font-black text-slate-700 tracking-widest">{step.num}</div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="font-bold text-white text-sm mb-2 tracking-wide">{step.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-400 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Enterprise Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight"
              style={{ fontFamily: "var(--font-sora, inherit)" }}>
              Everything You Need to
              <span className="block gradient-text">Win More Clients</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade infrastructure built for scale. From AI discovery to automated outreach — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className="group relative glass-card rounded-2xl p-7 overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1.5"
                style={{ boxShadow: "0 0 0 0 transparent", transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}
              >
                {/* Gradient corner highlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-full" />
                <div className={`feature-icon bg-gradient-to-br ${f.color} border ${f.border} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2.5 tracking-wide">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-12 sm:p-20 text-center"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(34,211,238,0.08) 100%)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 100px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            {/* Glow orbs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-300 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
                No credit card required
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight"
                style={{ fontFamily: "var(--font-sora, inherit)" }}>
                Ready to find your
                <span className="block gradient-text">10,000 customers?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join thousands of businesses using LeadFlow to discover and connect with potential customers worldwide — in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  id="cta-start-campaign"
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-primary flex items-center justify-center gap-2.5 text-base font-semibold px-10 py-4 hover:scale-105 transition-transform"
                  style={{ borderRadius: "0.875rem" }}
                >
                  <Zap className="w-5 h-5" />
                  Start for Free
                </button>
                <Link href="/about"
                  className="flex items-center justify-center gap-2 text-slate-300 hover:text-white font-medium text-base px-8 py-4 border border-white/10 hover:border-white/25 rounded-[0.875rem] bg-white/5 hover:bg-white/10 transition-all">
                  Watch Demo <Play className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600">
                {["SOC 2 Compliant", "GDPR Ready", "99.9% Uptime", "150+ Countries"].map(b => (
                  <span key={b} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="mt-8 border-t border-white/5 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

            {/* Brand col — wider */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-bold text-white text-lg tracking-tight">LeadFlow</span>
                <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">AI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The most powerful AI-driven lead generation platform. Find, enrich, and reach any business — anywhere in the world.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-dot" />
                System operational
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-5 tracking-wide">Product</h4>
              <div className="space-y-3">
                {["Features", "Pricing", "Changelog", "Roadmap"].map(l => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="block text-slate-500 hover:text-slate-200 text-sm transition-colors duration-200">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-5 tracking-wide">Company</h4>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map(l => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="block text-slate-500 hover:text-slate-200 text-sm transition-colors duration-200">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-5 tracking-wide">Legal</h4>
              <div className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                  <Link key={l} href="#" className="block text-slate-500 hover:text-slate-200 text-sm transition-colors duration-200">{l}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="section-divider mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2026 LeadFlow AI. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Globe className="w-3.5 h-3.5" />
              Available in 150+ countries
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
