"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      contactPhone: String(form.get("contactPhone") || "") || undefined,
      lotNumber: String(form.get("lotNumber") || "") || undefined,
      makeModel: String(form.get("makeModel") || "") || undefined,
      maxBudget: form.get("maxBudget") ? Number(form.get("maxBudget")) : undefined,
      notes: String(form.get("notes") || "") || undefined,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error ? "Check the form — some fields need fixing." : "Something went wrong. Try again.");
      }

      const { request } = await res.json();
      router.push(`/dashboard/${request.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section on-asphalt">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="sec-eyebrow">Start a request</div>
        <h2 className="sec-h" style={{ color: "var(--chalk)" }}>Tell us what you&apos;re after</h2>
        <p className="sec-lead">
          A specific lot number gets the fastest quote. No lot in mind? Give us the make, model, and
          budget and we&apos;ll go find one.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="customerName">Full name</label>
            <input id="customerName" name="customerName" type="text" required placeholder="Jordan Reyes" />
          </div>
          <div className="field">
            <label htmlFor="contactEmail">Email</label>
            <input id="contactEmail" name="contactEmail" type="email" required placeholder="jordan@email.com" />
          </div>
          <div className="field">
            <label htmlFor="contactPhone">Phone (optional)</label>
            <input id="contactPhone" name="contactPhone" type="tel" placeholder="(555) 555-5555" />
          </div>
          <div className="field">
            <label htmlFor="lotNumber">Auction lot # (if known)</label>
            <input id="lotNumber" name="lotNumber" type="text" placeholder="e.g. 48291" />
          </div>
          <div className="field">
            <label htmlFor="makeModel">Make &amp; model</label>
            <input id="makeModel" name="makeModel" type="text" placeholder="Honda CR-V" />
          </div>
          <div className="field">
            <label htmlFor="maxBudget">Max budget, all-in ($)</label>
            <input id="maxBudget" name="maxBudget" type="number" placeholder="12000" />
          </div>
          <div className="field">
            <label htmlFor="notes">Anything else we should know</label>
            <textarea id="notes" name="notes" rows={3} placeholder="Preferred title type, location, timeline..." />
          </div>

          {error && <p style={{ color: "var(--safety)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Request — No Payment Yet"}
          </button>
        </form>
      </div>
    </section>
  );
}
