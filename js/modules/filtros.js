// ========================================
// SISTEMA DE FILTROS COM MÚLTIPLAS CATEGORIAS
// ========================================

let categoriaAtual = 'todos';
let subcategoriaAtual = 'todas';
let marcaAtual = 'todas';
let linhaAtual = 'todas';

// ========================================
// MAPEAMENTO DE CATEGORIAS (para subcategorias)
// ========================================

const CATEGORIA_MAP = {
    'cabelo': 'cabelo',
    'capilar': 'cabelo',
    'shampoo': 'cabelo',
    'condicionador': 'cabelo',
    'creme-pentear': 'cabelo',
    'mascara': 'cabelo',
    'oleo': 'cabelo',
    'tonico': 'cabelo',
    'tinta': 'cabelo',
    'descolorante': 'cabelo',
    'guanidina': 'cabelo',
    'creme relaxante': 'cabelo',
    'ativador de cachos': 'cabelo',
    'gelatina': 'cabelo',
    'gel': 'cabelo',
    'gel fixador': 'cabelo',
    'kit': 'cabelo',

    'kids': 'kids',
    'creme-de-pentear-kids': 'kids',
    'gelatina-kids': 'kids',
    'ativador-de-cachos-kids': 'kids',
    'shampoo-kids': 'kids',
    'condicionador-kids': 'kids',
    'mascara-kids': 'kids',
    'kit-kids': 'kids',
    'creme-kids': 'kids',
    'creme-multifuncional-kids': 'kids',

    'corpo': 'corpo',
    'corporal': 'corpo',
    'corpo e rosto': 'corpo',
    'hidratante': 'corpo',
    'oleo corporal': 'corpo',
    'creme-corpo': 'corpo',
    'colonia': 'corpo',
    'body splash': 'corpo',
    'desodorante': 'corpo',
    'oleo de banho': 'corpo',

    'higiene': 'higiene',
    'sabonete': 'higiene',
    'sabonete em barra': 'higiene',
    'sabonete liquido': 'higiene',
    'sabonete intimo': 'higiene',
    'fralda': 'higiene',
    'talco': 'higiene',
    'higiene pessoal': 'higiene',
    'intimo': 'higiene',

    'pele': 'pele',
    'facial': 'pele',
    'rosto': 'pele',
    'labial': 'pele',
    'tratamento facial': 'pele',
    'creme facial': 'pele',
    'gel de limpeza': 'pele',
    'agua micelar': 'pele',
    'demaquilante': 'pele',
    'serum facial': 'pele',
    'mascara facial': 'pele',
    'protetor labial': 'pele',

    'barba': 'barba',
    'pos-barba': 'barba',
    'pós-barba': 'barba',
    'creme-barbear': 'barba',
    'creme de barbear': 'barba',
    'pos barba': 'barba',
    'loção pós-barba': 'barba',
    'aparelho de barbear': 'barba',
    'aparelho': 'barba',

    'perfumaria': 'perfumaria',
    'perfume': 'perfumaria',
    'colonias': 'perfumaria',
    'deo colonia': 'perfumaria',

    'maquiagem': 'maquiagem',
    'make': 'maquiagem',
    'pre-make': 'maquiagem',
    'pos-make': 'maquiagem',
    'gloss': 'maquiagem',
    'primer': 'maquiagem',
    'fixador': 'maquiagem',
    'po facial': 'maquiagem',
    'bruma': 'maquiagem',

    'tintas': 'tintas',
    'tinta': 'tintas',
    'descolorante': 'tintas',
    'agua oxigenada': 'tintas',
    'oxigenada': 'tintas',

    'alimentos': 'alimentos',
    'biscoitos': 'alimentos',
    'balas': 'alimentos',
    'chicletes': 'alimentos',
    'doces': 'alimentos',

    'promocao': 'promocao',
    'promoção': 'promocao',
    'oferta': 'promocao'
};

// ========================================
// CATEGORIAS PRINCIPAIS
// ========================================

const CATEGORIAS_DISPONIVEIS = {
    'todos': 'Todos',
    'promocao': 'Promoção',
    'cabelo': 'Cabelos',
    'kids': 'Kids',
    'corpo': 'Corpo',
    'higiene': 'Higiene',
    'pele': 'Pele',
    'barba': 'Barba',
    'perfumaria': 'Perfumaria',
    'maquiagem': 'Maquiagem',
    'tintas': 'Tintas',
    'alimentos': 'Alimentos'
};

// ========================================
// SUB-CATEGORIAS POR CATEGORIA PRINCIPAL
// ========================================

const SUBCATEGORIAS = {
    'cabelo': [
        { id: 'todas',            nome: 'Todos',           match: () => true },
        { id: 'shampoo',          nome: 'Shampoo',         match: (p) => ehShampoo(p) },
        { id: 'condicionador',    nome: 'Condicionador',   match: (p) => ehCondicionador(p) },
        { id: 'creme-pentear',    nome: 'Creme de Pentear', match: (p) => ehCremePentear(p) },
        { id: 'mascara',          nome: 'Máscara',         match: (p) => ehMascara(p) },
        { id: 'creme-tratamento', nome: 'Creme de Tratamento', match: (p) => ehCremeTratamento(p) },
        { id: 'kit',              nome: 'Kit',             match: (p) => ehKit(p) },
        { id: 'ativador',         nome: 'Ativador de Cachos', match: (p) => ehAtivador(p) },
        { id: 'oleo',             nome: 'Óleo',            match: (p) => ehOleo(p) },
        { id: 'tinta',            nome: 'Tinta',           match: (p) => ehTinta(p) }
    ],
    'higiene': [
        { id: 'todas',       nome: 'Todos',        match: () => true },
        { id: 'sabonete',    nome: 'Sabonetes',    match: (p) => ehSabonete(p) },
        { id: 'desodorante', nome: 'Desodorantes', match: (p) => ehDesodorante(p) },
        { id: 'fralda',      nome: 'Fraldas',      match: (p) => ehFralda(p) },
        { id: 'intimo',      nome: 'Íntimos',      match: (p) => ehIntimo(p) },
        { id: 'talco',       nome: 'Talco',        match: (p) => ehTalco(p) }
    ],
    'corpo': [
        { id: 'todas',       nome: 'Todos',        match: () => true },
        { id: 'desodorante', nome: 'Desodorantes', match: (p) => ehDesodorante(p) },
        { id: 'hidratante',  nome: 'Hidratantes',  match: (p) => ehHidratante(p) },
        { id: 'oleo',        nome: 'Óleos',        match: (p) => ehOleo(p) }
    ],
    'pele': [
        { id: 'todas',      nome: 'Todos',        match: () => true },
        { id: 'facial',     nome: 'Facial',       match: (p) => ehFacial(p) },
        { id: 'labial',     nome: 'Labial',       match: (p) => ehLabial(p) },
        { id: 'anti-idade', nome: 'Anti-idade',   match: (p) => ehAntiIdade(p) }
    ],
    'barba': [
        { id: 'todas',            nome: 'Todos',              match: () => true },
        { id: 'aparelho',         nome: 'Aparelhos',           match: (p) => ehAparelhoBarbear(p) },
        { id: 'creme-barbear',    nome: 'Creme de Barbear',   match: (p) => ehCremeBarbear(p) },
        { id: 'pos-barba',        nome: 'Pós-Barba',          match: (p) => ehPosBarba(p) }
    ],
    'kids': [
        { id: 'todas',       nome: 'Todos',        match: () => true },
        { id: 'cabelo-kids', nome: 'Cabelo',       match: (p) => ehCabelo(p) },
        { id: 'corpo-kids',  nome: 'Corpo',        match: (p) => ehCorpo(p) },
        { id: 'fralda-kids', nome: 'Fraldas',      match: (p) => ehFralda(p) }
    ],
    'perfumaria': [
        { id: 'todas',       nome: 'Todos',        match: () => true },
        { id: 'colonia',     nome: 'Colônias',     match: (p) => ehColonia(p) },
        { id: 'body-splash', nome: 'Body Splash',  match: (p) => ehBodySplash(p) },
        { id: 'perfume',     nome: 'Perfumes',     match: (p) => ehPerfume(p) }
    ],
    'maquiagem': [
        { id: 'todas',   nome: 'Todos',     match: () => true },
        { id: 'base',    nome: 'Base',      match: (p) => ehBase(p) },
        { id: 'olhos',   nome: 'Olhos',     match: (p) => ehOlhos(p) },
        { id: 'boca',    nome: 'Boca',      match: (p) => ehBoca(p) }
    ],
    'tintas': [
        { id: 'todas',          nome: 'Todos',            match: () => true },
        { id: 'tinta',          nome: 'Tinta',            match: (p) => ehTinta(p) },
        { id: 'descolorante',   nome: 'Descolorante',     match: (p) => ehDescolorante(p) },
        { id: 'oxigenada',      nome: 'Água Oxigenada',   match: (p) => ehOxigenada(p) }
    ],
    'alimentos': [
        { id: 'todas',      nome: 'Todos',      match: () => true },
        { id: 'balas',      nome: 'Balas',      match: (p) => ehBalas(p) },
        { id: 'chicletes',  nome: 'Chicletes',  match: (p) => ehChicletes(p) },
        { id: 'chocolates', nome: 'Chocolates', match: (p) => ehChocolates(p) }
    ]
};

// ========================================
// FUNÇÕES AUXILIARES DE DETECÇÃO
// ========================================

function textoTem(texto, palavras) {
    const t = String(texto || '').toLowerCase();
    return palavras.some(p => t.includes(p));
}

function ehShampoo(p)      { return textoTem(p.nome, ['shampoo', 'sh ']) || textoTem(p.tipo, ['shampoo']); }
function ehCondicionador(p){ return textoTem(p.nome, ['condicionador', 'cond ']) || textoTem(p.tipo, ['condicionador']); }
function ehCremePentear(p) { return textoTem(p.nome, ['creme de pentear', 'creme pentear', 'cr-']) || textoTem(p.tipo, ['creme de pentear', 'creme-pentear']); }
function ehMascara(p)      { return textoTem(p.nome, ['mascara', 'máscara']) && !textoTem(p.nome, ['mascara facial']); }
function ehCremeTratamento(p){ return textoTem(p.nome, ['creme de tratamento', 'tratamento']); }
function ehKit(p)          { return textoTem(p.nome, ['kit ']) || textoTem(p.categoria, ['kit']); }
function ehAtivador(p)     { return textoTem(p.nome, ['ativador']) || textoTem(p.categoria, ['ativador']); }
function ehOleo(p)         { return textoTem(p.nome, ['óleo', 'oleo', 'argan']); }
function ehTinta(p)        { return textoTem(p.nome, ['tinta', 'tintura']) || textoTem(p.tipo, ['tinta']); }
function ehDescolorante(p) { return textoTem(p.nome, ['descolorante', 'descoloração']); }
function ehOxigenada(p)    { return textoTem(p.nome, ['oxigenada', 'água oxigenada']); }

function ehSabonete(p)     { return textoTem(p.nome, ['sabonete']) || textoTem(p.categoria, ['sabonete']); }
function ehDesodorante(p)  { return textoTem(p.nome, ['desodorante', 'roll-on', 'roll on']) || textoTem(p.categoria, ['desodorante']); }
function ehFralda(p)       { return textoTem(p.nome, ['fralda']) || textoTem(p.categoria, ['fralda']); }
function ehIntimo(p)       { return textoTem(p.nome, ['absorvente', 'intimus', 'always']) || textoTem(p.categoria, ['intimo']); }
function ehTalco(p)        { return textoTem(p.nome, ['talco']); }
function ehHidratante(p)   { return textoTem(p.nome, ['hidratante', 'loção']); }
function ehFacial(p)       { return textoTem(p.nome, ['facial', 'rosto', 'micelar']) || textoTem(p.categoria, ['facial']); }
function ehLabial(p)       { return textoTem(p.nome, ['labial', 'lábios']); }
function ehAntiIdade(p)    { return textoTem(p.nome, ['anti-idade', 'antiidade', 'firmador']); }
function ehAparelhoBarbear(p){ return textoTem(p.nome, ['prestobarba', 'aparelho', 'barbeador', 'gillette', 'bic']) && !textoTem(p.nome, ['creme', 'gel']); }
function ehCremeBarbear(p) { return textoTem(p.nome, ['creme de barbear', 'espuma de barbear']); }
function ehPosBarba(p)     { return textoTem(p.nome, ['pós-barba', 'pos-barba', 'after shave']); }
function ehCabelo(p)       { return textoTem(p.nome, ['cabelo', 'shampoo', 'condicionador', 'creme']); }
function ehCorpo(p)        { return textoTem(p.nome, ['corpo', 'corporal', 'colônia', 'colonia']); }
function ehColonia(p)      { return textoTem(p.nome, ['colônia', 'colonia']); }
function ehBodySplash(p)   { return textoTem(p.nome, ['body splash', 'body-splash']); }
function ehPerfume(p)      { return textoTem(p.nome, ['perfume']); }
function ehBase(p)         { return textoTem(p.nome, ['base', 'bb cream']); }
function ehOlhos(p)        { return textoTem(p.nome, ['sombra', 'rímel', 'rimel', 'delineador']); }
function ehBoca(p)         { return textoTem(p.nome, ['batom', 'gloss', 'lip']); }
function ehBalas(p)        { return textoTem(p.nome, ['bala ']); }
function ehChicletes(p)    { return textoTem(p.nome, ['chiclete', 'trident', 'halls']); }
function ehChocolates(p)   { return textoTem(p.nome, ['chocolate', 'kinder', 'nutella', 'bis', 'lacta']); }

// ========================================
// RETORNA AS CATEGORIAS DE UM PRODUTO (ARRAY)
// ========================================

function getCategoriasProduto(produto) {
    // Se já foi categorizado (pelo produtos.js), usa
    if (produto.categorias && Array.isArray(produto.categorias) && produto.categorias.length > 0) {
        return produto.categorias;
    }
    // Fallback: tenta inferir na hora
    if (typeof obterCategoriasProduto === 'function') {
        return obterCategoriasProduto(produto);
    }
    // Fallback final
    if (produto.tipoPadrao && produto.tipoPadrao !== 'todos') {
        return [produto.tipoPadrao];
    }
    return [];
}

// ========================================
// RENDERIZAR SUB-CATEGORIAS
// ========================================

function renderizarSubcategorias() {
    const container = document.getElementById('subCategorias');
    const buttons = document.getElementById('subCategoriasButtons');
    const label = document.getElementById('subCategoriaLabel');

    if (!container || !buttons) return;

    // Se for "todos" ou "promocao", esconde as sub-categorias
    if (categoriaAtual === 'todos' || categoriaAtual === 'promocao') {
        container.style.display = 'none';
        subcategoriaAtual = 'todas';
        return;
    }

    const subcats = SUBCATEGORIAS[categoriaAtual];
    if (!subcats || subcats.length === 0) {
        container.style.display = 'none';
        subcategoriaAtual = 'todas';
        return;
    }

    // Filtra produtos que TÊM a categoria atual (pode ser múltipla)
    const produtosDaCategoria = produtosEnriquecidos.filter(p => {
        return getCategoriasProduto(p).includes(categoriaAtual);
    });

    // Calcula contagem de cada sub-categoria
    const contagens = subcats.map(sub => {
        if (sub.id === 'todas') {
            return produtosDaCategoria.length;
        }
        return produtosDaCategoria.filter(sub.match).length;
    });

    // Atualiza label
    if (label) {
        const nomeCategoria = CATEGORIAS_DISPONIVEIS[categoriaAtual] || categoriaAtual;
        label.textContent = `${nomeCategoria} - Filtrar por:`;
    }

    // Renderiza botões
    buttons.innerHTML = subcats.map((sub, i) => {
        const contagem = contagens[i];
        const ativo = subcategoriaAtual === sub.id ? 'active' : '';
        const desabilitado = contagem === 0 && sub.id !== 'todas' ? 'vazio' : '';

        return `
            <button class="btn-subcategoria ${ativo} ${desabilitado}"
                data-subcategoria="${sub.id}"
                ${contagem === 0 && sub.id !== 'todas' ? 'disabled' : ''}>
                ${sub.nome}
                <span class="contador">${contagem}</span>
            </button>
        `;
    }).join('');

    // Adiciona eventos
    buttons.querySelectorAll('.btn-subcategoria').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) return;

            const sub = this.dataset.subcategoria;
            subcategoriaAtual = sub;

            buttons.querySelectorAll('.btn-subcategoria').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            aplicarFiltros();
        });
    });

    container.style.display = 'flex';
}

// ========================================
// APLICAR FILTROS (AGORA COM MÚLTIPLAS CATEGORIAS)
// ========================================

function aplicarFiltros() {
    console.log('🔍 Aplicando filtros:', {
        categoria: categoriaAtual,
        subcategoria: subcategoriaAtual,
        marca: marcaAtual,
        linha: linhaAtual
    });

    if (!produtosEnriquecidos || produtosEnriquecidos.length === 0) {
        console.warn('⚠️ Nenhum produto disponível para filtrar');
        return;
    }

    produtosFiltrados = produtosEnriquecidos.filter(produto => {
        let tipoMatch;

        // 🔑 Lógica para múltiplas categorias
        if (categoriaAtual === 'promocao') {
            tipoMatch = produto.promocao === true;
        } else if (categoriaAtual === 'todos') {
            tipoMatch = true;
        } else {
            const categoriasProduto = getCategoriasProduto(produto);
            tipoMatch = categoriasProduto.includes(categoriaAtual);
        }

        // Sub-categoria
        let subMatch = true;
        if (subcategoriaAtual !== 'todas' && SUBCATEGORIAS[categoriaAtual]) {
            const sub = SUBCATEGORIAS[categoriaAtual].find(s => s.id === subcategoriaAtual);
            if (sub && sub.match) {
                subMatch = sub.match(produto);
            }
        }

        const marcaMatch = marcaAtual === 'todas' ||
            normalizarTexto(produto.marca) === normalizarTexto(marcaAtual);
        const linhaMatch = linhaAtual === 'todas' ||
            normalizarTexto(produto.linha || '') === normalizarTexto(linhaAtual);

        return tipoMatch && subMatch && marcaMatch && linhaMatch;
    });

    console.log(`📊 Resultado: ${produtosFiltrados.length} produtos encontrados`);

    paginaAtual = 1;
    mostrarPagina(true);
    atualizarFiltrosAtivos();

    const contador = document.getElementById('contador-produtos');
    if (contador) {
        const total = produtosFiltrados.length;
        contador.textContent = total > 0
            ? `Mostrando ${total} produto${total > 1 ? 's' : ''}`
            : 'Nenhum produto encontrado';
    }
}

// ========================================
// ATUALIZAR FILTROS ATIVOS (UI)
// ========================================

function atualizarFiltrosAtivos() {
    const container = document.getElementById('filtrosAtivos');
    if (!container) return;

    const ativos = [];

    if (categoriaAtual !== 'todos') {
        const nome = CATEGORIAS_DISPONIVEIS[categoriaAtual] || categoriaAtual;
        ativos.push(`<span class="ativo" data-filtro="categoria">${nome}</span>`);
    }

    if (subcategoriaAtual !== 'todas' && SUBCATEGORIAS[categoriaAtual]) {
        const sub = SUBCATEGORIAS[categoriaAtual].find(s => s.id === subcategoriaAtual);
        if (sub) {
            ativos.push(`<span class="ativo" data-filtro="subcategoria">${sub.nome}</span>`);
        }
    }

    if (marcaAtual !== 'todas') {
        const select = document.getElementById('marcaSelect');
        const option = select?.querySelector(`option[value="${marcaAtual}"]`);
        ativos.push(`<span class="ativo" data-filtro="marca">${option?.textContent || marcaAtual}</span>`);
    }

    if (linhaAtual !== 'todas') {
        const select = document.getElementById('linhaSelect');
        const option = select?.querySelector(`option[value="${linhaAtual}"]`);
        ativos.push(`<span class="ativo" data-filtro="linha">${option?.textContent || linhaAtual}</span>`);
    }

    if (ativos.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <span style="font-size:12px;color:var(--gray);margin-right:4px;">Filtros:</span>
        ${ativos.join(' ')}
        <button onclick="limparTodosFiltros()" style="
            background:none;border:none;color:var(--esgotado);font-size:12px;
            font-weight:700;cursor:pointer;padding:2px 8px;border-radius:12px;
            transition:background 0.2s;
        ">✕ Limpar</button>
    `;
}

// ========================================
// LIMPAR TODOS OS FILTROS
// ========================================

function limparTodosFiltros() {
    categoriaAtual = 'todos';
    subcategoriaAtual = 'todas';
    marcaAtual = 'todas';
    linhaAtual = 'todas';

    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.categoria === 'todos');
    });

    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) marcaSelect.value = 'todas';

    const linhaSelect = document.getElementById('linhaSelect');
    if (linhaSelect) linhaSelect.value = 'todas';

    const wrapperLinhas = document.getElementById('linhasWrapper');
    if (wrapperLinhas) wrapperLinhas.style.display = 'none';

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Esconde sub-categorias
    const subContainer = document.getElementById('subCategorias');
    if (subContainer) subContainer.style.display = 'none';

    aplicarFiltros();
    mostrarToast('🧹 Filtros limpos!');
}

// ========================================
// LINHAS POR MARCA
// ========================================

function obterLinhasPorMarca(marca) {
    const linhas = new Set();

    produtosEnriquecidos.forEach(produto => {
        if (normalizarTexto(produto.marca) === normalizarTexto(marca)) {
            if (produto.linha && produto.linha !== produto.marca) {
                linhas.add(produto.linha);
            }
        }
    });

    return Array.from(linhas).sort();
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS DE FILTRO
// ========================================

function configurarEventosFiltros() {
    console.log('⚙️ Configurando eventos de filtros...');

    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            categoriaAtual = this.getAttribute('data-categoria');
            subcategoriaAtual = 'todas';
            console.log(`📂 Categoria selecionada: ${categoriaAtual}`);

            if (typeof registrarFiltroCategoria === 'function') {
                registrarFiltroCategoria(categoriaAtual);
            }

            // Renderiza sub-categorias
            renderizarSubcategorias();
            aplicarFiltros();
        });
    });

    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function () {
            const valor = this.value;
            marcaAtual = valor;

            if (typeof registrarFiltroMarca === 'function') {
                registrarFiltroMarca(valor);
            }

            const linhasWrapper = document.getElementById('linhasWrapper');
            const linhaSelect = document.getElementById('linhaSelect');
            const linhas = obterLinhasPorMarca(valor);

            if (linhas.length > 0 && valor !== 'todas') {
                linhasWrapper.style.display = 'block';
                linhaSelect.innerHTML = '<option value="todas">Todas as Linhas</option>';

                linhas.forEach(linha => {
                    const option = document.createElement('option');
                    option.value = linha;
                    option.textContent = linha;
                    linhaSelect.appendChild(option);
                });

                linhaAtual = 'todas';
            } else {
                linhasWrapper.style.display = 'none';
                linhaAtual = 'todas';
            }

            aplicarFiltros();
        });
    }

    const linhaSelect = document.getElementById('linhaSelect');
    if (linhaSelect) {
        linhaSelect.addEventListener('change', function () {
            linhaAtual = this.value;
            aplicarFiltros();
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;

        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                const termo = this.value.trim();

                if (termo === '') {
                    aplicarFiltros();
                    return;
                }

                if (typeof registrarBusca === 'function') {
                    registrarBusca(termo);
                }

                const resultados = buscarProdutosInteligente(termo, produtosEnriquecidos);

                const sugestao = sugerirCorrecao(termo, produtosEnriquecidos);
                if (sugestao && sugestao !== normalizarTextoBusca(termo)) {
                    console.log(`💡 Sugestão: "${termo}" → "${sugestao}"`);
                    mostrarToast(`💡 Você quis dizer: "${sugestao}"?`);
                }

                produtosFiltrados = resultados;
                paginaAtual = 1;
                mostrarPagina(true);
                atualizarFiltrosAtivos();

                const contador = document.getElementById('contador-produtos');
                if (contador) {
                    const total = produtosFiltrados.length;
                    if (total === 0) {
                        contador.textContent = `🔍 Nenhum resultado para "${termo}"`;
                    } else {
                        contador.textContent = `🔍 ${total} resultado${total > 1 ? 's' : ''} para "${termo}"`;
                    }
                }
            }, 300);
        });
    }

    console.log('✅ Eventos de filtros configurados!');
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.categoriaAtual = categoriaAtual;
window.subcategoriaAtual = subcategoriaAtual;
window.marcaAtual = marcaAtual;
window.linhaAtual = linhaAtual;
window.aplicarFiltros = aplicarFiltros;
window.atualizarFiltrosAtivos = atualizarFiltrosAtivos;
window.limparTodosFiltros = limparTodosFiltros;
window.obterLinhasPorMarca = obterLinhasPorMarca;
window.configurarEventosFiltros = configurarEventosFiltros;
window.getCategoriasProduto = getCategoriasProduto;
window.renderizarSubcategorias = renderizarSubcategorias;
window.CATEGORIAS_DISPONIVEIS = CATEGORIAS_DISPONIVEIS;
window.SUBCATEGORIAS = SUBCATEGORIAS;

console.log('✅ Módulo de filtros (múltiplas categorias) carregado!');