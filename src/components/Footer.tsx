import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai&backgroundColor=ffffff" alt="LeadFlow AI" className="w-full h-full scale-125" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">LeadFlow AI</span>
            </Link>
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-sm mb-8">
              Find any business anywhere on Google Maps. AI-powered lead generation that enriches contact info and sends personalized outreach automatically in seconds.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-[15px]">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-[15px]">Pricing</Link></li>
              <li><Link href="/agents" className="text-gray-400 hover:text-white transition-colors text-[15px]">AI Agents</Link></li>
              <li><Link href="/tools" className="text-gray-400 hover:text-white transition-colors text-[15px]">AI Tools</Link></li>
              <li><Link href="/changelog" className="text-gray-400 hover:text-white transition-colors text-[15px]">Changelog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-[15px]">Blog</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors text-[15px]">AI Events</Link></li>
              <li><Link href="/jobs" className="text-gray-400 hover:text-white transition-colors text-[15px]">AI Jobs</Link></li>
              <li><Link href="/agencies" className="text-gray-400 hover:text-white transition-colors text-[15px]">AI Agencies</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-[15px]">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-[15px]">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-[15px]">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-[15px]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-[15px]">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[14px]">
            &copy; {new Date().getFullYear()} LeadFlow AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-[14px] flex items-center gap-2">
              <Mail className="w-4 h-4" /> support@leadflow.ai
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
