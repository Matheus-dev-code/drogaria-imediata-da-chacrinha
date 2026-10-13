// ========================================
// CARROSSEL DE BANNERS POR MARCA
// ========================================

let bannerAtual = 0;
let bannersAutoplayTimer = null;
let bannersTotal = 0;

const BANNERS_AUTOPLAY = 4000; // 4 segundos

// ========================================
// RENDERIZAR BANNERS
// ========================================

function renderizarBanners() {
    const track = document.getElementById('bannersTrack');
    const indicadores = document.getElementById('bannersIndicadores');
    
    if (!track || typeof bannersPromocionais === 'undefined') return;
    
    bannersTotal = bannersPromocionais.length;
    
    // Cria os slides
    track.innerHTML = bannersPromocionais.map((banner, index) => `
        <div class="banner-slide" 
             data-index="${index}" 
             data-filtro="${banner.filtro}"
             data-busca="${banner.busca || ''}"
             onclick="irParaMarcaBanner('${banner.filtro}', '${banner.busca || ''}')"
             style="background: linear-gradient(135deg, ${banner.cor}, ${ajustarCor(banner.cor, -30)})">
            
            <img 
                src="${banner.imagem}" 
                alt="${banner.titulo}" 
                class="banner-slide-img"
                loading="${index === 0 ? 'eager' : 'lazy'}"
                onerror="this.style.display='none'">
            
            <div class="banner-slide-overlay">
                <h3 class="banner-slide-titulo">${banner.titulo}</h3>
                <p class="banner-slide-subtitulo">${banner.subtitulo}</p>
                <span class="banner-slide-cta">
                    Ver Produtos <i class="fas fa-arrow-right"></i>
                </span>
            </div>
            
            <div class="banners-progresso"></div>
        </div>
    `).join('');
    
    // Cria os indicadores (bolinhas)
    indicadores.innerHTML = bannersPromocionais.map((_, index) => `
        <button 
            class="banner-dot ${index === 0 ? 'active' : ''}" 
            data-index="${index}"
            onclick="irParaBanner(${index})"
            aria-label="Ir para banner ${index + 1}">
        </button>
    `).join('');
    
    // Configura botões de navegação
    configurarNavegacaoBanners();
    
    // Inicia o autoplay
    iniciarAutoplayBanners();
    
    // Pausa ao passar mouse (desktop)
    const viewport = document.querySelector('.banners-viewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', pausarAutoplayBanners);
        viewport.addEventListener('mouseleave', iniciarAutoplayBanners);
        
        // Suporte a swipe no mobile
        configurarSwipeBanners(viewport);
    }
    
    // Pausa quando a aba fica invisível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pausarAutoplayBanners();
        } else {
            iniciarAutoplayBanners();
        }
    });
}

// ========================================
// NAVEGAÇÃO
// ========================================

function irParaBanner(index) {
    if (bannersTotal === 0) return;
    
    // Loop circular
    if (index < 0) index = bannersTotal - 1;
    if (index >= bannersTotal) index = 0;
    
    bannerAtual = index;
    
    const track = document.getElementById('bannersTrack');
    if (track) {
        track.style.transform = `translateX(-${bannerAtual * 100}%)`;
    }
    
    // Atualiza indicadores
    document.querySelectorAll('.banner-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === bannerAtual);
    });
    
    // Reseta a barra de progresso
    resetarProgressoBanner();
}

function proximoBanner() {
    irParaBanner(bannerAtual + 1);
}

function bannerAnterior() {
    irParaBanner(bannerAtual - 1);
}

// ========================================
// CONFIGURAR NAVEGAÇÃO
// ========================================

function configurarNavegacaoBanners() {
    const prevBtn = document.getElementById('bannersPrev');
    const nextBtn = document.getElementById('bannersNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bannerAnterior();
            reiniciarAutoplayBanners();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            proximoBanner();
            reiniciarAutoplayBanners();
        });
    }
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        const bannersSection = document.getElementById('banners');
        if (!bannersSection) return;
        
        // Só funciona se o banner estiver visível na tela
        const rect = bannersSection.getBoundingClientRect();
        const visivel = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!visivel) return;
        
        if (e.key === 'ArrowLeft') {
            bannerAnterior();
            reiniciarAutoplayBanners();
        } else if (e.key === 'ArrowRight') {
            proximoBanner();
            reiniciarAutoplayBanners();
        }
    });
}

// ========================================
// AUTOPLAY
// ========================================

function iniciarAutoplayBanners() {
    pausarAutoplayBanners();
    
    bannersAutoplayTimer = setInterval(() => {
        proximoBanner();
    }, BANNERS_AUTOPLAY);
    
    // Ativa a barra de progresso do banner atual
    resetarProgressoBanner();
}

function pausarAutoplayBanners() {
    if (bannersAutoplayTimer) {
        clearInterval(bannersAutoplayTimer);
        bannersAutoplayTimer = null;
    }
    
    // Remove animação da barra
    document.querySelectorAll('.banners-progresso').forEach(p => {
        p.classList.remove('ativo');
    });
}

function reiniciarAutoplayBanners() {
    pausarAutoplayBanners();
    iniciarAutoplayBanners();
}

function resetarProgressoBanner() {
    document.querySelectorAll('.banners-progresso').forEach((p, i) => {
        p.classList.remove('ativo');
        p.style.width = '0%';
        
        if (i === bannerAtual) {
            // Force reflow para reiniciar a animação
            void p.offsetWidth;
            p.classList.add('ativo');
        }
    });
}

// ========================================
// SWIPE (MOBILE)
// ========================================

function configurarSwipeBanners(elemento) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let diffX = 0;
    
    const SWIPE_THRESHOLD = 50;
    
    elemento.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        diffX = 0;
        pausarAutoplayBanners();
    }, { passive: true });
    
    elemento.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        diffX = currentX - startX;
        const diffY = currentY - startY;
        
        // Se o movimento for mais vertical que horizontal, cancela
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }
        
        // Previne scroll horizontal
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    elemento.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (diffX > SWIPE_THRESHOLD) {
            bannerAnterior();
        } else if (diffX < -SWIPE_THRESHOLD) {
            proximoBanner();
        }
        
        reiniciarAutoplayBanners();
    }, { passive: true });
    
    elemento.addEventListener('touchcancel', () => {
        isDragging = false;
        reiniciarAutoplayBanners();
    }, { passive: true });
}

// ========================================
// CLICAR NO BANNER → FILTRAR MARCA (E BUSCA)
// ========================================

function irParaMarcaBanner(marcaFiltro, buscaFiltro = '') {
    console.log(`🎯 Filtrando por marca: ${marcaFiltro}${buscaFiltro ? ` | busca: ${buscaFiltro}` : ''}`);
    
    // 1. Atualiza o select de marcas
    const selectMarca = document.getElementById('marcaSelect');
    if (!selectMarca) return;
    
    // Procura a opção correspondente
    let opcaoEncontrada = null;
    Array.from(selectMarca.options).forEach(option => {
        if (normalizarTexto(option.value) === normalizarTexto(marcaFiltro)) {
            opcaoEncontrada = option;
        }
    });
    
    if (opcaoEncontrada) {
        selectMarca.value = opcaoEncontrada.value;
        
        // 2. Dispara o evento de mudança (para atualizar filtros)
        selectMarca.dispatchEvent(new Event('change'));
    } else {
        // Fallback: aplica filtro manualmente
        if (typeof marcaAtual !== 'undefined') {
            window.marcaAtual = marcaFiltro;
        }
        
        // Reset de categoria
        const btnTodos = document.querySelector('.btn-categoria[data-categoria="todos"]');
        if (btnTodos) {
            document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
            btnTodos.classList.add('active');
            if (typeof categoriaAtual !== 'undefined') {
                window.categoriaAtual = 'todos';
            }
        }
        
        // Aplica filtros
        if (typeof aplicarFiltros === 'function') {
            aplicarFiltros();
        }
    }
    
    // 3. Se tiver busca, preenche o campo de busca
    if (buscaFiltro) {
        // Espera o select de marca atualizar os filtros
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            
            if (!searchInput) return;
            
            // Preenche o campo de busca
            searchInput.value = buscaFiltro;
            
            // Dispara o evento de input (que aciona a busca inteligente)
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            console.log(`✅ Busca aplicada: "${buscaFiltro}"`);
        }, 200);
    }
    
    // 4. Rola até a seção de produtos
    const produtosSection = document.getElementById('produtos');
    if (produtosSection) {
        setTimeout(() => {
            if (typeof scrollParaElemento === 'function') {
                scrollParaElemento(produtosSection);
            } else {
                produtosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, buscaFiltro ? 400 : 100);
    }
    
    // 5. Toast de feedback
    if (typeof mostrarToast === 'function') {
        const mensagem = buscaFiltro 
            ? `🎯 Mostrando ${marcaFiltro} — ${buscaFiltro}`
            : `🎯 Mostrando produtos ${marcaFiltro}`;
        mostrarToast(mensagem);
    }
    
    // 6. Analytics
    if (typeof registrarFiltroMarca === 'function') {
        registrarFiltroMarca(marcaFiltro);
    }
}

// ========================================
// UTILITÁRIOS
// ========================================

// Escurece/clareia uma cor hex
function ajustarCor(hex, percentual) {
    if (!hex || hex[0] !== '#') return hex;
    
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    r = Math.max(0, Math.min(255, r + percentual));
    g = Math.max(0, Math.min(255, g + percentual));
    b = Math.max(0, Math.min(255, b + percentual));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.renderizarBanners = renderizarBanners;
window.irParaBanner = irParaBanner;
window.proximoBanner = proximoBanner;
window.bannerAnterior = bannerAnterior;
window.irParaMarcaBanner = irParaMarcaBanner;

console.log('✅ Módulo de banners carregado!');