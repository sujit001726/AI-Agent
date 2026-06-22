"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Search, ArrowRight, Clock, CheckCircle2, Loader2, LogOut, BarChart3 } from "lucide-react";

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

function statusConfig(status: string) {
  const configs: Record<string, { label: string; className: string; icon: string }> = {
    PENDING:     { label: "Pending",    className: "badge-pending",   icon: "⏳" },
    DISCOVERING: { label: "Discovering",className: "badge-running",   icon: "🔍" },
    ENRICHING:   { label: "Enriching",  className: "badge-running",   icon: "⚡" },
    COMPLETED:   { label: "Completed",  className: "badge-completed", icon: "✓" },
    FAILED:      { label: "Failed",     className: "badge-failed",    icon: "✗" },
  };
  return configs[status] || { label: status, className: "badge-pending", icon: "?" };
}

export default function HomePage() {
  const router = useRouter();
  const [instruction, setInstruction] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 5000); // poll every 5s for live status
    return () => clearInterval(interval);
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
    <div className="min-h-screen" style={{
      background: "radial-gradient(ellipse at 50% -20%, rgba(52,211,153,0.08) 0%, transparent 60%), #020b18"
    }}>
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-400" />
          </div>
          <span className="font-bold text-white">LeadFlow</span>
        </div>
        <button
          id="nav-signout"
          onClick={() => router.push("/api/auth/signout")}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-brand-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot" />
            AI-powered lead generation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find leads.<br />
            <span className="gradient-text">Reach them in one click.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto px-4">
            Type a plain-English instruction. LeadFlow discovers businesses, enriches contact info, and sends personalized outreach — automatically.
          </p>
        </div>

        {/* Input card */}
        <div className="glass rounded-2xl p-4 sm:p-6 mb-4 glow-brand">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="instruction-input"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Find the top 100 hotels in Nepal…"
                  disabled={loading}
                  className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
                />
              </div>
              <button
                id="start-campaign"
                type="submit"
                disabled={loading || !instruction.trim()}
                className="flex justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm glow-brand-sm hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap w-full sm:w-auto"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Parsing…</>
                ) : (
                  <>Start Campaign <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
          </form>

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2 mt-4">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setInstruction(p)}
                className="text-xs text-slate-400 hover:text-white bg-surface-800 hover:bg-surface-700 border border-white/5 hover:border-white/15 rounded-lg px-3 py-1.5 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 md:mb-14">
          {[
            { icon: "🧠", title: "AI Parsing", desc: "Claude extracts location, category & parameters from your instruction" },
            { icon: "🔍", title: "Discovery", desc: "Google Places API finds matching businesses with ratings & contact info" },
            { icon: "📧", title: "Outreach", desc: "Personalized emails sent via Resend with unsubscribe & tracking" },
          ].map((step) => (
            <div key={step.title} className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
              <div className="text-xs text-slate-500">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Campaigns list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              Recent Campaigns
            </h2>
            {campaigns.length > 0 && (
              <span className="text-xs text-slate-500">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {fetchingCampaigns ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading campaigns…
            </div>
          ) : campaigns.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-slate-400 text-sm">No campaigns yet. Type an instruction above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => {
                const cfg = statusConfig(c.status);
                const progress = c.totalLeadsExpected > 0
                  ? Math.round((c.leadsEnrichedCount / c.totalLeadsExpected) * 100)
                  : 0;
                const isActive = c.status === "DISCOVERING" || c.status === "ENRICHING";

                return (
                  <button
                    key={c.id}
                    id={`campaign-${c.id}`}
                    onClick={() => router.push(`/campaign/${c.id}`)}
                    className="glass rounded-xl p-4 sm:p-5 w-full text-left hover:border-brand-500/30 hover:bg-surface-800/40 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-white font-medium text-sm truncate group-hover:text-brand-400 transition-colors">
                          {c.instruction}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {c.location} · {c.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />}
                          {cfg.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors hidden sm:block" />
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {c.leadsDiscoveredCount} discovered
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
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
                          className={`h-full rounded-full transition-all duration-500 ${isActive ? "progress-bar" : "bg-brand-500"}`}
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
      </main>
    </div>
  );
}
