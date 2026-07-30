import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEPOSIT_PERCENT } from "@/lib/stripe";
import { initializeFlutterwavePayment, FlutterwaveCurrency } from "@/lib/flutterwave";
import { convertFromUSD } from "@/lib/fx";

// POST /api/checkout-flutterwave — Mobile Money deposit flow for
// Ghana/Nigeria customers.
export async function POST(req: NextRequest) {
  const { requestId, currency } = await req.json();

  if (!requestId || !currency) {
    return NextResponse.json({ error: "Missing requestId or currency" }, { status: 400 });
  }
  if (currency !== "GHS" && currency !== "NGN") {
    return NextResponse.json({ error: "Currency must be GHS or NGN" }, { status: 400 });
  }

  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!request.quotedTotal) {
    return NextResponse.json(
      { error: "This request doesn't have a quote yet — nothing to deposit against." },
      { status: 400 }
    );
  }

  // Deposit is quoted in USD (20% of the quoted total) — convert to the
  // customer's local currency at today's live rate before charging.
  const depositUSD = request.quotedTotal * DEPOSIT_PERCENT;
  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;

  try {
    const amount = await convertFromUSD(depositUSD, currency as "GHS" | "NGN");

    const payment = await initializeFlutterwavePayment({
      tx_ref: `${request.id}-${Date.now()}`,
      amount,
      currency: currency as FlutterwaveCurrency,
      redirect_url: `${origin}/dashboard/${request.id}?deposit=success`,
      customerEmail: request.contactEmail,
      customerName: request.customerName,
      meta: { requestId: request.id },
    });

    return NextResponse.json({ url: payment.link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Flutterwave error" }, { status: 500 });
  }
}
