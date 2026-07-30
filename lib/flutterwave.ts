/**
 * Thin wrapper around Flutterwave's Standard (hosted) payment API.
 * Flutterwave shows Mobile Money (MTN, Vodafone Cash, AirtelTigo in
 * Ghana; bank transfer/USSD/card in Nigeria) automatically based on
 * the currency you pass, same as Paystack did — just a different
 * processor per your preference.
 *
 * CURRENCY CAVEAT — same one as before, still applies: quotes in this
 * app are calculated in USD, but Flutterwave charges in GHS/NGN. This
 * passes the number straight through without converting. Wire in a
 * live FX rate, or quote Ghanaian/Nigerian customers directly in local
 * currency, before taking a real deposit this way.
 */

const FLW_BASE = "https://api.flutterwave.com/v3";

export type FlutterwaveCurrency = "GHS" | "NGN";

export async function initializeFlutterwavePayment(params: {
  tx_ref: string;
  amount: number; // in whole currency units (GHS/NGN), not smallest unit
  currency: FlutterwaveCurrency;
  redirect_url: string;
  customerEmail: string;
  customerName: string;
  meta?: Record<string, unknown>;
}) {
  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.tx_ref,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirect_url,
      customer: { email: params.customerEmail, name: params.customerName },
      meta: params.meta,
      // Nudges Flutterwave's hosted page toward Mobile Money as the
      // lead option for these markets; customers can still pick card.
      payment_options: params.currency === "GHS" ? "mobilemoneyghana,card" : "card,banktransfer,ussd",
    }),
  });

  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Flutterwave initialization failed");
  }

  return data.data as { link: string };
}
