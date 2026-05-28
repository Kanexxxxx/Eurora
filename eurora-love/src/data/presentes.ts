export type Platform = "Amazon" | "Shopee" | "ML";

export type Produto = {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  categoria: string;
  image?: string;
  asin?: string;
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
  { id: 1,  name: "Caixa Surpresa com Rosa Artificial Namorados",   platform: "Amazon", url: "https://amzn.to/49ccCh6",  categoria: "Caixas Surpresa",    asin: "B0BR5GJQ6Y" },
  { id: 2,  name: "Ursinho de Pelúcia Vermelho Presente",           platform: "Amazon", url: "https://amzn.to/4v4Wq9M",  categoria: "Ursos e Pelucias",   asin: "B0GNDD1BST" },
  { id: 3,  name: "Flores Artificiais Decorativas Presente",        platform: "Amazon", url: "https://amzn.to/4v8Vbqc",  categoria: "Presentes em Geral", asin: "B0GWPCPKLJ" },
  { id: 4,  name: "Almofada Porta-Pipoca Presente Namorados",       platform: "Amazon", url: "https://amzn.to/4nJh9O3",  categoria: "Almofadas",          asin: "B09RTP8GZS" },
  { id: 5,  name: "Embalagem Romântica Perfumada Transparente",     platform: "Amazon", url: "https://amzn.to/4dqPuhl",  categoria: "Caixas Surpresa",    asin: "B0GYTH1WVN" },
  { id: 6,  name: "Kit Presente Masculino com Carteira",            platform: "Amazon", url: "https://amzn.to/4f3oQMC",  categoria: "Kits Masculinos",    asin: "B0GY5RLXW8" },
  { id: 7,  name: "Conjunto Chaveiros de Casal Esportivo",          platform: "Amazon", url: "https://amzn.to/4wKBmH7",  categoria: "Pulseiras de Casal", asin: "B0GZMD687R" },
  { id: 8,  name: "Luminária Astronauta LED Decoração Presente",    platform: "Amazon", url: "https://amzn.to/3RsMecC",  categoria: "Quadros Decorativos",asin: "B0DT2DS4DW" },
  { id: 9,  name: "Karaokê Portátil Bluetooth 2 Microfones",        platform: "Amazon", url: "https://amzn.to/4dEMSLD",  categoria: "Caixas de Som",      asin: "B0DXS3TT3H" },
  { id: 10, name: "Kit Mini Escalda Pés + Sabonete + Massageador",  platform: "Amazon", url: "https://amzn.to/4dAhDBm",  categoria: "Kits de Spa",        asin: "B0FWZ2LHDZ" },
  { id: 11, name: "Kit Maquiagem Portátil Completo",                platform: "Amazon", url: "https://amzn.to/4uyFKb0",  categoria: "Maquiagem",          asin: "B0FRNKX28D" },
  { id: 12, name: "Sérum Vitamina C 10% Principia",                 platform: "Amazon", url: "https://amzn.to/4nN7FBt",  categoria: "Skincare",           asin: "B09WC8Q5H3" },
  { id: 13, name: "Mix Sérum Niacinamida + Ácidos Glicólico",       platform: "Amazon", url: "https://amzn.to/4uotmdl",  categoria: "Skincare",           asin: "B0939SHBP8" },
  { id: 14, name: "Conjunto Maquiagem Profissional Completo",       platform: "Amazon", url: "https://amzn.to/3RtvFgP",  categoria: "Maquiagem",          asin: "B0FJKYZHYF" },

  // ── Shopee ────────────────────────────────────────────────────────────────
  // Perfumes & Body
  { id: 15, name: "Kit Body Splash Masculino Barbarius + Midtown 200ml", platform: "Shopee", url: "https://s.shopee.com.br/AUrCKIcnxW", categoria: "Perfumes Masculinos" },
  { id: 16, name: "Renovadores Faciais Kokeshi Pele Porcelana Olhos Gueixa", platform: "Shopee", url: "https://s.shopee.com.br/23994387054", categoria: "Skincare" },
  { id: 17, name: "Kit Liso dos Sonhos Shampoo + Condicionador + Sérum Elseve", platform: "Shopee", url: "https://s.shopee.com.br/2g8Kzoh0gE", categoria: "Kit Capilar" },
  { id: 18, name: "Limpa Air Fryer Spray 250ml Remove Gordura Pesada", platform: "Shopee", url: "https://s.shopee.com.br/4VZzBEQ1Fv", categoria: "Skincare" },
  { id: 19, name: "Organizador Maquiagem Giratório 3 Andares para Pincéis e Joias", platform: "Shopee", url: "https://s.shopee.com.br/4VZzBEQ1Fv", categoria: "Maquiagem" },
  { id: 20, name: "Kit 30 Esmalte Impala Cores Sortidas Atacado Manicure", platform: "Shopee", url: "https://s.shopee.com.br/7fX0x5nahj", categoria: "Maquiagem" },
  { id: 21, name: "Alicate de Cutícula Profissional e Cortador De Unha Mundial", platform: "Shopee", url: "https://s.shopee.com.br/2VounVhe0a", categoria: "Maquiagem" },

  // Joias & Acessórios
  { id: 22, name: "Colar Cordão Feminino Pingente Personalizado Foto e Nome Banhado Ouro 18k", platform: "Shopee", url: "https://s.shopee.com.br/5q5MliuZRD", categoria: "Colares e Correntes" },
  { id: 23, name: "Novo Colar Masculino Hip Hop 16mm Corrente Cubana + Pulseira", platform: "Shopee", url: "https://s.shopee.com.br/2VounS9eti", categoria: "Colares e Correntes" },
  { id: 24, name: "Kit Relógio Masculino Digital Esportivo + Corrente Cruz + Pulseira Luxo", platform: "Shopee", url: "https://s.shopee.com.br/7fX0x3DxpD", categoria: "Kits Masculinos" },
  { id: 25, name: "Smartwatch Série 10 Tela 45mm Feminino Masculino Fere Fit", platform: "Shopee", url: "https://s.shopee.com.br/5ApfySNTsw", categoria: "Smartwatches" },
  { id: 26, name: "Smartwatch Bettdow Fb055 1.85 Esportivo IA Música GPS 3ATM", platform: "Shopee", url: "https://s.shopee.com.br/4ftPNUZOco", categoria: "Smartwatches" },

  // Camisetas de Casal
  { id: 27, name: "Camiseta Oversized Academia Espinafre Popeye Streetwear 100% Algodão", platform: "Shopee", url: "https://s.shopee.com.br/8fPY8vjmg1", categoria: "Camisetas de Casal" },
  { id: 28, name: "Camiseta Masculina Brasil 10 Camisa 100% Algodão Premium Casual", platform: "Shopee", url: "https://s.shopee.com.br/AKXm7zdRIV", categoria: "Camisetas de Casal" },
  { id: 29, name: "Camiseta Feminina Masculina Camisa 10 Brasil T-shirt 100% Algodão", platform: "Shopee", url: "https://s.shopee.com.br/8KmhkJl3Mw", categoria: "Camisetas de Casal" },
  { id: 30, name: "Camiseta Masculina BOS Gola Redonda Regular Malha Premium", platform: "Shopee", url: "https://s.shopee.com.br/1gFno4AQt1", categoria: "Camisetas de Casal" },
  { id: 31, name: "2 Camisas do Brasil Casal Copa do Mundo Kit Casal 2 Blusas", platform: "Shopee", url: "https://s.shopee.com.br/8piyL9JX9z", categoria: "Camisetas de Casal" },
  { id: 32, name: "Camiseta Masculina com Elastano Peruana Cotton Premium", platform: "Shopee", url: "https://s.shopee.com.br/gNGc8ocj9", categoria: "Camisetas de Casal" },
  { id: 33, name: "Camiseta Oversized Streetwear Masculina Gola Alta Los Angeles", platform: "Shopee", url: "https://s.shopee.com.br/5q5MldUxFZ", categoria: "Camisetas de Casal" },
  { id: 34, name: "Camiseta Masculina Básica Los Angeles New World AlgodãoPremium", platform: "Shopee", url: "https://s.shopee.com.br/AUrCKDDBmP", categoria: "Camisetas de Casal" },
  { id: 35, name: "Camiseta Camisa Oversized Top Academia Zeus Branca Streetwear 100% Algodão", platform: "Shopee", url: "https://s.shopee.com.br/LkQDcFVbe", categoria: "Camisetas de Casal" },
  { id: 36, name: "Camiseta Oversized Academia Faça o seu Melhor Treino Streetwear", platform: "Shopee", url: "https://s.shopee.com.br/3g0sBb5DWp", categoria: "Camisetas de Casal" },
  { id: 37, name: "Cropped Brasil Feminino Torcedora Copa Canelado Bordado", platform: "Shopee", url: "https://s.shopee.com.br/7KuAYOPFC3", categoria: "Camisetas de Casal" },
  { id: 38, name: "Kit 3 Blusas de Tricô Infantil Feminina Juvenil Lã Quente Inverno", platform: "Shopee", url: "https://s.shopee.com.br/8ATHXvM4Vn", categoria: "Camisetas de Casal" },

  // Moletons de Casal
  { id: 39, name: "Moletom Blusa de Frio Canguru Personalizado Streetwear Flanelado", platform: "Shopee", url: "https://s.shopee.com.br/809rLhmK1p", categoria: "Moletons de Casal" },
  { id: 40, name: "Moletom Masculino Canguru Blusa Casaco Algodão Liso Confortável", platform: "Shopee", url: "https://s.shopee.com.br/4ftPNZz0nt", categoria: "Moletons de Casal" },
  { id: 41, name: "Conjunto Moletom Masculino Blusa de Frio com Capuz e Bolso Flanelado", platform: "Shopee", url: "https://s.shopee.com.br/3qKIO32BUc", categoria: "Moletons de Casal" },
  { id: 42, name: "Casaco Teddy Feminino de Pelinho com Capuz", platform: "Shopee", url: "https://s.shopee.com.br/5L96AnwTS4", categoria: "Moletons de Casal" },
  { id: 43, name: "Kit Moletom Brasil Unissex Casaco Flanelado Algodão Premium", platform: "Shopee", url: "https://s.shopee.com.br/43628800869", categoria: "Moletons de Casal" },
  { id: 44, name: "Jaqueta Puffer Bobojaco Impermeável de Frio Intenso com Capuz Removível", platform: "Shopee", url: "https://s.shopee.com.br/7KuAYRFEV7", categoria: "Moletons de Casal" },
  { id: 45, name: "Blusa Moletom Anime Tokyo Revengers Team Valhalla Faixas", platform: "Shopee", url: "https://s.shopee.com.br/4ftPNUZOco", categoria: "Moletons de Casal" },
  { id: 46, name: "Casaco Moletom Anime Attack on Titan Shingeki Mangá Blusa de Frio", platform: "Shopee", url: "https://s.shopee.com.br/1BJXD3mijF", categoria: "Moletons de Casal" },
  { id: 47, name: "Blusa Moletom Anime Killua Caçador x Caçador com Capuz", platform: "Shopee", url: "https://s.shopee.com.br/1qZE0HkBNR", categoria: "Moletons de Casal" },
  { id: 48, name: "Moletom Canguru Racionais MC's Rap Capuz Masculino e Feminino", platform: "Shopee", url: "https://s.shopee.com.br/2VounVhe1d", categoria: "Moletons de Casal" },
  { id: 49, name: "Conjunto Jaqueta e Calça Jogger Masculina Inverno Academia Esportivo", platform: "Shopee", url: "https://s.shopee.com.br/3B4bag77Xe", categoria: "Moletons de Casal" },
  { id: 50, name: "Jaqueta Puffer Dupla Face Masculina Bobojaco Impermeável Inverno", platform: "Shopee", url: "https://s.shopee.com.br/3VhRzOTpHV", categoria: "Moletons de Casal" },
  { id: 51, name: "Casaco De Frio Luxo com Detalhes e Botões de Tricot Tendência 2025", platform: "Shopee", url: "https://s.shopee.com.br/50WFm9O7Dv", categoria: "Moletons de Casal" },
  { id: 52, name: "Moletom Header Sem Capuz Algodão Qualidade Promoção Blusa Gola Careca", platform: "Shopee", url: "https://s.shopee.com.br/1gFno1anzb", categoria: "Moletons de Casal" },
  { id: 53, name: "Coberdrom Casal Queen Dupla Face Sherpa Pele de Carneiro Macio", platform: "Shopee", url: "https://s.shopee.com.br/8938404555", categoria: "Moletons de Casal" },

  // Pijamas de Casal
  { id: 54, name: "Kit Conjunto Segunda Pele Térmico Casal Frio Inverno Luva Touca Cachecol", platform: "Shopee", url: "https://s.shopee.com.br/9Uyf8SgbzE", categoria: "Pijamas de Casal" },
  { id: 55, name: "Cobertor Manta Casal 2,00m x 1,80m Macio Microfibra Liso Estampado", platform: "Shopee", url: "https://s.shopee.com.br/1gFno1anzb", categoria: "Pijamas de Casal" },
  { id: 56, name: "Conjunto Pijama Plush Soft Infantil Bebê Flanelado Capuz Manga Longa", platform: "Shopee", url: "https://s.shopee.com.br/2LVUbCiHLZ", categoria: "Pijamas de Casal" },
  { id: 57, name: "Macacão Inverno Bebê Menina Plush + Pantufa Quentinho Conjunto Peluciado", platform: "Shopee", url: "https://s.shopee.com.br/2qRlCD5zWK", categoria: "Pijamas de Casal" },
  { id: 58, name: "2 Peças Pijamas Feminino Grosso Lã Manga Longa Casa Cintura Elástica", platform: "Shopee", url: "https://s.shopee.com.br/9KfEw4Hd98", categoria: "Pijamas de Casal" },

  // Canecas & Garrafas
  { id: 59, name: "Caneca Misturadora Automática Elétrica USB Bateria Recarregável Mixer Café", platform: "Shopee", url: "https://s.shopee.com.br/5ApfyPXUaq", categoria: "Canecas" },
  { id: 60, name: "Kit Caneca Xícara Porcelana 120ml + Pires Mãe Você é Especial", platform: "Shopee", url: "https://s.shopee.com.br/5L96AlMqYf", categoria: "Canecas" },
  { id: 61, name: "Garrafa Inox Térmica com Capinha Protetora Silicone 1000ML", platform: "Shopee", url: "https://s.shopee.com.br/4VZzBEQ1Es", categoria: "Canecas" },
  { id: 62, name: "Copo Garrafa Térmica Grande Aço Inox com Alça e Canudo 1200ML", platform: "Shopee", url: "https://s.shopee.com.br/BR01DqWjy", categoria: "Canecas" },
  { id: 63, name: "Copo Térmico Personalizado Brasil com Abridor Integrado Copa do Mundo", platform: "Shopee", url: "https://s.shopee.com.br/9fI5KciNLH", categoria: "Canecas" },
  { id: 64, name: "Jogo Taças Vidro 340ml Diamond Bico Abacaxi Para Água Vinho Suco", platform: "Shopee", url: "https://s.shopee.com.br/3g0sBhTBwY", categoria: "Kits de Vinho" },

  // Decoração & Quadros
  { id: 65, name: "Espelho com Touch Quadrado 40x40 Jateado Fino LED 3 Cores Banheiro Luxo", platform: "Shopee", url: "https://s.shopee.com.br/9fI5KlfyeJ", categoria: "Quadros Decorativos" },
  { id: 66, name: "Espelho Oval com LED Moderno Luz Quente e Fria Banheiro Quarto Decorativo", platform: "Shopee", url: "https://s.shopee.com.br/7KuAYTorOe", categoria: "Quadros Decorativos" },
  { id: 67, name: "Painel Porta Retrato Parede MDF Família 6 Fotos Moldura Preta Galhos", platform: "Shopee", url: "https://s.shopee.com.br/58255074717", categoria: "Quadros Decorativos" },
  { id: 68, name: "Espelho Orgânico 120x50 com Moldura em Couro Corpo Inteiro Moderno Luxo", platform: "Shopee", url: "https://s.shopee.com.br/3VhRzLdpzT", categoria: "Quadros Decorativos" },
  { id: 69, name: "Cofre MDF Desafio 10 Mil Personalizado com Caneta Caixa Metas Financeira", platform: "Shopee", url: "https://s.shopee.com.br/W3qPppG40", categoria: "Quadros Decorativos" },

  // Brinquedos & Pelúcias
  { id: 70, name: "144 Pcs Bonecos Pokémon Sem Repetições Miniaturas Coleção Anime Figura", platform: "Shopee", url: "https://s.shopee.com.br/AAELvge4dQ", categoria: "Ursos e Pelucias" },
  { id: 71, name: "Pokébola Pokémon Colecionável Geek Decoração Nerd Anime", platform: "Shopee", url: "https://s.shopee.com.br/9fI5KgGMTA", categoria: "Ursos e Pelucias" },
  { id: 72, name: "Tio Patinhas Segurando Sacos de Dinheiro 20cm Action Figure Colecionável", platform: "Shopee", url: "https://s.shopee.com.br/2LVUb9AIEh", categoria: "Ursos e Pelucias" },
  { id: 73, name: "Figura de Ação Nendoroid Jujutsu Kaisen Gojo Satoru Colecionável", platform: "Shopee", url: "https://s.shopee.com.br/5flwZKVaaW", categoria: "Ursos e Pelucias" },
  { id: 74, name: "Cachorro Robô Inteligente Smart Pet Dogbot Colorido", platform: "Shopee", url: "https://s.shopee.com.br/1gFnnvCpaV", categoria: "Ursos e Pelucias" },
  { id: 75, name: "Kit 4 Bonecos Naruto Anime Uzumaki Articulados Sasuke Kakashi Minato", platform: "Shopee", url: "https://s.shopee.com.br/6VL3YnuQn7", categoria: "Ursos e Pelucias" },

  // Caixas de Som & Tech
  { id: 76, name: "Caixa Som Bluetooth Potente Pendrive FM SD Portátil IPX6", platform: "Shopee", url: "https://s.shopee.com.br/58207657402", categoria: "Caixas de Som" },
  { id: 77, name: "Projetor 4K HD 150 Polegadas TV Para Celular Xbox PS PC WiFi", platform: "Shopee", url: "https://s.shopee.com.br/27774205292", categoria: "Extras" },
  { id: 78, name: "Nintendo Switch V2 + Super Mario Bros. Wonder + 3 meses NSO Lacrado", platform: "Shopee", url: "https://s.shopee.com.br/3VhRzOTpHV", categoria: "Extras" },
  { id: 79, name: "Video Game Stick 10 Mil Jogos 2 Controles Sem Fio Console Portátil Retro", platform: "Shopee", url: "https://s.shopee.com.br/10562396565", categoria: "Extras" },
  { id: 80, name: "Carregador Portátil Turbo 20000mah Power Bank Universal com Indicador", platform: "Shopee", url: "https://s.shopee.com.br/6VL3YnuQm6", categoria: "Extras" },
  { id: 81, name: "Carregador Portátil Indução iPhone/Android Magsafe Sem Fio 10000mah", platform: "Shopee", url: "https://s.shopee.com.br/6L1dMdsfQM", categoria: "Extras" },

  // Kits Masculinos
  { id: 82, name: "Parafusadeira Furadeira 48V Recarregável 2 Baterias Maleta Kit Completo", platform: "Shopee", url: "https://s.shopee.com.br/3VhRzLdpyQ", categoria: "Kits Masculinos" },
  { id: 83, name: "Parafusadeira Furadeira 48V 2 Baterias com Maleta e Acessórios vipcssa", platform: "Shopee", url: "https://s.shopee.com.br/1qZE0KaAec", categoria: "Kits Masculinos" },
  { id: 84, name: "40 Peças Jogo De Chave Catraca Caixa De Ferramentas Reversível Soquetes", platform: "Shopee", url: "https://s.shopee.com.br/5q5MlgKwXm", categoria: "Kits Masculinos" },
  { id: 85, name: "Hand Grip Flexor de Punho Exercício para Mãos Ajustável Mola 60kg", platform: "Shopee", url: "https://s.shopee.com.br/1LcxPPc4fV", categoria: "Kits Masculinos" },
  { id: 86, name: "Aparelho Medidor de Pressão Arterial Braço Digital Inteligente", platform: "Shopee", url: "https://s.shopee.com.br/7AakM1rtR3", categoria: "Kits Masculinos" },
  { id: 87, name: "Faca com Bainha em Couro Muladeiro Boiadeiro com Chaveiro", platform: "Shopee", url: "https://s.shopee.com.br/3qKIO0SYbb", categoria: "Kits Masculinos" },
  { id: 88, name: "Bomba de Ar Portátil Compressor Inflator Multi-função 4 em 1 PowerBank 8kmah", platform: "Shopee", url: "https://s.shopee.com.br/gNGc8ockA", categoria: "Kits Masculinos" },

  // Extras / Presentes em Geral
  { id: 89, name: "Vestido Longo Com FORO e BOJO Feminino Manga Confortável e Leve", platform: "Shopee", url: "https://s.shopee.com.br/2g8KzrWzxN", categoria: "Lingerie" },
  { id: 90, name: "Macacão Feminino Elegante Pantalona Longa com Cinto Decote V Costas Abertas", platform: "Shopee", url: "https://s.shopee.com.br/9ALojo8Fm6", categoria: "Lingerie" },
  { id: 91, name: "Conjunto Gabi Shorts e Colete Social Elegante", platform: "Shopee", url: "https://s.shopee.com.br/5VSWN4MDDg", categoria: "Lingerie" },
  { id: 92, name: "Kit Conjunto Segunda Pele Térmico Masculino Feminino Luva Touca Cachecol", platform: "Shopee", url: "https://s.shopee.com.br/9Uyf8SgbzE", categoria: "Kits de Spa" },
  { id: 93, name: "Album Oficial Copa do Mundo Panini FIFA 2026 + Figurinhas Colecionáveis", platform: "Shopee", url: "https://s.shopee.com.br/58209882446", categoria: "Presentes em Geral" },
  { id: 94, name: "Kit Torcedor Torcida Brasil 12 Itens Copa 2026 Adesivo Corneta Bandeira", platform: "Shopee", url: "https://s.shopee.com.br/8piyLEj9L2", categoria: "Presentes em Geral" },
  { id: 95, name: "Patinete Infantil 3 Rodas LED Musical Guido Ajustável até 50kg", platform: "Shopee", url: "https://s.shopee.com.br/6VL3YuIPBq", categoria: "Presentes em Geral" },
  { id: 96, name: "Chaleira Elétrica Inox 1,8L Automática Aquecimento Rápido 127v", platform: "Shopee", url: "https://s.shopee.com.br/4LGYyvQeZr", categoria: "Presentes em Geral" },
  { id: 97, name: "Kit Café Manhã Chaleira Elétrica + Sanduicheira 127v ou 220v Kian", platform: "Shopee", url: "https://s.shopee.com.br/23893965494", categoria: "Presentes em Geral" },
  { id: 98, name: "Bolsa de Maternidade Multifuncional Térmica Impermeável Berço M002", platform: "Shopee", url: "https://s.shopee.com.br/8piyLEj9M5", categoria: "Presentes em Geral" },
  { id: 99, name: "Máquina Nebulizadora Portátil Inalador Nebulizador Adulto Infantil", platform: "Shopee", url: "https://s.shopee.com.br/40diaJRvGm", categoria: "Presentes em Geral" },
  { id: 100, name: "Ventilador com Luminária Bivolt + Controle Remoto", platform: "Shopee", url: "https://s.shopee.com.br/7AakM1rtQ2", categoria: "Presentes em Geral" },
];
