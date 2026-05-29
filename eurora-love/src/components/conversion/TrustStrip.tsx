"use client";

import { motion } from "framer-motion";

const ITEMS = [
  { icon: "🔒", title: "Pagamento seguro", sub: "Pix e cartao via Asaas" },
  { icon: "🛡️", title: "Suporte garantido", sub: "Atendimento em até 7 dias" },
  { icon: "⚡", title: "Pronto em 3 minutos", sub: "Entrega instantânea" },
  { icon: "♥", title: "+38.000 casais", sub: "Em todo o Brasil" },
];

export default function TrustStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
      {ITEMS.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="bg-[#0a0710] px-4 py-5 flex items-center gap-3"
        >
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              {item.title}
            </p>
            <p className="text-white/50 text-[11px] leading-tight mt-0.5">
              {item.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
