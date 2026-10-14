// ========================================
// ARQUIVO PRINCIPAL - COORDENA TUDO
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicação...');

    // ========================================
    // 1. CARREGA TODOS OS PRODUTOS
    // ========================================
    try {
        produtosEnriquecidos = carregarTodosProdutos();
        console.log('📦 Total de produtos carregados:', produtosEnriquecidos.length);

        if (typeof inicializarVisualizacoes === 'function') {
            inicializarVisualizacoes(produtosEnriquecidos);
        }
    } catch (e) {
        console.error('❌ Erro ao carregar produtos:', e);
        produtosEnriquecidos = [];
    }

    if (!Array.isArray(produtosEnriquecidos) || produtosEnriquecidos.length === 0) {
        console.error('❌ Nenhum produto carregado — abortando renderização');
        const grid = document.getElementById('produtosGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--gray);">
                    <i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--esgotado);margin-bottom:16px;display:block;"></i>
                    <p style="font-size:18px;font-weight:600;">Nenhum produto disponível</p>
                    <p style="font-size:14px;">Verifique o console (F12) para mais detalhes.</p>
                </div>
            `;
        }
        return;
    }

    // ========================================
    // 2. CARREGA O CARRINHO
    // ========================================
    try {
        carregarCarrinho();
    } catch (e) {
        console.error('❌ Erro ao carregar carrinho:', e);
    }

    // ========================================
    // 2.1. CARREGA OS FAVORITOS
    // ========================================
    try {
        if (typeof carregarFavoritos === 'function') {
            carregarFavoritos();
        }
    } catch (e) {
        console.warn('⚠️ Erro ao carregar favoritos:', e);
    }

    // ========================================
    // 3. VERIFICA ADMIN
    // ========================================
    try {
        await verificarAdmin();
    } catch (e) {
        console.warn('⚠️ Erro ao verificar admin:', e);
        window.isAdmin = false;
    }

    // ========================================
    // 4. CONFIGURA ACESSO ESCONDIDO AO ADMIN
    // ========================================
    try {
        configurarAcessoAdminEscondido();
    } catch (e) {
        console.warn('⚠️ Erro ao configurar acesso admin escondido:', e);
    }

    // ========================================
    // 5. CONFIGURA INTERFACE
    // ========================================
    const configs = [
        ['configurarEventosFiltros',   () => typeof configurarEventosFiltros   === 'function' && configurarEventosFiltros()],
        ['configurarEventosDestaques', () => typeof configurarEventosDestaques === 'function' && configurarEventosDestaques()],
        ['configurarMenuMobile',       () => typeof configurarMenuMobile       === 'function' && configurarMenuMobile()],
        ['configurarBotaoTopo',        () => typeof configurarBotaoTopo        === 'function' && configurarBotaoTopo()],
        ['configurarSmoothScroll',     () => typeof configurarSmoothScroll     === 'function' && configurarSmoothScroll()],
        ['configurarEventosCarrinho',  () => typeof configurarEventosCarrinho  === 'function' && configurarEventosCarrinho()],
        ['configurarHeaderSearch',     () => typeof configurarHeaderSearch     === 'function' && configurarHeaderSearch()],
        ['configurarBotaoFavoritos',   () => typeof configurarBotaoFavoritos   === 'function' && configurarBotaoFavoritos()]
    ];

    configs.forEach(([nome, fn]) => {
        try { fn(); } catch (e) { console.warn(`⚠️ Erro em ${nome}:`, e); }
    });

    // ========================================
    // 6. SINCRONIZA SELECT DE MARCAS
    // ========================================
    const selectMarca = document.getElementById('marcaSelect');
    if (selectMarca) selectMarca.value = 'todas';

    // ========================================
    // 7. RENDERIZA PRODUTOS IMEDIATAMENTE
    // ========================================
    try {
        produtosFiltrados = [...produtosEnriquecidos];
        renderizarProdutos(produtosEnriquecidos);
        renderizarDestaques(produtosEnriquecidos);
        console.log('✅ Produtos renderizados (local)');

        if (typeof atualizarIconesFavoritos === 'function') {
            atualizarIconesFavoritos();
        }
    } catch (e) {
        console.error('❌ Erro ao renderizar produtos:', e);
    }

    // ========================================
    // 8. CARREGA ESTOQUE
    // ========================================
    try {
        await carregarEstoqueFirebase();
        console.log('✅ Estoque carregado');
    } catch (error) {
        console.error('❌ Erro ao carregar estoque:', error);
        try { carregarEstoqueLocal(); } catch (e2) { console.error('❌ Fallback falhou:', e2); }
    }

    // ========================================
    // 9. CORREÇÃO DE EMERGÊNCIA (IDs determinísticos)
    // ========================================
    setTimeout(() => {
        try { forcarCorrecaoIds(); }
        catch (e) { console.warn('⚠️ Erro em forcarCorrecaoIds:', e); }
    }, 500);

    // ========================================
    // 10. ATUALIZA INTERFACE
    // ========================================
    setTimeout(() => {
        try {
            atualizarBotoesCarrinho();
            initScrollReveal();
            habilitarScrollHorizontal('.categoria-buttons');
            habilitarScrollHorizontal('.marca-buttons');

            if (typeof atualizarIconesFavoritos === 'function') {
                atualizarIconesFavoritos();
            }

            if (window.isAdmin) {
                adicionarBotoesToggleEsgotado();
            }
            console.log('✅ Interface atualizada');
        } catch (e) {
            console.warn('⚠️ Erro ao atualizar interface:', e);
        }
    }, 800);

    // ========================================
    // 11. HEADER COM SCROLL
    // ========================================
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    });

    // ========================================
    // 12. ANO NO FOOTER
    // ========================================
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
    }

    // ========================================
    // 13. LOGO
    // ========================================
    try { configurarLogo(); } catch (e) { console.warn('⚠️ Erro logo:', e); }

    // ========================================
    // 14. OBSERVA CARDS (ADMIN)
    // ========================================
    try { observarCards(); } catch (e) { console.warn('⚠️ Erro observer:', e); }

    // ========================================
    // 15. BANNERS
    // ========================================
    setTimeout(() => {
        try {
            if (typeof renderizarBanners === 'function') {
                renderizarBanners();
                console.log('🎨 Banners renderizados');
            }
        } catch (e) { console.warn('⚠️ Erro banners:', e); }
    }, 300);

    // ========================================
    // 16. PROMOÇÕES
    // ========================================
    setTimeout(() => {
        try {
            if (typeof renderizarPromocoes === 'function') {
                renderizarPromocoes();
                console.log('🔥 Promoções renderizadas');
            }
        } catch (e) { console.warn('⚠️ Erro promoções:', e); }
    }, 350);

    // ========================================
    // 17. SERVICE WORKER (PWA)
    // ========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((reg) => {
                    console.log('✅ PWA Service Worker registrado:', reg.scope);
                })
                .catch((err) => {
                    console.warn('⚠️ Falha ao registrar Service Worker:', err);
                });
        });
    }

    // ========================================
    // 18. 🔗 ABRIR PRODUTO VIA LINK COMPARTILHADO (?p=ID)
    // ========================================
    setTimeout(() => {
        try {
            if (typeof abrirProdutoPorLink === 'function') {
                abrirProdutoPorLink();
            }
        } catch (e) {
            console.warn('⚠️ Erro ao abrir produto por link:', e);
        }
    }, 1200);

    console.log('✅ Sistema carregado com sucesso!');
});

// ========================================
// CORREÇÃO DE EMERGÊNCIA - IDs DUPLICADOS
// ✅ IDs DETERMINÍSTICOS (não mudam ao recarregar)
// ========================================

function forcarCorrecaoIds() {
    console.log('🔄 Forçando correção de IDs duplicados...');

    const lista = (typeof produtosEnriquecidos !== 'undefined' && produtosEnriquecidos.length)
        ? produtosEnriquecidos
        : (typeof todosProdutos !== 'undefined' ? todosProdutos : null);

    if (!lista || lista.length === 0) {
        console.warn('⚠️ Nenhum produto carregado');
        return;
    }

    const idsVistos = new Set();
    let corrigidos = 0;

    lista.forEach((produto, index) => {
        const idAtual = produto.id;

        // Verifica se é inválido OU duplicado
        if (!idAtual || idsVistos.has(idAtual)) {
            // 🔑 Gera ID determinístico (mesmo produto = mesmo ID sempre)
            const base = String(produto.nome || '') + '|' + String(produto.marca || '') + '|' + index;
            let hash = 0;
            for (let i = 0; i < base.length; i++) {
                hash = ((hash << 5) - hash) + base.charCodeAt(i);
                hash |= 0;
            }
            produto.id = Math.abs(hash) + 100000;
            corrigidos++;
        }

        idsVistos.add(produto.id);
    });

    console.log(`✅ ${corrigidos} IDs corrigidos (determinísticos)`);

    if (typeof enriquecerProdutos === 'function') {
        produtosEnriquecidos = enriquecerProdutos(lista);
    }
    produtosFiltrados = [...produtosEnriquecidos];

    if (typeof renderizarProdutos === 'function') renderizarProdutos(produtosEnriquecidos);
    if (typeof renderizarDestaques === 'function') renderizarDestaques(produtosEnriquecidos);

    if (typeof atualizarIconesFavoritos === 'function') {
        setTimeout(atualizarIconesFavoritos, 200);
    }

    console.log('✅ Produtos recarregados');
}

// ========================================
// CONFIGURAÇÃO DO LOGO
// ========================================

function configurarLogo() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    logo.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    logo.style.cursor = 'pointer';
    logo.style.userSelect = 'none';
    logo.title = 'Clique para voltar ao início';
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS DO CARRINHO
// ========================================

function configurarEventosCarrinho() {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.addEventListener('click', abrirCarrinho);

    const cartClose = document.getElementById('cartClose');
    if (cartClose) cartClose.addEventListener('click', fecharCarrinho);

    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function (e) {
            if (e.target === this) fecharCarrinho();
        });
    }

    const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    if (btnFinalizarPedido) btnFinalizarPedido.addEventListener('click', abrirCheckout);

    const btnEsvaziarCarrinho = document.getElementById('btnEsvaziarCarrinho');
    if (btnEsvaziarCarrinho) {
        btnEsvaziarCarrinho.addEventListener('click', function () {
            if (carrinho.length === 0) return;
            if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
                carrinho = [];
                salvarCarrinho();
                renderizarCarrinho();
                atualizarBotoesCarrinho();
                mostrarToast('Carrinho esvaziado!');
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            fecharCarrinho();
            fecharCheckout();
        }
    });
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

window.adicionarAoCarrinho          = adicionarAoCarrinho;
window.removerDoCarrinho            = removerDoCarrinho;
window.alterarQuantidade            = alterarQuantidade;
window.abrirCarrinho                = abrirCarrinho;
window.fecharCarrinho               = fecharCarrinho;
window.abrirCheckout                = abrirCheckout;
window.fecharCheckout               = fecharCheckout;
window.processarCheckout            = processarCheckout;
window.mostrarObservacaoPagamento   = mostrarObservacaoPagamento;
window.mudarPagina                  = mudarPagina;
window.mostrarLoginAdmin            = mostrarLoginAdmin;
window.logoutAdmin                  = logoutAdmin;
window.verificarDisponibilidade     = verificarDisponibilidade;
window.configurarLogo               = configurarLogo;
window.observarCards                = observarCards;
window.forcarCorrecaoIds            = forcarCorrecaoIds;

// ❤️ Favoritos
window.abrirFavoritosModal          = abrirFavoritosModal;
window.fecharFavoritosModal         = fecharFavoritosModal;
window.toggleFavorito               = toggleFavorito;
window.removerFavorito              = removerFavorito;
window.limparFavoritos              = limparFavoritos;

console.log('✅ Main.js carregado com sucesso!');