"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, Users, Building2, Zap } from "lucide-react";

const MOCK_DATA: Record<string, Array<{ id: number; name: string; category: string; desc: string; price: string; image: string }>> = {
  "AI Agents": [
    { id: 1, name: "AutoAgent GPT", category: "Automation", desc: "Autonomous agent designed to automate browser tasks, research, and spreadsheets.", price: "$29/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent1&backgroundColor=6366f1" },
    { id: 2, name: "DevBot Pro", category: "Development", desc: "AI developer that commits code, fixes bugs, and writes tests autonomously.", price: "$49/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent2&backgroundColor=6366f1" },
    { id: 3, name: "WriteFlow AI", category: "Marketing", desc: "Long-form content creator and scheduler for multi-channel publishing.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent3&backgroundColor=6366f1" },
    { id: 4, name: "SupportHero", category: "Customer Support", desc: "AI assistant that handles tier 1 support tickets and live chats in 50+ languages.", price: "$79/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent4&backgroundColor=6366f1" },
    { id: 5, name: "LeadScout", category: "Sales", desc: "Automatically searches public directories and enriches lead details.", price: "$19/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent5&backgroundColor=6366f1" },
    { id: 6, name: "DesignGen", category: "Design", desc: "Converts text prompts into responsive Figma layouts and landing pages.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent6&backgroundColor=6366f1" },
    { id: 7, name: "TaskSync AI", category: "Automation", desc: "Integrates apps and synchronizes databases without API keys.", price: "$9/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent7&backgroundColor=6366f1" },
    { id: 8, name: "Analytica AI", category: "Data Science", desc: "Processes CSV/JSON files and generates beautiful PDF reports.", price: "$39/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agent8&backgroundColor=6366f1" },
  ],
  "AI Tools": [
    { id: 1, name: "PromptBuilder", category: "Developer Tools", desc: "AI prompt optimizer and playground for LLM fine-tuning.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=tool1&backgroundColor=3b82f6" },
    { id: 2, name: "VoiceSync", category: "Audio", desc: "Instantly clones any voice with ultra-realistic emotional range.", price: "$15/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=tool2&backgroundColor=3b82f6" },
    { id: 3, name: "VisionQuery", category: "Computer Vision", desc: "Analyze images and video feeds in real-time with zero-latency APIs.", price: "$99/mo", image: "https://api.dicebear.com/7.x/bottts/svg?seed=tool3&backgroundColor=3b82f6" },
    { id: 4, name: "SEO-AI", category: "Marketing", desc: "Scrapes search results and optimizes your blog content for Google ranking.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=tool4&backgroundColor=3b82f6" },
  ],
  "Events": [
    { id: 1, name: "AI Summit 2026", category: "Conference", desc: "The largest global gathering of developers, founders, and VC firms.", price: "From $199", image: "https://api.dicebear.com/7.x/bottts/svg?seed=event1&backgroundColor=ec4899" },
    { id: 2, name: "Agentic Hackathon", category: "Hackathon", desc: "48-hour build session focusing on multi-agent collaboration frameworks.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=event2&backgroundColor=ec4899" },
    { id: 3, name: "Figma + AI Meetup", category: "Meetup", desc: "Local meetup discussing the intersection of UI design and generative models.", price: "Free", image: "https://api.dicebear.com/7.x/bottts/svg?seed=event3&backgroundColor=ec4899" },
  ],
  "Jobs": [
    { id: 1, name: "Agent Systems Engineer", category: "Full-Time", desc: "Design multi-agent task execution and scheduler queues using BullMQ.", price: "$140k - $180k", image: "https://api.dicebear.com/7.x/bottts/svg?seed=job1&backgroundColor=f59e0b" },
    { id: 2, name: "Prompt Engineer", category: "Contract", desc: "Optimize LLM system prompts and evaluate performance benchmarks.", price: "$100/hr", image: "https://api.dicebear.com/7.x/bottts/svg?seed=job2&backgroundColor=f59e0b" },
    { id: 3, name: "AI Product Designer", category: "Full-Time", desc: "Design intuitive interfaces for complex generative AI workflows.", price: "$120k - $150k", image: "https://api.dicebear.com/7.x/bottts/svg?seed=job3&backgroundColor=f59e0b" },
  ],
  "AI Agencies": [
    { id: 1, name: "Synthetica Labs", category: "Consulting", desc: "Helps enterprises integrate large language models and automate workflows.", price: "Custom Quote", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agency1&backgroundColor=10b981" },
    { id: 2, name: "VectorFlow", category: "Development", desc: "Specializes in building custom vector databases and search indexes.", price: "Custom Quote", image: "https://api.dicebear.com/7.x/bottts/svg?seed=agency2&backgroundColor=10b981" },
  ]
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("AI Agents");
  const [searchQuery, setSearchQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState("All Categories");
  const [priceFilter, setPriceFilter] = useState("All Pricing");

  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const tabs = [
    { 
      name: "AI Agents", 
      icon: <span className="text-xl">🤖</span>
    },
    { 
      name: "AI Tools", 
      icon: <Zap className="w-5 h-5" />
    },
    { 
      name: "Events", 
      icon: <Building2 className="w-5 h-5" />
    },
    { 
      name: "Jobs", 
      icon: <Search className="w-5 h-5" />
    },
    { 
      name: "AI Agencies", 
      icon: <Users className="w-5 h-5" /> 
    },
  ];

  const getFilteredItems = () => {
    const items = MOCK_DATA[activeTab] || [];
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeTab !== "AI Agents" || agentFilter === "All Categories" || item.category === agentFilter;

      let matchesPrice = true;
      if (activeTab === "AI Agents" && priceFilter !== "All Pricing") {
        if (priceFilter === "Free") {
          matchesPrice = item.price.toLowerCase() === "free";
        } else if (priceFilter === "Paid") {
          matchesPrice = item.price.toLowerCase() !== "free";
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/ai-agent.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <main className="relative z-20 pt-32 pb-20 px-4 flex flex-col items-center justify-center w-full">
        <div className="text-center max-w-6xl mx-auto mb-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 tracking-tight leading-[1.15]">
            Discover. Compare. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Stay Ahead.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed">
            Discover the Newest AI Agents Revolutionizing Everything
          </p>
        </div>

        <div className="w-full max-w-[1100px] mx-auto px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 ease-out fill-mode-both">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-5 px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setSearchQuery("");
                    setAgentFilter("All Categories");
                    setPriceFilter("All Pricing");
                  }}
                  className={`flex items-center gap-2.5 text-sm sm:text-base font-semibold pb-2.5 transition-all border-b-[3px] ${
                    isActive ? "text-white border-indigo-500" : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 shadow-2xl">
            <div className="flex-[1.5] w-full sm:border-r border-white/10 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                className="w-full text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base bg-transparent font-medium"
              />
            </div>

            <div className="relative flex-1 w-full sm:border-r border-white/10">
              <div 
                onClick={() => {
                  setShowAgentDropdown(!showAgentDropdown);
                  setShowPriceDropdown(false);
                }}
                className="h-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer group"
              >
                <span className="text-gray-300 text-sm sm:text-[15px] group-hover:text-white transition font-medium truncate">
                  {activeTab === "AI Agents" ? agentFilter : "AI Agents Only"}
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {showAgentDropdown && activeTab === "AI Agents" && (
                <div className="absolute top-[105%] left-0 w-full bg-[#121217] border border-white/10 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                  {["All Categories", "Automation", "Development", "Marketing", "Customer Support", "Sales", "Design", "Data Science"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setAgentFilter(cat);
                        setShowAgentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors ${agentFilter === cat ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1 w-full sm:border-r border-white/10">
              <div 
                onClick={() => {
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowAgentDropdown(false);
                }}
                className="h-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer group"
              >
                <span className="text-gray-300 text-sm sm:text-[15px] group-hover:text-white transition font-medium truncate">
                  {activeTab === "AI Agents" ? priceFilter : "AI Agents Only"}
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {showPriceDropdown && activeTab === "AI Agents" && (
                <div className="absolute top-[105%] left-0 w-full bg-[#121217] border border-white/10 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                  {["All Pricing", "Free", "Paid"].map((pr) => (
                    <button
                      key={pr}
                      onClick={() => {
                        setPriceFilter(pr);
                        setShowPriceDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors ${priceFilter === pr ? "text-indigo-400 font-semibold" : "text-gray-300"}`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all sm:ml-1.5 shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] duration-200"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Search
            </button>
          </div>
        </div>



      </main>
      </section>

      <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{activeTab}</span></h2>
          <Link href={`/${activeTab.toLowerCase().replace(" ", "-")}`} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm sm:text-base flex items-center gap-1.5 transition group">
            View all 
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-colors duration-500 z-0"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 ease-out">
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                         <img src={item.image} alt={item.name} className="w-full h-full" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors duration-300">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-4">
                    <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">{item.category}</span>
                    <span className="text-sm font-bold text-white">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No items found matching your filters.
          </div>
        )}
      </section>

      <section className="py-16 px-4 sm:px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-gray-500 font-semibold text-sm mb-10 uppercase tracking-wider">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="h-8 text-white hover:scale-110 transition-transform" viewBox="0 0 100 30" fill="currentColor">
                <rect width="100" height="30" rx="4" fill="currentColor" fillOpacity="0.2"/>
                <text x="50" y="20" fontSize="13" textAnchor="middle" fill="currentColor" fontWeight="600">COMPANY {i}</text>
              </svg>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
