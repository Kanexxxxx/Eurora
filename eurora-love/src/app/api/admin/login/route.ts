import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieName,
  adminSessionMaxAge,
  createAdminSessionToken,
} from "@/server/auth/admin";
import { checkRateLimit } from "@/server/rateLimit";

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, { key: "admin-login", limit: 5, windowMs: 15 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde 15 minutos." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({})) as { password?: string };
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct || body.password !== correct) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const sessionToken = await createAdminSessionToken();
  res.cookies.set(adminCookieName(), sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: adminSessionMaxAge(),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(adminCookieName());
  return res;
}
