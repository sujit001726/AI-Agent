import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/unsubscribe?leadId=xxx — handle opt-out
export async function GET(request: NextRequest) {
  const leadId = request.nextUrl.searchParams.get("leadId");
  if (!leadId) {
    return new Response("Invalid unsubscribe link", { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead?.email) {
    return new Response("Already unsubscribed or not found", { status: 200 });
  }

  await prisma.suppression.upsert({
    where: { email: lead.email },
    create: { email: lead.email, reason: "user_unsubscribed" },
    update: {},
  });

  // Return a clean confirmation page
  return new Response(
    `<!DOCTYPE html><html><head><title>Unsubscribed</title>
    <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#f8fafc}
    .card{text-align:center;padding:2rem;background:#1e293b;border-radius:1rem;max-width:400px}
    h1{color:#34d399;margin-bottom:.5rem}p{color:#94a3b8}</style></head>
    <body><div class="card"><h1>✓ Unsubscribed</h1>
    <p>${lead.email} has been removed from all future outreach.</p></div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
