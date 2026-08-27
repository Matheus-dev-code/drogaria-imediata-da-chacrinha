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

    // 8. Atualiza interface
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
    }, 500);

    // 9. Configura header com scroll
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

    // 10. Atualiza ano no footer
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
    }

    // 11. Configura logo
    configurarLogo();

    // 12. Inicia observação de cards para admin
    observarCards();

    console.log('✅ Sistema carregado com sucesso!');
});

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
// CONFIGURAÇÃO DOS EVENTOS DE FILTROS
// ========================================

function configurarEventosFiltros() {
    // Categorias
    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            categoriaAtual = this.getAttribute('data-categoria');
            aplicarFiltros();
        });
    });

    // Select de Marcas
    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function() {
            const valor = this.value;
            marcaAtual = valor;

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

    // Select de Linhas
    const linhaSelect = document.getElementById('linhaSelect');
    if (linhaSelect) {
        linhaSelect.addEventListener('change', function() {
            linhaAtual = this.value;
            aplicarFiltros();
        });
    }

    // Busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            
            debounceTimer = setTimeout(() => {
                const termo = normalizarTexto(this.value);

                if (termo === '') {
                    aplicarFiltros();
                    return;
                }

                // 📊 Registra evento de busca no Analytics
                if (typeof registrarBusca === 'function') {
                    registrarBusca(termo);
                }

                produtosFiltrados = produtosEnriquecidos.filter(produto => {
                    return normalizarTexto(produto.nome).includes(termo) ||
                        normalizarTexto(produto.marca).includes(termo) ||
                        normalizarTexto(produto.descricao).includes(termo) ||
                        normalizarTexto(formatarCategoria(produto.categoria)).includes(termo) ||
                        normalizarTexto(produto.linha || '').includes(termo);
                });

                paginaAtual = 1;
                mostrarPagina(true);
            }, 300);
        });
    }
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS DE DESTAQUES
// ========================================

function configurarEventosDestaques() {
    const destaquePrev = document.getElementById('destaquePrev');
    if (destaquePrev) {
        destaquePrev.addEventListener('click', () => mudarPaginaDestaques(-1));
    }

    const destaqueNext = document.getElementById('destaqueNext');
    if (destaqueNext) {
        destaqueNext.addEventListener('click', () => mudarPaginaDestaques(1));
    }
}

// ========================================
// CONFIGURAÇÃO DO MENU MOBILE
// ========================================

function configurarMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    document.addEventListener('click', (e) => {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

// ========================================
// CONFIGURAÇÃO DO BOTÃO VOLTAR AO TOPO
// ========================================

function configurarBotaoTopo() {
    const btnTopo = document.getElementById('btnTopo');
    if (!btnTopo) return;

    window.addEventListener('scroll', () => {
        btnTopo.classList.toggle('show', window.scrollY > 400);
    });

    btnTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// CONFIGURAÇÃO DO SMOOTH SCROLL
// ========================================

function configurarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) scrollParaElemento(target);
        });
    });
}

// ========================================
// CONFIGURAÇÃO DO SCROLL REVEAL
// ========================================

function configurarScrollReveal() {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.produto-card, .destaques-grid .produto-card, .sobre-texto')
        .forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
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

console.log('✅ Main.js carregado com sucesso!');