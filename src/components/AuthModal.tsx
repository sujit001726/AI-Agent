"use client";
import React, { useState } from "react";
import { Lock, ArrowRight, Eye, EyeOff, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      
      {/* Click away to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-[440px] relative z-10 animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tabs: Sign In / Create Account */}
        <div className="flex bg-[#121217] p-1 rounded-lg mb-4 border border-white/5">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 text-sm font-semibold py-2.5 rounded-md transition-colors ${isLogin ? "bg-[#6C5CE7] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 text-sm font-semibold py-2.5 rounded-md transition-colors ${!isLogin ? "bg-[#6C5CE7] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            Create Account
          </button>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-[#121217]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-10 shadow-2xl relative">
          
          <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-gray-400 text-[15px] mb-8">
            {isLogin ? "Sign in to your LeadFlow workspace" : "Get started with LeadFlow today"}
          </p>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#1A1A24] hover:bg-[#22222E] border border-white/5 text-white font-medium py-3 rounded-lg transition-all mb-6 group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[13px] text-gray-400 font-medium ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-[#1A1A24] border border-white/5 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-[15px]"
                  />
                </div>
              </div>
            )}

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
                {isLogin && <a href="#" className="text-[13px] text-[#6C5CE7] hover:text-indigo-400 transition-colors font-medium">Forgot password?</a>}
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
            <button className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-2 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:scale-[1.02] transform duration-200">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="mt-8 text-center text-[13px] text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#6C5CE7] font-medium hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Sign up free" : "Log in"}
            </button>
          </div>
          
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          Secured by enterprise-grade encryption
        </div>

      </div>
    </div>
  );
}
