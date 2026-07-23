import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="section on-asphalt" style={{ paddingTop: 70, paddingBottom: 70 }}>
        <div className="wrap">
          <div className="sec-eyebrow">Salvage &amp; insurance-auction concierge</div>
          <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: "0 0 20px", maxWidth: 640 }}>
            You don&apos;t need a dealer license. <span style={{ color: "var(--safety)" }}>You need us.</span>
          </h1>
          <p className="sec-lead">
            Tell us the car. We source it, bid it, or buy it outright through our licensed auction
            accounts — you never touch a login you don&apos;t have access to. One flat 10% service fee,
            shown before you commit.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/request" className="btn-primary">Submit a Request</Link>
            <Link href="/quote" className="btn-ghost">See How Pricing Works</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-eyebrow">The process</div>
          <h2 className="sec-h">Four steps, no license required</h2>
          <p className="sec-lead">We hold the accredited auction accounts. You get the car.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              ["01", "You send the request", "A specific lot, or a make/model/budget. Either works."],
              ["02", "We quote the ceiling", "You approve a max bid or Buy-It-Now price, fee included."],
              ["03", "We bid or buy it", "Through our own licensed auction account. You track status live."],
              ["04", "You pay & pick up", "Final invoice matches the quote exactly. Title transfers to you."],
            ].map(([num, title, desc]) => (
              <div key={num}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--safety-dim)", marginBottom: 8 }}>STEP {num}</div>
                <div style={{ fontFamily: "var(--disp)", fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13.5, color: "#5a564a", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-asphalt">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div className="sec-eyebrow">Ready when you are</div>
            <h2 className="sec-h" style={{ color: "var(--chalk)", margin: 0 }}>Send a lot number, get a quote back.</h2>
          </div>
          <Link href="/request" className="btn-primary">Start a Request</Link>
        </div>
      </section>
    </>
  );
}
