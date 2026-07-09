"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
  List,
  Heart,
  BadgeCheck,
  RotateCcw,
  Zap,
  X,
} from "lucide-react";

/* ────────────────── Types ────────────────── */
interface Tool {
  id: number;
  name: string;
  verified: boolean;
  desc: string;
  tags: string[];
  pricing: "Free" | "Free Trial" | "Freemium" | "Paid";
  rating: number;
  image: string;
  logo: string;
}

/* ────────────────── Mock Data ────────────────── */
const TOOLS: Tool[] = [
  { id: 1,  name: "IamKhanPhD",        verified: true,  desc: "FREE Prompt library for creating better AI",                                tags: ["Prompt Generators", "Productivity"],             pricing: "Free",       rating: 0, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",  logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=khan&backgroundColor=1e1e2e" },
  { id: 2,  name: "Future Prompts AI", verified: true,  desc: "FREE AI prompts that actually get you resi...",                              tags: ["Prompt Generators", "Productivity", "Learning"], pricing: "Free",       rating: 0, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=future&backgroundColor=6c5ce7" },
  { id: 3,  name: "Azure AI Foundry",  verified: true,  desc: "Build, customize, and manage intelligent ...",                              tags: ["Learning"],                                      pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=azure&backgroundColor=0078d4" },
  { id: 4,  name: "vid ai",            verified: false, desc: "Create unlimited viral short-form and long-form vide...",                   tags: ["Text to Video", "Ads Generator"],                pricing: "Paid",       rating: 0, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=vid&backgroundColor=ff6b6b" },
  { id: 5,  name: "veed ai",           verified: false, desc: "Create stunning AI videos from text or photos with b...",                   tags: ["Text to Video", "Image to Video"],               pricing: "Freemium",   rating: 0, image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=veed&backgroundColor=4834d4" },
  { id: 6,  name: "consensus ai",      verified: false, desc: "AI-powered academic search engine for peer-review...",                      tags: ["Research"],                                      pricing: "Freemium",   rating: 0, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=consensus&backgroundColor=2ed573" },
  { id: 7,  name: "Jasper AI",         verified: true,  desc: "Enterprise AI copilot for marketing teams — create on-brand content.",      tags: ["Copywriting", "Marketing"],                      pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=jasper&backgroundColor=f0932b" },
  { id: 8,  name: "Copy.ai",           verified: true,  desc: "AI-powered writing tool that generates marketing copy and emails.",         tags: ["Copywriting", "Email"],                          pricing: "Freemium",   rating: 4, image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=copyai&backgroundColor=6c5ce7" },
  { id: 9,  name: "Runway ML",         verified: true,  desc: "Next-gen AI creative suite for video editing and generation.",              tags: ["Video Generation", "Image Editing"],             pricing: "Freemium",   rating: 5, image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=runway&backgroundColor=e74c3c" },
  { id: 10, name: "Midjourney",        verified: true,  desc: "AI image generation tool creating stunning artwork from text.",             tags: ["Image Generation", "Art"],                       pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=midj&backgroundColor=1e272e" },
  { id: 11, name: "Notion AI",         verified: true,  desc: "AI writing assistant built into Notion — summarize and draft.",             tags: ["Productivity", "Writing"],                       pricing: "Freemium",   rating: 4, image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=notion&backgroundColor=000000" },
  { id: 12, name: "Synthesia",         verified: true,  desc: "Create professional AI videos with digital avatars in 130+ langs.",         tags: ["Text to Video", "Avatar"],                       pricing: "Paid",       rating: 5, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=synthesia&backgroundColor=5f27cd" },
];

const ALL_TOOL_TYPES = [
  "All", "Prompt Generators", "Productivity", "Learning", "Text to Video",
  "Image to Video", "Ads Generator", "Research", "Copywriting", "Marketing",
  "Video Generation", "Image Generation", "Image Editing", "Writing",
  "Text to Speech", "Voice Cloning", "Search", "Video Editing", "Design",
  "SEO", "Transcription", "Presentations", "Art", "Avatar", "Podcast",
  "E-commerce", "Email", "Content",
];

const PRICING_OPTIONS = ["Free", "Free Trial", "Freemium", "Paid"] as const;
const ORDER_OPTIONS   = ["Latest", "Most Popular", "Top Rated", "Name A-Z"];
const ITEMS_PER_PAGE  = 9;

function pricingBadge(p: string) {
  switch (p) {
    case "Free":       return "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30";
    case "Free Trial": return "bg-amber-600/20 text-amber-400 border border-amber-500/30";
    case "Freemium":   return "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30";
    case "Paid":       return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    default:           return "bg-white/10 text-gray-300 border border-white/20";
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━━━ */
export default function ToolsPage() {
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedType, setSelectedType]       = useState("All");
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [orderBy, setOrderBy]                 = useState("Latest");
  const [viewMode, setViewMode]               = useState<"grid" | "list">("grid");
  const [page, setPage]                       = useState(1);
  const [showOrderDrop, setShowOrderDrop]     = useState(false);
  const [showTypeDrop, setShowTypeDrop]       = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [activeTab, setActiveTab]             = useState<"filters" | "categories">("filters");
  const [liked, setLiked]                     = useState<Set<number>>(new Set());

  const orderRef = useRef<HTMLDivElement>(null);
  const typeRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (orderRef.current && !orderRef.current.contains(e.target as Node)) setShowOrderDrop(false);
      if (typeRef.current  && !typeRef.current.contains(e.target as Node))  setShowTypeDrop(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    let list = [...TOOLS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)));
    }
    if (selectedType !== "All") list = list.filter((t) => t.tags.some(tag => tag.includes(selectedType)));
    if (selectedPricing.length > 0) list = list.filter((t) => selectedPricing.includes(t.pricing));
    switch (orderBy) {
      case "Most Popular": list.sort((a, b) => b.id - a.id); break;
      case "Top Rated":    list.sort((a, b) => b.rating - a.rating); break;
      case "Name A-Z":     list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => b.id - a.id); break;
    }
    return list;
  }, [searchQuery, selectedType, selectedPricing, orderBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => { setSearchQuery(""); setSelectedType("All"); setSelectedPricing([]); setOrderBy("Latest"); setPage(1); };
  const toggleLike = (id: number) => setLiked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ━━━━━━━━━━━━━━━ SIDEBAR ━━━━━━━━━━━━━━━ */
  const Sidebar = () => (
    <div className="flex flex-col h-full text-gray-300">
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("filters")}
          className={`text-[15px] font-semibold pb-2 transition ${activeTab === "filters" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-white"}`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`text-[15px] font-semibold pb-2 transition ${activeTab === "categories" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-white"}`}
        >
          Categories
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-10">
        {activeTab === "filters" ? (
          <>
            {/* Search */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-white text-[15px] placeholder-gray-600 focus:outline-none border-b border-white/10 focus:border-indigo-500 pb-3 transition"
              />
            </div>

            {/* Tool type dropdown */}
            <div ref={typeRef} className="relative">
              <button
                onClick={() => setShowTypeDrop(!showTypeDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[15px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedType === "All" ? "Select AI Tool Type" : selectedType}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showTypeDrop ? "rotate-180" : ""}`} />
              </button>
              {showTypeDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {ALL_TOOL_TYPES.map((t) => (
                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedType === t ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{t === "All" ? "All Tool Types" : t}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing label */}
            <div>
              <button
                className="w-full flex items-center justify-between bg-transparent text-[15px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span>Select Pricing Model</span>
              </button>
            </div>

            {/* Order by */}
            <div ref={orderRef} className="relative">
              <p className="text-[13px] text-gray-500 mb-2">Order by</p>
              <button
                onClick={() => setShowOrderDrop(!showOrderDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[15px] text-white font-semibold border-b border-white/10 pb-3 transition"
              >
                <span>{orderBy}</span>
                <div className="flex items-center gap-2">
                  {orderBy !== "Latest" && (
                    <span onClick={(e) => { e.stopPropagation(); setOrderBy("Latest"); }} className="text-gray-500 hover:text-white transition cursor-pointer">
                      <X className="w-4 h-4" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showOrderDrop ? "rotate-180" : ""}`} />
                </div>
              </button>
              {showOrderDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1">
                  {ORDER_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => { setOrderBy(opt); setShowOrderDrop(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${orderBy === opt ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-1">
            {ALL_TOOL_TYPES.map((t) => (
              <button key={t} onClick={() => { setSelectedType(t); setPage(1); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${selectedType === t ? "bg-indigo-500/20 text-indigo-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >{t === "All" ? "All Tool Types" : t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="pt-6 space-y-4 mt-6">
        <button onClick={() => setSidebarOpen(false)}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button onClick={resetFilters}
          className="w-full text-gray-400 hover:text-white text-[15px] flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );

  /* ━━━━━━━━━━━━━━━ JSX ━━━━━━━━━━━━━━━ */
  return (
    <div className="min-h-screen bg-[#09090b] pt-[80px]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-[#111116] border-r border-white/10 p-6 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto flex bg-[#09090b] min-h-screen border-x border-white/[0.04]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-[300px] xl:w-[320px] flex-shrink-0 border-r border-white/[0.06] sticky top-[80px] h-[calc(100vh-80px)] px-7 py-8">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 bg-[#0a0a0c]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white text-sm font-medium border border-white/10 rounded-md px-3 py-1.5 transition">Filters</button>
            </div>
            
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-[15px] hidden sm:block">
                Showing <span className="font-semibold text-white">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> out of <span className="font-semibold text-white">3,130</span> results
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="p-1.5 text-white hover:text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition">
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
                <div className="flex ml-2 gap-2">
                  <button onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition ${viewMode === "grid" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#111116] rounded-xl border border-white/10">
              <Search className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-white text-lg font-semibold mb-2">No tools found</p>
              <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="mt-6 text-indigo-400 font-semibold hover:text-indigo-300 transition">Reset all filters</button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((tool) => (
                <ToolCard key={tool.id} tool={tool} liked={liked.has(tool.id)} onToggleLike={() => toggleLike(tool.id)} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginated.map((tool) => (
                <ToolListRow key={tool.id} tool={tool} liked={liked.has(tool.id)} onToggleLike={() => toggleLike(tool.id)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━ TOOL CARD ━━━━━━━━━━━━━━━ */
function ToolCard({ tool, liked, onToggleLike }: { tool: Tool; liked: boolean; onToggleLike: () => void }) {
  return (
    <div className="group bg-[#111116] border border-white/[0.08] rounded-[14px] overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-[340px]">
      {/* Image area */}
      <div className="relative h-[200px] overflow-hidden bg-gray-900 flex-shrink-0">
        <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />

        {/* Badges overlay matching design, but without stars */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
          {/* Yellow lightning box */}
          <div className="w-7 h-7 rounded border border-amber-400/50 bg-[#2C2C2E]/80 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>

          {/* Tag badges */}
          {tool.tags.map((tag) => (
            <div key={tag} className="px-3 h-7 flex items-center rounded border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[12px] font-medium text-white shadow-sm whitespace-nowrap">
              {tag}
            </div>
          ))}

          {/* Pricing */}
          <div className={`px-3 h-7 flex items-center rounded text-[12px] font-bold shadow-sm ${pricingBadge(tool.pricing)}`}>
            {tool.pricing}
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4 pb-0 flex gap-3.5">
        <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
          <img src={tool.logo} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-[15px] font-bold text-white truncate">{tool.name}</h3>
            {tool.verified && (
              <svg className="w-4 h-4 text-[#1DA1F2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/>
              </svg>
            )}
          </div>
          <p className="text-[13px] text-gray-400 leading-snug line-clamp-1">{tool.desc}</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-white/[0.06] flex items-center">
        <button className="flex-1 flex items-center justify-center py-3 text-gray-500 hover:text-white transition">
          <Search className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-white/[0.06]" />
        <button onClick={onToggleLike} className={`flex-1 flex items-center justify-center py-3 transition ${liked ? "text-rose-500" : "text-gray-500 hover:text-rose-500"}`}>
          <Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} />
        </button>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━ TOOL LIST ROW ━━━━━━━━━━━━━━━ */
function ToolListRow({ tool, liked, onToggleLike }: { tool: Tool; liked: boolean; onToggleLike: () => void }) {
  return (
    <div className="group flex gap-5 bg-[#111116] border border-white/[0.08] rounded-[14px] overflow-hidden hover:border-white/20 hover:shadow-lg transition-all p-4">
      <div className="relative w-[240px] h-[150px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
        <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          <div className="w-6 h-6 rounded border border-amber-400/50 bg-[#2C2C2E]/80 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div className={`px-2 h-6 flex items-center rounded text-[11px] font-bold ${pricingBadge(tool.pricing)}`}>{tool.pricing}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10"><img src={tool.logo} alt="" className="w-full h-full object-cover" /></div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[16px] font-bold text-white">{tool.name}</h3>
              {tool.verified && <svg className="w-4 h-4 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>}
            </div>
            <p className="text-gray-400 text-[14px] mt-1">{tool.desc}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button className="p-2 text-gray-500 hover:text-white"><Search className="w-4 h-4" /></button>
          <button onClick={onToggleLike} className={`p-2 ${liked ? "text-rose-500" : "text-gray-500 hover:text-rose-500"}`}><Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} /></button>
        </div>
      </div>
    </div>
  );
}
