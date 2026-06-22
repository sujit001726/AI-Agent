"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Zap, CheckCircle2, XCircle, Mail, Globe, Phone,
  Edit2, Trash2, Save, X, Loader2, Send, Eye, AlertTriangle, RefreshCw,
  BarChart3
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  address: string | null;
  rating: number | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  emailConfidence: number | null;
  enrichmentStatus: string;
  outreachStatus: string;
  outreach: { status: string; sentAt: string } | null;
}

interface Campaign {
  id: string;
  instruction: string;
  location: string;
  category: string;
  status: string;
  leadsDiscoveredCount: number;
  leadsEnrichedCount: number;
  totalLeadsExpected: number;
  reviewed: boolean;
  emailTemplateSubject: string | null;
  emailTemplateBody: string | null;
  leads: Lead[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function enrichBadge(status: string) {
  const m: Record<string, { label: string; cls: string }> = {
    PENDING:          { label: "Pending",       cls: "badge-pending" },
    ENRICHING:        { label: "Enriching…",    cls: "badge-running" },
    ENRICHED:         { label: "Contact Found", cls: "badge-enriched" },
    NO_CONTACT_FOUND: { label: "No Contact",    cls: "badge-no-contact" },
    FAILED:           { label: "Failed",        cls: "badge-failed" },
  };
  return m[status] || { label: status, cls: "badge-pending" };
}

function outreachBadge(status: string) {
  const m: Record<string, { label: string; cls: string }> = {
    NOT_SENT:  { label: "Not Sent",  cls: "badge-pending" },
    QUEUED:    { label: "Queued",    cls: "badge-running" },
    SENT:      { label: "Sent",      cls: "badge-sent" },
    DELIVERED: { label: "Delivered", cls: "badge-delivered" },
    OPENED:    { label: "Opened",    cls: "badge-opened" },
    BOUNCED:   { label: "Bounced",   cls: "badge-bounced" },
    FAILED:    { label: "Failed",    cls: "badge-failed" },
  };
  return m[status] || { label: status, cls: "badge-pending" };
}

const DEFAULT_SUBJECT = "Partnership Opportunity – {{name}}";
const DEFAULT_BODY = `Hi {{name}},

We came across your business in {{city}} and would love to explore a partnership with you.

Could we schedule a quick 15-minute call this week?

Best regards,
The LeadFlow Team`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tab, setTab] = useState<"overview" | "leads" | "outreach">("overview");
  const [loading, setLoading] = useState(true);

  // Lead editing state
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Lead>>({});

  // Outreach template state
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ queued?: number; error?: string } | null>(null);
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) return;
      const data = await res.json();
      setCampaign(data.campaign);
      // Initialize template from DB if available
      if (data.campaign.emailTemplateSubject) setSubject(data.campaign.emailTemplateSubject);
      if (data.campaign.emailTemplateBody)    setBody(data.campaign.emailTemplateBody);
      // Set a preview lead
      const enriched = data.campaign.leads.find((l: Lead) => l.email);
      if (enriched && !previewLead) setPreviewLead(enriched);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [campaignId, router, previewLead]);

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 4000);
    return () => clearInterval(interval);
  }, [fetchCampaign]);

  // ── Mark as reviewed & switch to leads tab ────────────────────────────────
  async function markReviewed() {
    await fetch(`/api/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed: true }),
    });
    await fetchCampaign();
    setTab("outreach");
  }

  // ── Lead edit ─────────────────────────────────────────────────────────────
  function startEdit(lead: Lead) {
    setEditingLeadId(lead.id);
    setEditValues({ name: lead.name, email: lead.email, phone: lead.phone, website: lead.website });
  }

  async function saveEdit(leadId: string) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setEditingLeadId(null);
    fetchCampaign();
  }

  async function deleteLead(leadId: string) {
    if (!confirm("Remove this lead from the campaign?")) return;
    await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
    fetchCampaign();
  }

  // ── Save template ─────────────────────────────────────────────────────────
  async function saveTemplate() {
    setSavingTemplate(true);
    await fetch(`/api/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailTemplateSubject: subject, emailTemplateBody: body }),
    });
    setSavingTemplate(false);
  }

  // ── Send outreach ─────────────────────────────────────────────────────────
  async function sendOutreach() {
    if (!confirm("Queue emails to all eligible leads? This cannot be undone.")) return;
    setSending(true);
    setSendResult(null);
    try {
      // First save template
      await saveTemplate();
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: "POST" });
      const data = await res.json();
      setSendResult(res.ok ? { queued: data.queued } : { error: data.error });
      if (res.ok) fetchCampaign();
    } catch {
      setSendResult({ error: "Network error" });
    } finally {
      setSending(false);
    }
  }

  // ── Merge field preview ───────────────────────────────────────────────────
  function renderPreview(template: string) {
    if (!previewLead || !campaign) return template;
    return template
      .replace(/\{\{name\}\}/g, previewLead.name)
      .replace(/\{\{city\}\}/g, campaign.location)
      .replace(/\{\{website\}\}/g, previewLead.website || "")
      .replace(/\{\{email\}\}/g, previewLead.email || "")
      .replace(/\{\{phone\}\}/g, previewLead.phone || "")
      .replace(/\{\{category\}\}/g, campaign.category);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Campaign not found.
      </div>
    );
  }

  const isActive = campaign.status === "DISCOVERING" || campaign.status === "ENRICHING";
  const progress = campaign.totalLeadsExpected > 0
    ? Math.round((campaign.leadsEnrichedCount / campaign.totalLeadsExpected) * 100)
    : 0;
  const enrichedLeads = campaign.leads.filter((l) => l.email);
  const noContactLeads = campaign.leads.filter((l) => l.enrichmentStatus === "NO_CONTACT_FOUND");

  return (
    <div className="min-h-screen" style={{
      background: "radial-gradient(ellipse at 50% -10%, rgba(52,211,153,0.06) 0%, transparent 60%), #020b18"
    }}>
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/")} className="p-2 rounded-lg hover:bg-surface-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-white truncate max-w-xl">{campaign.instruction}</h1>
          <p className="text-xs text-slate-500">{campaign.location} · {campaign.category}</p>
        </div>
        {isActive && (
          <div className="ml-auto flex items-center gap-2 text-brand-400 text-xs font-medium">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Live updates
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Discovered", value: campaign.leadsDiscoveredCount, icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />, color: "text-blue-400" },
            { label: "Enriched",   value: campaign.leadsEnrichedCount,   icon: <Zap className="w-4 h-4 text-brand-400" />,       color: "text-brand-400" },
            { label: "With Email", value: enrichedLeads.length,           icon: <Mail className="w-4 h-4 text-violet-400" />,     color: "text-violet-400" },
            { label: "No Contact", value: noContactLeads.length,          icon: <XCircle className="w-4 h-4 text-slate-500" />,   color: "text-slate-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-slate-400">{s.label}</span></div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {campaign.totalLeadsExpected > 0 && (
          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Pipeline Progress</span>
              <span>{progress}% · {campaign.status}</span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isActive ? "progress-bar" : "bg-brand-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-900 rounded-xl p-1 border border-white/5 w-full sm:w-fit overflow-x-auto hide-scrollbar">
          {(["overview", "leads", "outreach"] as const).map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t === "outreach" ? "📧 Outreach" : t === "leads" ? "📋 Leads" : "📊 Overview"}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="glass rounded-2xl p-4 sm:p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Campaign Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ["Instruction", campaign.instruction],
                ["Location", campaign.location],
                ["Category", campaign.category],
                ["Status", campaign.status],
                ["Reviewed", campaign.reviewed ? "Yes ✓" : "No"],
                ["Total Expected", String(campaign.totalLeadsExpected)],
              ].map(([k, v]) => (
                <div key={k} className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">{k}</span>
                  <p className="text-white">{v}</p>
                </div>
              ))}
            </div>

            {!campaign.reviewed && campaign.status === "COMPLETED" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-medium text-sm">Review Required Before Sending</p>
                  <p className="text-amber-400/70 text-xs mt-1">
                    Check the Leads tab to review and edit contacts, then mark as reviewed to unlock outreach.
                  </p>
                  <button
                    id="go-to-leads"
                    onClick={() => setTab("leads")}
                    className="mt-3 text-xs font-medium text-amber-300 hover:text-amber-200 underline underline-offset-2"
                  >
                    Go to Leads →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LEADS TAB ────────────────────────────────────────────────── */}
        {tab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{campaign.leads.length} leads found</p>
              {!campaign.reviewed && (
                <button
                  id="mark-reviewed"
                  onClick={markReviewed}
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all glow-brand-sm"
                >
                  <Eye className="w-4 h-4" /> Mark as Reviewed & Proceed
                </button>
              )}
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">Rating</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3">Outreach</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaign.leads.map((lead) => {
                    const isEditing = editingLeadId === lead.id;
                    const eb = enrichBadge(lead.enrichmentStatus);
                    const ob = outreachBadge(lead.outreachStatus);
                    return (
                      <tr key={lead.id} className="hover:bg-surface-800/30 transition-colors group">
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input value={editValues.name || ""} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                              className="bg-surface-700 border border-white/10 rounded-lg px-2 py-1 text-white text-xs w-40 focus:outline-none focus:ring-1 focus:ring-brand-500/50" />
                          ) : (
                            <div>
                              <p className="text-white font-medium">{lead.name}</p>
                              {lead.address && <p className="text-slate-500 text-xs truncate max-w-[180px]">{lead.address}</p>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input value={editValues.email || ""} onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                              placeholder="email@example.com"
                              className="bg-surface-700 border border-white/10 rounded-lg px-2 py-1 text-white text-xs w-44 focus:outline-none focus:ring-1 focus:ring-brand-500/50" />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {lead.email ? (
                                <>
                                  <Mail className="w-3 h-3 text-brand-400 shrink-0" />
                                  <span className="text-slate-300 text-xs truncate max-w-[160px]">{lead.email}</span>
                                  {lead.emailConfidence && (
                                    <span className="text-xs text-slate-600 shrink-0">{Math.round(lead.emailConfidence * 100)}%</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          {lead.rating ? `⭐ ${lead.rating}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${eb.cls}`}>{eb.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${ob.cls}`}>{ob.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isEditing ? (
                              <>
                                <button onClick={() => saveEdit(lead.id)} className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors" title="Save">
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setEditingLeadId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-surface-700 transition-colors" title="Cancel">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(lead)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-700 transition-colors" title="Edit">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Remove">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ── OUTREACH TAB ─────────────────────────────────────────────── */}
        {tab === "outreach" && (
          <div className="space-y-6">
            {!campaign.reviewed && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-amber-300 text-sm">
                  You must review leads first.{" "}
                  <button onClick={() => setTab("leads")} className="underline underline-offset-2">Go to Leads →</button>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template editor */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-400" /> Email Template
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Subject Line</label>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Body</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all resize-none font-mono" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Merge fields: <code className="text-brand-400">{"{{name}}"}</code>{" "}
                    <code className="text-brand-400">{"{{city}}"}</code>{" "}
                    <code className="text-brand-400">{"{{website}}"}</code>{" "}
                    <code className="text-brand-400">{"{{phone}}"}</code>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button id="save-template" onClick={saveTemplate} disabled={savingTemplate}
                    className="flex justify-center items-center gap-2 bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto">
                    {savingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Template
                  </button>
                  <button id="send-all" onClick={sendOutreach}
                    disabled={!campaign.reviewed || sending || enrichedLeads.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all glow-brand-sm w-full sm:w-auto">
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Queueing…</> : <><Send className="w-4 h-4" /> Send to {enrichedLeads.length} Leads</>}
                  </button>
                </div>

                {sendResult && (
                  <div className={`rounded-xl p-3 text-sm ${sendResult.error ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-brand-500/10 border border-brand-500/20 text-brand-400"}`}>
                    {sendResult.error ? `Error: ${sendResult.error}` : `✓ Queued ${sendResult.queued} emails successfully`}
                  </div>
                )}
              </div>

              {/* Live preview */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-violet-400" /> Live Preview
                  {previewLead && <span className="text-xs text-slate-500 font-normal ml-auto">{previewLead.name}</span>}
                </h2>
                {previewLead ? (
                  <div className="bg-surface-900 rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="border-b border-white/5 pb-3">
                      <span className="text-xs text-slate-500">Subject: </span>
                      <span className="text-sm text-white">{renderPreview(subject)}</span>
                    </div>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                      {renderPreview(body)}
                    </pre>
                    <div className="border-t border-white/5 pt-3 text-xs text-slate-600">
                      — Unsubscribe link will be automatically appended —
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                    No enriched leads to preview yet
                  </div>
                )}

                {/* Outreach stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Eligible", value: enrichedLeads.length, icon: <Mail className="w-3 h-3" /> },
                    { label: "No Contact", value: noContactLeads.length, icon: <XCircle className="w-3 h-3" /> },
                    { label: "Sent", value: campaign.leads.filter((l) => l.outreachStatus !== "NOT_SENT" && l.outreachStatus !== "QUEUED").length, icon: <BarChart3 className="w-3 h-3" /> },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface-800 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                      <div className="text-lg font-bold text-white">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outreach log table */}
            {campaign.leads.some((l) => l.outreach) && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-400" /> Sent Emails
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Lead</th>
                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Email</th>
                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Status</th>
                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">Sent At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {campaign.leads.filter((l) => l.outreach).map((lead) => {
                        const ob = outreachBadge(lead.outreach!.status);
                        return (
                          <tr key={lead.id} className="hover:bg-surface-800/20">
                            <td className="px-4 py-3 text-white text-sm whitespace-nowrap">{lead.name}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{lead.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${ob.cls}`}>{ob.label}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                              {new Date(lead.outreach!.sentAt).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
