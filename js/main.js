// ========================================
// ARQUIVO PRINCIPAL - COORDENA TUDO
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicação...');

    // 1. Carrega todos os produtos
    produtosEnriquecidos = carregarTodosProdutos();
    console.log('📦 Total de produtos:', produtosEnriquecidos.length);

    // 2. Inicializa sistemas
    carregarCarrinho();
    
    // 3. Verifica admin ANTES de configurar a UI
    await verificarAdmin();
    
    // 4. Adiciona botão de admin no header (sempre visível)
    adicionarBotaoAdmin();

    // 5. Configura interface
    configurarEventosFiltros();
    configurarEventosDestaques();
    configurarMenuMobile();
    configurarBotaoTopo();
    configurarSmoothScroll();
    configurarEventosCarrinho();

    // 6. Sincroniza select de marcas
    const selectMarca = document.getElementById('marcaSelect');
    if (selectMarca) selectMarca.value = 'todas';

    // 7. Carrega estoque
    const grid = document.getElementById('produtosGrid');
    if (grid) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;">🔄 Carregando estoque...</p>';
    }

    try {
        await carregarEstoqueFirebase();
        console.log('✅ Estoque carregado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar estoque:', error);
        carregarEstoqueLocal();
    }

    // 8. CORREÇÃO DE EMERGÊNCIA: Força correção de IDs
    setTimeout(() => {
        forcarCorrecaoIds();
    }, 500);

    // 9. Atualiza interface
    setTimeout(() => {
        atualizarBotoesCarrinho();
        initScrollReveal();
        habilitarScrollHorizontal('.categoria-buttons');
        habilitarScrollHorizontal('.marca-buttons');
        
        // Se for admin, adiciona botões de toggle
        if (isAdmin) {
            adicionarBotoesToggleEsgotado();
        }
        
        console.log('✅ Interface atualizada');
    }, 800);

    // 10. Configura header com scroll
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

    // 11. Atualiza ano no footer
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
    }

    // 12. Configura logo
    configurarLogo();

    // 13. Inicia observação de cards para admin
    observarCards();

    console.log('✅ Sistema carregado com sucesso!');
});

// ========================================
// CORREÇÃO DE EMERGÊNCIA - IDs Duplicados
// ========================================

function forcarCorrecaoIds() {
    console.log('🔄 Forçando correção de IDs duplicados...');
    
    if (!todosProdutos || todosProdutos.length === 0) {
        console.warn('⚠️ Nenhum produto carregado ainda');
        return;
    }
    
    const idsVistos = new Set();
    let corrigidos = 0;
    
    todosProdutos.forEach((produto, index) => {
        // Se o ID for inválido ou duplicado
        if (!produto.id || produto.id === null || produto.id === undefined || idsVistos.has(produto.id)) {
            // Gera um ID único baseado no índice + timestamp
            produto.id = 100000 + index + Date.now() % 1000;
            corrigidos++;
        }
        idsVistos.add(produto.id);
    });
    
    console.log(`✅ ${corrigidos} IDs corrigidos`);
    
    // Recria os produtos enriquecidos
    produtosEnriquecidos = enriquecerProdutos(todosProdutos);
    produtosFiltrados = [...produtosEnriquecidos];
    
    // Re-renderiza
    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);
    
    console.log('✅ Produtos recarregados com sucesso!');
}

// ========================================
// CONFIGURAÇÃO DO LOGO
// ========================================

function configurarLogo() {
    const logo = document.querySelector('.logo');
    
    if (!logo) return;

    // CLIQUE ÚNICO: Volta para o topo
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // DUPLO CLIQUE: Abre login admin (fallback)
    logo.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        
        if (isAdmin) {
            if (confirm('Você está logado como administrador. Deseja sair?')) {
                logoutAdmin();
            }
        } else {
            mostrarLoginAdmin();
        }
    });

    logo.style.cursor = 'pointer';
    logo.style.userSelect = 'none';
    logo.title = 'Clique para voltar ao início | Duplo clique para admin';
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS DO CARRINHO
// ========================================

function configurarEventosCarrinho() {
    // Abrir carrinho
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', abrirCarrinho);
    }

    // Fechar carrinho
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
        cartClose.addEventListener('click', fecharCarrinho);
    }

    // Fechar carrinho ao clicar fora
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharCarrinho();
            }
        });
    }

    // Botão finalizar agora abre o checkout
    const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', abrirCheckout);
    }

    // Esvaziar carrinho
    const btnEsvaziarCarrinho = document.getElementById('btnEsvaziarCarrinho');
    if (btnEsvaziarCarrinho) {
        btnEsvaziarCarrinho.addEventListener('click', function() {
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

    // Fechar carrinho com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharCarrinho();
            fecharCheckout();
        }
    });
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.abrirCheckout = abrirCheckout;
window.fecharCheckout = fecharCheckout;
window.processarCheckout = processarCheckout;
window.mostrarObservacaoPagamento = mostrarObservacaoPagamento;
window.mudarPagina = mudarPagina;
window.mudarPaginaDestaques = mudarPaginaDestaques;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.logoutAdmin = logoutAdmin;
window.verificarDisponibilidade = verificarDisponibilidade;
window.configurarLogo = configurarLogo;
window.observarCards = observarCards;
window.forcarCorrecaoIds = forcarCorrecaoIds;

console.log('✅ Main.js carregado com sucesso!');