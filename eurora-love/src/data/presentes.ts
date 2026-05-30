export type Platform = "Amazon" | "Shopee" | "ML";

export type Produto = {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  categoria: string;
  image?: string;
  asin?: string;
  preco?: string;
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
  "Roupas Femininas":      { emoji: "👗", gradient: "from-rose-400 to-pink-700",     label: "Roupas Fem." },
  "Calçados":              { emoji: "👟", gradient: "from-indigo-400 to-blue-700",   label: "Calçados" },
  "Casa e Cozinha":        { emoji: "🏡", gradient: "from-amber-500 to-orange-700",  label: "Casa & Cozinha" },
};

// Apenas produtos com foto real (sem emoji)
export const PRODUTOS: Produto[] = [
  { id: 1,  name: "Caixa Surpresa com Rosa Artificial Namorados",   platform: "Amazon", url: "https://amzn.to/49ccCh6",  categoria: "Caixas Surpresa",    asin: "B0BR5GJQ6Y", image: "https://m.media-amazon.com/images/I/71pFSuf8ZLL._SL400_.jpg" },
  { id: 15, name: "Kit Body Splash Masculino Barbarius + Midtown 200ml", platform: "Shopee", url: "https://s.shopee.com.br/AUrCKIcnxW", image: "https://down-br.img.susercontent.com/file/br-11134207-820ly-mo6v5w0dj37k01", categoria: "Perfumes Masculinos" },
  { id: 30, name: "Camiseta Masculina BOS Gola Redonda Regular Malha Premium", platform: "Shopee", url: "https://s.shopee.com.br/1gFno4AQt1", image: "https://down-br.img.susercontent.com/file/sg-11134201-821dj-mh7zxnlkmvbi7e", categoria: "Camisetas de Casal" },
  { id: 34, name: "Camiseta Masculina Básica Los Angeles New World AlgodãoPremium", platform: "Shopee", url: "https://s.shopee.com.br/AUrCKDDBmP", image: "https://down-br.img.susercontent.com/file/sg-11134201-824g1-mfbyhdxl3ojv9b", categoria: "Camisetas de Casal" },
  { id: 36, name: "Camiseta Oversized Academia Faça o seu Melhor Treino Streetwear", platform: "Shopee", url: "https://s.shopee.com.br/3g0sBb5DWp", image: "https://down-br.img.susercontent.com/file/br-11134207-81zu4-ml0v05kqu96oba", categoria: "Camisetas de Casal" },
  { id: 39, name: "Moletom Blusa de Frio Canguru Personalizado Streetwear Flanelado", platform: "Shopee", url: "https://s.shopee.com.br/809rLhmK1p", image: "https://down-br.img.susercontent.com/file/sg-11134201-7rdwl-mdrr9d4l09568e", categoria: "Moletons de Casal" },
  { id: 41, name: "Conjunto Moletom Masculino Blusa de Frio com Capuz e Bolso Flanelado", platform: "Shopee", url: "https://s.shopee.com.br/3qKIO32BUc", image: "https://down-br.img.susercontent.com/file/sg-11134201-8261b-mjy7azdc7ojmff", categoria: "Moletons de Casal" },
  { id: 42, name: "Casaco Teddy Feminino de Pelinho com Capuz", platform: "Shopee", url: "https://s.shopee.com.br/5L96AnwTS4", image: "https://down-br.img.susercontent.com/file/br-11134207-820lg-mlmeq3kbnbba55", categoria: "Moletons de Casal" },
  { id: 44, name: "Jaqueta Puffer Bobojaco Impermeável de Frio Intenso com Capuz Removível", platform: "Shopee", url: "https://s.shopee.com.br/7KuAYRFEV7", image: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-migmvypl8b9f6c", categoria: "Moletons de Casal" },
  { id: 48, name: "Moletom Canguru Racionais MC's Rap Capuz Masculino e Feminino", platform: "Shopee", url: "https://s.shopee.com.br/2VounVhe1d", image: "https://down-br.img.susercontent.com/file/br-11134207-81z1k-meakm9em30n74d", categoria: "Moletons de Casal" },
  { id: 52, name: "Moletom Header Sem Capuz Algodão Qualidade Promoção Blusa Gola Careca", platform: "Shopee", url: "https://s.shopee.com.br/1gFno1anzb", image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lw2z5ct7wdcia0", categoria: "Moletons de Casal" },
  { id: 54, name: "Kit Conjunto Segunda Pele Térmico Casal Frio Inverno Luva Touca Cachecol", platform: "Shopee", url: "https://s.shopee.com.br/9Uyf8SgbzE", image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-macp3cpbriq70e", categoria: "Pijamas de Casal" },
  { id: 64, name: "Jogo Taças Vidro 340ml Diamond Bico Abacaxi Para Água Vinho Suco", platform: "Shopee", url: "https://s.shopee.com.br/3g0sBhTBwY", image: "https://down-br.img.susercontent.com/file/br-11134207-81ztz-ml3pi3snkyrl46", categoria: "Kits de Vinho" },
  { id: 66, name: "Espelho Oval com LED Moderno Luz Quente e Fria Banheiro Quarto Decorativo", platform: "Shopee", url: "https://s.shopee.com.br/7KuAYTorOe", image: "https://down-br.img.susercontent.com/file/br-11134207-820lq-mlgenqnnagau47", categoria: "Quadros Decorativos" },
  { id: 68, name: "Espelho Orgânico 120x50 com Moldura em Couro Corpo Inteiro Moderno Luxo", platform: "Shopee", url: "https://s.shopee.com.br/3VhRzLdpzT", image: "https://down-br.img.susercontent.com/file/br-11134207-820lt-mlgb72rszg1y0c", categoria: "Quadros Decorativos" },
  { id: 69, name: "Cofre MDF Desafio 10 Mil Personalizado com Caneta Caixa Metas Financeira", platform: "Shopee", url: "https://s.shopee.com.br/W3qPppG40", image: "https://down-br.img.susercontent.com/file/br-11134207-81ztv-mklcatqm4idde8", categoria: "Quadros Decorativos" },
  { id: 74, name: "Cachorro Robô Inteligente Smart Pet Dogbot Colorido", platform: "Shopee", url: "https://s.shopee.com.br/1gFnnvCpaV", image: "https://down-br.img.susercontent.com/file/br-11134207-81ztc-mj32kgv35zwi1d", categoria: "Ursos e Pelucias" },
  { id: 80, name: "Carregador Portátil Turbo 20000mah Power Bank Universal com Indicador", platform: "Shopee", url: "https://s.shopee.com.br/6VL3YnuQm6", image: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m5yudei1t4tu20", categoria: "Extras" },
  { id: 88, name: "Bomba de Ar Portátil Compressor Inflator Multi-função 4 em 1 PowerBank 8kmah", platform: "Shopee", url: "https://s.shopee.com.br/gNGc8ockA", image: "https://down-br.img.susercontent.com/file/sg-11134201-8226z-mhq0f4h34kjs78", categoria: "Kits Masculinos" },
  { id: 94, name: "Kit Torcedor Torcida Brasil 12 Itens Copa 2026 Adesivo Corneta Bandeira", platform: "Shopee", url: "https://s.shopee.com.br/8piyLEj9L2", image: "https://down-br.img.susercontent.com/file/br-11134207-820l7-mn2wd67jqmma08", categoria: "Presentes em Geral" },
  { id: 96, name: "Chaleira Elétrica Inox 1,8L Automática Aquecimento Rápido 127v", platform: "Shopee", url: "https://s.shopee.com.br/4LGYyvQeZr", image: "https://down-br.img.susercontent.com/file/br-11134207-820ma-mnn0jmg4a0aq58", categoria: "Presentes em Geral" },
];
