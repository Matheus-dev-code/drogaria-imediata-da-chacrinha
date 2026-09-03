// ========================================
// SISTEMA DE FILTROS - VERSÃO CORRIGIDA
// ========================================

let categoriaAtual = 'todos';
let marcaAtual = 'todas';
let linhaAtual = 'todas';

// ========================================
// MAPEAMENTO DE CATEGORIAS - CORRIGIDO
// ========================================

const CATEGORIA_MAP = {
    // Produtos de cabelo
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
    'kit': 'cabelo',

    // Produtos kids
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

    // Produtos corporais (cremes, hidratantes, óleos corporais)
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

    // Higiene (sabonetes, fraldas, talcos, produtos íntimos)
    'higiene': 'higiene',
    'sabonete': 'higiene',
    'sabonete em barra': 'higiene',
    'sabonete liquido': 'higiene',
    'sabonete intimo': 'higiene',
    'fralda': 'higiene',
    'talco': 'higiene',
    'higiene pessoal': 'higiene',
    'intimo': 'higiene',

    // Pele / Facial
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

    // Perfumaria
    'perfumaria': 'perfumaria',
    'perfume': 'perfumaria',
    'colonias': 'perfumaria',
    'deo colonia': 'perfumaria',

    // Maquiagem
    'maquiagem': 'maquiagem',
    'make': 'maquiagem',
    'pre-make': 'maquiagem',
    'pos-make': 'maquiagem',
    'gloss': 'maquiagem',
    'primer': 'maquiagem',
    'fixador': 'maquiagem',
    'po facial': 'maquiagem',
    'bruma': 'maquiagem',

    // Tintas
    'tintas': 'tintas',
    'tinta': 'tintas',
    'descolorante': 'tintas',
    'agua oxigenada': 'tintas',
    'oxigenada': 'tintas',

    // ========== ALIMENTOS ==========
    'alimentos': 'alimentos',
    'biscoitos': 'alimentos',
    'balas': 'alimentos',
    'chicletes': 'alimentos',
    'doces': 'alimentos'
};

// ========================================
// FUNÇÃO PARA DETERMINAR A CATEGORIA DE UM PRODUTO
// ========================================

function getCategoriaProduto(produto) {
    // 1. Tenta usar o campo 'tipoPadrao' (definido em produtos.js)
    if (produto.tipoPadrao && produto.tipoPadrao !== 'todos') {
        return produto.tipoPadrao;
    }

    // 2. Tenta usar o campo 'categoria' do produto
    if (produto.categoria) {
        const categoriaLower = String(produto.categoria).toLowerCase().trim();
        
        // Verifica se é sabonete (prioridade)
        if (categoriaLower.includes('sabonete')) {
            return 'higiene';
        }
        
        for (const [key, value] of Object.entries(CATEGORIA_MAP)) {
            if (categoriaLower.includes(key) || key.includes(categoriaLower)) {
                return value;
            }
        }
    }

    // 3. Tenta usar o campo 'tipo'
    if (produto.tipo) {
        const tipoLower = String(produto.tipo).toLowerCase().trim();
        
        // Verifica se é sabonete (prioridade)
        if (tipoLower.includes('sabonete')) {
            return 'higiene';
        }
        
        for (const [key, value] of Object.entries(CATEGORIA_MAP)) {
            if (tipoLower.includes(key) || key.includes(tipoLower)) {
                return value;
            }
        }
    }

    // 4. Tenta usar a marca para inferir categoria (ex: produtos kids)
    if (produto.marca) {
        const marcaLower = String(produto.marca).toLowerCase();
        if (marcaLower.includes('kids') || marcaLower.includes('baby')) {
            return 'kids';
        }
    }

    // 5. Tenta pelo nome
    if (produto.nome) {
        const nomeLower = String(produto.nome).toLowerCase();
        
        // Prioridade para sabonetes
        if (nomeLower.includes('sabonete')) {
            return 'higiene';
        }
        
        if (nomeLower.includes('shampoo') || nomeLower.includes('condicionador') || 
            nomeLower.includes('creme de pentear') || nomeLower.includes('mascara') ||
            nomeLower.includes('oleo') || nomeLower.includes('tinta')) {
            return 'cabelo';
        }
        if (nomeLower.includes('fralda') || nomeLower.includes('talco')) {
            return 'higiene';
        }
        if (nomeLower.includes('desodorante') || nomeLower.includes('hidratante') || 
            nomeLower.includes('creme corporal')) {
            return 'corpo';
        }
    }

    // 6. Fallback: 'todos'
    return 'todos';
}

// ========================================
// CATEGORIAS DISPONÍVEIS
// ========================================

const CATEGORIAS_DISPONIVEIS = {
    'todos': 'Todos',
    'cabelo': 'Cabelos',
    'kids': 'Kids',
    'corpo': 'Corpo',
    'higiene': 'Higiene',
    'pele': 'Pele',
    'perfumaria': 'Perfumaria',
    'maquiagem': 'Maquiagem',
    'tintas': 'Tintas',
    'alimentos': 'Alimentos'
};

// ========================================
// APLICAÇÃO DE FILTROS
// ========================================

function aplicarFiltros() {
    console.log('🔍 Aplicando filtros:', {
        categoria: categoriaAtual,
        marca: marcaAtual,
        linha: linhaAtual
    });

    if (!produtosEnriquecidos || produtosEnriquecidos.length === 0) {
        console.warn('⚠️ Nenhum produto disponível para filtrar');
        return;
    }

    produtosFiltrados = produtosEnriquecidos.filter(produto => {
        const categoriaProduto = getCategoriaProduto(produto);
        const tipoMatch = categoriaAtual === 'todos' || categoriaProduto === categoriaAtual;
        const marcaMatch = marcaAtual === 'todas' || 
            normalizarTexto(produto.marca) === normalizarTexto(marcaAtual);
        const linhaMatch = linhaAtual === 'todas' || 
            normalizarTexto(produto.linha || '') === normalizarTexto(linhaAtual);

        return tipoMatch && marcaMatch && linhaMatch;
    });

    console.log(`📊 Resultado: ${produtosFiltrados.length} produtos encontrados`);

    paginaAtual = 1;
    mostrarPagina(true);
    atualizarFiltrosAtivos();
    
    const contador = document.getElementById('contador-produtos');
    if (contador) {
        const total = produtosFiltrados.length;
        contador.textContent = total > 0 ? `Mostrando ${total} produto${total > 1 ? 's' : ''}` : 'Nenhum produto encontrado';
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
            background:none;
            border:none;
            color:var(--esgotado);
            font-size:12px;
            font-weight:700;
            cursor:pointer;
            padding:2px 8px;
            border-radius:12px;
            transition:background 0.2s;
        ">✕ Limpar</button>
    `;
}

// ========================================
// LIMPAR TODOS OS FILTROS
// ========================================

function limparTodosFiltros() {
    categoriaAtual = 'todos';
    marcaAtual = 'todas';
    linhaAtual = 'todas';

    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.categoria === 'todos');
    });

    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) marcaSelect.value = 'todas';

    const linhaSelect = document.getElementById('linhaSelect');
    if (linhaSelect) linhaSelect.value = 'todas';

    document.getElementById('linhasWrapper').style.display = 'none';

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

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
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            categoriaAtual = this.getAttribute('data-categoria');
            console.log(`📂 Categoria selecionada: ${categoriaAtual}`);
            
            if (typeof registrarFiltroCategoria === 'function') {
                registrarFiltroCategoria(categoriaAtual);
            }
            
            aplicarFiltros();
        });
    });

    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function() {
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
        linhaSelect.addEventListener('change', function() {
            linhaAtual = this.value;
            aplicarFiltros();
        });
    }

    // ========================================
    // CONFIGURAÇÃO DA BUSCA INTELIGENTE
    // ========================================

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
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

                // ========== BUSCA INTELIGENTE ==========
                const resultados = buscarProdutosInteligente(termo, produtosEnriquecidos);
                
                // Verifica se há sugestão de correção
                const sugestao = sugerirCorrecao(termo, produtosEnriquecidos);
                if (sugestao && sugestao !== normalizarTextoBusca(termo)) {
                    console.log(`💡 Sugestão de correção: "${termo}" → "${sugestao}"`);
                    // Mostra sugestão (opcional)
                    mostrarToast(`💡 Você quis dizer: "${sugestao}"?`);
                }

                produtosFiltrados = resultados;
                paginaAtual = 1;
                mostrarPagina(true);
                atualizarFiltrosAtivos();
                
                // Mostra quantos resultados foram encontrados
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
window.marcaAtual = marcaAtual;
window.linhaAtual = linhaAtual;
window.aplicarFiltros = aplicarFiltros;
window.atualizarFiltrosAtivos = atualizarFiltrosAtivos;
window.limparTodosFiltros = limparTodosFiltros;
window.obterLinhasPorMarca = obterLinhasPorMarca;
window.configurarEventosFiltros = configurarEventosFiltros;
window.getCategoriaProduto = getCategoriaProduto;
window.CATEGORIAS_DISPONIVEIS = CATEGORIAS_DISPONIVEIS;

console.log('✅ Módulo de filtros carregado com sucesso!');