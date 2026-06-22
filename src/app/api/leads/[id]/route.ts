import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const UpdateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().optional().nullable(),
});

// PUT /api/leads/[id] — edit a lead's details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = UpdateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Verify the lead belongs to this user via campaign
  const lead = await prisma.lead.findFirst({
    where: { id, campaign: { userId: session.user.id } },
  });
  if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });

  const updated = await prisma.lead.update({
    where: { id },
    data: parsed.data,
  });

  return Response.json({ lead: updated });
}

// DELETE /api/leads/[id] — remove a lead from the campaign
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, campaign: { userId: session.user.id } },
  });
  if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });

  await prisma.lead.delete({ where: { id } });

  return Response.json({ success: true });
}
