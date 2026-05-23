import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { optionalEnv } from "@/server/env";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

function uploadRoot() {
  return optionalEnv("UPLOAD_DIR", path.join(process.cwd(), "uploads"));
}

function publicBaseUrl() {
  const appUrl = optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000").replace(/\/$/, "");
  return optionalEnv("UPLOAD_PUBLIC_URL", `${appUrl}/uploads`).replace(/\/$/, "");
}

function cleanSegment(segment: string) {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function assertSafeKey(key: string) {
  const normalized = key.replace(/\\/g, "/");
  if (normalized.includes("..") || normalized.startsWith("/")) {
    throw new Error("Caminho de upload invalido.");
  }
  return normalized.split("/").map(cleanSegment).join("/");
}

export function extensionFromMime(mimeType: string) {
  const ext = mimeType.split("/")[1]?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) return null;
  return ext === "jpeg" ? "jpg" : ext;
}

export function createUploadKey(folder: string, extension: string) {
  const safeFolder = cleanSegment(folder);
  const safeExt = cleanSegment(extension).replace(/^\.+/, "");
  const unique = `${Date.now()}-${randomUUID()}`;
  return `${safeFolder}/${unique}.${safeExt}`;
}

export async function saveUpload(key: string, buffer: Buffer) {
  const safeKey = assertSafeKey(key);
  const target = path.join(uploadRoot(), safeKey);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return `${publicBaseUrl()}/${safeKey}`;
}
