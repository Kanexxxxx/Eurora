import { NextRequest } from "next/server";

const COOKIE_NAME = "admin_token";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  exp: number;
  nonce: string;
};

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "="
  );
  return atob(padded);
}

function sessionSecret() {
  if (!process.env.ADMIN_SESSION_SECRET && process.env.NODE_ENV === "production") {
    console.warn("[admin-auth] ADMIN_SESSION_SECRET não definido — usando ADMIN_PASSWORD como fallback. Defina ADMIN_SESSION_SECRET separadamente para maior segurança.");
  }
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function hmac(value: string) {
  const secret = sessionSecret();
  if (!secret) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = Array.from(new Uint8Array(signature));
  return base64UrlEncode(String.fromCharCode(...bytes));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function adminSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}

export async function createAdminSessionToken() {
  const payload: AdminSessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(encodedPayload);
  if (!signature) throw new Error("ADMIN_SESSION_SECRET ou ADMIN_PASSWORD ausente.");
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expected = await hmac(encodedPayload);
  if (!expected || !safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminRequest(req: NextRequest) {
  return verifyAdminSessionToken(req.cookies.get(COOKIE_NAME)?.value);
}
