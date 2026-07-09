"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LayoutGrid,
  List,
  Heart,
  BadgeCheck,
  RotateCcw,
  Star,
  Zap,
  DollarSign,
  X,
} from "lucide-react";

/* ────────────────── Mock Data ────────────────── */
interface Agent {
  id: number;
  name: string;
  verified: boolean;
  desc: string;
  category: string;
  pricing: "Free" | "Free Trial" | "Freemium" | "Paid";
  rating: number;
  image: string;         // card screenshot
  logo: string;          // small logo
  extra: number;         // "+N" badge count
}

const AGENTS: Agent[] = [
  { id: 1,  name: "Manus",             verified: true,  desc: "From thought to done — an AI assistant that actually does the work for you.",       category: "Productivity",         pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=manus&backgroundColor=1e1e2e",         extra: 0 },
  { id: 2,  name: "Google Agentspace", verified: true,  desc: "Unify your enterprise with AI agents — search, act, automate across Google Cloud.", category: "AI Agent Builder",     pricing: "Freemium",   rating: 5, image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=google&backgroundColor=4285f4",        extra: 2 },
  { id: 3,  name: "Slack AI Agents",   verified: true,  desc: "Your AI-powered teammates for smarter, faster work collaboration.",                 category: "Seamless Integration", pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=slack&backgroundColor=611f69",         extra: 1 },
  { id: 4,  name: "Operator",          verified: true,  desc: "Let Operator handle the clicks — your digital task runner powered by OpenAI.",      category: "Automation",           pricing: "Free Trial", rating: 5, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=operator&backgroundColor=10a37f",      extra: 0 },
  { id: 5,  name: "lyro ai",           verified: false, desc: "Human-like AI customer experience agent that resolves tickets instantly.",           category: "Customer Support",     pricing: "Freemium",   rating: 4, image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=lyro&backgroundColor=6c5ce7",          extra: 0 },
  { id: 6,  name: "tidio ai",          verified: false, desc: "AI customer service agent with live chat and helpdesk features.",                   category: "Customer Support",     pricing: "Freemium",   rating: 4, image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=tidio&backgroundColor=0066ff",         extra: 0 },
  { id: 7,  name: "AutoGPT",           verified: true,  desc: "An autonomous AI agent capable of completing multi-step tasks without supervision.", category: "Automation",           pricing: "Free",       rating: 5, image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=autogpt&backgroundColor=ff6b35",       extra: 0 },
  { id: 8,  name: "AgentGPT",          verified: true,  desc: "Deploy autonomous AI agents directly in your browser for any task.",                category: "Productivity",         pricing: "Free",       rating: 4, image: "https://images.unsplash.com/photo-1684369176170-463e84248b70?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=agentgpt&backgroundColor=8b5cf6",      extra: 0 },
  { id: 9,  name: "Relevance AI",      verified: true,  desc: "Build, deploy and manage AI agents and tool chains for enterprise workflows.",      category: "AI Agent Builder",     pricing: "Freemium",   rating: 5, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=relevance&backgroundColor=2563eb",     extra: 3 },
  { id: 10, name: "SuperAgent",        verified: false, desc: "Open-source framework for building AI assistants with memory and tools.",           category: "Development",          pricing: "Free",       rating: 4, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=super&backgroundColor=f43f5e",         extra: 0 },
  { id: 11, name: "BabyAGI",           verified: true,  desc: "Task-driven autonomous agent that creates, prioritizes and executes tasks.",        category: "Research",             pricing: "Free",       rating: 5, image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=baby&backgroundColor=06b6d4",          extra: 0 },
  { id: 12, name: "Cognosys",          verified: true,  desc: "Web-based AI agent platform for research, analysis and content creation.",          category: "Research",             pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=cogno&backgroundColor=a855f7",         extra: 0 },
  { id: 13, name: "Lindy AI",          verified: true,  desc: "Create AI employees that automate workflows across your entire tech stack.",        category: "Automation",           pricing: "Free Trial", rating: 4, image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=lindy&backgroundColor=14b8a6",         extra: 1 },
  { id: 14, name: "Spell AI",          verified: false, desc: "Delegate tasks to autonomous AI agents using GPT-4 plugins and web browsing.",     category: "Productivity",         pricing: "Paid",       rating: 4, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=spell&backgroundColor=ec4899",         extra: 0 },
  { id: 15, name: "Fine AI",           verified: true,  desc: "AI agents that automate software development workflows end to end.",                category: "Development",          pricing: "Free Trial", rating: 5, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=fine&backgroundColor=f59e0b",          extra: 2 },
  { id: 16, name: "Fixie AI",          verified: false, desc: "Build natural language agents that connect to your APIs and data sources.",         category: "AI Agent Builder",     pricing: "Free",       rating: 4, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=fixie&backgroundColor=3b82f6",         extra: 0 },
  { id: 17, name: "Adept AI",          verified: true,  desc: "AI teammate that takes actions in any software tool you already use.",               category: "Productivity",         pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=adept&backgroundColor=6366f1",         extra: 0 },
  { id: 18, name: "MultiOn",           verified: true,  desc: "AI agent that browses and interacts with the web on your behalf.",                  category: "Automation",           pricing: "Free Trial", rating: 5, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", logo: "https://api.dicebear.com/7.x/shapes/svg?seed=multion&backgroundColor=10b981",       extra: 0 },
];

const CATEGORIES = [
  "All",
  "Productivity",
  "AI Agent Builder",
  "Seamless Integration",
  "Automation",
  "Customer Support",
  "Development",
  "Research",
];

const PRICING_OPTIONS = ["Free", "Free Trial", "Freemium", "Paid"] as const;

const ORDER_OPTIONS = ["Latest", "Most Popular", "Top Rated", "Name A-Z"];

const ITEMS_PER_PAGE = 9;

/* ────────────────── Pricing badge colours ────────────────── */
function pricingColor(p: string) {
  switch (p) {
    case "Free":       return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Free Trial": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Freemium":   return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    case "Paid":       return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    default:           return "bg-white/10 text-gray-300 border-white/20";
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━━━ */
export default function AgentsPage() {
  /* ── filter state ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState("Latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"filters" | "categories">("filters");

  const orderRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  /* close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orderRef.current && !orderRef.current.contains(e.target as Node)) setShowOrderDropdown(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategoryDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── filtering & sorting ── */
  const filtered = useMemo(() => {
    let list = [...AGENTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (selectedPricing.length > 0) {
      list = list.filter((a) => selectedPricing.includes(a.pricing));
    }

    switch (orderBy) {
      case "Most Popular": list.sort((a, b) => b.extra - a.extra); break;
      case "Top Rated":    list.sort((a, b) => b.rating - a.rating); break;
      case "Name A-Z":     list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:             list.sort((a, b) => b.id - a.id); break;
    }

    return list;
  }, [searchQuery, selectedCategory, selectedPricing, orderBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPricing([]);
    setOrderBy("Latest");
    setPage(1);
  };

  const togglePricing = (p: string) => {
    setSelectedPricing((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
    setPage(1);
  };

  /* ── Likes (local) ── */
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const toggleLike = (id: number) =>
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ━━━━━━━━━━━━━━━━━━ Sidebar ━━━━━━━━━━━━━━━━━━ */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("filters")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            activeTab === "filters" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            activeTab === "categories" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Categories
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-5 space-y-6">
        {activeTab === "filters" ? (
          <>
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-b border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 pl-9 pr-3 py-2.5 transition"
                />
              </div>
            </div>

            {/* Category dropdown */}
            <div ref={catRef} className="relative">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select AI Agents</label>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full flex items-center justify-between bg-transparent border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white hover:border-white/20 transition"
              >
                <span className="truncate">{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#121218] border border-white/10 rounded-lg shadow-2xl z-50 py-1 max-h-60 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition ${
                        selectedCategory === cat ? "text-indigo-400 font-semibold" : "text-gray-300"
                      }`}
                    >
                      {cat === "All" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing model */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Select Pricing Model</label>
              <div className="space-y-2.5">
                {PRICING_OPTIONS.map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        selectedPricing.includes(p)
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-white/20 group-hover:border-white/40"
                      }`}
                    >
                      {selectedPricing.includes(p) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order by */}
            <div ref={orderRef} className="relative">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order by</label>
              <button
                onClick={() => setShowOrderDropdown(!showOrderDropdown)}
                className="w-full flex items-center justify-between bg-transparent border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white hover:border-white/20 transition"
              >
                <span>{orderBy}</span>
                <div className="flex items-center gap-1">
                  {orderBy !== "Latest" && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setOrderBy("Latest"); }}
                      className="text-gray-500 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showOrderDropdown ? "rotate-180" : ""}`} />
                </div>
              </button>
              {showOrderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#121218] border border-white/10 rounded-lg shadow-2xl z-50 py-1">
                  {ORDER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setOrderBy(opt); setShowOrderDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition ${
                        orderBy === opt ? "text-indigo-400 font-semibold" : "text-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Categories tab */
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                  selectedCategory === cat
                    ? "bg-indigo-500/15 text-indigo-400 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-1 pb-4 space-y-3 pt-3 border-t border-white/10">
        <button
          onClick={() => { resetFilters(); setSidebarOpen(false); }}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={resetFilters}
          className="w-full text-gray-400 hover:text-white text-sm font-medium flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );

  /* ━━━━━━━━━━━━━━━━━━ JSX ━━━━━━━━━━━━━━━━━━ */
  return (
    <div className="min-h-screen bg-[#09090b] pt-16">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0e0e12] border-r border-white/10 p-4 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto flex">
        {/* ─── Desktop Sidebar ─── */}
        <aside className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0 border-r border-white/[0.06] min-h-[calc(100vh-64px)] sticky top-16 p-5">
          <SidebarContent />
        </aside>

        {/* ─── Main Content ─── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white text-sm font-medium border border-white/10 rounded-lg px-3 py-1.5 transition"
              >
                Filters
              </button>
              <p className="text-gray-400 text-sm hidden sm:block">
                Showing{" "}
                <span className="text-indigo-400 font-semibold">
                  {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                out of <span className="text-white font-semibold">{filtered.length} results</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Pagination arrows */}
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Grid / List toggle */}
              <div className="flex border border-white/10 rounded-lg overflow-hidden ml-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Results Grid / List ─── */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg font-semibold mb-1">No agents found</p>
              <p className="text-gray-600 text-sm">Try adjusting your filters or search query.</p>
              <button onClick={resetFilters} className="mt-5 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition">
                Reset all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginated.map((agent) => (
                <AgentCard key={agent.id} agent={agent} liked={liked.has(agent.id)} onToggleLike={() => toggleLike(agent.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginated.map((agent) => (
                <AgentListItem key={agent.id} agent={agent} liked={liked.has(agent.id)} onToggleLike={() => toggleLike(agent.id)} />
              ))}
            </div>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm disabled:opacity-30 disabled:pointer-events-none transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    p === page ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm disabled:opacity-30 disabled:pointer-events-none transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━ Agent Card (Grid) ━━━━━━━━━━━━━━━━━━ */
function AgentCard({
  agent,
  liked,
  onToggleLike,
}: {
  agent: Agent;
  liked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="group bg-[#111116] border border-white/[0.07] rounded-xl overflow-hidden hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col">
      {/* Screenshot */}
      <div className="relative h-[160px] overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent opacity-60" />

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/90 text-white">
            <Zap className="w-3 h-3" />
          </span>
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-600/90 text-white">
            <DollarSign className="w-3 h-3" />
          </span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
            {Array.from({ length: agent.rating }).map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            ))}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm ${pricingColor(agent.pricing)}`}>
            {agent.pricing === "Free Trial" ? "Free Trial" : agent.pricing}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 pt-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
            <img src={agent.logo} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-[15px] font-bold text-white truncate">{agent.name}</h3>
            {agent.verified && <BadgeCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
          </div>
        </div>

        <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 mb-4">
          {agent.desc}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 truncate max-w-[140px]">
              {agent.category}
            </span>
            {agent.extra > 0 && (
              <span className="text-[11px] font-semibold text-gray-500 px-1.5">
                +{agent.extra}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleLike}
              className={`p-1.5 rounded-md transition ${
                liked ? "text-rose-400 bg-rose-400/10" : "text-gray-500 hover:text-rose-400 hover:bg-white/5"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━ Agent List Item ━━━━━━━━━━━━━━━━━━ */
function AgentListItem({
  agent,
  liked,
  onToggleLike,
}: {
  agent: Agent;
  liked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="group flex gap-4 bg-[#111116] border border-white/[0.07] rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 p-3">
      {/* Thumbnail */}
      <div className="relative w-[160px] h-[100px] sm:w-[200px] sm:h-[120px] flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm ${pricingColor(agent.pricing)}`}>
          {agent.pricing}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
              <img src={agent.logo} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-bold text-white truncate">{agent.name}</h3>
            {agent.verified && <BadgeCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
            <div className="flex items-center gap-0.5 ml-1">
              {Array.from({ length: agent.rating }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{agent.desc}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] font-semibold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
            {agent.category}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-gray-500 hover:text-white transition">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleLike}
              className={`p-1 rounded transition ${liked ? "text-rose-400" : "text-gray-500 hover:text-rose-400"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
