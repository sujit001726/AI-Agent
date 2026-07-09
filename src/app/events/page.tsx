"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  RotateCcw,
  Calendar,
  X,
} from "lucide-react";

/* ────────────────── Types ────────────────── */
interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  pricing: "Free" | "Paid";
  format: "Online" | "In-Person" | "Hybrid";
  image: string;
  eventType: string;
}

/* ────────────────── Mock Data ────────────────── */
const EVENTS: Event[] = [
  {
    id: 1,
    title: "CodeAegis Pvt Ltd",
    startDate: "February 16, 2016 12:00 am",
    endDate: "December 31, 2026",
    location: "India",
    pricing: "Free",
    format: "Hybrid",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    eventType: "Hackathon",
  },
  {
    id: 2,
    title: "Global AI Summit 2026",
    startDate: "October 10, 2026 9:00 am",
    endDate: "October 12, 2026",
    location: "USA",
    pricing: "Paid",
    format: "In-Person",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    eventType: "Conference",
  },
  {
    id: 3,
    title: "Generative AI Hackathon",
    startDate: "November 5, 2026 10:00 am",
    endDate: "November 7, 2026",
    location: "Online",
    pricing: "Free",
    format: "Online",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    eventType: "Hackathon",
  },
  {
    id: 4,
    title: "AI in Healthcare Symposium",
    startDate: "September 20, 2026 8:30 am",
    endDate: "September 21, 2026",
    location: "UK",
    pricing: "Paid",
    format: "Hybrid",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
    eventType: "Symposium",
  },
  {
    id: 5,
    title: "Future of Work: Agents",
    startDate: "December 1, 2026 2:00 pm",
    endDate: "December 1, 2026",
    location: "Online",
    pricing: "Free",
    format: "Online",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
    eventType: "Webinar",
  },
  {
    id: 6,
    title: "AGI Alignment Workshop",
    startDate: "August 15, 2026 9:00 am",
    endDate: "August 17, 2026",
    location: "USA",
    pricing: "Paid",
    format: "In-Person",
    image: "https://images.unsplash.com/photo-1475721025505-c310742fef06?w=600&q=80",
    eventType: "Workshop",
  },
];

const DATE_FILTERS = [
  "Any day",
  "Today",
  "This week",
  "This weekend",
  "Next week",
  "Pick a date",
];

const EVENT_TYPES = ["All", "Conference", "Hackathon", "Webinar", "Workshop", "Symposium"];
const LOCATIONS = ["All", "Online", "India", "USA", "UK", "Canada", "Europe"];

const ITEMS_PER_PAGE = 6;

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━━━ */
export default function EventsPage() {
  const [searchQuery, setSearchQuery]       = useState("");
  const [dateFilter, setDateFilter]         = useState("Any day");
  const [selectedType, setSelectedType]     = useState("All");
  const [selectedLocation, setSelectedLoc]  = useState("All");
  const [isPaidOnly, setIsPaidOnly]         = useState(false);
  const [page, setPage]                     = useState(1);
  const [showTypeDrop, setShowTypeDrop]     = useState(false);
  const [showLocDrop, setShowLocDrop]       = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [activeTab, setActiveTab]           = useState<"filters" | "categories">("filters");

  const typeRef = useRef<HTMLDivElement>(null);
  const locRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setShowTypeDrop(false);
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocDrop(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    let list = [...EVENTS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    if (selectedType !== "All") list = list.filter((e) => e.eventType === selectedType);
    if (selectedLocation !== "All") list = list.filter((e) => e.location === selectedLocation);
    if (isPaidOnly) list = list.filter((e) => e.pricing === "Paid");
    return list;
  }, [searchQuery, selectedType, selectedLocation, isPaidOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setDateFilter("Any day");
    setSelectedType("All");
    setSelectedLoc("All");
    setIsPaidOnly(false);
    setPage(1);
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

            {/* Dates Grid */}
            <div>
              <p className="text-[13px] text-gray-400 mb-3 font-medium">Show events from</p>
              <div className="grid grid-cols-2 gap-2">
                {DATE_FILTERS.map((df) => (
                  <button
                    key={df}
                    onClick={() => { setDateFilter(df); setPage(1); }}
                    className={`px-3 py-2 text-[13px] rounded-[4px] font-medium border transition ${
                      dateFilter === df
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "bg-[#16161b] text-gray-300 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Type */}
            <div ref={typeRef} className="relative">
              <button
                onClick={() => setShowTypeDrop(!showTypeDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[14px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedType === "All" ? "Select AI Event Type" : selectedType}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showTypeDrop ? "rotate-180" : ""}`} />
              </button>
              {showTypeDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {EVENT_TYPES.map((t) => (
                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedType === t ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{t === "All" ? "All Event Types" : t}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div ref={locRef} className="relative">
              <button
                onClick={() => setShowLocDrop(!showLocDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[14px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedLocation === "All" ? "Location" : selectedLocation}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showLocDrop ? "rotate-180" : ""}`} />
              </button>
              {showLocDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {LOCATIONS.map((l) => (
                    <button key={l} onClick={() => { setSelectedLoc(l); setShowLocDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedLocation === l ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{l === "All" ? "All Locations" : l}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Model Checkbox */}
            <div>
              <p className="text-[13px] text-gray-400 mb-2 font-medium">Pricing Model</p>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition ${isPaidOnly ? "bg-indigo-600 border-indigo-500" : "bg-[#16161b] border-white/20 group-hover:border-white/40"}`}>
                  {isPaidOnly && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition">Paid</span>
              </label>
            </div>
          </>
        ) : (
          <div className="space-y-1">
            {EVENT_TYPES.map((t) => (
              <button key={t} onClick={() => { setSelectedType(t); setPage(1); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${selectedType === t ? "bg-indigo-500/20 text-indigo-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >{t === "All" ? "All Event Types" : t}</button>
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
                Showing <span className="font-semibold text-white">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
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
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#111116] rounded-xl border border-white/10">
              <Calendar className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-white text-lg font-semibold mb-2">No events found</p>
              <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="mt-6 text-indigo-400 font-semibold hover:text-indigo-300 transition">Reset all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {paginated.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━ EVENT CARD ━━━━━━━━━━━━━━━ */
function EventCard({ event }: { event: Event }) {
  return (
    <div className="group relative bg-[#111116] border border-white/[0.08] rounded-[12px] overflow-hidden hover:border-white/20 hover:shadow-lg transition-all h-[240px] cursor-pointer">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
      
      {/* Dark overlay for bottom text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[12px] font-medium text-white shadow-sm">
          {event.location}
        </span>
        <span className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[12px] font-medium text-white shadow-sm">
          {event.pricing}
        </span>
        <span className="px-2.5 py-1 rounded-[4px] border border-white/20 bg-[#2C2C2E]/80 backdrop-blur-md text-[12px] font-medium text-white shadow-sm">
          {event.format}
        </span>
      </div>

      {/* Bottom Text Area */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-[17px] font-bold text-white mb-2 truncate">{event.title}</h3>
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <p className="text-[13px] truncate">
            {event.startDate} - {event.endDate}
          </p>
        </div>
      </div>
    </div>
  );
}
