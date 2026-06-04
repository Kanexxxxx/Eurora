"use client";

export type MetaPixelEvent = "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase" | "Lead";

export type MetaPixelParams = Record<
  string,
  string | number | boolean | string[] | Array<Record<string, unknown>> | undefined
>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_READY_EVENT = "eurora:meta-pixel-ready";

function getStorage(scope: "session" | "local") {
  if (typeof window === "undefined") return null;

  try {
    return scope === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function notifyMetaPixelReady() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PIXEL_READY_EVENT));
}

export function onMetaPixelReady(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(PIXEL_READY_EVENT, callback);
  return () => window.removeEventListener(PIXEL_READY_EVENT, callback);
}

export function trackMetaPixel(event: MetaPixelEvent, params?: MetaPixelParams) {
  if (typeof window === "undefined" || !window.fbq) return false;

  window.fbq("track", event, params ?? {});
  return true;
}

export function trackMetaPixelOnce(
  key: string,
  event: MetaPixelEvent,
  params?: MetaPixelParams,
  scope: "session" | "local" = "session",
) {
  const storage = getStorage(scope);
  const storageKey = `eurora_meta_${key}`;

  if (storage?.getItem(storageKey)) return true;

  const tracked = trackMetaPixel(event, params);
  if (tracked) storage?.setItem(storageKey, "1");

  return tracked;
}

export function planValue(plan: string | null | undefined) {
  return plan === "basic" ? 19 : 39;
}

export function planName(plan: string | null | undefined) {
  return plan === "basic" ? "Pagina do Amor Basic" : "Pagina do Amor Premium";
}
