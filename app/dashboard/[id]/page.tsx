import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatUSD } from "@/lib/fee";

const STEPS = [
  { key: "QUOTE_APPROVED", label: "Quote\nApproved" },
  { key: "DEPOSIT_RECEIVED", label: "Deposit\nReceived" },
  { key: "BIDDING_LIVE", label: "Bidding\nLive" },
  { key: "WON", label: "Won &\nInvoiced" },
  { key: "READY_FOR_PICKUP", label: "Ready for\nPickup" },
] as const;

// Order defines how far along the tracker a given status counts as "done."
const STATUS_ORDER = [
  "SUBMITTED",
  "QUOTE_SENT",
  "QUOTE_APPROVED",
  "DEPOSIT_RECEIVED",
  "BIDDING_LIVE",
  "WON",
  "INVOICED",
  "READY_FOR_PICKUP",
];

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const request = await prisma.request.findUnique({
    where: { id: params.id },
    include: { statusEvents: { orderBy: { createdAt: "asc" } } },
  });

  if (!request) return notFound();

  const currentIndex = STATUS_ORDER.indexOf(request.status);

  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-eyebrow">Request #{request.id.slice(-6).toUpperCase()}</div>
        <h2 className="sec-h">
          {request.makeModel || request.lotNumber || "Your vehicle request"}
        </h2>
        <p className="sec-lead">
          Submitted {request.createdAt.toLocaleDateString()}. We&apos;ll update this page every time
          something changes — no need to call and check.
        </p>

        <div className="dash">
          <div className="dash-head">
            <span className="h">{request.customerName}</span>
            <span className="status-pill">{humanize(request.status)}</span>
          </div>
          <div className="track">
            {STEPS.map((step) => {
              const stepIndex = STATUS_ORDER.indexOf(step.key);
              const done = currentIndex > stepIndex;
              const active = currentIndex === stepIndex;
              return (
                <div key={step.key} className={`track-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                  <div className="node" />
                  <div className="t-label" style={{ whiteSpace: "pre-line" }}>{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {request.quotedTotal != null && (
          <div className="quote-ticket" style={{ marginTop: 28, maxWidth: 420 }}>
            <div className="quote-row"><span className="label">Winning bid / Buy-It-Now</span><span className="val">{formatUSD(request.quotedHammer || 0)}</span></div>
            <div className="quote-row"><span className="label">Auction &amp; doc fees</span><span className="val">{formatUSD(request.quotedAuctionFees || 0)}</span></div>
            <div className="quote-row fee"><span className="label">Lotrunner service fee ({Math.round(request.feePercent * 100)}%)</span><span className="val">{formatUSD((request.quotedTotal || 0) - (request.quotedHammer || 0) - (request.quotedAuctionFees || 0))}</span></div>
            <div className="quote-row total"><span className="label">Total</span><span className="val">{formatUSD(request.quotedTotal)}</span></div>
          </div>
        )}

        <div style={{ marginTop: 36 }}>
          <div className="sec-eyebrow">Timeline</div>
          <ul style={{ listStyle: "none", padding: 0, fontFamily: "var(--mono)", fontSize: 13 }}>
            {request.statusEvents.map((ev) => (
              <li key={ev.id} style={{ padding: "8px 0", borderBottom: "1px dashed var(--line-light)" }}>
                {ev.createdAt.toLocaleString()} — {humanize(ev.status)}{ev.note ? ` — ${ev.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function humanize(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
