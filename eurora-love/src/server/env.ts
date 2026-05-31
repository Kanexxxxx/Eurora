type EnvKey =
  | "DATABASE_URL"
  | "DIRECT_URL"
  | "ASAAS_API_KEY"
  | "ASAAS_API_URL"
  | "ASAAS_WEBHOOK_TOKEN"
  | "NEXT_PUBLIC_APP_URL"
  | "CRON_SECRET"
  | "GMAIL_USER"
  | "GMAIL_APP_PASSWORD"
  | "DEEPSEEK_API_KEY"
  | "NEXT_PUBLIC_WHATSAPP_NUMBER"
  | "NEXT_PUBLIC_SUPPORT_EMAIL"
  | "ADMIN_PASSWORD"
  | "ADMIN_SESSION_SECRET"
  | "UPLOAD_DIR"
  | "UPLOAD_PUBLIC_URL"
  | "EMAIL_USER"
  | "EMAIL_PASS"
  | "EMAIL_HOST"
  | "EMAIL_PORT";

export function requiredEnv(key: EnvKey) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${key}`);
  }
  return value;
}

export function optionalEnv(key: EnvKey, fallback = "") {
  return process.env[key] || fallback;
}
