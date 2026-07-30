/**
 * PayPal Orders v2 API — no SDK needed, just a couple of REST calls.
 * PAYPAL_MODE env var switches between sandbox (testing) and live.
 */

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "PayPal auth failed");
  return data.access_token as string;
}

export async function createPaypalOrder(params: {
  amountUSD: number;
  requestId: string;
  return_url: string;
  cancel_url: string;
}) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.requestId,
          amount: { currency_code: "USD", value: params.amountUSD.toFixed(2) },
        },
      ],
      application_context: {
        return_url: params.return_url,
        cancel_url: params.cancel_url,
        user_action: "PAY_NOW",
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PayPal order creation failed");

  const approveLink = data.links.find((l: any) => l.rel === "approve")?.href;
  return { orderId: data.id, approveLink };
}

export async function capturePaypalOrder(orderId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PayPal capture failed");
  return data;
}
