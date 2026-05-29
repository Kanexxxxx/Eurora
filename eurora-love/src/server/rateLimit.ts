import { NextRequest } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(req: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const ip = clientIp(req);
  const bucketKey = `${options.key}:${ip}`;
  const entry = buckets.get(bucketKey);

  if (!entry || entry.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + options.windowMs });
    cleanupExpiredBuckets(now);
    return true;
  }

  if (entry.count >= options.limit) return false;
  entry.count++;
  return true;
}

function cleanupExpiredBuckets(now: number) {
  if (buckets.size < 5000) return;

  for (const [key, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(key);
  }
}
