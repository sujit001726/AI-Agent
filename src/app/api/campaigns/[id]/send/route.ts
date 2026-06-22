import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { outreachQueue } from "@/lib/bullmq";
import type { OutreachJobData } from "@/lib/bullmq";

// POST /api/campaigns/[id]/send — queue outreach for all enriched leads
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!campaign) {
    return Response.json({ error: "Campaign not found" }, { status: 404 });
  }

  // Guard: must be reviewed before sending
  if (!campaign.reviewed) {
    return Response.json(
      { error: "Campaign must be reviewed before sending. Mark it as reviewed first." },
      { status: 403 }
    );
  }

  // Only send to leads with a confirmed email and not already sent
  const eligibleLeads = await prisma.lead.findMany({
    where: {
      campaignId: id,
      email: { not: null },
      outreachStatus: "NOT_SENT",
    },
    select: { id: true },
  });

  if (eligibleLeads.length === 0) {
    return Response.json({ error: "No eligible leads to send to" }, { status: 400 });
  }

  // Enqueue one job per lead
  const jobs = eligibleLeads.map((lead) => ({
    name: "send-outreach",
    data: { leadId: lead.id, campaignId: id } satisfies OutreachJobData,
    opts: { attempts: 3, backoff: { type: "exponential" as const, delay: 10000 } },
  }));

  await outreachQueue.addBulk(jobs);

  // Mark all as queued
  await prisma.lead.updateMany({
    where: { id: { in: eligibleLeads.map((l) => l.id) } },
    data: { outreachStatus: "QUEUED" },
  });

  return Response.json({ queued: eligibleLeads.length });
}
