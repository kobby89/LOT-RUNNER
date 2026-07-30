import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { calculateQuote } from "@/lib/fee";
import { sendQuoteReadyEmail, sendWonEmail, sendReadyForPickupEmail } from "@/lib/email";

// GET /api/requests/:id — powers the customer-facing dashboard/tracker page.
// Deliberately returns only what a customer should see about their own request.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const request = await prisma.request.findUnique({
    where: { id: params.id },
    include: { statusEvents: { orderBy: { createdAt: "asc" } } },
  });

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ request });
}

const UpdateSchema = z.object({
  status: z
    .enum([
      "SUBMITTED",
      "QUOTE_SENT",
      "QUOTE_APPROVED",
      "DEPOSIT_RECEIVED",
      "BIDDING_LIVE",
      "WON",
      "LOST",
      "INVOICED",
      "READY_FOR_PICKUP",
      "CANCELLED",
    ])
    .optional(),
  quotedHammer: z.number().nonnegative().optional(),
  quotedAuctionFees: z.number().nonnegative().optional(),
  feePercent: z.number().min(0).max(1).optional(),
  note: z.string().optional(),
});

// PATCH /api/requests/:id — admin logs a real quote or moves the status
// forward as they work the auction on the customer's behalf.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.request.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { status, quotedHammer, quotedAuctionFees, feePercent, note } = parsed.data;

  // Recompute the quoted total any time the underlying numbers change,
  // so quotedTotal never goes stale relative to what's shown on the invoice.
  const hammer = quotedHammer ?? existing.quotedHammer ?? undefined;
  const auctionFees = quotedAuctionFees ?? existing.quotedAuctionFees ?? undefined;
  const pct = feePercent ?? existing.feePercent;

  const quotedTotal =
    hammer !== undefined && auctionFees !== undefined
      ? calculateQuote({ hammer, auctionFees, feePercent: pct }).total
      : existing.quotedTotal;

  const updated = await prisma.request.update({
    where: { id: params.id },
    data: {
      status: status ?? existing.status,
      quotedHammer: hammer,
      quotedAuctionFees: auctionFees,
      feePercent: pct,
      quotedTotal,
      ...(status
        ? { statusEvents: { create: { status, note } } }
        : {}),
    },
  });

  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
  const dashboardUrl = `${origin}/dashboard/${updated.id}`;

  if (status === "QUOTE_SENT" && updated.quotedTotal) {
    await sendQuoteReadyEmail(updated.contactEmail, updated.customerName, dashboardUrl, updated.quotedTotal);
  }
  if (status === "WON" && updated.quotedHammer) {
    await sendWonEmail(updated.contactEmail, updated.customerName, dashboardUrl, updated.quotedHammer);
  }
  if (status === "READY_FOR_PICKUP") {
    await sendReadyForPickupEmail(updated.contactEmail, updated.customerName, dashboardUrl);
  }

  return NextResponse.json({ request: updated });
}
