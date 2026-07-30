import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, depositAmountCents, DEPOSIT_PERCENT } from "@/lib/stripe";

// POST /api/checkout — customer clicks "Pay Deposit" on their dashboard.
// Creates a Stripe Checkout session for 20% of the quoted total and
// redirects them to Stripe's hosted payment page. We never touch card
// details ourselves — Stripe handles all of that.
export async function POST(req: NextRequest) {
  const { requestId } = await req.json();

  if (!requestId) {
    return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
  }

  const request = await prisma.request.findUnique({ where: { id: requestId } });

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!request.quotedTotal) {
    return NextResponse.json(
      { error: "This request doesn't have a quote yet — nothing to deposit against." },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
  const amount = depositAmountCents(request.quotedTotal);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: request.contactEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Deposit — ${request.makeModel || request.lotNumber || "vehicle request"}`,
            description: `${Math.round(DEPOSIT_PERCENT * 100)}% deposit, held until the auction result is known. Refundable if we don't win.`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: { requestId: request.id },
    success_url: `${origin}/dashboard/${request.id}?deposit=success`,
    cancel_url: `${origin}/dashboard/${request.id}?deposit=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
