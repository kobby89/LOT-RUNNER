import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDepositReceivedEmail } from "@/lib/email";

// POST /api/webhooks/flutterwave — Flutterwave sends a "verif-hash"
// header matching a secret you set in your Flutterwave dashboard
// (Settings > Webhooks). We check it matches before trusting the payload.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = await req.json();

  if (event.event === "charge.completed" && event.data?.status === "successful") {
    const requestId = event.data?.meta?.requestId;
    const amount = event.data?.amount;
    const currency = event.data?.currency;

    if (requestId) {
      const updated = await prisma.request.update({
        where: { id: requestId },
        data: {
          status: "DEPOSIT_RECEIVED",
          statusEvents: {
            create: {
              status: "DEPOSIT_RECEIVED",
              note: `Deposit of ${amount} ${currency} received via Flutterwave (Mobile Money/card).`,
            },
          },
        },
      });

      const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
      await sendDepositReceivedEmail(updated.contactEmail, updated.customerName, `${origin}/dashboard/${updated.id}`);
    }
  }

  return NextResponse.json({ received: true });
}
