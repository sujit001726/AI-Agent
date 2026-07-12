"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, MapPin, Menu, X } from "lucide-react";
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#111113]/95 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-[#111113] backdrop-blur-none"
        }`}
        style={{ paddingTop: "14px", paddingBottom: "10px" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
            >
              {/* Robot face SVG matching reference image */}
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="16" height="12" rx="3" fill="white" fillOpacity="0.95"/>
                <circle cx="9" cy="14" r="2" fill="#6366f1"/>
                <circle cx="15" cy="14" r="2" fill="#6366f1"/>
                <rect x="9" y="17.5" width="6" height="1.5" rx="0.75" fill="#6366f1" fillOpacity="0.6"/>
                <rect x="11" y="5" width="2" height="3" rx="1" fill="white" fillOpacity="0.9"/>
                <circle cx="12" cy="4.5" r="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="2" y="11" width="2" height="4" rx="1" fill="white" fillOpacity="0.7"/>
                <rect x="20" y="11" width="2" height="4" rx="1" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
          </Link>

          {/* Search bar */}
          <div className="relative hidden lg:flex items-center flex-shrink-0">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="bg-white/8 border border-white/15 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400/50 focus:bg-white/12 pl-9 pr-3 py-2 w-[210px] lg:w-[250px] transition-all duration-200"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Nav Links */}
          <div className="hidden xl:flex items-center">
            {[
              { href: "/", label: "Home" },
              { href: "/agents", label: "AI Agents" },
              { href: "/tools", label: "AI Tools" },
              { href: "/events", label: "AI Events" },
              { href: "/jobs", label: "AI Jobs" },
              { href: "/agencies", label: "AI Agencies" },
              { href: "/blog", label: "Blog" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white/85 hover:text-white hover:bg-white/10 transition-all duration-150 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-1">
            {/* Sign in */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-white transition-colors duration-150 px-2 py-1.5 rounded-md hover:bg-white/10"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xl:inline whitespace-nowrap">Sign in or Register</span>
            </button>

            {/* Cart */}
            <button className="text-white/85 hover:text-white transition-colors duration-150 p-1.5 hover:bg-white/10 rounded-md">
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>

            {/* Add a listing — white button with purple text */}
            <Link
              href="/add-listing"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] bg-white hover:bg-gray-50 transition-all duration-200 px-4 py-2 rounded-md whitespace-nowrap shadow-sm ml-2"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>Add a listing</span>
            </Link>

            {/* Mobile Menu Toggle */}
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
              <Link href="/" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">Home</Link>
              <Link href="/agents" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">AI Agents</Link>
              <Link href="/tools" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">AI Tools</Link>
              <Link href="/events" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">AI Events</Link>
              <Link href="/jobs" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">AI Jobs</Link>
              <Link href="/agencies" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">AI Agencies</Link>
              <Link href="/blog" className="block text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium">Blog</Link>
              <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                <button
                  onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-2 text-left text-white hover:bg-white/10 transition px-4 py-3 rounded-lg font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign in or Register
                </button>
                <Link
                  href="/add-listing"
                  className="flex items-center gap-2 text-purple-300 border border-purple-400/70 text-center px-4 py-3 rounded-lg font-semibold justify-center"
                >
                  <MapPin className="w-4 h-4" />
                  Add a listing
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
