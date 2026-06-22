import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/webhooks/resend — handle Resend delivery events
// Resend sends events: email.sent, email.delivered, email.opened, email.bounced, email.complained
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Resend webhook payload structure
  const { type, data } = body as {
    type: string;
    data: { email_id: string; to: string[] };
  };

  const messageId = data?.email_id;
  if (!messageId) {
    return new Response("Missing email_id", { status: 400 });
  }

  const statusMap: Record<string, string> = {
    "email.sent": "SENT",
    "email.delivered": "DELIVERED",
    "email.opened": "OPENED",
    "email.bounced": "BOUNCED",
    "email.complained": "BOUNCED",
  };

  const newStatus = statusMap[type];
  if (!newStatus) {
    return new Response("Unknown event type", { status: 200 });
  }

  // Find outreach log by Resend message ID
  const outreachLog = await prisma.outreachLog.findUnique({
    where: { resendMessageId: messageId },
  });

  if (!outreachLog) {
    return new Response("Log not found", { status: 200 });
  }

  // Update outreach log and lead status
  await prisma.outreachLog.update({
    where: { id: outreachLog.id },
    data: {
      status: newStatus,
      ...(newStatus === "OPENED" && { openedAt: new Date() }),
      ...(newStatus === "BOUNCED" && { bouncedAt: new Date() }),
    },
  });

  await prisma.lead.update({
    where: { id: outreachLog.leadId },
    data: { outreachStatus: newStatus },
  });

  // Auto-suppress bounced/complained emails
  if (newStatus === "BOUNCED") {
    const lead = await prisma.lead.findUnique({ where: { id: outreachLog.leadId } });
    if (lead?.email) {
      await prisma.suppression.upsert({
        where: { email: lead.email },
        create: { email: lead.email, reason: type },
        update: {},
      });
    }
  }

  return new Response("OK", { status: 200 });
}
