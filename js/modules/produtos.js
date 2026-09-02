// ========================================
// GERENCIAMENTO DE PRODUTOS - VERSÃO CORRIGIDA
// ========================================

let todosProdutos = [];
let produtosEnriquecidos = [];
let produtosFiltrados = [];

const PRODUTOS_POR_PAGINA = 12;
let paginaAtual = 1;

// IDs de promoção e avaliação
const idsPromocao = [101, 201, 301, 401, 501, 601, 701, 801, 901, 1001];
const idsAvaliacao = {
    101: 4.8, 201: 4.7, 301: 4.6, 401: 4.9, 501: 4.5,
    601: 4.4, 701: 4.3, 801: 4.7, 901: 4.6, 1001: 4.8
};

// ========================================
// CARREGAMENTO DE PRODUTOS
// ========================================

function carregarTodosProdutos() {
    console.log('🔄 Carregando produtos...');
    
    const arraysProdutos = [
        { nome: 'Salon Line Kids', dados: typeof produtosSalonLineKids !== 'undefined' ? produtosSalonLineKids : [] },
        { nome: 'Salon Line Adulto', dados: typeof produtosSalonLineAdulto !== 'undefined' ? produtosSalonLineAdulto : [] },
        { nome: 'Seda', dados: typeof produtosSeda !== 'undefined' ? produtosSeda : [] },
        { nome: 'Loreal', dados: typeof produtosLoreal !== 'undefined' ? produtosLoreal : [] },
        { nome: 'Paixão', dados: typeof produtosPaixao !== 'undefined' ? produtosPaixao : [] },
        { nome: 'Maxton', dados: typeof produtosMaxton !== 'undefined' ? produtosMaxton : [] },
        { nome: 'Coreton', dados: typeof produtosCoreton !== 'undefined' ? produtosCoreton : [] },
        { nome: 'Dove', dados: typeof produtosDove !== 'undefined' ? produtosDove : [] },
        { nome: 'Nivea', dados: typeof produtosNivea !== 'undefined' ? produtosNivea : [] },
        { nome: 'Muriel', dados: typeof produtosMuriel !== 'undefined' ? produtosMuriel : [] },
        { nome: 'Acnezil', dados: typeof produtosAcnezil !== 'undefined' ? produtosAcnezil : [] },
        { nome: 'Asepxia', dados: typeof produtosAsepxia !== 'undefined' ? produtosAsepxia : [] },
        { nome: 'Bepantriz', dados: typeof produtosBepantriz !== 'undefined' ? produtosBepantriz : [] },
        { nome: 'Bepantol', dados: typeof produtosBepantol !== 'undefined' ? produtosBepantol : [] },
        { nome: 'Cicatricure', dados: typeof produtosCicatricure !== 'undefined' ? produtosCicatricure : [] },
        { nome: 'Face Beautiful', dados: typeof produtosFacebeautiful !== 'undefined' ? produtosFacebeautiful : [] },
        { nome: 'Rexona', dados: typeof produtosRexona !== 'undefined' ? produtosRexona : [] },
        { nome: 'Babysec', dados: typeof produtosBabysec !== 'undefined' ? produtosBabysec : [] },
        { nome: 'Monange', dados: typeof produtosMonange !== 'undefined' ? produtosMonange : [] },
        { nome: 'Giovanna Baby', dados: typeof produtosGiovannababy !== 'undefined' ? produtosGiovannababy : [] },
        { nome: 'Marcia', dados: typeof produtosMarcia !== 'undefined' ? produtosMarcia : [] },
        { nome: 'Natuhair', dados: typeof produtosNatuhair !== 'undefined' ? produtosNatuhair : [] },
        { nome: 'Granado', dados: typeof produtosGranado !== 'undefined' ? produtosGranado : [] },
        // ========== NOVO ==========
        { nome: 'Fofuras', dados: typeof produtosFofuras !== 'undefined' ? produtosFofuras : [] }
    ];

    // Mostra diagnóstico de carregamento
    let totalCarregado = 0;
    arraysProdutos.forEach(item => {
        if (item.dados.length === 0) {
            console.warn(`⚠️ ${item.nome}: Nenhum produto carregado`);
        } else {
            console.log(`✅ ${item.nome}: ${item.dados.length} produtos`);
            totalCarregado += item.dados.length;
        }
    });

    // Junta todos os produtos em um único array
    todosProdutos = arraysProdutos
        .map(item => item.dados)
        .flat();

    console.log(`📦 Total de produtos carregados: ${todosProdutos.length}`);

    // 🔧 CORRIGE IDs DUPLICADOS AUTOMATICAMENTE
    corrigirIdsDuplicados(todosProdutos);

    // 🔧 CORRIGE CATEGORIAS DOS PRODUTOS
    todosProdutos = padronizarCategorias(todosProdutos);

    // Enriquece os produtos (adiciona avaliação, promoção, etc)
    const produtosEnriquecidosArray = enriquecerProdutos(todosProdutos);
    
    console.log(`✅ Produtos processados com sucesso!`);
    
    return produtosEnriquecidosArray;
}

// ========================================
// PADRONIZAR CATEGORIAS DOS PRODUTOS
// ========================================

function padronizarCategorias(produtos) {
    console.log('🔧 Padronizando categorias dos produtos...');
    
    return produtos.map(produto => {
        // Garante que os campos existam
        if (!produto.categoria) {
            produto.categoria = produto.tipo || 'Geral';
        }
        
        // Padroniza o campo 'tipo' para categorias de filtro
        if (produto.tipo) {
            const tipoLower = String(produto.tipo).toLowerCase();
            
            // Mapeia para categorias padronizadas
            if (['cabelo', 'capilar', 'shampoo', 'condicionador', 'creme-pentear', 
                 'mascara', 'oleo', 'tonico', 'tinta', 'descolorante', 'tintas',
                 'guanidina', 'creme relaxante', 'ativador de cachos', 'gelatina',
                 'kit'].includes(tipoLower)) {
                produto.tipoPadrao = 'cabelo';
            } else if (['kids', 'infantil'].includes(tipoLower) || 
                       String(produto.marca).toLowerCase().includes('kids') ||
                       String(produto.marca).toLowerCase().includes('baby')) {
                produto.tipoPadrao = 'kids';
            } else if (['corpo', 'corporal', 'desodorante', 'sabonete', 'creme-corpo',
                       'hidratante', 'oleo corporal', 'colonia', 'body splash',
                       'desodorante', 'sabonete liquido', 'sabonete em barra',
                       'oleo de banho'].includes(tipoLower)) {
                produto.tipoPadrao = 'corpo';
            } else if (['higiene', 'fralda', 'talco', 'sabonete intimo', 'intimo',
                       'higiene pessoal'].includes(tipoLower)) {
                produto.tipoPadrao = 'higiene';
            } else if (['pele', 'facial', 'rosto', 'labial', 'tratamento facial', 
                       'creme facial', 'gel de limpeza', 'agua micelar',
                       'demaquilante', 'serum facial', 'mascara facial',
                       'protetor labial'].includes(tipoLower)) {
                produto.tipoPadrao = 'pele';
            } else if (['perfumaria', 'perfume', 'colonias', 'deo colonia',
                       'body splash', 'colonia'].includes(tipoLower)) {
                produto.tipoPadrao = 'perfumaria';
            } else if (['maquiagem', 'make', 'pre-make', 'pos-make', 'gloss',
                       'primer', 'fixador', 'po facial', 'bruma'].includes(tipoLower)) {
                produto.tipoPadrao = 'maquiagem';
            } else if (['tintas', 'tinta', 'descolorante', 'agua oxigenada',
                       'oxigenada'].includes(tipoLower)) {
                produto.tipoPadrao = 'tintas';
            } else if (['alimentos', 'biscoitos', 'balas', 'chicletes', 'doces'].includes(tipoLower)) {
                produto.tipoPadrao = 'alimentos';
            } else {
                produto.tipoPadrao = 'todos';
            }
        } else {
            produto.tipoPadrao = 'todos';
        }

        return produto;
    });
}

// ========================================
// CORREÇÃO AUTOMÁTICA DE IDs DUPLICADOS
// ========================================

function corrigirIdsDuplicados(produtos) {
    console.log('🔧 Verificando IDs duplicados...');
    
    const idsVistos = new Set();
    let contadorCorrecoes = 0;
    let contadorSemId = 0;
    let contadorDuplicados = 0;
    
    produtos.forEach((produto, index) => {
        // Verifica se o ID é inválido
        if (!produto.id || produto.id === null || produto.id === undefined) {
            produto.id = 10000 + index;
            contadorSemId++;
            contadorCorrecoes++;
        }
        // Verifica se o ID já foi usado
        else if (idsVistos.has(produto.id)) {
            produto.id = 10000 + index;
            contadorDuplicados++;
            contadorCorrecoes++;
        }
        
        idsVistos.add(produto.id);
    });
    
    if (contadorCorrecoes > 0) {
        console.log(`✅ Correções realizadas:`);
        if (contadorSemId > 0) console.log(`   - ${contadorSemId} produtos sem ID`);
        if (contadorDuplicados > 0) console.log(`   - ${contadorDuplicados} IDs duplicados`);
        console.log(`   - Total: ${contadorCorrecoes} correções`);
    } else {
        console.log('✅ Todos os IDs são únicos!');
    }
    
    return produtos;
}

// ========================================
// ENRIQUECIMENTO DE PRODUTOS
// ========================================

function enriquecerProdutos(produtos) {
    return produtos.map(produto => {
        // Adiciona flag de promoção
        produto.promocao = idsPromocao.includes(produto.id);

        // Adiciona avaliação
        if (idsAvaliacao[produto.id]) {
            produto.avaliacao = idsAvaliacao[produto.id];
        } else {
            produto.avaliacao = Math.round((4.0 + Math.random() * 0.9) * 10) / 10;
            if (produto.avaliacao > 4.9) {
                produto.avaliacao = 4.9;
            }
        }

        // Adiciona total de avaliações
        produto.totalAvaliacoes = Math.floor(50 + Math.random() * 200);

        // Garante que tenha linha
        produto.linha = produto.linha || produto.marca;

        // Garante que tenha uma categoria padrão
        if (!produto.categoria) {
            produto.categoria = produto.tipo || 'Geral';
        }

        // Garante tipoPadrao
        if (!produto.tipoPadrao) {
            produto.tipoPadrao = 'todos';
        }

        return produto;
    });
}

// ========================================
// RENDERIZAÇÃO DE PRODUTOS
// ========================================

function renderizarProdutos(produtosArray) {
    produtosFiltrados = [...produtosArray];
    paginaAtual = 1;
    mostrarPagina(false);
}

function mostrarPagina(scrollParaProdutos = false) {
    const grid = document.getElementById('produtosGrid');
    const contador = document.getElementById('contador-produtos');

    if (!grid) {
        console.error('❌ Grid de produtos não encontrado');
        return;
    }

    grid.innerHTML = '';

    if (produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px 20px;
                color:var(--gray);
            ">
                <i class="fas fa-search" style="font-size:48px;color:var(--border);margin-bottom:16px;display:block;"></i>
                <p style="font-size:18px;font-weight:600;margin-bottom:8px;">Nenhum produto encontrado</p>
                <p style="font-size:14px;">Tente ajustar os filtros ou buscar por outro termo</p>
                <button onclick="limparTodosFiltros()" style="
                    margin-top:16px;
                    padding:10px 24px;
                    background:var(--primary);
                    color:white;
                    border:none;
                    border-radius:25px;
                    font-weight:600;
                    cursor:pointer;
                ">Limpar filtros</button>
            </div>
        `;
        if (contador) contador.textContent = 'Nenhum produto encontrado';
        return;
    }

    const total = produtosFiltrados.length;
    if (contador) {
        contador.textContent = `Mostrando ${total} produto${total > 1 ? 's' : ''}`;
    }

    const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
    const fim = inicio + PRODUTOS_POR_PAGINA;
    const produtosPagina = produtosFiltrados.slice(inicio, fim);

    produtosPagina.forEach((produto, index) => {
        setTimeout(() => {
            const card = criarProdutoCard(produto);
            grid.appendChild(card);
            setTimeout(() => card.classList.add('visible'), 50);
        }, index * 50);
    });

    atualizarPaginacao();
    atualizarBotoesCarrinho();

    if (scrollParaProdutos) {
        setTimeout(() => {
            const searchContainer = document.querySelector('.search-wrapper');
            if (searchContainer) scrollParaElemento(searchContainer);
        }, 100);
    }
}

function mudarPagina(pagina) {
    paginaAtual = pagina;
    mostrarPagina(true);
}

function atualizarPaginacao() {
    const container = document.querySelector('.produtos .container');
    if (!container) return;

    let paginacaoDiv = document.getElementById('paginacao');
    if (!paginacaoDiv) {
        paginacaoDiv = document.createElement('div');
        paginacaoDiv.id = 'paginacao';
        paginacaoDiv.className = 'paginacao';
        container.appendChild(paginacaoDiv);
    }

    const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
    
    if (totalPaginas <= 1) {
        paginacaoDiv.style.display = 'none';
        return;
    }

    paginacaoDiv.style.display = 'flex';
    
    let html = `
        <button class="btn-pagina" ${paginaAtual === 1 ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
            html += `<button class="btn-pagina ${i === paginaAtual ? 'active' : ''}" onclick="mudarPagina(${i})">${i}</button>`;
        } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
            html += '<span class="btn-pagina pontos">...</span>';
        }
    }

    html += `
        <button class="btn-pagina" ${paginaAtual === totalPaginas ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
        <span class="info-pagina">Página ${paginaAtual} de ${totalPaginas}</span>
    `;

    paginacaoDiv.innerHTML = html;
}

// ========================================
// CRIAÇÃO DE CARDS
// ========================================

function criarProdutoCard(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';

    if (produto.destaque) card.classList.add('destaque');
    if (produto.esgotado) card.classList.add('esgotado');
    if (produto.promocao) card.classList.add('promocao');

    card.setAttribute('data-id', produto.id);
    card.setAttribute('data-marca', String(produto.marca || '').toLowerCase());
    card.setAttribute('data-linha', String(produto.linha || '').toLowerCase());
    card.setAttribute('data-categoria', produto.tipoPadrao || 'todos');

    // Imagem
    const imagemDiv = document.createElement('div');
    imagemDiv.className = 'produto-imagem';
    
    const img = document.createElement('img');
    img.src = produto.imagem;
    img.alt = produto.nome;
    img.loading = 'lazy';
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/400x400/FF69B4/FFFFFF?text=Sem+Imagem';
    };
    imagemDiv.appendChild(img);

    // Badge de promoção
    if (produto.promocao) {
        const badge = document.createElement('div');
        badge.className = 'badge-promocao';
        badge.innerHTML = '<i class="fas fa-fire"></i> PROMOÇÃO';
        imagemDiv.appendChild(badge);
    }

    // Badge de esgotado
    if (produto.esgotado) {
        const esgotadoBadge = document.createElement('div');
        esgotadoBadge.className = 'esgotado-badge-img';
        esgotadoBadge.textContent = 'ESGOTADO';
        imagemDiv.appendChild(esgotadoBadge);
    }

    // Badge de no carrinho
    if (window.estaNoCarrinho && estaNoCarrinho(produto.id)) {
        const badge = document.createElement('div');
        badge.className = 'no-carrinho-badge';
        badge.innerHTML = '<i class="fas fa-check"></i> No Carrinho';
        imagemDiv.appendChild(badge);
    }

    // Informações
    const infoDiv = document.createElement('div');
    infoDiv.className = 'produto-info';

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'produto-tags';
    
    const marcaSpan = document.createElement('span');
    marcaSpan.className = 'produto-categoria';
    marcaSpan.textContent = produto.marca;
    
    const tipoSpan = document.createElement('span');
    tipoSpan.className = 'produto-tipo';
    if (produto.tipoPadrao === 'kids') tipoSpan.classList.add('kids-tag');
    tipoSpan.textContent = formatarCategoria(produto.categoria);
    
    tagsDiv.appendChild(marcaSpan);
    tagsDiv.appendChild(tipoSpan);
    infoDiv.appendChild(tagsDiv);

    // Linha do produto (se existir)
    if (produto.linha && produto.linha !== produto.marca) {
        const linhaSpan = document.createElement('span');
        linhaSpan.className = 'produto-linha';
        linhaSpan.textContent = `📌 ${produto.linha}`;
        infoDiv.appendChild(linhaSpan);
    }

    // Nome e descrição
    infoDiv.innerHTML += `
        <h3 class="produto-nome">${produto.nome}</h3>
        <p class="produto-descricao">${produto.descricao}</p>
        <div class="produto-avaliacao">
            <div class="estrelas">${renderizarEstrelas(produto.avaliacao)}</div>
            <span class="avaliacao-numero">${Number(produto.avaliacao).toFixed(1)}</span>
            <span class="avaliacao-total">(${produto.totalAvaliacoes})</span>
        </div>
    `;

    // Preço
    const precoDiv = document.createElement('p');
    precoDiv.className = 'produto-preco';
    
    if (produto.promocao) {
        const precoNum = converterPreco(produto.preco);
        const precoOriginal = precoNum * 1.2;
        precoDiv.innerHTML = `${produto.preco} <span class="preco-antigo">${formatarPreco(precoOriginal)}</span>`;
    } else {
        precoDiv.textContent = produto.preco;
    }
    
    infoDiv.appendChild(precoDiv);

    // Frete grátis
    const precosFreteGratis = ['8.90', '12.99', '13.99', '14.99', '15.99', '16.99', '17.99'];
    const precoProduto = converterPreco(produto.preco);
    const temFreteGratis = precosFreteGratis.some(p => Math.abs(parseFloat(p) - precoProduto) < 0.01);

    if (temFreteGratis) {
        const freteSpan = document.createElement('span');
        freteSpan.className = 'frete-gratis';
        freteSpan.textContent = 'Frete Grátis';
        infoDiv.appendChild(freteSpan);
    }

    // Botão WhatsApp
    const btnWhatsapp = document.createElement('button');
    btnWhatsapp.className = 'btn-whatsapp';
    btnWhatsapp.innerHTML = '<i class="fab fa-whatsapp"></i> Verificar Disponibilidade';
    btnWhatsapp.addEventListener('click', () => verificarDisponibilidade(produto.nome, produto.marca, produto.preco));
    infoDiv.appendChild(btnWhatsapp);

    // Botão Adicionar ao Carrinho
    if (!produto.esgotado) {
        const btnCarrinho = document.createElement('button');
        btnCarrinho.className = 'btn-add-cart';
        btnCarrinho.dataset.id = produto.id;
        
        if (window.estaNoCarrinho && estaNoCarrinho(produto.id)) {
            btnCarrinho.classList.add('in-cart');
            btnCarrinho.innerHTML = '<i class="fas fa-check"></i> No Carrinho';
            btnCarrinho.style.background = '#4CAF50';
        } else {
            btnCarrinho.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
        }
        
        btnCarrinho.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof adicionarAoCarrinho === 'function') {
                adicionarAoCarrinho(produto);
            }
        });
        
        infoDiv.appendChild(btnCarrinho);
    }

    card.appendChild(imagemDiv);
    card.appendChild(infoDiv);

    return card;
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

window.carregarTodosProdutos = carregarTodosProdutos;
window.corrigirIdsDuplicados = corrigirIdsDuplicados;
window.padronizarCategorias = padronizarCategorias;
window.renderizarProdutos = renderizarProdutos;
window.mostrarPagina = mostrarPagina;
window.mudarPagina = mudarPagina;
window.criarProdutoCard = criarProdutoCard;
window.observarCards = observarCards;

console.log('✅ Módulo de produtos carregado com sucesso!');

// ========================================
// FUNÇÃO PARA OBSERVAR CARDS (ADMIN)
// ========================================

function observarCards() {
    const observer = new MutationObserver(() => {
        if (typeof isAdmin !== 'undefined' && isAdmin) {
            if (typeof adicionarBotoesToggleEsgotado === 'function') {
                adicionarBotoesToggleEsgotado();
            }
        }
    });

    const target = document.getElementById('produtosGrid');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
        console.log('👀 Observador de cards iniciado');
    }
}