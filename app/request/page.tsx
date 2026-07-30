"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  VEHICLE_TYPES, MAKES, LOSS_TYPES, PRIMARY_DAMAGE, TITLE_TYPES,
  SALES_TYPES, START_CODES, FUEL_TYPES, TRANSMISSIONS, DRIVETRAINS,
  BODY_STYLES, COLORS, ODOMETER_RANGES, US_STATES,
} from "@/lib/vehicle-options";

const YEARS = Array.from({ length: 2027 - 1996 }, (_, i) => 1996 + i).reverse();

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue="All">
        <option value="All">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function RequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const customerName = String(form.get("customerName") || "").trim();
    const contactEmail = String(form.get("contactEmail") || "").trim();

    if (!customerName) {
      setError("Please enter your name.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    // Every "Find Vehicle" filter that isn't left on "All" gets bundled
    // into searchCriteria — this is what we search for on your behalf
    // once we're checking real listings, not something submitted to
    // any auction site directly.
    const filterFields = [
      "vehicleType", "make", "model", "state", "lossType", "primaryDamage",
      "titleType", "salesType", "startCode", "odometer", "fuelType",
      "transmission", "drivetrain", "bodyStyle", "exteriorColor", "interiorColor",
    ];
    const searchCriteria: Record<string, string> = {};
    for (const field of filterFields) {
      const val = String(form.get(field) || "");
      if (val && val !== "All") searchCriteria[field] = val;
    }

    const yearMin = form.get("yearMin") ? Number(form.get("yearMin")) : undefined;
    const yearMax = form.get("yearMax") ? Number(form.get("yearMax")) : undefined;

    const payload = {
      customerName,
      contactEmail,
      contactPhone: String(form.get("contactPhone") || "").trim() || undefined,
      lotNumber: String(form.get("lotNumber") || "").trim() || undefined,
      makeModel: [searchCriteria.make, searchCriteria.model].filter(Boolean).join(" ") || undefined,
      yearRangeMin: yearMin,
      yearRangeMax: yearMax,
      maxBudget: form.get("maxBudget") ? Number(form.get("maxBudget")) : undefined,
      notes: String(form.get("notes") || "").trim() || undefined,
      searchCriteria: Object.keys(searchCriteria).length ? searchCriteria : undefined,
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
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sec-eyebrow">Start a request</div>
        <h2 className="sec-h" style={{ color: "var(--chalk)" }}>Find your vehicle</h2>
        <p className="sec-lead">
          Already have a lot number? Just fill that in and skip the rest. Otherwise, narrow it down
          below — the more specific, the faster we can find a match.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <div className="field">
              <label htmlFor="customerName">Full name</label>
              <input id="customerName" name="customerName" type="text" placeholder="Jordan Reyes" />
            </div>
            <div className="field">
              <label htmlFor="contactEmail">Email</label>
              <input id="contactEmail" name="contactEmail" type="text" inputMode="email" placeholder="jordan@email.com" />
            </div>
            <div className="field">
              <label htmlFor="contactPhone">Phone (optional)</label>
              <input id="contactPhone" name="contactPhone" type="tel" placeholder="(555) 555-5555" />
            </div>
            <div className="field">
              <label htmlFor="lotNumber">Auction lot # (if known — skips everything below)</label>
              <input id="lotNumber" name="lotNumber" type="text" placeholder="e.g. 48291" />
            </div>
            <div className="field">
              <label htmlFor="maxBudget">Max budget, all-in ($)</label>
              <input id="maxBudget" name="maxBudget" type="number" placeholder="12000" />
            </div>
          </div>

          <div className="sec-eyebrow" style={{ marginTop: 8 }}>Find Vehicle</div>

          <Select name="vehicleType" label="Vehicle Type" options={VEHICLE_TYPES} />
          <Select name="make" label="Make" options={MAKES} />

          <div className="field">
            <label htmlFor="model">Model</label>
            <input id="model" name="model" type="text" placeholder="e.g. CR-V, Civic, Accord" />
          </div>

          <div className="field">
            <label>Year</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <select name="yearMin" defaultValue="1996" style={{ flex: 1 }}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <span style={{ color: "#8a8578" }}>–</span>
              <select name="yearMax" defaultValue="2027" style={{ flex: 1 }}>
                {[...YEARS].reverse().map((y) => <option key={y} value={y}>{y}</option>)}
                <option value="2027">2027</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="state">Location — State</label>
            <select id="state" name="state" defaultValue="All">
              <option value="All">All</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <Select name="lossType" label="Loss Type" options={LOSS_TYPES} />
          <Select name="primaryDamage" label="Primary Damage" options={PRIMARY_DAMAGE} />
          <Select name="titleType" label="Title Type" options={TITLE_TYPES} />
          <Select name="salesType" label="Sales Type" options={SALES_TYPES} />
          <Select name="startCode" label="Start Code" options={START_CODES} />
          <Select name="odometer" label="Odometer" options={ODOMETER_RANGES} />
          <Select name="fuelType" label="Fuel Type" options={FUEL_TYPES} />
          <Select name="transmission" label="Transmission" options={TRANSMISSIONS} />
          <Select name="drivetrain" label="Drivetrain" options={DRIVETRAINS} />
          <Select name="bodyStyle" label="Body Style" options={BODY_STYLES} />
          <Select name="exteriorColor" label="Exterior Color" options={COLORS} />
          <Select name="interiorColor" label="Interior Color" options={COLORS} />

          <div className="field" style={{ marginTop: 8 }}>
            <label htmlFor="notes">Anything else we should know</label>
            <textarea id="notes" name="notes" rows={3} placeholder="Preferred pickup timeline, must-have features..." />
          </div>

          {error && <p style={{ color: "var(--safety)", fontFamily: "var(--mono)", fontSize: 13 }}>{error}</p>}

          <p style={{ fontSize: 12, color: "#8a8578", fontFamily: "var(--mono)", marginBottom: 12 }}>
            By submitting, you agree to our{" "}
            <Link href="/terms" style={{ color: "var(--safety)" }}>Terms of Service</Link> and{" "}
            <Link href="/privacy" style={{ color: "var(--safety)" }}>Privacy Policy</Link>.
          </p>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Request — No Payment Yet"}
          </button>
        </form>
      </div>
    </section>
  );
}
