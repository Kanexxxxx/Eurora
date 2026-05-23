import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { optionalEnv } from "@/server/env";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const uploadRoot = optionalEnv("UPLOAD_DIR", path.join(process.cwd(), "uploads"));
  const safeSegments = segments.map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, "-"));
  const target = path.join(uploadRoot, ...safeSegments);
  const relative = path.relative(uploadRoot, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return NextResponse.json({ error: "Arquivo invalido" }, { status: 400 });
  }

  try {
    const buffer = await readFile(target);
    const contentType = CONTENT_TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo nao encontrado" }, { status: 404 });
  }
}
