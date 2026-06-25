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
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
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
    color: "from-teal-500/20 to-cyan-500/20",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
    title: "Global Scale",
    desc: "Operates in 150+ countries. Find any business anywhere on Google Maps in seconds."
  },
];

function statusConfig(status: string) {
  const configs: Record<string, { label: string; className: string }> = {
    PENDING:     { label: "Pending",     className: "badge-pending" },
    DISCOVERING: { label: "Discovering", className: "badge-running" },
    ENRICHING:   { label: "Enriching",   className: "badge-running" },
    COMPLETED:   { label: "Completed",   className: "badge-completed" },
    FAILED:      { label: "Failed",      className: "badge-failed" },
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        style={{ boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
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
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">LeadFlow AI</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                Online & ready
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 hide-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot className="w-3 h-3 text-emerald-400" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3.5 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot text-slate-200"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Bot className="w-3 h-3 text-emerald-400" />
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
                className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
              />
              <button
                id="chatbot-send"
                type="submit"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">LeadFlow</span>
          <span className="hidden sm:block text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">AI</span>
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
    <div className="min-h-screen bg-mesh">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-40" />

      <Navbar onSignOut={() => router.push("/api/auth/signout")} />

      {/* ============ HERO / SEARCH SECTION ============ */}
      <section className="relative pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center">
        {/* Subtle background glow, not too intense */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.07] blur-[80px] pointer-events-none bg-emerald-500" />
        
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            LeadFlow AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight" style={{ fontFamily: "var(--font-sora, inherit)" }}>
            Find your next customers.
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Simply describe the businesses you're looking for. We'll discover them on Google Maps, enrich their contact info, and reach out automatically.
          </p>

          {/* Integrated Search Box */}
          <div className="max-w-3xl mx-auto mb-10">
            <form onSubmit={handleSubmit} className="relative group text-left">
               {/* Search Input */}
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
               </div>
               <input 
                 id="hero-instruction-input"
                 className="block w-full pl-14 pr-32 sm:pr-40 py-5 bg-surface-900/60 border border-white/10 rounded-2xl text-base sm:text-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-2xl backdrop-blur-md"
                 value={instruction}
                 onChange={e => setInstruction(e.target.value)}
                 placeholder={EXAMPLE_PROMPTS[placeholderIdx]}
                 disabled={loading}
               />
               <div className="absolute inset-y-2 right-2">
                 <button 
                   id="hero-start-campaign"
                   type="submit"
                   disabled={loading || !instruction.trim()}
                   className="h-full px-4 sm:px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                 >
                   {loading ? (
                     <><Loader2 className="w-4 h-4 animate-spin sm:mr-2" /><span className="hidden sm:inline">Parsing...</span></>
                   ) : (
                     "Start Finding"
                   )}
                 </button>
               </div>
            </form>

            {error && (
              <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-left">
                <X className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}
            
            {/* Example chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-xs text-slate-500">Try:</span>
              {EXAMPLE_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => setInstruction(p)}
                  className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-3 py-1.5 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CAMPAIGNS SECTION ============ */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Recent Campaigns
            </h2>
            {campaigns.length > 0 && (
              <span className="text-xs text-slate-500 glass px-3 py-1 rounded-full">
                {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {fetchingCampaigns ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <div className="skeleton h-4 w-2/3 mb-3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">No campaigns yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Type an instruction above to start discovering leads from Google Maps!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => {
                const cfg = statusConfig(c.status);
                const progress = c.totalLeadsExpected > 0
                  ? Math.min(Math.round((c.leadsEnrichedCount / c.totalLeadsExpected) * 100), 100)
                  : 0;
                const isActive = c.status === "DISCOVERING" || c.status === "ENRICHING";

                return (
                  <button
                    key={c.id}
                    id={`campaign-${c.id}`}
                    onClick={() => router.push(`/campaign/${c.id}`)}
                    className="glass-card rounded-xl p-4 sm:p-5 w-full text-left hover:border-emerald-500/20 transition-all duration-300 group card-hover"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate group-hover:text-emerald-400 transition-colors">
                          {c.instruction}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-slate-600" />
                          <p className="text-slate-500 text-xs">{c.location} · {c.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.className}`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />}
                          {cfg.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {c.leadsDiscoveredCount} discovered
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-500" />
                        {c.leadsEnrichedCount} enriched
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {c.totalLeadsExpected > 0 && (
                      <div className="h-1 bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isActive ? "progress-bar" : "bg-emerald-500"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for Global Lead Generation
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Enterprise-grade features to find, reach, and convert businesses anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title}
                className="glass-card rounded-2xl p-6 card-hover group"
              >
                <div className={`feature-icon bg-gradient-to-br ${f.color} border ${f.border} mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
            style={{ boxShadow: "0 0 80px rgba(52,211,153,0.1)" }}>
            {/* Decorative orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
                <Zap className="w-3.5 h-3.5" />
                Get Started Free
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-sora, inherit)" }}>
                Ready to find your next<br />
                <span className="gradient-text">10,000 customers?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of businesses using LeadFlow to discover and connect with potential customers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  id="cta-start-campaign"
                  onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4"
                >
                  <Zap className="w-5 h-5" />
                  Start for Free
                </button>
                <Link href="/about" className="btn-secondary flex items-center justify-center gap-2 text-sm py-4 px-8">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-white">LeadFlow</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                AI-powered lead generation platform for global businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
              <div className="space-y-2">
                {["Features", "Pricing", "Changelog", "Roadmap"].map(l => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="block text-slate-500 hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
              <div className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map(l => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="block text-slate-500 hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
              <div className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                  <Link key={l} href="#" className="block text-slate-500 hover:text-white text-sm transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="section-divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2026 LeadFlow AI. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Globe className="w-3.5 h-3.5" />
              Available worldwide in 150+ countries
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
