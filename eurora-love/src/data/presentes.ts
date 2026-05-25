export type Platform = "Amazon" | "Shopee" | "ML";

export type Produto = {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  categoria: string;
  image?: string;
};

export type CategoriaInfo = {
  emoji: string;
  gradient: string;
  label: string;
};

export const CATEGORIAS: Record<string, CategoriaInfo> = {
  "Perfumes Femininos":    { emoji: "🌸", gradient: "from-pink-500 to-rose-600",     label: "Perfumes Fem." },
  "Perfumes Masculinos":   { emoji: "🌿", gradient: "from-emerald-500 to-teal-700",  label: "Perfumes Masc." },
  "Pulseiras de Casal":    { emoji: "💫", gradient: "from-amber-400 to-orange-500",  label: "Pulseiras" },
  "Colares e Correntes":   { emoji: "📿", gradient: "from-yellow-400 to-amber-600",  label: "Colares" },
  "Aneis e Aliancas":      { emoji: "💍", gradient: "from-slate-400 to-slate-700",   label: "Anéis" },
  "Chocolates":            { emoji: "🍫", gradient: "from-amber-700 to-orange-900",  label: "Chocolates" },
  "Lingerie":              { emoji: "🌹", gradient: "from-red-400 to-rose-700",      label: "Lingerie" },
  "Kits de Spa":           { emoji: "🧴", gradient: "from-purple-400 to-violet-600", label: "Spa & Beleza" },
  "Skincare":              { emoji: "✨", gradient: "from-emerald-400 to-teal-600",  label: "Skincare" },
  "Maquiagem":             { emoji: "💄", gradient: "from-fuchsia-400 to-pink-600",  label: "Maquiagem" },
  "Kit Capilar":           { emoji: "💆", gradient: "from-teal-400 to-cyan-600",     label: "Capilar" },
  "Smartwatches":          { emoji: "⌚", gradient: "from-gray-600 to-gray-900",     label: "Smartwatches" },
  "Fones de Ouvido":       { emoji: "🎧", gradient: "from-indigo-400 to-blue-700",   label: "Fones" },
  "Caixas de Som":         { emoji: "🔊", gradient: "from-violet-500 to-purple-800", label: "Caixas de Som" },
  "Cameras Instantaneas":  { emoji: "📷", gradient: "from-stone-400 to-stone-700",   label: "Câmeras" },
  "Mini Impressoras":      { emoji: "🖨️", gradient: "from-slate-300 to-slate-600",   label: "Impressoras" },
  "Pijamas de Casal":      { emoji: "😴", gradient: "from-blue-400 to-indigo-600",   label: "Pijamas" },
  "Camisetas de Casal":    { emoji: "👕", gradient: "from-rose-300 to-pink-600",     label: "Camisetas" },
  "Moletons de Casal":     { emoji: "🧥", gradient: "from-gray-500 to-slate-700",    label: "Moletons" },
  "Velas Aromaticas":      { emoji: "🕯️", gradient: "from-amber-300 to-yellow-500",  label: "Velas" },
  "Kits de Vinho":         { emoji: "🍷", gradient: "from-red-700 to-rose-900",      label: "Vinho & Taças" },
  "Carteiras Masculinas":  { emoji: "👛", gradient: "from-amber-800 to-stone-700",   label: "Carteiras" },
  "Ursos e Pelucias":      { emoji: "🧸", gradient: "from-orange-300 to-amber-500",  label: "Pelúcias" },
  "Canecas":               { emoji: "☕", gradient: "from-amber-600 to-orange-700",  label: "Canecas" },
  "Almofadas":             { emoji: "🛋️", gradient: "from-rose-300 to-pink-500",     label: "Almofadas" },
  "Quadros Decorativos":   { emoji: "🖼️", gradient: "from-violet-600 to-indigo-800", label: "Quadros" },
  "Kit de Barba":          { emoji: "🪒", gradient: "from-slate-600 to-blue-900",    label: "Kit Barba" },
  "Kits Masculinos":       { emoji: "🎁", gradient: "from-blue-500 to-indigo-700",   label: "Kits Masc." },
  "Caixas Surpresa":       { emoji: "🎊", gradient: "from-yellow-400 to-orange-600", label: "Surpresas" },
  "Difusores":             { emoji: "🌿", gradient: "from-lime-400 to-green-700",    label: "Difusores" },
  "Presentes em Geral":    { emoji: "🔗", gradient: "from-gray-500 to-gray-700",     label: "Geral" },
  "Extras":                { emoji: "🎀", gradient: "from-fuchsia-300 to-pink-500",  label: "Extras" },
};

export const PRODUTOS: Produto[] = [
  { id: 1,  name: "Caixa Surpresa com Rosa Artificial Namorados",   platform: "Amazon", url: "https://amzn.to/49ccCh6",  categoria: "Caixas Surpresa" },
  { id: 2,  name: "Ursinho de Pelúcia Vermelho Presente",           platform: "Amazon", url: "https://amzn.to/4v4Wq9M",  categoria: "Ursos e Pelucias" },
  { id: 3,  name: "Flores Artificiais Decorativas Presente",        platform: "Amazon", url: "https://amzn.to/4v8Vbqc",  categoria: "Presentes em Geral" },
  { id: 4,  name: "Almofada Porta-Pipoca Presente Namorados",       platform: "Amazon", url: "https://amzn.to/4nJh9O3",  categoria: "Almofadas" },
  { id: 5,  name: "Embalagem Romântica Perfumada Transparente",     platform: "Amazon", url: "https://amzn.to/4dqPuhl",  categoria: "Caixas Surpresa" },
  { id: 6,  name: "Kit Presente Masculino com Carteira",            platform: "Amazon", url: "https://amzn.to/4f3oQMC",  categoria: "Kits Masculinos" },
  { id: 7,  name: "Conjunto Chaveiros de Casal Esportivo",          platform: "Amazon", url: "https://amzn.to/4wKBmH7",  categoria: "Pulseiras de Casal" },
  { id: 8,  name: "Luminária Astronauta LED Decoração Presente",    platform: "Amazon", url: "https://amzn.to/3RsMecC",  categoria: "Quadros Decorativos" },
  { id: 9,  name: "Karaokê Portátil Bluetooth 2 Microfones",        platform: "Amazon", url: "https://amzn.to/4dEMSLD",  categoria: "Caixas de Som" },
  { id: 10, name: "Kit Mini Escalda Pés + Sabonete + Massageador",  platform: "Amazon", url: "https://amzn.to/4dAhDBm",  categoria: "Kits de Spa" },
  { id: 11, name: "Kit Maquiagem Portátil Completo",                platform: "Amazon", url: "https://amzn.to/4uyFKb0",  categoria: "Maquiagem" },
  { id: 12, name: "Sérum Vitamina C 10% Principia",                 platform: "Amazon", url: "https://amzn.to/4nN7FBt",  categoria: "Skincare" },
  { id: 13, name: "Mix Sérum Niacinamida + Ácidos Glicólico",       platform: "Amazon", url: "https://amzn.to/4uotmdl",  categoria: "Skincare" },
];
