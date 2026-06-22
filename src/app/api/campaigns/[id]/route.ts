import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/campaigns/[id] — campaign details + leads
export async function GET(
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
    include: {
      leads: {
        orderBy: { createdAt: "asc" },
        include: { outreach: true },
      },
    },
  });

  if (!campaign) {
    return Response.json({ error: "Campaign not found" }, { status: 404 });
  }

  return Response.json({ campaign });
}

// PATCH /api/campaigns/[id] — update template or mark as reviewed
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!campaign) {
    return Response.json({ error: "Campaign not found" }, { status: 404 });
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: {
      ...(typeof body.reviewed === "boolean" && { reviewed: body.reviewed }),
      ...(typeof body.emailTemplateSubject === "string" && {
        emailTemplateSubject: body.emailTemplateSubject,
      }),
      ...(typeof body.emailTemplateBody === "string" && {
        emailTemplateBody: body.emailTemplateBody,
      }),
    },
  });

  return Response.json({ campaign: updated });
}
