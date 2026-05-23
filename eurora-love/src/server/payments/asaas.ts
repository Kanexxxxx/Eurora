import { optionalEnv, requiredEnv } from "@/server/env";

type AsaasError = {
  errors?: Array<{ code?: string; description?: string }>;
  error?: string;
  message?: string;
};

export type AsaasCustomerInput = {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  externalReference: string;
};

type AsaasPayerInput = Omit<AsaasCustomerInput, "externalReference">;

export type AsaasPaymentMethod = "pix" | "credit_card";

export type AsaasCardInput = {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  postalCode: string;
  addressNumber: string;
};

export type AsaasPaymentInput = {
  customerId: string;
  pageId: string;
  plan: "basic" | "premium";
  method: AsaasPaymentMethod;
  payer: AsaasPayerInput;
  card?: AsaasCardInput;
  remoteIp: string;
};

export type AsaasPayment = {
  id: string;
  status?: string;
  invoiceUrl?: string;
};

export type AsaasPixQrCode = {
  encodedImage: string;
  payload: string;
  expirationDate?: string;
};

const PRICES = { basic: 19, premium: 39 } as const;

export function planPrice(plan: "basic" | "premium") {
  return PRICES[plan];
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function asaasBaseUrl() {
  return optionalEnv("ASAAS_API_URL", "https://api.asaas.com/v3");
}

function asaasApiKey() {
  return requiredEnv("ASAAS_API_KEY");
}

function asaasErrorMessage(body: AsaasError) {
  const first = body.errors?.[0]?.description;
  return first || body.message || body.error || "Erro ao comunicar com o Asaas.";
}

export async function asaasRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("access_token", asaasApiKey());
  headers.set("User-Agent", "eurora-love/1.0");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${asaasBaseUrl()}${path}`, { ...init, headers });
  const body = (await res.json().catch(() => ({}))) as T & AsaasError;

  if (!res.ok) {
    throw new Error(asaasErrorMessage(body));
  }

  return body;
}

export async function createAsaasCustomer(input: AsaasCustomerInput) {
  return asaasRequest<{ id: string }>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      cpfCnpj: onlyDigits(input.cpfCnpj),
      email: input.email,
      mobilePhone: onlyDigits(input.phone),
      externalReference: input.externalReference,
      notificationDisabled: true,
    }),
  });
}

export async function createAsaasPayment(input: AsaasPaymentInput) {
  const expiryYear =
    input.card?.expiryYear.length === 2
      ? `20${input.card.expiryYear}`
      : input.card?.expiryYear;

  const baseBody: Record<string, unknown> = {
    customer: input.customerId,
    billingType: input.method === "pix" ? "PIX" : "CREDIT_CARD",
    value: planPrice(input.plan),
    dueDate: todayIsoDate(),
    description: `EURORA LOVE - Plano ${
      input.plan === "premium" ? "Premium" : "Basic"
    }`,
    externalReference: input.pageId,
    remoteIp: input.remoteIp,
  };

  if (input.method === "credit_card") {
    if (!input.card) throw new Error("Dados do cartao nao informados.");

    baseBody.creditCard = {
      holderName: input.card.holderName,
      number: onlyDigits(input.card.number),
      expiryMonth: input.card.expiryMonth.padStart(2, "0"),
      expiryYear,
      ccv: onlyDigits(input.card.ccv),
    };
    baseBody.creditCardHolderInfo = {
      name: input.payer.name,
      email: input.payer.email,
      cpfCnpj: onlyDigits(input.payer.cpfCnpj),
      postalCode: onlyDigits(input.card.postalCode),
      addressNumber: input.card.addressNumber,
      phone: onlyDigits(input.payer.phone),
      mobilePhone: onlyDigits(input.payer.phone),
    };
  }

  return asaasRequest<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify(baseBody),
  });
}

export async function getAsaasPixQrCode(paymentId: string) {
  return asaasRequest<AsaasPixQrCode>(`/payments/${paymentId}/pixQrCode`);
}

export function isAsaasPaidStatus(status?: string) {
  return status === "CONFIRMED" || status === "RECEIVED";
}
