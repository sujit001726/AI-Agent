import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { parseInstruction } from "@/lib/claude";
import { discoveryQueue } from "@/lib/bullmq";
import type { DiscoveryJobData } from "@/lib/bullmq";

const CreateCampaignSchema = z.object({
  instruction: z.string().min(5).max(500),
});

// POST /api/campaigns — parse instruction, create campaign, queue discovery
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { instruction } = parsed.data;

  // Parse with Claude (tool-calling)
  let taskPlan;
  try {
    taskPlan = await parseInstruction(instruction);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Claude parsing failed";
    return Response.json({ error: message }, { status: 502 });
  }

  // Create campaign record
  const campaign = await prisma.campaign.create({
    data: {
      userId: session.user.id,
      instruction,
      location: taskPlan.location,
      category: taskPlan.category,
      maxResults: taskPlan.maxResults,
      sortBy: taskPlan.sortBy,
      status: "PENDING",
    },
  });

  // Enqueue discovery job
  await discoveryQueue.add(
    "discover-leads",
    {
      campaignId: campaign.id,
      location: taskPlan.location,
      category: taskPlan.category,
      maxResults: taskPlan.maxResults,
      sortBy: taskPlan.sortBy,
    } satisfies DiscoveryJobData,
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
  );

  return Response.json({ campaign }, { status: 201 });
}

// GET /api/campaigns — list user's campaigns with lead stats
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      instruction: true,
      location: true,
      category: true,
      status: true,
      leadsDiscoveredCount: true,
      leadsEnrichedCount: true,
      totalLeadsExpected: true,
      reviewed: true,
      createdAt: true,
      _count: { select: { leads: true } },
    },
  });

  return Response.json({ campaigns });
}
