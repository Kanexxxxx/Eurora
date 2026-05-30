"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/criar", label: "Criar pagina", icon: "+" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "💳" },
  { href: "/admin/cadastros", label: "Cadastros", icon: "👥" },
  { href: "/admin/mensagens", label: "Mensagens", icon: "✉️" },
  { href: "/admin/links", label: "Produtos", icon: "🎁" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/8 flex flex-col">
        <div className="p-5 border-b border-white/8">
          <p className="text-white font-bold text-sm">EURORA LOVE</p>
          <p className="text-white/40 text-xs">Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-rose-600/20 text-rose-300"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
