// ========================================
// CARROSSEL DE PROMOÇÕES
// ========================================

let promocaoAtual = 0;
let promocoesAutoplayTimer = null;
let totalPromocoes = 0;

const PROMOCOES_AUTOPLAY = 5000; // 5 segundos

// ========================================
// RENDERIZAR PROMOÇÕES
// ========================================

function renderizarPromocoes() {
    const track = document.getElementById('promocoesTrack');
    const indicadores = document.getElementById('promocoesIndicadores');

    if (!track || typeof promocoesAtivas === 'undefined') return;

    totalPromocoes = promocoesAtivas.length;

    // Cria os slides
    track.innerHTML = promocoesAtivas.map((promo, index) => `
        <div class="promocao-slide"
             data-index="${index}"
             data-filtro="${promo.filtro || ''}"
             onclick="irParaMarcaPromocao('${promo.filtro || ''}')"
             style="background: linear-gradient(135deg, ${promo.cor}, ${ajustarCorPromo(promo.cor, -30)})">

            <img
                src="${promo.imagem}"
                alt="${promo.titulo}"
                class="promocao-slide-img"
                loading="${index === 0 ? 'eager' : 'lazy'}"
                onerror="this.style.display='none'">

            <div class="promocao-slide-overlay">
                <span class="promocao-tag">🔥 OFERTA</span>
                <h3 class="promocao-slide-titulo">${promo.titulo}</h3>
                <p class="promocao-slide-subtitulo">${promo.subtitulo}</p>
                <span class="promocao-slide-cta">
                    Aproveitar <i class="fas fa-arrow-right"></i>
                </span>
            </div>

            <div class="promocoes-progresso"></div>
        </div>
    `).join('');

    // Indicadores (bolinhas)
    indicadores.innerHTML = promocoesAtivas.map((_, index) => `
        <button
            class="promocao-dot ${index === 0 ? 'active' : ''}"
            data-index="${index}"
            onclick="irParaPromocao(${index})"
            aria-label="Ir para promoção ${index + 1}">
        </button>
    `).join('');

    configurarNavegacaoPromocoes();
    iniciarAutoplayPromocoes();

    // Pausa no hover (desktop)
    const viewport = document.querySelector('.promocoes-viewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', pausarAutoplayPromocoes);
        viewport.addEventListener('mouseleave', iniciarAutoplayPromocoes);
        configurarSwipePromocoes(viewport);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pausarAutoplayPromocoes();
        else iniciarAutoplayPromocoes();
    });
}

// ========================================
// NAVEGAÇÃO
// ========================================

function irParaPromocao(index) {
    if (totalPromocoes === 0) return;

    if (index < 0) index = totalPromocoes - 1;
    if (index >= totalPromocoes) index = 0;

    promocaoAtual = index;

    const track = document.getElementById('promocoesTrack');
    if (track) {
        track.style.transform = `translateX(-${promocaoAtual * 100}%)`;
    }

    // Atualiza indicadores
    document.querySelectorAll('.promocao-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === promocaoAtual);
    });

    // Reinicia a barra de progresso
    resetarProgressoPromocao();
}

function proximaPromocao() {
    irParaPromocao(promocaoAtual + 1);
}

function promocaoAnterior() {
    irParaPromocao(promocaoAtual - 1);
}

// ========================================
// CONFIGURAR NAVEGAÇÃO
// ========================================

function configurarNavegacaoPromocoes() {
    const prevBtn = document.getElementById('promocoesPrev');
    const nextBtn = document.getElementById('promocoesNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            promocaoAnterior();
            reiniciarAutoplayPromocoes();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            proximaPromocao();
            reiniciarAutoplayPromocoes();
        });
    }

    // Teclado (setas) quando visível
    document.addEventListener('keydown', (e) => {
        const secao = document.getElementById('promocoes');
        if (!secao) return;

        const rect = secao.getBoundingClientRect();
        const visivel = rect.top < window.innerHeight && rect.bottom > 0;
        if (!visivel) return;

        if (e.key === 'ArrowLeft') {
            promocaoAnterior();
            reiniciarAutoplayPromocoes();
        } else if (e.key === 'ArrowRight') {
            proximaPromocao();
            reiniciarAutoplayPromocoes();
        }
    });
}

// ========================================
// AUTOPLAY
// ========================================

function iniciarAutoplayPromocoes() {
    pausarAutoplayPromocoes();
    promocoesAutoplayTimer = setInterval(proximaPromocao, PROMOCOES_AUTOPLAY);

    // Ativa a barra de progresso do slide atual
    resetarProgressoPromocao();
}

function pausarAutoplayPromocoes() {
    if (promocoesAutoplayTimer) {
        clearInterval(promocoesAutoplayTimer);
        promocoesAutoplayTimer = null;
    }

    // Remove animação da barra
    document.querySelectorAll('.promocoes-progresso').forEach(p => {
        p.classList.remove('ativo');
    });
}

function reiniciarAutoplayPromocoes() {
    pausarAutoplayPromocoes();
    iniciarAutoplayPromocoes();
}

// ========================================
// BARRA DE PROGRESSO
// ========================================

function resetarProgressoPromocao() {
    document.querySelectorAll('.promocoes-progresso').forEach((p, i) => {
        p.classList.remove('ativo');
        p.style.width = '0%';

        if (i === promocaoAtual) {
            // Force reflow para reiniciar a animação
            void p.offsetWidth;
            p.classList.add('ativo');
        }
    });
}

// ========================================
// SWIPE (MOBILE)
// ========================================

function configurarSwipePromocoes(elemento) {
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
        pausarAutoplayPromocoes();
    }, { passive: true });

    elemento.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        diffX = currentX - startX;
        const diffY = currentY - startY;
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isDragging = false;
            return;
        }
        if (Math.abs(diffX) > 10) e.preventDefault();
    }, { passive: false });

    elemento.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        if (diffX > SWIPE_THRESHOLD) promocaoAnterior();
        else if (diffX < -SWIPE_THRESHOLD) proximaPromocao();
        reiniciarAutoplayPromocoes();
    }, { passive: true });

    elemento.addEventListener('touchcancel', () => {
        isDragging = false;
        reiniciarAutoplayPromocoes();
    }, { passive: true });
}

// ========================================
// CLICAR → FILTRAR MARCA(S)
// Aceita 1 marca OU várias separadas por vírgula
// Ex: "stork"  ou  "musa,stork"
// ========================================

function irParaMarcaPromocao(filtroString) {
    if (!filtroString) {
        const secao = document.getElementById('produtos');
        if (secao) secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    // Separa por vírgula e limpa espaços
    const marcas = filtroString.split(',')
        .map(m => m.trim().toLowerCase())
        .filter(m => m.length > 0);

    console.log(`🎯 Promoção filtrando por ${marcas.length} marca(s):`, marcas);

    // Se for só 1 marca, usa o select normal
    if (marcas.length === 1) {
        aplicarFiltroMarcas(marcas);
        return;
    }

    // Se for várias marcas, faz filtro manual
    aplicarFiltroMultiplasMarcas(marcas);
}

// ========================================
// FILTRO DE 1 MARCA (usa o select normal)
// ========================================

function aplicarFiltroMarcas(marcas) {
    const selectMarca = document.getElementById('marcaSelect');
    if (!selectMarca) return;

    const marca = marcas[0];
    let opcaoEncontrada = null;

    Array.from(selectMarca.options).forEach(option => {
        if (normalizarTexto(option.value) === normalizarTexto(marca)) {
            opcaoEncontrada = option;
        }
    });

    if (opcaoEncontrada) {
        selectMarca.value = opcaoEncontrada.value;
        selectMarca.dispatchEvent(new Event('change'));
    }

    rolarParaProdutos(`🔥 Ofertas ${marca}`);

    if (typeof registrarFiltroMarca === 'function') {
        registrarFiltroMarca(marca);
    }
}

// ========================================
// FILTRO DE VÁRIAS MARCAS (manual)
// ========================================

function aplicarFiltroMultiplasMarcas(marcas) {
    console.log(`🔍 Aplicando filtro múltiplo: ${marcas.join(', ')}`);

    // Reseta o select de marca
    const selectMarca = document.getElementById('marcaSelect');
    if (selectMarca) {
        selectMarca.value = 'todas';
    }

    // Reseta o select de linha (esconde)
    const linhasWrapper = document.getElementById('linhasWrapper');
    if (linhasWrapper) {
        linhasWrapper.style.display = 'none';
    }

    // Reseta o campo de busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reseta categoria (usa "todos" como ativa)
    document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
    const btnTodos = document.querySelector('.btn-categoria[data-categoria="todos"]');
    if (btnTodos) btnTodos.classList.add('active');

    // Atualiza variáveis globais
    if (typeof window !== 'undefined') {
        window.marcaAtual = 'todas';   // pra não conflitar com o select
        window.categoriaAtual = 'todos';
        window.linhaAtual = 'todas';
    }

    // Filtra produtos pelas marcas selecionadas
    if (typeof produtosEnriquecidos !== 'undefined' && Array.isArray(produtosEnriquecidos)) {
        produtosFiltrados = produtosEnriquecidos.filter(produto => {
            const marcaProduto = normalizarTexto(produto.marca);
            return marcas.includes(marcaProduto);
        });

        console.log(`📊 Encontrados ${produtosFiltrados.length} produtos das marcas: ${marcas.join(', ')}`);
    } else {
        console.warn('⚠️ produtosEnriquecidos não está disponível');
        produtosFiltrados = [];
    }

    // Renderiza
    paginaAtual = 1;
    if (typeof mostrarPagina === 'function') {
        mostrarPagina(true);
    }

    // Atualiza chips de filtros ativos
    atualizarFiltrosMultiplosUI(marcas);

    // Atualiza contador
    const contador = document.getElementById('contador-produtos');
    if (contador) {
        const total = produtosFiltrados.length;
        contador.textContent = total > 0
            ? `🔥 ${total} oferta${total > 1 ? 's' : ''} encontrada${total > 1 ? 's' : ''}`
            : 'Nenhum produto encontrado';
    }

    rolarParaProdutos(`🔥 Ofertas de ${marcas.length} marcas`);
}

// ========================================
// ATUALIZA CHIPS DE FILTROS ATIVOS
// ========================================

function atualizarFiltrosMultiplosUI(marcas) {
    const container = document.getElementById('filtrosAtivos');
    if (!container) return;

    const nomesBonitos = marcas.map(m => {
        // Coloca primeira letra maiúscula
        return m.split(' ')
            .map(p => p.charAt(0).toUpperCase() + p.slice(1))
            .join(' ');
    });

    container.innerHTML = `
        <span style="font-size:12px;color:var(--gray);margin-right:4px;">Filtros:</span>
        ${nomesBonitos.map(nome =>
            `<span class="ativo" data-filtro="marca">${nome}</span>`
        ).join(' ')}
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
// ROLA ATÉ A SEÇÃO DE PRODUTOS
// ========================================

function rolarParaProdutos(mensagemToast = '') {
    const produtosSection = document.getElementById('produtos');
    if (produtosSection) {
        setTimeout(() => {
            if (typeof scrollParaElemento === 'function') {
                scrollParaElemento(produtosSection);
            } else {
                produtosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    if (mensagemToast && typeof mostrarToast === 'function') {
        mostrarToast(mensagemToast);
    }
}

// ========================================
// UTILITÁRIO
// ========================================

function ajustarCorPromo(hex, percentual) {
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
// EXPORTA GLOBAIS
// ========================================

window.renderizarPromocoes = renderizarPromocoes;
window.irParaPromocao = irParaPromocao;
window.proximaPromocao = proximaPromocao;
window.promocaoAnterior = promocaoAnterior;
window.irParaMarcaPromocao = irParaMarcaPromocao;

console.log('✅ Módulo de promoções carregado!');