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
  Bookmark,
  Heart,
  X,
} from "lucide-react";

/* ────────────────── Types ────────────────── */
interface Job {
  id: number;
  title: string;
  type: string;
  logo: string;
  company: string;
  qualification: string;
  jobType: string;
}

/* ────────────────── Mock Data ────────────────── */
const JOBS: Job[] = [
  {
    id: 1,
    title: "Principal Applied Scientist (OCI) - Product Development – Gen AI and AI Solutions",
    company: "Oracle",
    type: "Full time",
    logo: "https://api.dicebear.com/7.x/icons/svg?seed=oracle&backgroundColor=e74c3c",
    qualification: "Ph.D",
    jobType: "Applied Science",
  },
  {
    id: 2,
    title: "Lead AI Engineer",
    company: "TechCorp",
    type: "Full time",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=lead&backgroundColor=3498db",
    qualification: "Master's",
    jobType: "Engineering",
  },
  {
    id: 3,
    title: "Senior AI/ML Engineer",
    company: "DataWorks",
    type: "Full time",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=senior&backgroundColor=2ecc71",
    qualification: "Bachelor's",
    jobType: "Engineering",
  },
  {
    id: 4,
    title: "AI Product Manager",
    company: "Innovate AI",
    type: "Part time",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=pm&backgroundColor=9b59b6",
    qualification: "Master's",
    jobType: "Product",
  },
  {
    id: 5,
    title: "Machine Learning Intern",
    company: "Startup ML",
    type: "Internship",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=intern&backgroundColor=f1c40f",
    qualification: "Bachelor's",
    jobType: "Engineering",
  },
  {
    id: 6,
    title: "Freelance Prompt Engineer",
    company: "Self",
    type: "Freelance",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=prompt&backgroundColor=1abc9c",
    qualification: "None",
    jobType: "Content",
  },
];

const JOB_TYPES = ["All", "Engineering", "Applied Science", "Research", "Product", "Content", "Design"];
const VACANCY_TYPES = ["Temporary", "Part time", "Internship", "Full time", "Freelance"];
const QUALIFICATIONS = ["All", "None", "Bachelor's", "Master's", "Ph.D"];

const ITEMS_PER_PAGE = 6;

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━━━ */
export default function JobsPage() {
  const [searchQuery, setSearchQuery]       = useState("");
  const [selectedJobType, setSelectedJob]   = useState("All");
  const [selectedVacancies, setVacancies]   = useState<string[]>([]);
  const [selectedQual, setSelectedQual]     = useState("All");
  const [page, setPage]                     = useState(1);
  const [showJobDrop, setShowJobDrop]       = useState(false);
  const [showQualDrop, setShowQualDrop]     = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [activeTab, setActiveTab]           = useState<"filters" | "categories">("filters");
  const [liked, setLiked]                   = useState<Set<number>>(new Set());

  const jobRef  = useRef<HTMLDivElement>(null);
  const qualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (jobRef.current && !jobRef.current.contains(e.target as Node)) setShowJobDrop(false);
      if (qualRef.current && !qualRef.current.contains(e.target as Node)) setShowQualDrop(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleVacancy = (v: string) => {
    setVacancies(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...JOBS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
    }
    if (selectedJobType !== "All") list = list.filter((j) => j.jobType === selectedJobType);
    if (selectedVacancies.length > 0) list = list.filter((j) => selectedVacancies.includes(j.type));
    if (selectedQual !== "All") list = list.filter((j) => j.qualification === selectedQual);
    return list;
  }, [searchQuery, selectedJobType, selectedVacancies, selectedQual]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedJob("All");
    setVacancies([]);
    setSelectedQual("All");
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
    <div className="flex flex-col h-full text-gray-800">
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

            {/* Job Type */}
            <div ref={jobRef} className="relative">
              <button
                onClick={() => setShowJobDrop(!showJobDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[14px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedJobType === "All" ? "Select AI Job Types" : selectedJobType}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showJobDrop ? "rotate-180" : ""}`} />
              </button>
              {showJobDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {JOB_TYPES.map((t) => (
                    <button key={t} onClick={() => { setSelectedJob(t); setShowJobDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedJobType === t ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{t === "All" ? "All Job Types" : t}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Vacancy type */}
            <div>
              <p className="text-[14px] text-gray-300 mb-4">Vacancy type</p>
              <div className="space-y-3">
                {VACANCY_TYPES.map((v) => (
                  <label key={v} onClick={(e) => { e.preventDefault(); toggleVacancy(v); }} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition ${selectedVacancies.includes(v) ? "bg-indigo-600 border-indigo-500" : "bg-[#16161b] border-white/20 group-hover:border-white/40"}`}>
                      {selectedVacancies.includes(v) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                    <span className="text-[14px] text-gray-400 group-hover:text-white transition">{v}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Qualification */}
            <div ref={qualRef} className="relative">
              <button
                onClick={() => setShowQualDrop(!showQualDrop)}
                className="w-full flex items-center justify-between bg-transparent text-[14px] text-gray-400 hover:text-white border-b border-white/10 pb-3 transition"
              >
                <span className="truncate">{selectedQual === "All" ? "Qualification" : selectedQual}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${showQualDrop ? "rotate-180" : ""}`} />
              </button>
              {showQualDrop && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {QUALIFICATIONS.map((q) => (
                    <button key={q} onClick={() => { setSelectedQual(q); setShowQualDrop(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${selectedQual === q ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >{q === "All" ? "All Qualifications" : q}</button>
                  ))}
                </div>
              )}
            </div>

          </>
        ) : (
          <div className="space-y-1">
            {JOB_TYPES.map((t) => (
              <button key={t} onClick={() => { setSelectedJob(t); setPage(1); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${selectedJobType === t ? "bg-indigo-500/20 text-indigo-400 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >{t === "All" ? "All Job Types" : t}</button>
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
                  <button className="text-gray-400 hover:text-white transition">
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#111116] rounded-xl border border-white/[0.06]">
              <Search className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-white text-lg font-semibold mb-2">No jobs found</p>
              <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="mt-6 text-[#7C3AED] font-semibold hover:text-[#6D28D9] transition">Reset all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {paginated.map((job) => (
                <JobCard key={job.id} job={job} liked={liked.has(job.id)} onToggleLike={() => toggleLike(job.id)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━ JOB CARD ━━━━━━━━━━━━━━━ */
function JobCard({ job, liked, onToggleLike }: { job: Job; liked: boolean; onToggleLike: () => void }) {
  return (
    <div className="bg-[#111116] border border-white/[0.06] rounded-[12px] shadow-sm hover:border-white/20 transition-all flex flex-col min-h-[160px] cursor-pointer">
      
      {/* Top Section */}
      <div className="p-5 flex gap-4 items-start flex-1">
        <div className="w-12 h-12 flex-shrink-0 bg-[#09090b] border border-white/[0.08] rounded-md overflow-hidden flex items-center justify-center p-1">
          <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-gray-100 leading-snug line-clamp-3">
            {job.title}
          </h3>
          <p className="text-[13px] text-gray-400 mt-1">{job.company}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.04] w-full" />

      {/* Bottom Section */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-[#7C3AED]" />
          </div>
          <span className="text-[14px] text-gray-300 font-medium">{job.type}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition">
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${liked ? 'border-rose-500/50 bg-rose-500/10 text-rose-500' : 'border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-400/50'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>
      </div>

    </div>
  );
}
