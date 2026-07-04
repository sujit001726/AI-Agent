"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Zap, ChevronRight, CheckCircle2, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0A0A0B] text-white font-sans overflow-hidden">
      
      {/* LEFT COLUMN: BRANDING & FEATURES */}
      <div className="w-full md:w-[55%] relative flex flex-col px-8 py-10 md:px-16 lg:px-24 justify-center" 
           style={{ background: "radial-gradient(circle at right center, rgba(30, 20, 60, 0.4) 0%, rgba(10, 10, 11, 1) 70%)" }}>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-between max-w-2xl">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16 pt-4">
            <div className="w-9 h-9 rounded-lg bg-[#2A2B3D] flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">LeadFlow</span>
            <span className="text-[10px] font-semibold bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded uppercase tracking-wider">AI</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 w-fit mb-8">
              <Zap className="w-3.5 h-3.5" />
              Trusted by 50,000+ businesses
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-[54px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
              The smartest way to<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400">
                find & reach leads
              </span>
            </h1>

            <p className="text-gray-400 text-[17px] leading-relaxed mb-10 max-w-lg">
              LeadFlow uses AI + Google Maps to discover any business worldwide and send personalized outreach in seconds.
            </p>

          </div>

          {/* Footer Badges */}
          <div className="mt-16 flex items-center gap-6 text-[13px] text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-600" />
              SOC 2 Certified
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gray-600" />
              GDPR Compliant
            </span>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN FORM */}
      <div className="w-full md:w-[45%] flex flex-col items-center justify-center p-8 relative z-10">
        
        <div className="w-full max-w-[440px]">
          
          {/* Tabs: Sign In / Create Account */}
          <div className="flex bg-[#121217] p-1 rounded-lg mb-8 border border-white/5">
            <button className="flex-1 bg-[#6C5CE7] text-white text-sm font-semibold py-2.5 rounded-md shadow-lg transition-colors">
              Sign In
            </button>
            <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold py-2.5 rounded-md transition-colors">
              Create Account
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-[#121217]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 lg:p-10 shadow-2xl relative">
            
            <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-400 text-[15px] mb-8">Sign in to your LeadFlow workspace</p>

            {/* Google Login */}
            <button className="w-full flex items-center justify-center gap-3 bg-[#1A1A24] hover:bg-[#22222E] border border-white/5 text-white font-medium py-3 rounded-lg transition-all mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-3 text-xs text-gray-500 font-medium">or with email</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[13px] text-gray-400 font-medium ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    className="w-full bg-[#1A1A24] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[13px] text-gray-400 font-medium">Password</label>
                  <a href="#" className="text-[13px] text-[#6C5CE7] hover:text-indigo-400 transition-colors font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full bg-[#1A1A24] border border-white/5 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-500 hover:text-gray-300" /> : <Eye className="w-4 h-4 text-gray-500 hover:text-gray-300" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-2 shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="mt-8 text-center text-[13px] text-gray-500">
              Don't have an account? <Link href="/register" className="text-[#6C5CE7] font-medium hover:text-indigo-400 transition-colors">Sign up free</Link>
            </div>
            
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Lock className="w-3 h-3" />
            Secured by enterprise-grade encryption
          </div>

        </div>
      </div>

    </div>
  );
}
