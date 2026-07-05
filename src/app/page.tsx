"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Users, ShoppingBag, User, Building2
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("AI Agents");

  const tabs = [
    { 
      name: "AI Agents", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a3 3 0 013 3v2h2v4h-2v1a3 3 0 01-3 3h-6a3 3 0 01-3-3v-1H5v-4h2v-2a3 3 0 013-3h1V5.73A2 2 0 0110 4a2 2 0 012-2zm0 6H9a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-1-1h-3zm-2 3a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
        </svg>
      )
    },
    { 
      name: "AI Tools", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
           <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      )
    },
    { 
      name: "Events", 
      icon: <Building2 className="w-5 h-5 fill-transparent" />
    },
    { 
      name: "Jobs", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      )
    },
    { 
      name: "AI Agencies", 
      icon: <Users className="w-5 h-5 fill-transparent" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-x-hidden">
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/hero-bg.jpg')",
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          {/* Additional gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <main className="relative z-20 pt-32 pb-20 px-4 flex flex-col items-center justify-center w-full">
        
        <div className="text-center max-w-6xl mx-auto mb-12 relative z-10 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 tracking-tight leading-[1.15]">
            Discover. Compare. <span className="gradient-text">Stay Ahead.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed">
            Discover the Newest AI Agents Revolutionizing Everything
          </p>
        </div>

        {/* Search Interface */}
        <div className="w-full max-w-[1100px] mx-auto px-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-5 px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
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

          {/* Search Box */}
          <div className="glass-card rounded-xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-xl">
            
            <div className="flex-[1.5] w-full sm:border-r border-white/10 px-4 sm:px-5 py-3 sm:py-3.5">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="w-full text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base bg-transparent font-medium"
              />
            </div>

            <div className="flex-1 w-full sm:border-r border-white/10 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-sm sm:text-[15px] group-hover:text-white transition font-medium">Select AI Agents</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <div className="flex-1 w-full sm:border-r border-white/10 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-sm sm:text-[15px] group-hover:text-white transition font-medium">Select Pricing</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all sm:ml-1.5 shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] duration-200">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Search
            </button>

          </div>

        </div>

      </main>

      </section>

      {/* Featured Section */}
      <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured <span className="gradient-text-blue">AI Agents</span></h2>
          <Link href="/agents" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm sm:text-base flex items-center gap-1.5 transition group">
            View all 
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="glass rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-white/10 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=agent${i}&backgroundColor=6366f1`} alt="Agent" className="w-full h-full" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">AI Agent {i}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">Advanced AI agent revolutionizing automation and productivity workflows.</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">Automation</span>
                <span className="text-sm font-bold text-white">$29<span className="text-gray-500 text-xs">/mo</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="relative z-20 py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5 bg-gradient-to-b from-black/40 to-black/60">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-gray-500 font-semibold text-xs sm:text-sm mb-6 sm:mb-8 uppercase tracking-wider">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 opacity-50 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="h-6 sm:h-7 md:h-8 text-white hover:scale-110 transition-transform" viewBox="0 0 100 30" fill="currentColor">
                <rect width="100" height="30" rx="4" fill="currentColor" fillOpacity="0.15"/>
                <text x="50" y="20" fontSize="13" textAnchor="middle" fill="currentColor" fontWeight="600">LOGO {i}</text>
              </svg>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
