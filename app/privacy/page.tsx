export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="sec-eyebrow">Legal</div>
        <h2 className="sec-h">Privacy Policy</h2>
        <p style={{ fontSize: 13, color: "#8a8578", fontFamily: "var(--mono)" }}>
          Last updated: July 30, 2026 — Draft. Have a lawyer review before relying on this.
        </p>

        <div style={{ fontSize: 15, lineHeight: 1.7, color: "#3a3833" }}>
          <h3>1. What we collect</h3>
          <p>
            When you submit a request, we collect your name, email, phone number (optional), and
            the vehicle details/budget you provide. If you pay a deposit, our payment processors
            (Stripe, PayPal, or Flutterwave) collect and handle your payment details directly — we
            never see or store your full card number, Mobile Money PIN, or bank credentials.
          </p>

          <h3>2. How we use it</h3>
          <p>
            We use your information to find and quote vehicles on your behalf, communicate with
            you about your request's status, process deposits and payments, and — if you agree —
            send you updates about new inventory that matches what you're looking for.
          </p>

          <h3>3. Who we share it with</h3>
          <ul>
            <li>
              <strong>Payment processors</strong> (Stripe, PayPal, Flutterwave) — to process
              deposits and payments. Each has its own privacy policy governing the payment data
              they hold.
            </li>
            <li>
              <strong>Database hosting</strong> (Supabase) — where your request information is
              stored securely.
            </li>
            <li>
              We do <strong>not</strong> sell your personal information to third parties.
            </li>
          </ul>

          <h3>4. How long we keep it</h3>
          <p>
            We retain request records for as long as needed to provide the service and comply with
            tax/accounting obligations. You can ask us to delete your data by contacting us
            directly, subject to records we're legally required to keep.
          </p>

          <h3>5. Your rights</h3>
          <p>
            Depending on where you live, you may have the right to access, correct, or delete the
            personal information we hold about you. Contact us to make a request.
          </p>

          <h3>6. Security</h3>
          <p>
            We take reasonable steps to protect your information, but no online service can
            guarantee absolute security.
          </p>

          <h3>7. Contact</h3>
          <p>Questions about this policy: <a href="mailto:swocsllc@gmail.com">swocsllc@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
