const APP_ROUTES = [
  "/",
  "/criar",
  "/checkout",
  "/sucesso",
  "/presentes",
  "/mensagem",
  "/quiz",
  "/ia",
  "/termos",
  "/privacidade",
];

export function isLovePage(pathname: string | null): boolean {
  if (!pathname || pathname.length <= 1) return false;
  return APP_ROUTES.every((route) => !pathname.startsWith(route));
}
