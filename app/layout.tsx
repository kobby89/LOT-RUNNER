import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotrunner — Salvage & Auction Buying Concierge",
  description: "We bid or buy salvage and insurance-auction vehicles on your behalf. No dealer license required. One flat, disclosed service fee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="nav">
            <Link href="/" className="brand"><span className="dot" />LOTRUNNER</Link>
            <nav style={{ display: "flex", gap: 28, fontFamily: "var(--disp)", fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>
              <Link href="/quote" style={{ color: "#cfcbc0", textDecoration: "none" }}>Get a Quote</Link>
              <Link href="/request" style={{ color: "#cfcbc0", textDecoration: "none" }}>Request a Car</Link>
            </nav>
            <Link href="/request" className="nav-cta">Request a Car</Link>
          </div>
        </header>

        {children}

        <footer>
          <div className="wrap">
            <div style={{ fontFamily: "var(--stencil)", color: "var(--chalk)", fontSize: 18, marginBottom: 12 }}>LOTRUNNER</div>
            <p style={{ maxWidth: 560, lineHeight: 1.6, fontFamily: "var(--mono)", fontSize: 11.5 }}>
              Lotrunner is an independent vehicle-sourcing service. We are not affiliated with, sponsored by,
              or acting as an agent of any auction platform referenced. Purchases are made under our own
              licensed auction account on the customer&apos;s behalf for a disclosed service fee.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/terms" style={{ color: "#8a8578", textDecoration: "underline" }}>Terms of Service</Link>
              <Link href="/privacy" style={{ color: "#8a8578", textDecoration: "underline" }}>Privacy Policy</Link>
            </div>
            <div style={{ marginTop: 16 }}>
              © {new Date().getFullYear()} Lotrunner. Exchange rates by{" "}
              <a href="https://www.exchangerate-api.com" style={{ color: "#8a8578" }}>
                ExchangeRate-API
              </a>
              .
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
