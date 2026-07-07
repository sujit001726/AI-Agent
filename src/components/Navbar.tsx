"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, MapPin, Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-xl py-3 border-b border-white/10 shadow-lg" : "bg-black/30 backdrop-blur-md py-4 border-b border-white/5"}`}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-white rounded-md overflow-hidden flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=6366f1" alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
            </Link>
            <div className="relative hidden lg:flex items-center group">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 group-hover:text-white transition" />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 pl-10 pr-4 py-2 w-[220px] lg:w-[280px] placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          {/* Middle: Links */}
          <div className="hidden xl:flex items-center gap-1">
            <Link href="/" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">Home</Link>
            <Link href="/agents" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">AI Agents</Link>
            <Link href="/tools" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">AI Tools</Link>
            <Link href="/events" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">AI Events</Link>
            <Link href="/jobs" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">AI Jobs</Link>
            <Link href="/agencies" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">AI Agencies</Link>
            <Link href="/blog" className="text-white/90 hover:text-white hover:bg-white/10 transition px-4 py-2 rounded-lg text-sm font-semibold">Blog</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline">Sign in or Register</span>
            </button>
            <button className="text-white/90 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <Link href="/add-listing" className="hidden sm:flex bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition px-4 py-2 rounded-lg text-sm font-semibold items-center gap-2 shadow-lg hover:shadow-indigo-500/25 hover:scale-105 duration-200">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Add a listing</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
            <div className="px-4 py-6 space-y-1">
              <Link href="/" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">Home</Link>
              <Link href="/agents" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">AI Agents</Link>
              <Link href="/tools" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">AI Tools</Link>
              <Link href="/events" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">AI Events</Link>
              <Link href="/jobs" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">AI Jobs</Link>
              <Link href="/agencies" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">AI Agencies</Link>
              <Link href="/blog" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">Blog</Link>
              <div className="pt-4 border-t border-white/10 mt-4">
                <button onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }} className="block w-full text-left text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-semibold">Sign in or Register</button>
                <Link href="/add-listing" className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center px-4 py-3 rounded-lg font-semibold mt-2">Add a listing</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
