"use client";

import { useEffect, useState } from "react";

type Req = {
  id: string;
  customerName: string;
  contactEmail: string;
  lotNumber?: string;
  makeModel?: string;
  maxBudget?: number;
  searchCriteria?: Record<string, string>;
  status: string;
  quotedHammer?: number;
  quotedAuctionFees?: number;
  feePercent: number;
  quotedTotal?: number;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "SUBMITTED", "QUOTE_SENT", "QUOTE_APPROVED", "DEPOSIT_RECEIVED",
  "BIDDING_LIVE", "WON", "LOST", "INVOICED", "READY_FOR_PICKUP", "CANCELLED",
];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [requests, setRequests] = useState<Req[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadRequests(t: string) {
    const res = await fetch("/api/requests", { headers: { "x-admin-token": t } });
    if (!res.ok) {
      setError("Invalid admin token.");
      setAuthed(false);
      return;
    }
    const { requests } = await res.json();
    setRequests(requests);
    setAuthed(true);
    setError(null);
  }

  async function updateRequest(id: string, patch: Partial<Req>) {
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(patch),
    });
    loadRequests(token);
  }

  if (!authed) {
    return (
      <section className="section on-asphalt">
        <div className="wrap" style={{ maxWidth: 420 }}>
          <div className="sec-eyebrow">Staff only</div>
          <h2 className="sec-h" style={{ color: "var(--chalk)" }}>Admin access</h2>
          <div className="field">
            <label>Admin token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadRequests(token)}
            />
          </div>
          {error && <p style={{ color: "var(--safety)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}
          <button className="btn-primary" onClick={() => loadRequests(token)}>Enter</button>
          <p style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "#8a8578", marginTop: 20 }}>
            This is a placeholder gate for local/dev use. Replace with real auth (Clerk, NextAuth, or
            Supabase Auth) before this touches production.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-eyebrow">Staff dashboard</div>
        <h2 className="sec-h">Open &amp; closed requests</h2>
        <table className="admin">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Lot / Vehicle</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Hammer</th>
              <th>Auction Fees</th>
              <th>Fee %</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <RequestRow key={r.id} request={r} onSave={(patch) => updateRequest(r.id, patch)} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RequestRow({ request, onSave }: { request: Req; onSave: (patch: any) => void }) {
  const [status, setStatus] = useState(request.status);
  const [hammer, setHammer] = useState(request.quotedHammer ?? "");
  const [fees, setFees] = useState(request.quotedAuctionFees ?? "");
  const [pct, setPct] = useState(request.feePercent);

  return (
    <tr>
      <td>{request.customerName}<br /><span style={{ color: "#8a8578" }}>{request.contactEmail}</span></td>
      <td>
        {request.lotNumber || request.makeModel || "—"}
        {request.searchCriteria && Object.keys(request.searchCriteria).length > 0 && (
          <div style={{ fontSize: 11, color: "#8a8578", marginTop: 4, fontFamily: "var(--mono)" }}>
            {Object.entries(request.searchCriteria).map(([k, v]) => `${k}: ${v}`).join(", ")}
          </div>
        )}
      </td>
      <td>{request.maxBudget ? `$${request.maxBudget}` : "—"}</td>
      <td>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td><input type="number" value={hammer} onChange={(e) => setHammer(e.target.value === "" ? "" : Number(e.target.value))} style={{ width: 90 }} /></td>
      <td><input type="number" value={fees} onChange={(e) => setFees(e.target.value === "" ? "" : Number(e.target.value))} style={{ width: 90 }} /></td>
      <td><input type="number" step={0.01} value={pct} onChange={(e) => setPct(Number(e.target.value))} style={{ width: 60 }} /></td>
      <td>{request.quotedTotal ? `$${request.quotedTotal.toLocaleString()}` : "—"}</td>
      <td>
        <button
          className="btn-ghost"
          style={{ padding: "6px 12px", fontSize: 11 }}
          onClick={() =>
            onSave({
              status,
              quotedHammer: hammer === "" ? undefined : hammer,
              quotedAuctionFees: fees === "" ? undefined : fees,
              feePercent: pct,
            })
          }
        >
          Save
        </button>
      </td>
    </tr>
  );
}
