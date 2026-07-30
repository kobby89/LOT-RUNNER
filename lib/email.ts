import { Resend } from "resend";

const FROM = process.env.NOTIFY_FROM_EMAIL || "quotes@lotrunner.example";

async function send(to: string, subject: string, html: string) {
  // Silently no-op if Resend isn't configured yet, rather than crashing
  // the request that triggered this — email is a nice-to-have, not
  // something that should break the actual status update. The client
  // is created here (not at the top of the file) so that just
  // *importing* this file doesn't require the key to exist — that was
  // breaking the Vercel build before any request ever ran.
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email skipped — no RESEND_API_KEY] Would send "${subject}" to ${to}`);
    return;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

export async function sendRequestReceivedEmail(to: string, name: string, dashboardUrl: string) {
  await send(
    to,
    "We got your request — Lotrunner",
    `<p>Hi ${name},</p>
     <p>We received your vehicle request and we're on it. You can check live status here anytime:</p>
     <p><a href="${dashboardUrl}">${dashboardUrl}</a></p>
     <p>No payment is needed yet — we'll follow up with a quote once we've reviewed the real listing.</p>`
  );
}

export async function sendQuoteReadyEmail(to: string, name: string, dashboardUrl: string, total: number) {
  await send(
    to,
    "Your quote is ready — Lotrunner",
    `<p>Hi ${name},</p>
     <p>We've priced your vehicle: <strong>$${total.toLocaleString()}</strong> all-in.</p>
     <p>Review the full breakdown and pay your deposit to get started:</p>
     <p><a href="${dashboardUrl}">${dashboardUrl}</a></p>`
  );
}

export async function sendDepositReceivedEmail(to: string, name: string, dashboardUrl: string) {
  await send(
    to,
    "Deposit received — we're starting to bid",
    `<p>Hi ${name},</p>
     <p>Your deposit is in. We're now actively working on winning this vehicle for you.</p>
     <p>Track progress here: <a href="${dashboardUrl}">${dashboardUrl}</a></p>`
  );
}

export async function sendWonEmail(to: string, name: string, dashboardUrl: string, hammer: number) {
  await send(
    to,
    "You won! 🎉 — Lotrunner",
    `<p>Hi ${name},</p>
     <p>Great news — we won your vehicle at auction for $${hammer.toLocaleString()}.</p>
     <p>Next steps and your final invoice: <a href="${dashboardUrl}">${dashboardUrl}</a></p>`
  );
}

export async function sendReadyForPickupEmail(to: string, name: string, dashboardUrl: string) {
  await send(
    to,
    "Your vehicle is ready for pickup",
    `<p>Hi ${name},</p>
     <p>Your vehicle is paid in full and ready. Details here: <a href="${dashboardUrl}">${dashboardUrl}</a></p>`
  );
}

export async function sendAdminWireNotice(adminEmail: string, requestId: string) {
  await send(
    adminEmail,
    "Customer says they sent a wire transfer",
    `<p>A customer marked a wire transfer as sent for request <strong>${requestId}</strong>.</p>
     <p>Check your bank account, then confirm in the admin panel.</p>`
  );
}
