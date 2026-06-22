"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDevLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, callbackUrl: "/" });
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.12) 0%, transparent 65%), #020b18" }}>

      {/* Floating orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)" }} />

      <div className="glass rounded-2xl p-6 sm:p-8 w-full max-w-md glow-brand-sm relative z-10 mx-4 sm:mx-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-400" />
          </div>
          <span className="text-xl font-bold gradient-text">LeadFlow</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to your AI lead generation workspace</p>

        {/* Dev credentials login */}
        <form onSubmit={handleDevLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev@leadflow.local"
              required
              className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm glow-brand-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? "Signing in…" : "Continue with Email"}
          </button>
        </form>

        {process.env.NEXT_PUBLIC_HAS_GOOGLE_AUTH && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <button
              id="login-google"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-surface-800 hover:bg-surface-700 border border-white/10 text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="text-center text-xs text-slate-600 mt-6">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
