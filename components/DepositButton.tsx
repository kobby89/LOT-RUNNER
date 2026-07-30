"use client";

import { useState } from "react";

type WireInstructions = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swift: string;
};

export default function DepositButton({
  requestId,
  wireInstructions,
}: {
  requestId: string;
  wireInstructions: WireInstructions;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<"momo" | "wire" | null>(null);
  const [wireConfirmed, setWireConfirmed] = useState(false);

  async function payWithStripe() {
    setLoading("stripe");
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  }

  async function payWithPaypal() {
    setLoading("paypal");
    setError(null);
    try {
      const res = await fetch("/api/checkout-paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  }

  async function payWithMomo(currency: "GHS" | "NGN") {
    setLoading(currency);
    setError(null);
    try {
      const res = await fetch("/api/checkout-flutterwave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, currency }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(null);
    }
  }

  async function notifyWireSent() {
    setLoading("wire");
    setError(null);
    try {
      const res = await fetch("/api/wire-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) throw new Error("Couldn't record that. Try again or contact us directly.");
      setWireConfirmed(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={payWithStripe} disabled={!!loading}>
          {loading === "stripe" ? "Redirecting..." : "Pay with Visa/Card"}
        </button>
        <button className="btn-ghost" onClick={payWithPaypal} disabled={!!loading}>
          {loading === "paypal" ? "Redirecting..." : "Pay with PayPal"}
        </button>
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setOpen(open === "momo" ? null : "momo")}
          disabled={!!loading}
        >
          Mobile Money (GH/NG)
        </button>
        <button
          className="btn-ghost"
          type="button"
          onClick={() => setOpen(open === "wire" ? null : "wire")}
          disabled={!!loading}
        >
          Wire Transfer
        </button>
      </div>

      {open === "momo" && (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn-ghost" onClick={() => payWithMomo("GHS")} disabled={!!loading}>
            {loading === "GHS" ? "Redirecting..." : "Ghana — MoMo (GHS)"}
          </button>
          <button className="btn-ghost" onClick={() => payWithMomo("NGN")} disabled={!!loading}>
            {loading === "NGN" ? "Redirecting..." : "Nigeria — Transfer/Card (NGN)"}
          </button>
        </div>
      )}

      {open === "wire" && (
        <div className="quote-ticket" style={{ marginTop: 12, maxWidth: 420 }}>
          <p style={{ fontSize: 13, marginTop: 0 }}>
            Send your deposit to:
          </p>
          <div className="quote-row"><span className="label">Bank</span><span className="val">{wireInstructions.bankName}</span></div>
          <div className="quote-row"><span className="label">Account Name</span><span className="val">{wireInstructions.accountName}</span></div>
          <div className="quote-row"><span className="label">Account #</span><span className="val">{wireInstructions.accountNumber}</span></div>
          <div className="quote-row"><span className="label">Routing #</span><span className="val">{wireInstructions.routingNumber}</span></div>
          <div className="quote-row"><span className="label">SWIFT</span><span className="val">{wireInstructions.swift}</span></div>
          {wireConfirmed ? (
            <p style={{ fontSize: 13, color: "var(--safety-dim)", marginTop: 14 }}>
              Got it — we'll confirm once the funds land and update your status here.
            </p>
          ) : (
            <button className="btn-primary" style={{ marginTop: 14 }} onClick={notifyWireSent} disabled={!!loading}>
              {loading === "wire" ? "Sending..." : "I've Sent the Wire"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p style={{ color: "var(--safety)", fontFamily: "var(--mono)", fontSize: 13, marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
