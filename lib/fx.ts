/**
 * Live exchange rates from ExchangeRate-API's free/open endpoint —
 * no API key needed, updates once every 24 hours (fine for this use
 * case; deposits aren't high-frequency trades). Their terms require
 * visible attribution somewhere on the site — that's in the footer
 * (see app/layout.tsx).
 *
 * Docs: https://www.exchangerate-api.com/docs/free
 */

let cachedRates: { rates: Record<string, number>; fetchedAt: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // re-fetch at most once an hour per running instance

async function getUsdRates(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < CACHE_MS) {
    return cachedRates.rates;
  }

  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  const data = await res.json();

  if (data.result !== "success") {
    throw new Error("Exchange rate lookup failed");
  }

  cachedRates = { rates: data.rates, fetchedAt: Date.now() };
  return data.rates;
}

/**
 * Converts a USD amount to the given currency at today's rate.
 * Rounds to 2 decimal places.
 */
export async function convertFromUSD(amountUSD: number, toCurrency: "GHS" | "NGN") {
  const rates = await getUsdRates();
  const rate = rates[toCurrency];

  if (!rate) {
    throw new Error(`No exchange rate available for ${toCurrency}`);
  }

  return Math.round(amountUSD * rate * 100) / 100;
}
