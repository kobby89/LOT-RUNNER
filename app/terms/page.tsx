export default function TermsPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sec-eyebrow">Legal</div>
        <h2 className="sec-h">Terms of Service</h2>
        <p style={{ fontSize: 13, color: "#8a8578", fontFamily: "var(--mono)" }}>
          Last updated: July 30, 2026 — Draft. Have a lawyer review before relying on this.
        </p>

        <div style={{ fontSize: 15, lineHeight: 1.7, color: "#3a3833" }}>
          <h3>1. Who we are</h3>
          <p>
            Lotrunner ("we," "us") is an independent vehicle-sourcing and bidding concierge service.
            We are not affiliated with, sponsored by, endorsed by, or an agent of SalvageBid, IAA,
            Copart, or any other auction platform. We access those platforms under our own
            registered account(s) on your behalf, for a disclosed service fee.
          </p>

          <h3>2. What we do</h3>
          <p>
            You submit a request describing a vehicle you want (by lot number or by search
            criteria). We review the real listing, provide you a quote (hammer price estimate +
            auction/doc fees + our service fee), and — once you approve that quote and pay a
            deposit — we bid on or purchase the vehicle using our own account. Legal ownership of
            the vehicle transfers to you once payment is complete and title is transferred.
          </p>

          <h3>3. No guarantee of winning</h3>
          <p>
            Auctions are competitive. We do not guarantee that any bid will succeed. If we do not
            win the vehicle, your deposit (see Section 5) is refunded in full, minus any payment
            processor fees actually incurred.
          </p>

          <h3>4. Our fee</h3>
          <p>
            Our service fee is a flat percentage of the winning bid amount, disclosed to you as
            part of your quote before you approve it or pay anything. We do not charge this fee on
            auction/doc fees or taxes.
          </p>

          <h3>5. Deposits and refunds</h3>
          <p>
            We require a deposit (currently {"20%"} of the quoted total, shown at checkout) before we
            place any bid on your behalf. This deposit is:
          </p>
          <ul>
            <li><strong>Fully refundable</strong> if we do not win the vehicle at auction.</li>
            <li>
              <strong>Fully refundable</strong> if you cancel your request before we have placed a
              bid on your behalf.
            </li>
            <li>
              <strong>Non-refundable</strong> if we win the vehicle at or below your approved
              quote and you decline to complete the purchase. In that case the deposit compensates
              us for the auction fees and commitment we've already incurred on your behalf.
            </li>
          </ul>
          <p>
            Refunds are issued to the original payment method and may take several business days
            depending on your bank or payment provider.
          </p>

          <h3>6. Payment methods</h3>
          <p>
            We accept Visa/card, PayPal, Mobile Money (Ghana/Nigeria), and wire transfer. For
            payments made in a currency other than USD, the amount is converted at the prevailing
            exchange rate at the time of checkout; this rate may differ slightly from the rate on
            the day funds are actually applied.
          </p>

          <h3>7. Vehicle condition</h3>
          <p>
            Vehicle condition, title status, damage disclosures, and odometer readings are sourced
            from the auction platform's own listing at the time we review it, and are subject to
            that platform's own terms and accuracy. We do not independently inspect vehicles unless
            explicitly agreed in writing.
          </p>

          <h3>8. Limitation of liability</h3>
          <p>
            To the fullest extent permitted by law, our liability to you is limited to the amount
            of fees you have paid us for the specific request in question. We are not liable for
            indirect, incidental, or consequential damages, including loss of use, lost profit, or
            costs of alternative transportation.
          </p>

          <h3>9. Governing law</h3>
          <p>
            These terms are governed by the laws of the State of South Carolina, USA, without
            regard to conflict-of-law principles. Any dispute arising from these terms or our
            services will be resolved in the state or federal courts located in South Carolina,
            unless applicable law requires otherwise. [Confirm this with a lawyer — especially
            given customers may be located outside South Carolina, including in Ghana and
            Nigeria; cross-border enforcement and consumer-protection rules can affect what's
            actually enforceable.]
          </p>

          <h3>10. Changes to these terms</h3>
          <p>
            We may update these terms from time to time. Continued use of the site after changes
            are posted constitutes acceptance of the updated terms.
          </p>

          <h3>11. Contact</h3>
          <p>Questions about these terms: <a href="mailto:swocsllc@gmail.com">swocsllc@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
