import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminWireNotice } from "@/lib/email";

// POST /api/wire-notify — customer clicks "I've sent the wire transfer."
// Unlike card/Mobile Money/PayPal, there's no API that can confirm a
// bank wire landed — that has to be checked manually against your bank
// account. This just logs the claim and leaves status as-is so you see
// it in /admin and can move it to DEPOSIT_RECEIVED yourself once the
// funds actually show up.
export async function POST(req: NextRequest) {
  const { requestId } = await req.json();
  if (!requestId) return NextResponse.json({ error: "Missing requestId" }, { status: 400 });

  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.request.update({
    where: { id: requestId },
    data: {
      statusEvents: {
        create: {
          status: request.status,
          note: "Customer indicated a wire transfer was sent — pending manual confirmation in your bank account.",
        },
      },
    },
  });

  // TODO: send yourself (the admin) an email/notification here so you
  // know to go check the bank account, via Resend.
  if (process.env.ADMIN_NOTIFY_EMAIL) {
    await sendAdminWireNotice(process.env.ADMIN_NOTIFY_EMAIL, requestId);
  }

  return NextResponse.json({ ok: true });
}
