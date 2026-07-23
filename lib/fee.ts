/**
 * The one function that decides what a customer owes.
 * Keep every quote — on the landing page calculator, in the API, in emails,
 * on invoices — running through this so the number never drifts.
 */
export type QuoteInput = {
  hammer: number; // winning bid / Buy-It-Now price
  auctionFees: number; // auction house + doc fees, passed through at cost
  feePercent?: number; // Lotrunner's service fee, default 10%
};

export type Quote = {
  hammer: number;
  auctionFees: number;
  feePercent: number;
  fee: number;
  total: number;
};

export function calculateQuote({ hammer, auctionFees, feePercent = 0.1 }: QuoteInput): Quote {
  const safeHammer = Math.max(0, hammer || 0);
  const safeFees = Math.max(0, auctionFees || 0);
  const fee = round2(safeHammer * feePercent);
  const total = round2(safeHammer + safeFees + fee);

  return {
    hammer: round2(safeHammer),
    auctionFees: round2(safeFees),
    feePercent,
    fee,
    total,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
