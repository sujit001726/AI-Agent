"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Map,
  RotateCcw,
  Heart,
  X,
} from "lucide-react";

/* ────────────────── Types ────────────────── */
interface Agency {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  location: string[];
  image: string;
  specialization: string;
}

/* ────────────────── Mock Data ────────────────── */
const AGENCIES: Agency[] = [
  {
    id: 1,
    name: "Elluminati",
    price: "$4,999",
    priceValue: 4999,
    location: ["United States"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    specialization: "AI Development",
  },
  {
    id: 2,
    name: "Getsvision Solutions Pvt Ltd",
    price: "$1,200",
    priceValue: 1200,
    location: ["India"],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    specialization: "Digital Marketing",
  },
  {
    id: 3,
    name: "BrainX Technologies",
    price: "$1,000,000",
    priceValue: 1000000,
    location: ["United States"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    specialization: "Enterprise AI",
  },
  {
    id: 4,
    name: "Code Creator Technology – Code Smarter. Grow Faster.",
    price: "$10,000",
    priceValue: 10000,
    location: ["India"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
    specialization: "App Development",
  },
  {
    id: 5,
    name: "SunTec India",
    price: "$5,000",
    priceValue: 5000,
    location: ["United States", "India"],
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    specialization: "Data Processing",
  },
  {
    id: 6,
    name: "Abstracta",
    price: "$1,000",
    priceValue: 1000,
    location: ["United Kingdom", "United States"],
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80",
    specialization: "QA & Testing",
  },
];

const SPECIALIZATIONS = ["All", "AI Development", "Digital Marketing", "Enterprise AI", "App Development", "Data Processing", "QA & Testing", "Consulting"];
const LOCATIONS = ["United States", "United Kingdom", "India", "Canada", "Germany"];

const ITEMS_PER_PAGE = 6;

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━━━ */
export default function AgenciesPage() {
  const [searchQuery, setSearchQuery]       = useState("");
  const [selectedSpec, setSelectedSpec]     = useState("All");
  const [selectedLocs, setSelectedLocs]     = useState<string[]>([]);
  const [priceRange, setPriceRange]         = useState<number>(1000000);
  const [page, setPage]                     = useState(1);
  const [showSpecDrop, setShowSpecDrop]     = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [activeTab, setActiveTab]           = useState<"filters" | "categories">("filters");
  const [liked, setLiked]                   = useState<Set<number>>(new Set());

  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (specRef.current && !specRef.current.contains(e.target as Node)) setShowSpecDrop(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleLocation = (l: string) => {
    setSelectedLocs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...AGENCIES];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (selectedSpec !== "All") list = list.filter((a) => a.specialization === selectedSpec);
    if (selectedLocs.length > 0) list = list.filter((a) => a.location.some(l => selectedLocs.includes(l)));
    list = list.filter((a) => a.priceValue <= priceRange);
    return list;
  }, [searchQuery, selectedSpec, selectedLocs, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpec("All");
    setSelectedLocs([]);
    setPriceRange(1000000);
    setPage(1);
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

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

      <div className="flex-1 overflow-y-auto space-y-8 pr-1">
        {activeTab === "filters" ? (
          <>
            {/* Search */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="What are you looking for?"
                className="w-full bg-transparent text-white text-[14px] placeholder-gray-500 focus:outline-none border-b border-white/10 focus:border-indigo-500 pb-3 transition"
              />
            </div>

            {/* Specialization */}
            <div ref={specRef} className="relative">
              <button
                onClick={() => setShowSpecDrop(!showSpecDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[14px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedSpec === "All" ? "Select AI Specialization" : selectedSpec}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showSpecDrop ? "rotate-180" : ""}`} />
              </button>
              {showSpecDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {SPECIALIZATIONS.map((t) => (
                    <button key={t} onClick={() => { setSelectedSpec(t); setShowSpecDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedSpec === t ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{t === "All" ? "All Specializations" : t}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Slider */}
            <div>
              <p className="text-[14px] text-gray-300 mb-2">Select Price</p>
              <div className="flex justify-between text-[13px] text-gray-400 font-medium mb-3">
                <span>0$</span>
                <span>{priceRange === 1000000 ? "1000000$" : `${priceRange}$`}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000000" 
                step="1000"
                value={priceRange} 
                onChange={(e) => { setPriceRange(Number(e.target.value)); setPage(1); }}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
              />
            </div>

            {/* Location */}
            <div>
              <p className="text-[14px] text-gray-300 mb-4">Location</p>
              <div className="space-y-3">
                {LOCATIONS.map((l) => (
                  <label key={l} onClick={(e) => { e.preventDefault(); toggleLocation(l); }} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition ${selectedLocs.includes(l) ? "bg-indigo-600 border-indigo-500" : "bg-[#16161b] border-white/20 group-hover:border-white/40"}`}>
                      {selectedLocs.includes(l) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                    <span className="text-[14px] text-gray-400 group-hover:text-white transition">{l}</span>
                  </label>
                ))}
              </div>
            </div>

          </>
        ) : (
          <div className="space-y-1">
            {SPECIALIZATIONS.map((t) => (
              <button key={t} onClick={() => { setSelectedSpec(t); setPage(1); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${selectedSpec === t ? "bg-indigo-500/20 text-indigo-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >{t === "All" ? "All Specializations" : t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="pt-6 space-y-4 mt-6">
        <button onClick={() => setSidebarOpen(false)}
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-lg text-[14px] font-semibold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button onClick={resetFilters}
          className="w-full text-gray-500 hover:text-white text-[14px] flex items-center justify-center gap-1.5 transition"
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

      <div className="max-w-[1600px] mx-auto flex bg-[#09090b] min-h-[calc(100vh-80px)] border-x border-white/[0.04]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-[300px] xl:w-[320px] flex-shrink-0 border-r border-white/[0.06] sticky top-[80px] h-[calc(100vh-80px)] px-7 py-8 bg-[#111116]">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 bg-[#09090b]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white text-sm font-medium border border-white/10 rounded-md px-3 py-1.5 transition">Filters</button>
            </div>
            
            <div className="flex items-center gap-6">
              <p className="text-gray-400 text-[14px]">
                Showing <span className="font-semibold text-white">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> out of <span className="font-semibold text-white">165</span> results
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="text-gray-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="text-gray-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition">
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="pl-3 border-l border-white/10 flex items-center">
                  <button className="text-gray-400 hover:text-white">
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#111116] rounded-xl border border-white/10">
              <Search className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-white text-lg font-semibold mb-2">No agencies found</p>
              <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="mt-6 text-indigo-400 font-semibold hover:text-indigo-300 transition">Reset all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {paginated.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} liked={liked.has(agency.id)} onToggleLike={() => toggleLike(agency.id)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━ AGENCY CARD ━━━━━━━━━━━━━━━ */
function AgencyCard({ agency, liked, onToggleLike }: { agency: Agency; liked: boolean; onToggleLike: () => void }) {
  return (
    <div className="group bg-[#111116] border border-white/[0.08] rounded-[12px] shadow-sm hover:shadow-md hover:border-white/20 transition-all flex flex-col h-[280px] cursor-pointer overflow-hidden">
      
      {/* Top Image Section */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        <img src={agency.image} alt={agency.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
        
        {/* Dark overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
          {agency.price && (
            <span className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[13px] font-bold text-white shadow-sm">
              {agency.price}
            </span>
          )}
          {agency.location.length > 0 && (
            <span className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[13px] font-medium text-white shadow-sm">
              {agency.location.join(", ")}
            </span>
          )}
        </div>

        {/* Agency Title */}
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="text-[18px] font-bold text-white leading-snug truncate">
            {agency.name}
          </h3>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-5 py-3.5 flex items-center justify-end bg-[#111116] border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition">
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${liked ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-white/10 text-gray-500 hover:text-rose-500 hover:border-rose-500/50'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-rose-500" : ""}`} />
          </button>
        </div>
      </div>

    </div>
  );
}
