import { NextRequest, NextResponse } from "next/server";
import { asaasRequest } from "@/server/payments/asaas";

export async function GET(req: NextRequest) {
  const payment_id = req.nextUrl.searchParams.get("payment_id");
  if (!payment_id) return NextResponse.json({ error: "payment_id obrigatorio" }, { status: 400 });

  try {
    const p = await asaasRequest<{ status: string }>(`/payments/${payment_id}`);
    const paid = p.status === "CONFIRMED" || p.status === "RECEIVED";
    return NextResponse.json({ paid, status: p.status });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao verificar pagamento.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
