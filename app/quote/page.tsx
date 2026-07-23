"use client";

import { useMemo, useState } from "react";
import { calculateQuote, formatUSD } from "@/lib/fee";

export default function QuotePage() {
  const [hammer, setHammer] = useState(9850);
  const [auctionFees, setAuctionFees] = useState(680);
  const [feePercent, setFeePercent] = useState(0.1);

  const quote = useMemo(
    () => calculateQuote({ hammer, auctionFees, feePercent }),
    [hammer, auctionFees, feePercent]
  );

  return (
    <section className="section on-asphalt">
      <div className="wrap">
        <div className="sec-eyebrow">Transparent pricing</div>
        <h2 className="sec-h" style={{ color: "var(--chalk)" }}>See your fee before you send a dollar</h2>
        <p className="sec-lead">
          The math is always the same: hammer price, plus real auction fees, plus a flat service
          charge. Nothing hidden at pickup.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <div className="field">
              <label htmlFor="hammer">Expected winning bid ($)</label>
              <input
                id="hammer"
                type="number"
                value={hammer}
                min={0}
                step={50}
                onChange={(e) => setHammer(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="auctionfee">Estimated auction &amp; doc fees ($)</label>
              <input
                id="auctionfee"
                type="number"
                value={auctionFees}
                min={0}
                step={10}
                onChange={(e) => setAuctionFees(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="feepct">Lotrunner service fee</label>
              <select id="feepct" value={feePercent} onChange={(e) => setFeePercent(parseFloat(e.target.value))}>
                <option value={0.1}>10% — Standard</option>
                <option value={0.08}>8% — Repeat customer</option>
                <option value={0.12}>12% — Rush / hands-on search</option>
              </select>
            </div>
          </div>

          <div className="quote-ticket">
            <div className="quote-row"><span className="label">Winning bid / Buy-It-Now</span><span className="val">{formatUSD(quote.hammer)}</span></div>
            <div className="quote-row"><span className="label">Auction &amp; doc fees</span><span className="val">{formatUSD(quote.auctionFees)}</span></div>
            <div className="quote-row fee"><span className="label">Lotrunner service fee</span><span className="val">{formatUSD(quote.fee)}</span></div>
            <div className="quote-row total"><span className="label">Total you pay</span><span className="val">{formatUSD(quote.total)}</span></div>
            <div className="quote-fine">
              Service fee is calculated on the winning bid amount only, not on auction fees or taxes.
              This is an estimate — your locked quote arrives after we confirm the live listing.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
