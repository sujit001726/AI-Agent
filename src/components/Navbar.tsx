"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-5"}`}>
        <div className="w-full max-w-[1500px] mx-auto px-6 flex items-center justify-between">
          
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 overflow-hidden rounded-full">
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
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-2 text-[14px] text-white hover:text-gray-300 transition"
            >
              <User className="w-5 h-5 fill-white" />
              Sign in or Register
            </button>
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

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
