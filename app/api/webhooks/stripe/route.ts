import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendDepositReceivedEmail } from "@/lib/email";
import Stripe from "stripe";

// POST /api/webhooks/stripe — Stripe calls this automatically when a
// payment finishes. This is what actually flips a request's status to
// DEPOSIT_RECEIVED — never trust the success_url redirect alone for
// that, since a customer could close the tab or the browser could lie;
// only Stripe's server-to-server webhook is authoritative.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const requestId = session.metadata?.requestId;

    if (requestId) {
      const updated = await prisma.request.update({
        where: { id: requestId },
        data: {
          status: "DEPOSIT_RECEIVED",
          statusEvents: {
            create: {
              status: "DEPOSIT_RECEIVED",
              note: `Deposit of $${((session.amount_total || 0) / 100).toFixed(2)} received via Stripe.`,
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
