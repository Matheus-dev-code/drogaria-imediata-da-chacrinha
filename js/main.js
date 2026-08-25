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
    await verificarAdmin();

    // 3. Configura interface
    configurarEventosFiltros();
    configurarEventosDestaques();
    configurarMenuMobile();
    configurarBotaoTopo();
    configurarSmoothScroll();
    configurarEventosCarrinho();

    // 4. Sincroniza select de marcas
    const selectMarca = document.getElementById('marcaSelect');
    if (selectMarca) selectMarca.value = 'todas';

    // 5. Carrega estoque
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

    // 6. Atualiza interface
    setTimeout(() => {
        atualizarBotoesCarrinho();
        initScrollReveal();
        habilitarScrollHorizontal('.categoria-buttons');
        habilitarScrollHorizontal('.marca-buttons');
        console.log('✅ Interface atualizada');
    }, 500);

    // 7. Configura header com scroll
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

    // 8. Atualiza ano no footer
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
    }

    // 9. Configura logo para login admin (duplo clique)
    const logo = document.querySelector('.logo');
    if (logo) {
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
    }

    // 10. Cria barra de admin se necessário
    if (isAdmin) {
        criarBarraAdmin();
    }

    console.log('✅ Sistema carregado com sucesso!');
});

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
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === this) fecharCarrinho();
        });
    }

    const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    if (btnFinalizarPedido) btnFinalizarPedido.addEventListener('click', finalizarPedido);

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
}

// ========================================
// FUNÇÕES GLOBAIS (para acesso via HTML)
// ========================================

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.finalizarPedido = finalizarPedido;
window.mudarPagina = mudarPagina;
window.mudarPaginaDestaques = mudarPaginaDestaques;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.logoutAdmin = logoutAdmin;
window.verificarDisponibilidade = verificarDisponibilidade;