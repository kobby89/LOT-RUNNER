import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaypalOrder } from "@/lib/paypal";
import { DEPOSIT_PERCENT } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { requestId } = await req.json();
  if (!requestId) return NextResponse.json({ error: "Missing requestId" }, { status: 400 });

  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!request.quotedTotal) {
    return NextResponse.json(
      { error: "This request doesn't have a quote yet — nothing to deposit against." },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
  const amountUSD = request.quotedTotal * DEPOSIT_PERCENT;

  try {
    const { approveLink } = await createPaypalOrder({
      amountUSD,
      requestId: request.id,
      return_url: `${origin}/api/paypal/capture?requestId=${request.id}`,
      cancel_url: `${origin}/dashboard/${request.id}?deposit=cancelled`,
    });

    return NextResponse.json({ url: approveLink });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "PayPal error" }, { status: 500 });
  }
}
