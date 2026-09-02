export type WtpPriceBucket = "P1_low" | "P2_core" | "P3_high";
export type WtpResponse = "yes" | "maybe" | "no";

export type WtpPriceConfig = {
  bucket: WtpPriceBucket;
  amountUsdCents: number;
  display: string;
};

export const WTP_PRICE_KEY = "mara_p0_wtp_price_bucket";
export const WTP_PRICE_BUCKETS: WtpPriceConfig[] = [
  { bucket: "P1_low", amountUsdCents: 799, display: "US$7.99" },
  { bucket: "P2_core", amountUsdCents: 1299, display: "US$12.99" },
  { bucket: "P3_high", amountUsdCents: 1999, display: "US$19.99" },
];

export function readWtpPriceBucket(): WtpPriceBucket | null {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(WTP_PRICE_KEY) as WtpPriceBucket | null;
  return existing && WTP_PRICE_BUCKETS.some((item) => item.bucket === existing) ? existing : null;
}

export function setWtpPriceBucket(bucket: WtpPriceBucket) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WTP_PRICE_KEY, bucket);
}

export function assignWtpPriceBucket(): WtpPriceConfig {
  if (typeof window === "undefined") return WTP_PRICE_BUCKETS[1];

  const existing = readWtpPriceBucket();
  if (existing) return WTP_PRICE_BUCKETS.find((item) => item.bucket === existing)!;

  const seed = `${navigator.language}:${window.screen.width}:${window.screen.height}:${new Date().getDate()}:wtp`;
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const assigned = WTP_PRICE_BUCKETS[hash % WTP_PRICE_BUCKETS.length];
  setWtpPriceBucket(assigned.bucket);
  return assigned;
}
