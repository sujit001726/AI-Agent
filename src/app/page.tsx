"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Users, ShoppingBag, User, Building2
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("AI Agents");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { 
      name: "AI Agents", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM17.6009 15.2017C17.6009 15.2017 17.6009 15.2017 17.6009 15.2017C17.6009 15.2017 17.6009 15.2017 17.6009 15.2017ZM17.4725 10.9634C17.4725 10.9634 17.4725 10.9634 17.4725 10.9634C17.4725 10.9634 17.4725 10.9634 17.4725 10.9634ZM17.6416 10.9634C17.6416 10.9634 17.6416 10.9634 17.6416 10.9634C17.6416 10.9634 17.6416 10.9634 17.6416 10.9634ZM6.3578 10.9634C6.3578 10.9634 6.3578 10.9634 6.3578 10.9634C6.3578 10.9634 6.3578 10.9634 6.3578 10.9634ZM6.52688 10.9634C6.52688 10.9634 6.52688 10.9634 6.52688 10.9634C6.52688 10.9634 6.52688 10.9634 6.52688 10.9634ZM6.39853 15.2017C6.39853 15.2017 6.39853 15.2017 6.39853 15.2017C6.39853 15.2017 6.39853 15.2017 6.39853 15.2017ZM6.4764 15.3414C6.4764 15.3414 6.4764 15.3414 6.4764 15.3414C6.4764 15.3414 6.4764 15.3414 6.4764 15.3414ZM14.4984 8.78854L15.9388 6.29221C16.0371 6.12188 15.9789 5.89738 15.8087 5.79904C15.6384 5.70071 15.4139 5.75888 15.3156 5.92921L13.8441 8.47771C12.7231 7.96254 11.4116 7.64938 10 7.64938C8.58842 7.64938 7.27688 7.96254 6.15588 8.47771L4.68442 5.92921C4.58608 5.75888 4.36158 5.70071 4.19125 5.79904C4.02092 5.89738 3.96275 6.12188 4.06108 6.29221L5.50158 8.78854C3.04875 10.1332 1.34142 12.6395 1.05058 15.6322H18.9494C18.6586 12.6395 16.9513 10.1332 14.4984 8.78854ZM5.41525 13.5634C4.81075 13.5634 4.32108 13.0737 4.32108 12.4692C4.32108 11.8647 4.81075 11.375 5.41525 11.375C6.01975 11.375 6.50942 11.8647 6.50942 12.4692C6.50942 13.0737 6.01975 13.5634 5.41525 13.5634ZM14.5848 13.5634C13.9803 13.5634 13.4906 13.0737 13.4906 12.4692C13.4906 11.8647 13.9803 11.375 14.5848 11.375C15.1893 11.375 15.679 11.8647 15.679 12.4692C15.679 13.0737 15.1893 13.5634 14.5848 13.5634Z" />
        </svg>
      )
    },
    { 
      name: "AI Tools", 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
           {/* Alternative robot/tool icon matching reference roughly */}
           <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a3 3 0 013 3v2h2v4h-2v1a3 3 0 01-3 3h-6a3 3 0 01-3-3v-1H5v-4h2v-2a3 3 0 013-3h1V5.73A2 2 0 0110 4a2 2 0 012-2zm0 6H9a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-1-1h-3zm-2 3a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
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
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m11 8v6"/><path d="M8 11h6"/>
        </svg>
      )
    },
    { 
      name: "AI Agencies", 
      icon: <Users className="w-5 h-5 fill-transparent" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-x-hidden">
      
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 z-0 h-[100vh] w-full pointer-events-none overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/20 blur-[120px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent py-5"}`}>
        <div className="w-full max-w-[1500px] mx-auto px-6 flex items-center justify-between">
          
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 overflow-hidden rounded-full">
                {/* Robot Logo matching the screenshot approx */}
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai&backgroundColor=ffffff" alt="Logo" className="w-full h-full scale-125" />
              </div>
            </Link>
            <div className="relative hidden lg:flex items-center">
              <Search className="absolute left-2 w-4 h-4 text-white font-bold" />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="bg-transparent border-none text-white text-[15px] font-medium focus:outline-none pl-8 w-[240px] placeholder-white/80"
              />
            </div>
          </div>

          {/* Middle: Links */}
          <div className="hidden xl:flex items-center gap-7 text-[15px] font-medium tracking-wide">
            <Link href="/" className="text-white hover:text-gray-300 transition">Home</Link>
            <Link href="/agents" className="text-white hover:text-gray-300 transition">AI Agents</Link>
            <Link href="/tools" className="text-white hover:text-gray-300 transition">AI Tools</Link>
            <Link href="/events" className="text-white hover:text-gray-300 transition">AI Events</Link>
            <Link href="/jobs" className="text-white hover:text-gray-300 transition">AI Jobs</Link>
            <Link href="/agencies" className="text-white hover:text-gray-300 transition">AI Agencies</Link>
            <Link href="/blog" className="text-white hover:text-gray-300 transition">Blog</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:flex items-center gap-2 text-[14px] text-white hover:text-gray-300 transition">
              <User className="w-5 h-5 fill-white" />
              Sign in or Register
            </Link>
            <button className="text-white hover:text-gray-300 transition">
              <ShoppingBag className="w-[22px] h-[22px]" />
            </button>
            <Link href="/add-listing" className="bg-white text-indigo-600 hover:bg-gray-100 transition px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-2 shadow-lg hover:scale-105 transform duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
              </svg>
              Add a listing
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-20 pt-52 pb-32 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        
        <div className="text-center max-w-5xl mx-auto mb-16 relative z-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-[72px] font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Discover. Compare. <span className="gradient-text">Stay Ahead.</span>
          </h1>
          <p className="text-[20px] md:text-[24px] text-gray-300 font-medium max-w-3xl mx-auto">
            Discover the Newest AI Agents Revolutionizing Everything
          </p>
        </div>

        {/* Search Interface */}
        <div className="w-full max-w-[1000px] mx-auto">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-8 mb-4 px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 text-[16px] font-bold pb-3 transition-all border-b-[3px] ${
                    isActive ? "text-white border-indigo-500" : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="glass-card rounded-2xl p-[10px] flex flex-col md:flex-row items-center shadow-[0_0_40px_rgba(99,102,241,0.15)] border border-white/10 relative z-10">
            
            <div className="flex-[1.5] w-full md:border-r border-white/10 px-5 py-3">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="w-full text-white placeholder-gray-400 focus:outline-none text-[16px] bg-transparent"
              />
            </div>

            <div className="flex-1 w-full md:border-r border-white/10 px-5 py-3 flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-[15px] group-hover:text-white transition">Select AI Agents</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <div className="flex-1 w-full px-5 py-3 flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-[15px] group-hover:text-white transition">Select Pricing</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all ml-2 shadow-lg hover:shadow-indigo-500/25 hover:scale-105 duration-200">
              <Search className="w-5 h-5" />
              Search
            </button>

          </div>

        </div>

      </main>

      {/* Featured Section */}
      <section className="relative z-20 py-24 px-6 max-w-[1500px] mx-auto border-t border-white/5">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Featured <span className="gradient-text-blue">AI Agents</span></h2>
          <Link href="/agents" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition">
            View all <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition duration-300 group cursor-pointer border border-white/5 hover:border-indigo-500/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=agent${i}&backgroundColor=transparent`} alt="Agent" className="w-full h-full" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Agent {i}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">The most advanced AI agent for generating high quality leads automatically.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2.5 py-1 bg-white/5 text-gray-300 rounded-full">Automation</span>
                <span className="text-sm font-bold text-white">$29/mo</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
