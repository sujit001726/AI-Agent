"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, MapPin, Phone, MessageSquare, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", subject: "general" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-30" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-lg">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-sora, inherit)" }}>
            We&#39;d love to <span className="gradient-text">hear from you</span>
          </h1>
          <p className="text-slate-400 text-lg">Have a question? Need a custom plan? Want to schedule a demo? We respond within 24 hours.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-5">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Email</div>
                      <div className="text-slate-400 text-sm">hello@leadflow.ai</div>
                      <div className="text-slate-500 text-xs">Responds within 24h</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Phone</div>
                      <div className="text-slate-400 text-sm">+1 (888) 123-4567</div>
                      <div className="text-slate-500 text-xs">Mon-Fri 9am-6pm EST</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Office</div>
                      <div className="text-slate-400 text-sm">San Francisco, CA</div>
                      <div className="text-slate-500 text-xs">United States</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm mb-4">Office Hours</h3>
                <div className="space-y-2">
                  {[
                    { d: "Monday - Friday", t: "9:00 AM – 6:00 PM EST" },
                    { d: "Saturday", t: "10:00 AM – 2:00 PM EST" },
                    { d: "Sunday", t: "Closed" },
                  ].map(row => (
                    <div key={row.d} className="flex justify-between">
                      <span className="text-slate-400 text-xs">{row.d}</span>
                      <span className="text-slate-300 text-xs font-medium">{row.t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { l: "Schedule a Demo", h: "/about" },
                    { l: "View Pricing", h: "/pricing" },
                    { l: "Documentation", h: "#" },
                    { l: "Status Page", h: "#" },
                  ].map(item => (
                    <Link key={item.l} href={item.h}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-slate-400 text-sm group-hover:text-white transition-colors">{item.l}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-2xl p-7 glow-brand-sm">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-slate-400 mb-6">Thanks for reaching out. We&#39;ll get back to you within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", message: "", subject: "general" }); }}
                      className="btn-secondary text-sm px-6 py-2.5">
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-white font-bold text-xl mb-6">Send us a message</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                          <input id="contact-name" name="name" required value={form.name} onChange={handleChange}
                            placeholder="John Smith"
                            className="input-field" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
                          <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange}
                            placeholder="john@company.com"
                            className="input-field" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
                          <input id="contact-company" name="company" value={form.company} onChange={handleChange}
                            placeholder="Acme Corp"
                            className="input-field" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
                          <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange}
                            className="input-field">
                            <option value="general">General Inquiry</option>
                            <option value="demo">Schedule a Demo</option>
                            <option value="pricing">Pricing & Plans</option>
                            <option value="support">Technical Support</option>
                            <option value="partnership">Partnership</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Message *</label>
                        <textarea id="contact-message" name="message" required value={form.message} onChange={handleChange}
                          placeholder="Tell us about your needs..."
                          rows={5}
                          className="input-field resize-none" />
                      </div>

                      <button id="contact-submit" type="submit" disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                        ) : (
                          <><Mail className="w-4 h-4" /> Send Message</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4 text-center mt-10">
        <p className="text-slate-600 text-xs">© 2026 LeadFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
