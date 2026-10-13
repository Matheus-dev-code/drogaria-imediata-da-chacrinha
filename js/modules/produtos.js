// ========================================
// GERENCIAMENTO DE PRODUTOS - VERSÃO CORRIGIDA
// ========================================

var todosProdutos = [];
var produtosEnriquecidos = [];
var produtosFiltrados = [];

const PRODUTOS_POR_PAGINA = 12;
var paginaAtual = 1;

// 🚚 Regra do frete grátis
const VALOR_MINIMO_FRETE_GRATIS = 10.00;

// IDs de promoção
const idsPromocao = [101, 201, 301, 401, 501, 601, 701, 801, 901, 1001];

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
        { nome: 'Skala', dados: typeof produtosSkala !== 'undefined' ? produtosSkala : [] },
        { nome: 'Fofuras', dados: typeof produtosFofuras !== 'undefined' ? produtosFofuras : [] },
        { nome: 'Pantene', dados: typeof produtosPantene !== 'undefined' ? produtosPantene : [] },
        { nome: 'Koleston', dados: typeof produtosKoleston !== 'undefined' ? produtosKoleston : [] },
        { nome: 'Garnier', dados: typeof produtosGarnier !== 'undefined' ? produtosGarnier : [] },
        { nome: 'Alta Moda', dados: typeof produtosAltaModa !== 'undefined' ? produtosAltaModa : [] },
        { nome: 'Natucor', dados: typeof produtosNatucor !== 'undefined' ? produtosNatucor : [] },
        { nome: 'Probelle', dados: typeof produtosProbelle !== 'undefined' ? produtosProbelle : [] },
        { nome: 'Diana', dados: typeof produtosDiana !== 'undefined' ? produtosDiana : [] },
        { nome: 'Always', dados: typeof produtosAlways !== 'undefined' ? produtosAlways : [] },
        { nome: 'Intimus', dados: typeof produtosIntimus !== 'undefined' ? produtosIntimus : [] },
        { nome: 'Muriel Baby', dados: typeof produtosMurielBaby !== 'undefined' ? produtosMurielBaby : [] },
        { nome: 'Baruel Baby', dados: typeof produtosBaruelBaby !== 'undefined' ? produtosBaruelBaby : [] },
        { nome: 'Hard Hair', dados: typeof produtosHardHair !== 'undefined' ? produtosHardHair : [] },
        { nome: 'Ny.Looks', dados: typeof produtosNyLooks !== 'undefined' ? produtosNyLooks : [] },
        { nome: 'Bozzano', dados: typeof produtosBozzano !== 'undefined' ? produtosBozzano : [] },
        { nome: 'Gillette', dados: typeof produtosGillette !== 'undefined' ? produtosGillette : [] },
        { nome: 'BIC', dados: typeof produtosBic !== 'undefined' ? produtosBic : [] },
        { nome: 'Protex', dados: typeof produtosProtex !== 'undefined' ? produtosProtex : [] },
        { nome: 'Lux', dados: typeof produtosLux !== 'undefined' ? produtosLux : [] },
        { nome: 'Novex', dados: typeof produtosNovex !== 'undefined' ? produtosNovex : [] },
        { nome: 'Herbíssimo', dados: typeof produtosHerbissimo !== 'undefined' ? produtosHerbissimo : [] },



    ];

    arraysProdutos.forEach(item => {
        if (item.dados.length === 0) {
            console.warn(`⚠️ ${item.nome}: Nenhum produto carregado`);
        } else {
            console.log(`✅ ${item.nome}: ${item.dados.length} produtos`);
        }
    });

    todosProdutos = arraysProdutos.flatMap(item => item.dados);
    console.log(`📦 Total de produtos: ${todosProdutos.length}`);

    if (todosProdutos.length === 0) {
        console.error('❌ NENHUM produto foi carregado!');
        produtosEnriquecidos = [];
        produtosFiltrados = [];
        return [];
    }

    corrigirIdsDuplicados(todosProdutos);
    todosProdutos = padronizarCategorias(todosProdutos);

    const enriquecidos = enriquecerProdutos(todosProdutos);

    produtosEnriquecidos = enriquecidos;
    produtosFiltrados = [...enriquecidos];

    console.log(`✅ ${produtosEnriquecidos.length} produtos processados`);
    return produtosEnriquecidos;
}

// ========================================
// PADRONIZAR CATEGORIAS
// ========================================

function padronizarCategorias(produtos) {
    console.log('🔧 Padronizando categorias...');

    return produtos.map(produto => {
        if (!produto.categoria) {
            produto.categoria = produto.tipo || 'Geral';
        }

        if (produto.tipo) {
            const tipoLower = String(produto.tipo).toLowerCase();

            if (['cabelo', 'capilar', 'shampoo', 'condicionador', 'creme-pentear',
                'mascara', 'oleo', 'tonico', 'tinta', 'descolorante', 'tintas',
                'guanidina', 'creme relaxante', 'ativador de cachos', 'gelatina',
                'gel', 'kit'].includes(tipoLower)) {
                produto.tipoPadrao = 'cabelo';
            } else if (['kids', 'infantil'].includes(tipoLower) ||
                String(produto.marca || '').toLowerCase().includes('kids') ||
                String(produto.marca || '').toLowerCase().includes('baby')) {
                produto.tipoPadrao = 'kids';
            } else if (['corpo', 'corporal', 'desodorante', 'sabonete', 'creme-corpo',
                'hidratante', 'oleo corporal', 'colonia', 'body splash',
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
            } else if (['barba', 'pos-barba', 'creme-barbear', 'creme de barbear',
                'pos barba', 'pós-barba'].includes(tipoLower)) {
                produto.tipoPadrao = 'barba';
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
// CORREÇÃO DE IDs DUPLICADOS
// ========================================

function corrigirIdsDuplicados(produtos) {
    console.log('🔧 Verificando IDs duplicados...');

    const idsVistos = new Set();
    let contadorCorrecoes = 0;
    let contadorSemId = 0;
    let contadorDuplicados = 0;

    produtos.forEach((produto, index) => {
        if (!produto.id || produto.id === null || produto.id === undefined) {
            produto.id = 10000 + index;
            contadorSemId++;
            contadorCorrecoes++;
        } else if (idsVistos.has(produto.id)) {
            produto.id = 10000 + index;
            contadorDuplicados++;
            contadorCorrecoes++;
        }
        idsVistos.add(produto.id);
    });

    if (contadorCorrecoes > 0) {
        console.log(`✅ Correções: ${contadorSemId} sem ID, ${contadorDuplicados} duplicados`);
    } else {
        console.log('✅ Todos os IDs são únicos!');
    }

    return produtos;
}

// ========================================
// ENRIQUECIMENTO DE PRODUTOS (SEM AVALIAÇÃO)
// ========================================

function enriquecerProdutos(produtos) {
    return produtos.map(produto => {
        if (produto.promocao === undefined) {
            produto.promocao = idsPromocao.includes(produto.id);
        }

        produto.linha = produto.linha || produto.marca;

        if (!produto.categoria) {
            produto.categoria = produto.tipo || 'Geral';
        }
        if (!produto.tipoPadrao) {
            produto.tipoPadrao = 'todos';
        }

        // 🚚 Frete grátis acima de R$ 10
        const precoNumerico = typeof converterPreco === 'function'
            ? converterPreco(produto.preco)
            : 0;
        produto.temFreteGratis = precoNumerico > VALOR_MINIMO_FRETE_GRATIS;

        return produto;
    });
}

// ========================================
// RENDERIZAÇÃO
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

    if (!produtosFiltrados || produtosFiltrados.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--gray);">
                <i class="fas fa-search" style="font-size:48px;color:var(--border);margin-bottom:16px;display:block;"></i>
                <p style="font-size:18px;font-weight:600;margin-bottom:8px;">Nenhum produto encontrado</p>
                <p style="font-size:14px;">Tente ajustar os filtros ou buscar por outro termo</p>
                <button onclick="limparTodosFiltros()" style="
                    margin-top:16px;padding:10px 24px;background:var(--primary);color:white;
                    border:none;border-radius:25px;font-weight:600;cursor:pointer;
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
            try {
                const card = criarProdutoCard(produto);
                grid.appendChild(card);
                setTimeout(() => card.classList.add('visible'), 50);
            } catch (e) {
                console.error('❌ Erro ao criar card:', produto.nome, e);
            }
        }, index * 50);
    });

    atualizarPaginacao();
    if (typeof atualizarBotoesCarrinho === 'function') atualizarBotoesCarrinho();

    if (typeof atualizarIconesFavoritos === 'function') {
        setTimeout(atualizarIconesFavoritos, 100);
    }

    if (scrollParaProdutos) {
        setTimeout(() => {
            const searchContainer = document.querySelector('.search-wrapper');
            if (searchContainer && typeof scrollParaElemento === 'function') {
                scrollParaElemento(searchContainer);
            }
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

    // ========================================
    // IMAGEM
    // ========================================
    const imagemDiv = document.createElement('div');
    imagemDiv.className = 'produto-imagem';

    const img = document.createElement('img');
    img.src = produto.imagem || 'https://via.placeholder.com/400x400/FF69B4/FFFFFF?text=Sem+Imagem';
    img.alt = produto.nome || 'Produto';
    img.loading = 'lazy';
    img.onerror = function () {
        this.src = 'https://via.placeholder.com/400x400/FF69B4/FFFFFF?text=Sem+Imagem';
    };
    imagemDiv.appendChild(img);

    // ❤️ Botão de Favorito
    const btnFavorito = document.createElement('button');
    btnFavorito.className = 'btn-favorito';
    btnFavorito.dataset.id = produto.id;
    btnFavorito.title = 'Adicionar aos favoritos';

    const jaFavorito = typeof isFavorito === 'function' && isFavorito(produto.id);
    if (jaFavorito) {
        btnFavorito.classList.add('ativo');
        btnFavorito.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        btnFavorito.innerHTML = '<i class="far fa-heart"></i>';
    }

    btnFavorito.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof toggleFavorito === 'function') {
            toggleFavorito(produto.id);
        }
    });

    imagemDiv.appendChild(btnFavorito);

    // 📱 Botão de Compartilhar no card (canto superior esquerdo)
    const btnCompartilharImg = document.createElement('button');
    btnCompartilharImg.className = 'btn-compartilhar-img';
    btnCompartilharImg.title = 'Compartilhar no WhatsApp';
    btnCompartilharImg.innerHTML = '<i class="fab fa-whatsapp"></i>';
    btnCompartilharImg.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof compartilharProduto === 'function') {
            compartilharProduto(produto);
        }
    });
    imagemDiv.appendChild(btnCompartilharImg);

    if (produto.promocao) {
        const badge = document.createElement('div');
        badge.className = 'badge-promocao';
        badge.innerHTML = '<i class="fas fa-fire"></i> PROMOÇÃO';
        imagemDiv.appendChild(badge);
    }

    if (produto.esgotado) {
        const esgotadoBadge = document.createElement('div');
        esgotadoBadge.className = 'esgotado-badge-img';
        esgotadoBadge.textContent = 'ESGOTADO';
        imagemDiv.appendChild(esgotadoBadge);
    }

    if (typeof estaNoCarrinho === 'function' && estaNoCarrinho(produto.id)) {
        const badge = document.createElement('div');
        badge.className = 'no-carrinho-badge';
        badge.innerHTML = '<i class="fas fa-check"></i> No Carrinho';
        imagemDiv.appendChild(badge);
    }

    // ========================================
    // INFORMAÇÕES
    // ========================================
    const infoDiv = document.createElement('div');
    infoDiv.className = 'produto-info';

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'produto-tags';

    const marcaSpan = document.createElement('span');
    marcaSpan.className = 'produto-categoria';
    marcaSpan.textContent = produto.marca || '';

    const tipoSpan = document.createElement('span');
    tipoSpan.className = 'produto-tipo';
    if (produto.tipoPadrao === 'kids') tipoSpan.classList.add('kids-tag');
    tipoSpan.textContent = typeof formatarCategoria === 'function'
        ? formatarCategoria(produto.categoria)
        : produto.categoria || '';

    tagsDiv.appendChild(marcaSpan);
    tagsDiv.appendChild(tipoSpan);
    infoDiv.appendChild(tagsDiv);

    if (produto.linha && produto.linha !== produto.marca) {
        const linhaSpan = document.createElement('span');
        linhaSpan.className = 'produto-linha';
        linhaSpan.textContent = `📌 ${produto.linha}`;
        infoDiv.appendChild(linhaSpan);
    }

    infoDiv.innerHTML += `
        <h3 class="produto-nome">${produto.nome || ''}</h3>
        <p class="produto-descricao">${produto.descricao || ''}</p>
    `;

    // ========================================
    // 🔥 CONTADOR DE VISUALIZAÇÕES
    // ========================================
    if (!produto.esgotado && typeof obterVisualizacoes === 'function') {
        const views = obterVisualizacoes(produto.id);

        const viewsDiv = document.createElement('div');
        viewsDiv.className = 'produto-visualizacoes';
        viewsDiv.innerHTML = `🔥 <strong>${views}</strong> pessoas viram hoje`;
        infoDiv.appendChild(viewsDiv);

        if (typeof aumentarVisualizacao === 'function') {
            aumentarVisualizacao(produto.id);
        }
    }

    // ========================================
    // PREÇO
    // ========================================
    const precoDiv = document.createElement('p');
    precoDiv.className = 'produto-preco';

    if (produto.desconto && Number(produto.desconto) > 0) {
        const precoAntigo = produto.precoOriginal
            ? produto.precoOriginal
            : (typeof formatarPreco === 'function'
                ? formatarPreco(converterPreco(produto.preco) / (1 - produto.desconto / 100))
                : produto.preco);

        precoDiv.innerHTML = `
            ${produto.preco}
            <span class="preco-antigo">${precoAntigo}</span>
            <span class="selo-desconto">${produto.desconto}% OFF</span>
        `;
    } else if (produto.promocao) {
        const precoNum = converterPreco(produto.preco);
        const precoOriginal = precoNum * 1.2;
        const precoOriginalFmt = typeof formatarPreco === 'function'
            ? formatarPreco(precoOriginal)
            : precoOriginal.toFixed(2);
        precoDiv.innerHTML = `${produto.preco} <span class="preco-antigo">${precoOriginalFmt}</span>`;
    } else {
        precoDiv.textContent = produto.preco;
    }

    infoDiv.appendChild(precoDiv);

    // ========================================
    // FRETE GRÁTIS
    // ========================================
    const precoProduto = typeof converterPreco === 'function' ? converterPreco(produto.preco) : 0;
    const temFreteGratis = precoProduto > VALOR_MINIMO_FRETE_GRATIS;

    if (temFreteGratis) {
        const freteSpan = document.createElement('span');
        freteSpan.className = 'frete-gratis';
        freteSpan.innerHTML = '🚚 Frete Grátis';
        infoDiv.appendChild(freteSpan);
    }

    // ========================================
    // BOTÕES
    // ========================================

    if (produto.esgotado) {
        const btnWhatsapp = document.createElement('button');
        btnWhatsapp.className = 'btn-whatsapp';
        btnWhatsapp.innerHTML = '<i class="fab fa-whatsapp"></i> Verificar Disponibilidade';
        btnWhatsapp.dataset.nome = produto.nome;
        btnWhatsapp.dataset.marca = produto.marca;
        btnWhatsapp.dataset.preco = produto.preco;
        btnWhatsapp.addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof verificarDisponibilidade === 'function') {
                verificarDisponibilidade(produto.nome, produto.marca, produto.preco);
            }
        });
        infoDiv.appendChild(btnWhatsapp);

    } else {
        const btnCarrinho = document.createElement('button');
        btnCarrinho.className = 'btn-add-cart';
        btnCarrinho.dataset.id = produto.id;
        btnCarrinho.dataset.nome = produto.nome;
        btnCarrinho.dataset.marca = produto.marca;
        btnCarrinho.dataset.preco = produto.preco;

        if (typeof estaNoCarrinho === 'function' && estaNoCarrinho(produto.id)) {
            btnCarrinho.classList.add('in-cart');
            btnCarrinho.innerHTML = '<i class="fas fa-check"></i> No Carrinho';
            btnCarrinho.style.background = '#4CAF50';
        } else {
            btnCarrinho.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
        }

        btnCarrinho.addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof adicionarAoCarrinho === 'function') {
                adicionarAoCarrinho(produto);
            }
        });

        infoDiv.appendChild(btnCarrinho);
    }

    // 📱 Botão de Compartilhar (embaixo, texto)
    const btnCompartilhar = document.createElement('button');
    btnCompartilhar.className = 'btn-compartilhar';
    btnCompartilhar.innerHTML = '<i class="fab fa-whatsapp"></i> Compartilhar';
    btnCompartilhar.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof compartilharProduto === 'function') {
            compartilharProduto(produto);
        }
    });
    infoDiv.appendChild(btnCompartilhar);

    card.appendChild(imagemDiv);
    card.appendChild(infoDiv);

    return card;
}

// ========================================
// OBSERVAR CARDS (ADMIN)
// ========================================

function observarCards() {
    const observer = new MutationObserver(() => {
        if (typeof isAdmin !== 'undefined' && isAdmin) {
            if (typeof adicionarBotoesToggleEsgotado === 'function') {
                adicionarBotoesToggleEsgotado();
            }
        }
        if (typeof atualizarIconesFavoritos === 'function') {
            atualizarIconesFavoritos();
        }
    });

    const target = document.getElementById('produtosGrid');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
        console.log('👀 Observador de cards iniciado');
    }
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.carregarTodosProdutos = carregarTodosProdutos;
window.corrigirIdsDuplicados = corrigirIdsDuplicados;
window.padronizarCategorias = padronizarCategorias;
window.enriquecerProdutos = enriquecerProdutos;
window.renderizarProdutos = renderizarProdutos;
window.mostrarPagina = mostrarPagina;
window.mudarPagina = mudarPagina;
window.criarProdutoCard = criarProdutoCard;
window.observarCards = observarCards;
window.VALOR_MINIMO_FRETE_GRATIS = VALOR_MINIMO_FRETE_GRATIS;

console.log('✅ Módulo de produtos carregado com sucesso!');