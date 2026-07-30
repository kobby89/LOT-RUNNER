import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { capturePaypalOrder } from "@/lib/paypal";
import { sendDepositReceivedEmail } from "@/lib/email";

// GET /api/paypal/capture — PayPal redirects the customer here after
// they approve payment, with ?token=<orderId>. We capture the funds
// server-side right here (not via a separate webhook — PayPal's REST
// flow captures synchronously) then send the customer on to their
// dashboard.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("token");
  const requestId = searchParams.get("requestId");
  const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  if (!orderId || !requestId) {
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    const capture = await capturePaypalOrder(orderId);

    if (capture.status === "COMPLETED") {
      const updated = await prisma.request.update({
        where: { id: requestId },
        data: {
          status: "DEPOSIT_RECEIVED",
          statusEvents: {
            create: { status: "DEPOSIT_RECEIVED", note: "Deposit received via PayPal." },
          },
        },
      });
      await sendDepositReceivedEmail(updated.contactEmail, updated.customerName, `${origin}/dashboard/${updated.id}`);
    }
  } catch (err) {
    console.error("PayPal capture failed:", err);
    return NextResponse.redirect(`${origin}/dashboard/${requestId}?deposit=failed`);
  }

  return NextResponse.redirect(`${origin}/dashboard/${requestId}?deposit=success`);
}
