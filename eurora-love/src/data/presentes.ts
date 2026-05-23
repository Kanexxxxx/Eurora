export type Platform = "Amazon" | "Shopee" | "ML";

export type Produto = {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  categoria: string;
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
  // 1. Perfumes Femininos
  { id: 1,  name: "Kit L'eau de Lily Dia dos Namorados", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0F8KM9K75", categoria: "Perfumes Femininos" },
  { id: 2,  name: "Lady Perfume 50ml Longa Duração", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CL9DDDDW", categoria: "Perfumes Femininos" },
  { id: 3,  name: "Flores + Colar + Rosa Eterna Kit Feminino", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0F1XCF2B6", categoria: "Perfumes Femininos" },
  { id: 4,  name: "Vela + Presente Namorada Romantico", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CQQSVPQ6", categoria: "Perfumes Femininos" },
  { id: 5,  name: "Busca Kits Perfume Feminino Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=kit+perfume+feminino+presente", categoria: "Perfumes Femininos" },

  // 2. Perfumes Masculinos
  { id: 6,  name: "Parfum Masculino Frances 80ml Namorado", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08BY98NLB", categoria: "Perfumes Masculinos" },
  { id: 7,  name: "Perfume Masculino Fresco Romântico Spray 50ml", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C2P3WT81", categoria: "Perfumes Masculinos" },
  { id: 8,  name: "Kit Presente com Copo + Pulseira Masculino", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07Z1SC9KH", categoria: "Perfumes Masculinos" },
  { id: 9,  name: "Kit Quasar Brave Masculino O Boticário", platform: "ML", url: "https://www.mercadolivre.com.br/up/MLBU2171025860", categoria: "Perfumes Masculinos" },
  { id: 10, name: "Busca Perfumes Masculinos Namorado", platform: "Amazon", url: "https://www.amazon.com.br/s?k=perfume+masculino+presente+namorado", categoria: "Perfumes Masculinos" },

  // 3. Pulseiras de Casal
  { id: 11, name: "Pulseiras Casal Personalizadas com Iniciais", platform: "Shopee", url: "https://shopee.com.br/product/535117272/17356377845", categoria: "Pulseiras de Casal" },
  { id: 12, name: "Par Pulseiras com Data de Namoro", platform: "Shopee", url: "https://shopee.com.br/product/230458372/16164311323", categoria: "Pulseiras de Casal" },
  { id: 13, name: "Kit Pulseira Imã Casal Aliança Compromisso", platform: "Shopee", url: "https://shopee.com.br/product/516846996/19656402589", categoria: "Pulseiras de Casal" },
  { id: 14, name: "Pulseiras Casal com Iniciais dos Nomes", platform: "Shopee", url: "https://shopee.com.br/product/385521376/18255120530", categoria: "Pulseiras de Casal" },
  { id: 15, name: "Pulseira com Datas Metadinha Namorados", platform: "Shopee", url: "https://shopee.com.br/product/413740390/10508801290", categoria: "Pulseiras de Casal" },
  { id: 16, name: "Par Pulseiras Iniciais que Brilham no Escuro", platform: "Shopee", url: "https://shopee.com.br/product/230458372/12291627652", categoria: "Pulseiras de Casal" },
  { id: 17, name: "Kit Pulseiras Casal Infinito Preto Prata", platform: "Shopee", url: "https://shopee.com.br/product/516846996/22601166887", categoria: "Pulseiras de Casal" },
  { id: 18, name: "Pulseira Casal Presente Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/512919992/23291396456", categoria: "Pulseiras de Casal" },
  { id: 19, name: "Pulseira Modular Estilo Italiano Aço Inox", platform: "Shopee", url: "https://shopee.com.br/product/359389982/28473075631", categoria: "Pulseiras de Casal" },
  { id: 20, name: "Pulseira Casal Osso de Cobra Prata", platform: "Shopee", url: "https://shopee.com.br/product/757786543/18349757827", categoria: "Pulseiras de Casal" },

  // 4. Colares e Correntes
  { id: 21, name: "Corrente Colar Feminino Prata com Zircônia", platform: "Shopee", url: "https://shopee.com.br/product/242996472/5357046552", categoria: "Colares e Correntes" },
  { id: 22, name: "Conjunto Colares Chave e Coração Casal", platform: "Shopee", url: "https://shopee.com.br/product/351626763/9865371274", categoria: "Colares e Correntes" },
  { id: 23, name: "Colar Casal Prata 925 Exclusivo", platform: "Shopee", url: "https://shopee.com.br/product/316500910/2946760275", categoria: "Colares e Correntes" },
  { id: 24, name: "Colar Feminino Prata 925 com Garantia", platform: "Shopee", url: "https://shopee.com.br/product/420488119/15421003452", categoria: "Colares e Correntes" },
  { id: 25, name: "Flor Rosa Eterna + Colar de Luxo Brilhante", platform: "Shopee", url: "https://shopee.com.br/product/350188398/18998507471", categoria: "Colares e Correntes" },
  { id: 26, name: "Rosa Eterna + Caixa de Joias (Amazon)", platform: "Amazon", url: "https://www.amazon.com.br/dp/B09P572ZL6", categoria: "Colares e Correntes" },

  // 5. Aneis e Aliancas
  { id: 27, name: "Anel Compromisso Casal Ajustável Zircônia", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DG2SR5HG", categoria: "Aneis e Aliancas" },
  { id: 28, name: "Anel Moissanite S925 1 Quilate Presente", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DYNGHC9C", categoria: "Aneis e Aliancas" },
  { id: 29, name: "Aliança Prata 925 Quadrada 2mm + Solitário", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-3510437001", categoria: "Aneis e Aliancas" },
  { id: 30, name: "Aliança Prata 950 Pronta Entrega + Solitário", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-3339439589", categoria: "Aneis e Aliancas" },
  { id: 31, name: "Aliança Prata 925 Anatômica 2mm Namoro", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-3135247694", categoria: "Aneis e Aliancas" },
  { id: 32, name: "Busca Alianças Namoro Prata Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=alianca+namoro+prata+925", categoria: "Aneis e Aliancas" },

  // 6. Chocolates e Cestas
  { id: 33, name: "Cesta de Chocolate Presente Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/1403230380/23593593853", categoria: "Chocolates" },
  { id: 34, name: "Presente Romântico Cesta com Chocolates", platform: "Shopee", url: "https://shopee.com.br/product/320997511/23694045179", categoria: "Chocolates" },
  { id: 35, name: "Cesta de Chocolates Romântica Presente", platform: "Shopee", url: "https://shopee.com.br/product/409884671/17840257589", categoria: "Chocolates" },
  { id: 36, name: "Kit Coração de Chocolate Presente Criativo", platform: "Shopee", url: "https://shopee.com.br/product/281818504/23195721355", categoria: "Chocolates" },
  { id: 37, name: "Cesta Especial Dia dos Namorados 20 Itens", platform: "Shopee", url: "https://shopee.com.br/product/284534732/19802569745", categoria: "Chocolates" },
  { id: 38, name: "Cesta com Vinho + Chocolates + Taça Te Amo", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D2741R7G", categoria: "Chocolates" },
  { id: 39, name: "Kit Presente Esposa Almofada + Caneca + Ferrero", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C5KBQ4KW", categoria: "Chocolates" },
  { id: 40, name: "Kit Presente Amor Sempre Vence Te Amo", platform: "Amazon", url: "https://www.amazon.com.br/dp/B094YNST8Y", categoria: "Chocolates" },

  // 7. Lingerie
  { id: 41, name: "Kit Lingerie Calcinha Sutiã Renda Baby Doll", platform: "Shopee", url: "https://shopee.com.br/product/413650367/17566221743", categoria: "Lingerie" },
  { id: 42, name: "Kit Lingerie Sexy e Acessório Sensual", platform: "Shopee", url: "https://shopee.com.br/product/844766343/19898575319", categoria: "Lingerie" },
  { id: 43, name: "Conjunto Lingerie 3 Peças Sensual", platform: "Shopee", url: "https://shopee.com.br/product/374239857/18499608672", categoria: "Lingerie" },
  { id: 44, name: "Kit Lingerie com Calcinha e Sutiã Romântico", platform: "Shopee", url: "https://shopee.com.br/product/950643909/20296965061", categoria: "Lingerie" },

  // 8. Kits de Spa
  { id: 45, name: "Kit Presente Banho Feminino SPA com Copo Térmico", platform: "Shopee", url: "https://shopee.com.br/product/1270314430/23393571143", categoria: "Kits de Spa" },
  { id: 46, name: "Kit Dia dos Namorados Day Spa Afrodisíaco", platform: "Shopee", url: "https://shopee.com.br/product/291931949/22894014543", categoria: "Kits de Spa" },
  { id: 47, name: "Kit Nativa Spa Cereja Rouge 2 itens", platform: "Shopee", url: "https://shopee.com.br/product/228245087/23493991755", categoria: "Kits de Spa" },
  { id: 48, name: "Kit Nativa Spa Cereja Rouge 02 Itens", platform: "Shopee", url: "https://shopee.com.br/product/1003627843/19199706479", categoria: "Kits de Spa" },
  { id: 49, name: "Kit Presente O Boticário Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/660450746/19799263096", categoria: "Kits de Spa" },
  { id: 50, name: "Cesta Dia dos Namorados 8 Itens Feminino", platform: "Shopee", url: "https://shopee.com.br/product/816692002/22793051883", categoria: "Kits de Spa" },
  { id: 51, name: "Kit Celebre Agora Feminino 2 itens", platform: "Shopee", url: "https://shopee.com.br/product/382750301/21899321694", categoria: "Kits de Spa" },
  { id: 52, name: "Kits Presente Feminino ou Masculino a Escolher", platform: "Shopee", url: "https://shopee.com.br/product/545663373/19599251904", categoria: "Kits de Spa" },

  // 9. Skincare
  { id: 53, name: "Kit Beleza e Skincare 20 Produtos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/1384536260/23994046407", categoria: "Skincare" },
  { id: 54, name: "Kit Natura Colônia + Creme Hidratante + Óleo", platform: "Shopee", url: "https://shopee.com.br/product/1453906759/23993937812", categoria: "Skincare" },
  { id: 55, name: "Kit Natura Tododia Flor de Pera + Melissa", platform: "Shopee", url: "https://shopee.com.br/product/864461465/20498098462", categoria: "Skincare" },
  { id: 56, name: "Kit Body Splash + Hidratante + Gel + Sais 4 Itens", platform: "Shopee", url: "https://shopee.com.br/product/1178075361/23698563659", categoria: "Skincare" },
  { id: 57, name: "Kit Lily Presente Dia dos Namorados 3 itens", platform: "Shopee", url: "https://shopee.com.br/product/821992458/20897687510", categoria: "Skincare" },
  { id: 58, name: "Kit Jequiti Sensi Creme + 5 Sabonetes", platform: "Shopee", url: "https://shopee.com.br/product/287290908/9744953510", categoria: "Skincare" },
  { id: 59, name: "Vela Lavanda Baunilha 283g Casal TEEZWONDER", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0BPX4XX2T", categoria: "Skincare" },

  // 10. Maquiagem
  { id: 60, name: "Buquê de Maquiagem Dia dos Namorados 10 Itens", platform: "Shopee", url: "https://shopee.com.br/product/800901015/19415828822", categoria: "Maquiagem" },
  { id: 61, name: "Buquê de Maquiagem DIA DOS NAMORADOS", platform: "Shopee", url: "https://shopee.com.br/product/406912072/18719383383", categoria: "Maquiagem" },
  { id: 62, name: "Buquê Maquiagem Kit Completo Combo Presente", platform: "Shopee", url: "https://shopee.com.br/product/259544562/3459102468", categoria: "Maquiagem" },
  { id: 63, name: "KIT Maquiagem na Caixa 11 Itens", platform: "Shopee", url: "https://shopee.com.br/product/440784098/15277018976", categoria: "Maquiagem" },
  { id: 64, name: "Kit Maquiagem Vult Presente Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/417627623/22791321491", categoria: "Maquiagem" },
  { id: 65, name: "Buquê de Maquiagem para Presente", platform: "Shopee", url: "https://shopee.com.br/product/264679717/5885061476", categoria: "Maquiagem" },
  { id: 66, name: "Buquê Maquiagem Completo 37 Itens", platform: "Shopee", url: "https://shopee.com.br/product/423558315/23816241289", categoria: "Maquiagem" },
  { id: 67, name: "Kit Maquiagem Caixa Presente", platform: "Shopee", url: "https://shopee.com.br/product/1470100280/22498520240", categoria: "Maquiagem" },
  { id: 68, name: "Presente Kit de Maquiagem Namorados", platform: "Shopee", url: "https://shopee.com.br/product/344423522/16960553736", categoria: "Maquiagem" },
  { id: 69, name: "Presente Criativo Kit Maquiagem com Estojo", platform: "Shopee", url: "https://shopee.com.br/product/347406430/4685674989", categoria: "Maquiagem" },

  // 11. Kit Capilar
  { id: 70, name: "Kit Presente Cabelo Feminino Cuidados Capilares", platform: "Shopee", url: "https://shopee.com.br/product/383537153/23693938074", categoria: "Kit Capilar" },
  { id: 71, name: "Busca Kits Capilares Femininos Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=kit+cabelo+presente+namorados", categoria: "Kit Capilar" },

  // 12. Smartwatches
  { id: 72, name: "Kit Smartwatch + Copo Térmico + Fone Bluetooth", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0F9NWH2M5", categoria: "Smartwatches" },
  { id: 73, name: "Par de Relógios para Casais SKMEI Combinando", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0924HDV9S", categoria: "Smartwatches" },
  { id: 74, name: "Relógio Quartzo Feminino Presente Namorados", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CQD4LK8Q", categoria: "Smartwatches" },
  { id: 75, name: "BERNY Relógio Masculino Quartzo Cerâmica", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C1ZXS2TX", categoria: "Smartwatches" },
  { id: 76, name: "Relógio Dia dos Namorados Busca ML", platform: "ML", url: "https://lista.mercadolivre.com.br/relogio-dia-dos-namorados", categoria: "Smartwatches" },
  { id: 77, name: "Kit Relógio Casal ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-relogio-casal", categoria: "Smartwatches" },
  { id: 78, name: "Smartwatches Femininos Amazon Categoria", platform: "Amazon", url: "https://www.amazon.com.br/b?node=17682107011", categoria: "Smartwatches" },

  // 13. Fones de Ouvido
  { id: 79, name: "Fone Bluetooth Sem Fio GOLLATE Premium", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C3XZW4PM", categoria: "Fones de Ouvido" },
  { id: 80, name: "Fones Bluetooth Mais Vendidos Amazon", platform: "Amazon", url: "https://www.amazon.com.br/gp/bestsellers/electronics/16244120011", categoria: "Fones de Ouvido" },
  { id: 81, name: "Fone Bluetooth Vermelho Presente Namorados", platform: "Amazon", url: "https://www.amazon.com.br/s?k=fone+bluetooth+presente+namorados", categoria: "Fones de Ouvido" },

  // 14. Caixas de Som
  { id: 82, name: "Caixa Som Bluetooth Amplificada Portátil USB", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0B724NNS7", categoria: "Caixas de Som" },
  { id: 83, name: "Caixas de Som Bluetooth Mais Vendidas", platform: "Amazon", url: "https://www.amazon.com.br/gp/bestsellers/electronics/16244291011", categoria: "Caixas de Som" },
  { id: 84, name: "Busca Caixa Som Presente Namorados", platform: "Amazon", url: "https://www.amazon.com.br/s?k=caixa+de+som+bluetooth+presente", categoria: "Caixas de Som" },

  // 15. Cameras Instantaneas
  { id: 85, name: "Fujifilm Instax Mini 11 Azul Celeste + 10 Fotos", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08TS6JXKR", categoria: "Cameras Instantaneas" },
  { id: 86, name: "Fujifilm Instax Mini 12 Pacote Casamento", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C47Q2HNF", categoria: "Cameras Instantaneas" },
  { id: 87, name: "Fujifilm Instax Mini 9 Amarelo Banana", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07R4MFXK8", categoria: "Cameras Instantaneas" },
  { id: 88, name: "Fujifilm Instax Mini 9 Azul Acqua", platform: "Amazon", url: "https://www.amazon.com.br/dp/B06Y68YRTF", categoria: "Cameras Instantaneas" },
  { id: 89, name: "Fujifilm Instax Wide 300 Preta", platform: "Amazon", url: "https://www.amazon.com.br/dp/B00TGOWK3Q", categoria: "Cameras Instantaneas" },
  { id: 90, name: "Filme Instax Mini 10 Fotos Fujifilm", platform: "Amazon", url: "https://www.amazon.com.br/dp/B004U7JYS8", categoria: "Cameras Instantaneas" },

  // 16. Mini Impressoras
  { id: 91,  name: "Impressora Fujifilm Instax Mini Link Cinza", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07XYNN743", categoria: "Mini Impressoras" },
  { id: 92,  name: "Impressora Fujifilm Instax Mini Link Jeans", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07XYPBKT9", categoria: "Mini Impressoras" },
  { id: 93,  name: "Impressora FUJIFILM Instax Mini Link 2 Clay", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0B1QV6RKW", categoria: "Mini Impressoras" },
  { id: 94,  name: "Impressora FUJIFILM Mini Link 2 Branca", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0B1NF5NBN", categoria: "Mini Impressoras" },
  { id: 95,  name: "Impressora FUJIFILM Instax Mini Link 3 Verde", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DB8SKHM2", categoria: "Mini Impressoras" },
  { id: 96,  name: "Impressora FUJIFILM Instax Mini Link 3 Rosa", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DB8T2PF2", categoria: "Mini Impressoras" },
  { id: 97,  name: "Impressora FUJIFILM Instax Mini Link 3 Branca", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DB8SQSRH", categoria: "Mini Impressoras" },
  { id: 98,  name: "Impressora Instax Mini Link 2 + 40 Filmes", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07ZHNRB3W", categoria: "Mini Impressoras" },
  { id: 99,  name: "Álbum Scrapbook Polaroid DIY Instax Presente", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07KQ5PQ4W", categoria: "Mini Impressoras" },

  // 17. Pijamas de Casal
  { id: 100, name: "Conjunto Pijama Casal com Foto Personalizado", platform: "Shopee", url: "https://shopee.com.br/product/326873777/8054926490", categoria: "Pijamas de Casal" },
  { id: 101, name: "Conjunto Pijama Casal Presente Perfeito", platform: "Shopee", url: "https://shopee.com.br/product/215739606/18199804751", categoria: "Pijamas de Casal" },
  { id: 102, name: "Pijama Kit Casal Fotos Personalizado Adulto", platform: "Shopee", url: "https://shopee.com.br/product/385340011/18522958556", categoria: "Pijamas de Casal" },
  { id: 103, name: "Kit Casal Combinando Pijama Baby Doll", platform: "Shopee", url: "https://shopee.com.br/product/212565430/21897661889", categoria: "Pijamas de Casal" },
  { id: 104, name: "Pijama Casal de Inverno Kit Combinando", platform: "Shopee", url: "https://shopee.com.br/product/359111696/20896896845", categoria: "Pijamas de Casal" },
  { id: 105, name: "Pijama Casal em Oferta Shopee Categoria", platform: "Shopee", url: "https://shopee.com.br/list/Pijama/Casal", categoria: "Pijamas de Casal" },

  // 18. Camisetas de Casal
  { id: 106, name: "Kit Casal Camiseta Estampa Combinando 100% Algodão", platform: "Shopee", url: "https://shopee.com.br/product/712101619/23794045007", categoria: "Camisetas de Casal" },
  { id: 107, name: "Kit 2 Camisa Casal Love Combinando v1", platform: "Shopee", url: "https://shopee.com.br/product/1438387154/19999722399", categoria: "Camisetas de Casal" },
  { id: 108, name: "Kit 2 Camisa Casal Love Combinando v2", platform: "Shopee", url: "https://shopee.com.br/product/344002973/21696990568", categoria: "Camisetas de Casal" },
  { id: 109, name: "Camiseta Casal Combinando Nosso Primeiro Dia", platform: "Shopee", url: "https://shopee.com.br/product/422113311/23891250194", categoria: "Camisetas de Casal" },
  { id: 110, name: "Camisa Kit 2 Camiseta Metadinha Romântica", platform: "Shopee", url: "https://shopee.com.br/product/550315095/22691395201", categoria: "Camisetas de Casal" },
  { id: 111, name: "Kit Camisas Casal Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/408597357/23097539025", categoria: "Camisetas de Casal" },
  { id: 112, name: "Blusa Kit Casal Combinando Masc. + Fem.", platform: "Shopee", url: "https://shopee.com.br/product/380118274/20896982001", categoria: "Camisetas de Casal" },
  { id: 113, name: "Kit Camiseta Casal Estampa com Frases", platform: "Shopee", url: "https://shopee.com.br/product/346368963/21399248675", categoria: "Camisetas de Casal" },
  { id: 114, name: "Kit 2 Camisetas Casal Combinando Namorados", platform: "Shopee", url: "https://shopee.com.br/product/1414022698/21797992552", categoria: "Camisetas de Casal" },

  // 19. Moletons de Casal
  { id: 115, name: "Kit Casal Blusa Moletom Com Capuz LOVE", platform: "Shopee", url: "https://shopee.com.br/product/1435772352/23398554261", categoria: "Moletons de Casal" },
  { id: 116, name: "Moletom de Casal Combinando Categoria Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Moletom/Casal", categoria: "Moletons de Casal" },
  { id: 117, name: "Busca Moletom Casal Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/search?keyword=moletom+casal+namorados", categoria: "Moletons de Casal" },

  // 20. Velas Aromaticas
  { id: 118, name: "Vela Dia dos Namorados Rosa 3 Pavios 400ml", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0BG13DZX6", categoria: "Velas Aromaticas" },
  { id: 119, name: "12 Velas Aromáticas Morango Namorados", platform: "Amazon", url: "https://www.amazon.com.br/dp/B07S8CY3M6", categoria: "Velas Aromaticas" },
  { id: 120, name: "Vela Amor Romântico 2 Peças Coração Cera Soja", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DK3VZMVK", categoria: "Velas Aromaticas" },
  { id: 121, name: "Velas Casal Baunilha + Lavanda 295ml", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0BPX6KMYF", categoria: "Velas Aromaticas" },
  { id: 122, name: "Vela Perfumada Morango 3 Pavios 410ml", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0BG166GNB", categoria: "Velas Aromaticas" },
  { id: 123, name: "Velas Lavanda Presentes Casamento Casal", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D8PJY7FY", categoria: "Velas Aromaticas" },
  { id: 124, name: "Castiçal Coração Romântico Jantar", platform: "Amazon", url: "https://www.amazon.com.br/dp/B09Z71DQ48", categoria: "Velas Aromaticas" },
  { id: 125, name: "Vela Baunilha Lavanda 255g Presente Casal", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CJJJ9VT4", categoria: "Velas Aromaticas" },
  { id: 126, name: "Mini Vela Aromática Lembrancinha Casamento", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CMMW9S3Z", categoria: "Velas Aromaticas" },
  { id: 127, name: "Decoração Vela Presente Casal Apaixonado", platform: "Amazon", url: "https://www.amazon.com.br/dp/B09M9Z1L7Q", categoria: "Velas Aromaticas" },

  // 21. Kits de Vinho
  { id: 128, name: "Cesta Vinho + Chocolates + Taça Te Amo", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D2741R7G", categoria: "Kits de Vinho" },
  { id: 129, name: "Taça de Vinho Vidro 340ml Personalizada", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D2DT435N", categoria: "Kits de Vinho" },
  { id: 130, name: "Saco Garrafa Vinho Presente Namorados", platform: "Amazon", url: "https://www.amazon.com.br/dp/B09NZD5XN9", categoria: "Kits de Vinho" },
  { id: 131, name: "Conjunto Taça Vinho e Uísque Casal COOL AF", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0987YPYD6", categoria: "Kits de Vinho" },
  { id: 132, name: "Taça Vinho Personalizada com Inicial A-Z", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D79DHHKM", categoria: "Kits de Vinho" },
  { id: 133, name: "Busca Kit Vinho Taça Romântico Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=kit+vinho+taca+presente+namorados", categoria: "Kits de Vinho" },

  // 22. Carteiras Masculinas
  { id: 134, name: "Carteira Couro Gravada Personalizada Namorado", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08JGB5R1R", categoria: "Carteiras Masculinas" },
  { id: 135, name: "Carteira Personalizada Minimalista RFID", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D2S85PNW", categoria: "Carteiras Masculinas" },
  { id: 136, name: "Colaxi Carteira Couro Masculina Bifold", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CXXZCFFD", categoria: "Carteiras Masculinas" },
  { id: 137, name: "Carteira Minimalista 2 Dobras Couro RFID", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08YY6SVMQ", categoria: "Carteiras Masculinas" },
  { id: 138, name: "SYGUNAR Carteira Masculina Personalizada", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DPLKNZZC", categoria: "Carteiras Masculinas" },
  { id: 139, name: "Kullder Carteira Masculina Couro Crazy Horse", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0DPHYMPFL", categoria: "Carteiras Masculinas" },
  { id: 140, name: "Carteira Masculina Couro Legítimo Ziper", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D7QV44ZV", categoria: "Carteiras Masculinas" },
  { id: 141, name: "Carteira Masculina Couro Ziper Adaskala", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08YR7MT15", categoria: "Carteiras Masculinas" },

  // 23. Ursos e Pelucias
  { id: 142, name: "Ursinho de Pelúcia Presente Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/394191823/9937719057", categoria: "Ursos e Pelucias" },
  { id: 143, name: "Urso Pelúcia Gigante Personalizado Eu Te Amo", platform: "Shopee", url: "https://shopee.com.br/product/433584919/11008332408", categoria: "Ursos e Pelucias" },
  { id: 144, name: "Urso de Pelúcia Para Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/460725840/22998523693", categoria: "Ursos e Pelucias" },
  { id: 145, name: "Panda Grande Pelúcia Gigante Antialérgico", platform: "Shopee", url: "https://shopee.com.br/product/366605162/23393049301", categoria: "Ursos e Pelucias" },
  { id: 146, name: "Urso Pelúcia 90cm com Almofada Coração", platform: "Shopee", url: "https://shopee.com.br/product/356076723/15178657588", categoria: "Ursos e Pelucias" },
  { id: 147, name: "Urso de Pelúcia Premium 40cm", platform: "Shopee", url: "https://shopee.com.br/product/779914073/23391072231", categoria: "Ursos e Pelucias" },
  { id: 148, name: "Urso de Pelúcia 30cm Várias Opções", platform: "Shopee", url: "https://shopee.com.br/product/347912706/9359744397", categoria: "Ursos e Pelucias" },
  { id: 149, name: "Ursinhos Pelúcia para Montar Presentes", platform: "Shopee", url: "https://shopee.com.br/product/1221240871/23597507064", categoria: "Ursos e Pelucias" },
  { id: 150, name: "Urso de Pelúcia Grande com Coração", platform: "Shopee", url: "https://shopee.com.br/product/753855295/18296968328", categoria: "Ursos e Pelucias" },
  { id: 151, name: "Ursinho Coelho Pelúcia Presente Namorados", platform: "Shopee", url: "https://shopee.com.br/product/647130311/14358959469", categoria: "Ursos e Pelucias" },

  // 24. Canecas
  { id: 152, name: "Caneca Personalizada Casal Flork Bento", platform: "Shopee", url: "https://shopee.com.br/product/387836934/23091266194", categoria: "Canecas" },
  { id: 153, name: "Caneca Romântica Personalizada com Foto Casal", platform: "Shopee", url: "https://shopee.com.br/product/425259844/10604718580", categoria: "Canecas" },
  { id: 154, name: "Caneca Personalizada Mapa do Primeiro Encontro", platform: "Shopee", url: "https://shopee.com.br/product/1057983260/23593059239", categoria: "Canecas" },
  { id: 155, name: "Caneca Personalizada Dia dos Namorados Casal", platform: "Shopee", url: "https://shopee.com.br/product/227942978/6847353830", categoria: "Canecas" },
  { id: 156, name: "Caneca Personalizada com Foto e Frases", platform: "Shopee", url: "https://shopee.com.br/product/433857953/21102717728", categoria: "Canecas" },
  { id: 157, name: "Caneca Casal que Treina Junto", platform: "Shopee", url: "https://shopee.com.br/product/729193299/22398518943", categoria: "Canecas" },
  { id: 158, name: "Kit 2 Canecas Personalizadas Acrílico Casal", platform: "Amazon", url: "https://www.amazon.com.br/dp/B095J3GJZP", categoria: "Canecas" },
  { id: 159, name: "Caneca Flork Casal Fitness Branca", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0C731BKYB", categoria: "Canecas" },
  { id: 160, name: "Caneca Casal Player 1 e 2 Presente Geek", platform: "Amazon", url: "https://www.amazon.com.br/dp/B098R3QLTH", categoria: "Canecas" },
  { id: 161, name: "Caneca Love Amor Flores Romântico", platform: "Amazon", url: "https://www.amazon.com.br/dp/B08CT41YPT", categoria: "Canecas" },
  { id: 162, name: "Caneca Dupla Casal Gamer Presente", platform: "Amazon", url: "https://www.amazon.com.br/dp/B09ZXW9121", categoria: "Canecas" },
  { id: 163, name: "Caneca Engraçada Presente para Casal", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CJ2H7J1S", categoria: "Canecas" },

  // 25. Almofadas
  { id: 164, name: "Kit 10 Almofadas Dia dos Namorados Várias Estampas", platform: "Shopee", url: "https://shopee.com.br/product/300352322/16667136144", categoria: "Almofadas" },
  { id: 165, name: "Almofada Personalizada Envio no Mesmo Dia", platform: "Shopee", url: "https://shopee.com.br/product/815179777/23998532387", categoria: "Almofadas" },
  { id: 166, name: "Almofada Personalizada Presente Namorado", platform: "Shopee", url: "https://shopee.com.br/product/720845711/19504015664", categoria: "Almofadas" },
  { id: 167, name: "Almofada Personalizada para Presente Namorada", platform: "Shopee", url: "https://shopee.com.br/product/326798695/14990654282", categoria: "Almofadas" },
  { id: 168, name: "Almofada Namorados Personalizado com Foto", platform: "Shopee", url: "https://shopee.com.br/product/327342186/2984338203", categoria: "Almofadas" },
  { id: 169, name: "Almofada Personalizada com Foto Aniversário", platform: "Shopee", url: "https://shopee.com.br/product/710285521/22091261243", categoria: "Almofadas" },
  { id: 170, name: "Mini Almofada Personalizada Dia dos Namorados", platform: "Shopee", url: "https://shopee.com.br/product/203385339/8818906450", categoria: "Almofadas" },
  { id: 171, name: "Almofada Personalizada Lembrancinha Cesta", platform: "Shopee", url: "https://shopee.com.br/product/346243366/22597448767", categoria: "Almofadas" },
  { id: 172, name: "Almofada Personalizada Foto de Casal", platform: "Shopee", url: "https://shopee.com.br/product/282186917/4147969122", categoria: "Almofadas" },
  { id: 173, name: "Almofada Foto Personalizada 30x30 Envio Rápido", platform: "Shopee", url: "https://shopee.com.br/product/208671269/23594021002", categoria: "Almofadas" },

  // 26. Quadros Decorativos
  { id: 174, name: "Quadro Personalizado Spotify + Frase Moldura A4", platform: "Shopee", url: "https://shopee.com.br/product/339710288/17864392542", categoria: "Quadros Decorativos" },
  { id: 175, name: "Quadro Decorativo Personalizado Spotify Código", platform: "Shopee", url: "https://shopee.com.br/product/828263178/23592955865", categoria: "Quadros Decorativos" },
  { id: 176, name: "Quadro Casal com Foto + Frases Sala Quarto", platform: "Shopee", url: "https://shopee.com.br/product/334499149/19461332080", categoria: "Quadros Decorativos" },
  { id: 177, name: "Quadros Placas Personalizados Namorados Foto", platform: "Shopee", url: "https://shopee.com.br/product/353516694/8853563919", categoria: "Quadros Decorativos" },
  { id: 178, name: "Quadro Decorativo Personalizado AmorFlix Netflix", platform: "Shopee", url: "https://shopee.com.br/product/828263178/18897632725", categoria: "Quadros Decorativos" },
  { id: 179, name: "Quadro Personalizado Foto Casal Presente", platform: "Shopee", url: "https://shopee.com.br/product/1005436391/19899260094", categoria: "Quadros Decorativos" },
  { id: 180, name: "Quadro Casal com Data + QR Code + Foto", platform: "Shopee", url: "https://shopee.com.br/product/1028581611/23697248775", categoria: "Quadros Decorativos" },
  { id: 181, name: "Quadro Placa Casal Montagem Fotos Infinito", platform: "Shopee", url: "https://shopee.com.br/product/283730353/23397497076", categoria: "Quadros Decorativos" },
  { id: 182, name: "Quadro Placa Casal Fotos Amor Coração", platform: "Shopee", url: "https://shopee.com.br/product/1028581611/22097280577", categoria: "Quadros Decorativos" },

  // 27. Kit de Barba
  { id: 183, name: "11 Em 1 Kit Cuidados com a Barba", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-3335593433", categoria: "Kit de Barba" },
  { id: 184, name: "Kit Barbeiro Barbearia Presente Namorado", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-813200942", categoria: "Kit de Barba" },
  { id: 185, name: "Kit Barba Male God Óleo + Bálsamo", platform: "ML", url: "https://produto.mercadolivre.com.br/MLB-5187751358", categoria: "Kit de Barba" },
  { id: 186, name: "Busca Kit Barba Masculino Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-barbear-presente", categoria: "Kit de Barba" },

  // 28. Kits Masculinos
  { id: 187, name: "Presente Masculino Kit Namorado Criativo", platform: "Shopee", url: "https://shopee.com.br/product/390350666/9424046177", categoria: "Kits Masculinos" },
  { id: 188, name: "Kits Presente Feminino ou Masculino Aniversário", platform: "Shopee", url: "https://shopee.com.br/product/430043298/15969648965", categoria: "Kits Masculinos" },
  { id: 189, name: "Presente Namorados para Homem Barato Kit v1", platform: "Shopee", url: "https://shopee.com.br/product/975738896/23094051478", categoria: "Kits Masculinos" },
  { id: 190, name: "Presente Namorados para Homem Kit Criativo v2", platform: "Shopee", url: "https://shopee.com.br/product/332441661/22894051665", categoria: "Kits Masculinos" },
  { id: 191, name: "Kit Dia dos Namorados Masculino ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-dia-dos-namorados-masculino", categoria: "Kits Masculinos" },
  { id: 192, name: "Kit Presente Dia dos Namorados Masculinos ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-presente-dia-dos-namorados-masculinos", categoria: "Kits Masculinos" },

  // 29. Caixas Surpresa
  { id: 193, name: "AUGSUN Caixa Surpresa Explosão Dinheiro Rosa", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CP36PHW8", categoria: "Caixas Surpresa" },
  { id: 194, name: "Caixa de Presente Surpresa Pop-Up Explosão", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CQK5BC5K", categoria: "Caixas Surpresa" },
  { id: 195, name: "Kit Romântico Surpresa Velas + Pétalas + Balões", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0D6S1DWGR", categoria: "Caixas Surpresa" },
  { id: 196, name: "Chiazllta 4 Peças Caixa Dinheiro com Cartão", platform: "Amazon", url: "https://www.amazon.com.br/dp/B0CN8ZJ146", categoria: "Caixas Surpresa" },

  // 30. Difusores
  { id: 197, name: "Kit 5 Mini Difusor Aromatizador Personalizado", platform: "Shopee", url: "https://shopee.com.br/product/1398593845/23493556262", categoria: "Difusores" },
  { id: 198, name: "25 Lembrancinhas Aromatizador 45ml + Varetas", platform: "Shopee", url: "https://shopee.com.br/product/324215035/17023615924", categoria: "Difusores" },
  { id: 199, name: "20 Mini Aromatizadores 35ml Personalizados", platform: "Shopee", url: "https://shopee.com.br/product/324215035/10156485325", categoria: "Difusores" },
  { id: 200, name: "Aromatizador de Ambiente Lembrancinha", platform: "Shopee", url: "https://shopee.com.br/product/300370857/4966882020", categoria: "Difusores" },

  // 31. Presentes em Geral (buscas de categoria)
  { id: 201, name: "Presente Dia dos Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=presente+dia+dos+namorados", categoria: "Presentes em Geral" },
  { id: 202, name: "Dicas Presentes Dia dos Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/gcx/Dia-dos-Namorados/gfhz/events?categoryId=valentines-day", categoria: "Presentes em Geral" },
  { id: 203, name: "Presente Masculino Namorado Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=presente+masculino+namorado", categoria: "Presentes em Geral" },
  { id: 204, name: "Kit Dia dos Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=kit+dia+dos+namorados", categoria: "Presentes em Geral" },
  { id: 205, name: "Kit Romântico Surpresa Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=kit+romantico+surpresa", categoria: "Presentes em Geral" },
  { id: 206, name: "Impressoras Fotográficas Amazon Categoria", platform: "Amazon", url: "https://www.amazon.com.br/b?node=17502916011", categoria: "Presentes em Geral" },
  { id: 207, name: "Eletrônicos Mais Gifted Amazon", platform: "Amazon", url: "https://www.amazon.com.br/gp/most-gifted/electronics/16244120011", categoria: "Presentes em Geral" },
  { id: 208, name: "Presente Dia dos Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/presente-dia-dos-namorados", categoria: "Presentes em Geral" },
  { id: 209, name: "Presentes Dia dos Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/presentes-dia-dos-namorados", categoria: "Presentes em Geral" },
  { id: 210, name: "Presentes Femininos ML", platform: "ML", url: "https://lista.mercadolivre.com.br/presentes-femininos", categoria: "Presentes em Geral" },
  { id: 211, name: "Joias Relógios Casal ML", platform: "ML", url: "https://lista.mercadolivre.com.br/joias-relogios/relogios/relogio-casal-de-namorados", categoria: "Presentes em Geral" },
  { id: 212, name: "Kit Presente Dia dos Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-presente-dia-dos-namorados", categoria: "Presentes em Geral" },
  { id: 213, name: "Presente Para Barbeiro ML", platform: "ML", url: "https://lista.mercadolivre.com.br/presente-para-barbeiro", categoria: "Presentes em Geral" },
  { id: 214, name: "Kit O Boticário Dia dos Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-o-boticario-dia-dos-namorados", categoria: "Presentes em Geral" },
  { id: 215, name: "Aliança Namoro Prata ML", platform: "ML", url: "https://lista.mercadolivre.com.br/alianca-de-namoro-prata", categoria: "Presentes em Geral" },
  { id: 216, name: "Pulseira Compromisso Namorado ML", platform: "ML", url: "https://lista.mercadolivre.com.br/pulseira-compromisso-namorado", categoria: "Presentes em Geral" },
  { id: 217, name: "Dia dos Namorados Shopee Geral", platform: "Shopee", url: "https://shopee.com.br/search?keyword=dia+dos+namorados", categoria: "Presentes em Geral" },
  { id: 218, name: "Presente Namorado Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=presente+namorado", categoria: "Presentes em Geral" },
  { id: 219, name: "Cesta Chocolate Namorado Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Cesta/Chocolate/Namorado", categoria: "Presentes em Geral" },
  { id: 220, name: "Cesta Dia dos Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Cesta/Dia%20dos%20Namorados", categoria: "Presentes em Geral" },
  { id: 221, name: "Pulseira de Casal Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=pulseira+de+casal", categoria: "Presentes em Geral" },
  { id: 222, name: "Colar de Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Colar/Namorados", categoria: "Presentes em Geral" },
  { id: 223, name: "Camiseta de Casal Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Camiseta/Casal", categoria: "Presentes em Geral" },
  { id: 224, name: "Roupa de Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Roupa/Namorados", categoria: "Presentes em Geral" },
  { id: 225, name: "Decoração Dia dos Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/list/Decoracao+de+Dia+dos+Namorados", categoria: "Presentes em Geral" },
  { id: 226, name: "Canecas Personalizadas Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=canecas+personalizadas+namorados", categoria: "Presentes em Geral" },
  { id: 227, name: "Kit Barba Masculino ML Busca", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-barba-masculino", categoria: "Presentes em Geral" },
  { id: 228, name: "Dia Namorados Kit Feminino ML", platform: "ML", url: "https://lista.mercadolivre.com.br/dia-dos-namorados-kit-feminino", categoria: "Presentes em Geral" },
  { id: 229, name: "Bolsa Feminina Dia a Dia ML", platform: "ML", url: "https://lista.mercadolivre.com.br/bolsa-feminina-dia-dia", categoria: "Presentes em Geral" },
  { id: 230, name: "Sacola Dia dos Namorados ML", platform: "ML", url: "https://lista.mercadolivre.com.br/sacola-dia-dos-namorados", categoria: "Presentes em Geral" },

  // 32. Extras
  { id: 231, name: "Taças de Vinho Dia dos Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=taca+vinho+personalizada+namorados", categoria: "Extras" },
  { id: 232, name: "Cesto Presente com Vinho Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=cesto+presente+vinho+namorados", categoria: "Extras" },
  { id: 233, name: "Anel de Namoro Busca Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=anel+de+namoro", categoria: "Extras" },
  { id: 234, name: "Caneca Namorado Busca Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=caneca+namorado", categoria: "Extras" },
  { id: 235, name: "Carteira Masculina Namorado Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=carteira+masculina+namorado", categoria: "Extras" },
  { id: 236, name: "Aliança Compromisso Prata Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=alianca+compromisso+prata", categoria: "Extras" },
  { id: 237, name: "Aliança Compromisso Namoro Gravada ML", platform: "ML", url: "https://lista.mercadolivre.com.br/alianca-de-compromisso-namoro-gravada", categoria: "Extras" },
  { id: 238, name: "Kit Dia Namorados Homem Relógio ML", platform: "ML", url: "https://lista.mercadolivre.com.br/kit-dia-dos-namorados-homem-relogio", categoria: "Extras" },
  { id: 239, name: "Busca Urso Pelúcia Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=urso+pelucia+dia+dos+namorados", categoria: "Extras" },
  { id: 240, name: "Busca Quadro Personalizado Casal Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=quadro+personalizado+casal+namorados", categoria: "Extras" },
  { id: 241, name: "Busca Almofada Personalizada Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=almofada+personalizada+namorados", categoria: "Extras" },
  { id: 242, name: "Busca Lingerie Dia dos Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=lingerie+dia+dos+namorados", categoria: "Extras" },
  { id: 243, name: "Busca Vela Aromática Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=vela+aromatica+namorados", categoria: "Extras" },
  { id: 244, name: "Busca Kit Skincare Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=kit+skincare+namorados", categoria: "Extras" },
  { id: 245, name: "Busca Maquiagem Buquê Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=buque+maquiagem+namorados", categoria: "Extras" },
  { id: 246, name: "Busca Relógio Presente Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=relogio+presente+namorados", categoria: "Extras" },
  { id: 247, name: "Busca Difusor Ambiente Namorados Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=difusor+ambiente+namorados", categoria: "Extras" },
  { id: 248, name: "Busca Perfume Feminino Kit Shopee", platform: "Shopee", url: "https://shopee.com.br/search?keyword=perfume+feminino+kit+namorados", categoria: "Extras" },
  { id: 249, name: "Busca Caixa Surpresa Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=caixa+surpresa+namorados", categoria: "Extras" },
  { id: 250, name: "Presente Romântico Dia dos Namorados Amazon", platform: "Amazon", url: "https://www.amazon.com.br/s?k=presente+romantico+dia+dos+namorados", categoria: "Extras" },
];
