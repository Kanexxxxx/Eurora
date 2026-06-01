"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
// useRef é usado para fechar o drawer ao clicar fora

const NAV = [
  { href: "/admin",            label: "Dashboard", icon: "📊" },
  { href: "/admin/criar",      label: "Criar página", icon: "+" },
  { href: "/admin/pedidos",    label: "Pedidos",    icon: "💳" },
  { href: "/admin/cadastros",  label: "Cadastros",  icon: "👥" },
  { href: "/admin/mensagens",  label: "Mensagens",  icon: "✉️" },
  { href: "/admin/links",      label: "Produtos",   icon: "🎁" },
];

// Componente fora do render para evitar reset de estado
function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Menu administrativo">
      <ul className="flex-1 p-3 space-y-1" role="list">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                  active
                    ? "bg-rose-600/20 text-rose-300"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // fecha drawer ao navegar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // fecha com ESC ou clique fora
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* ── Sidebar desktop (lg+) ── */}
      <aside
        className="hidden lg:flex w-56 shrink-0 border-r border-white/8 flex-col"
        aria-label="Painel administrativo"
      >
        <div className="p-5 border-b border-white/8">
          <p className="text-white font-bold text-sm">EURORA LOVE</p>
          <p className="text-white/40 text-xs">Admin</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>

        <div className="p-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* ── Overlay mobile ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Drawer mobile ── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu administrativo"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-white/8 flex flex-col transform transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-white/8 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">EURORA LOVE</p>
            <p className="text-white/40 text-xs">Admin</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="text-white/40 hover:text-white p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>

        <div className="p-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Sair
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#0a0a0a]">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="text-white/60 hover:text-white p-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <rect y="3" width="20" height="2" rx="1"/>
              <rect y="9" width="20" height="2" rx="1"/>
              <rect y="15" width="20" height="2" rx="1"/>
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">EURORA LOVE Admin</span>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
