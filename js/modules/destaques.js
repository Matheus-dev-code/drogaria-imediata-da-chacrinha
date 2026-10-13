// ========================================
// CARROSSEL DE DESTAQUES - VITRINE DESLIZANTE
// ========================================

let destaquesAtual = 0;
let destaquesAutoplayTimer = null;
let totalDestaques = 0;
let cardsVisiveisDestaques = 2; // padrão mobile
let destaquesProdutos = [];

const DESTAQUES_AUTOPLAY = 5000; // 5 segundos

// ========================================
// RENDERIZAÇÃO DOS DESTAQUES
// ========================================

function renderizarDestaques(produtos, pagina = 1) {
    const track = document.getElementById('destaquesTrack');
    const indicadores = document.getElementById('destaquesIndicadores');
    if (!track) return;

    // Filtra apenas os que estão como destaque
    destaquesProdutos = produtos.filter(p => p.destaque === true);
    totalDestaques = destaquesProdutos.length;

    if (destaquesProdutos.length === 0) {
        track.innerHTML = `
            <p style="text-align:center;width:100%;padding:40px;color:var(--gray);">
                Nenhum destaque no momento.
            </p>
        `;
        if (indicadores) indicadores.innerHTML = '';
        return;
    }

    // Cria os cards
    track.innerHTML = destaquesProdutos.map((produto) => {
        const card = criarProdutoCard(produto, true);
        return card.outerHTML;
    }).join('');

    // Reaplica os eventos dos botões (o outerHTML perde listeners)
    setTimeout(() => {
        // Botões de adicionar ao carrinho
        track.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                // 🔑 ID agora é string
                const id = this.dataset.id;
                const produto = destaquesProdutos.find(p => String(p.id) === String(id));
                if (produto && typeof adicionarAoCarrinho === 'function') {
                    adicionarAoCarrinho(produto);
                }
            });
        });

        // Botões de WhatsApp
        track.querySelectorAll('.btn-whatsapp').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const nome = this.dataset.nome;
                const marca = this.dataset.marca;
                const preco = this.dataset.preco;
                if (typeof verificarDisponibilidade === 'function') {
                    verificarDisponibilidade(nome, marca, preco);
                }
            });
        });

        // Aplica scroll reveal
        track.querySelectorAll('.produto-card').forEach(c => c.classList.add('visible'));

        // Atualiza os botões do carrinho (marca como "No Carrinho" se já estiver)
        if (typeof atualizarBotoesCarrinho === 'function') {
            atualizarBotoesCarrinho();
        }
    }, 50);

    // Calcula cards visíveis
    calcularCardsVisiveisDestaques();

    // Cria indicadores
    criarIndicadoresDestaques();

    // Navegação
    configurarNavegacaoDestaques();
    configurarSwipeDestaques();

    // Inicia autoplay
    iniciarAutoplayDestaques();

    // Pausa no hover
    const viewport = document.querySelector('.destaques-viewport');
    if (viewport && !viewport.dataset.swipeConfigurado) {
        viewport.addEventListener('mouseenter', pausarAutoplayDestaques);
        viewport.addEventListener('mouseleave', iniciarAutoplayDestaques);
        viewport.dataset.swipeConfigurado = 'true';
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pausarAutoplayDestaques();
        else iniciarAutoplayDestaques();
    });

    // Recalcula ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const antigo = cardsVisiveisDestaques;
            calcularCardsVisiveisDestaques();
            if (antigo !== cardsVisiveisDestaques) {
                criarIndicadoresDestaques();
                irParaDestaque(0);
            } else {
                irParaDestaque(destaquesAtual);
            }
        }, 200);
    });
}

// ========================================
// CALCULA QUANTOS CARDS CABEM
// ========================================

function calcularCardsVisiveisDestaques() {
    const largura = window.innerWidth;

    if (largura >= 1024) {
        cardsVisiveisDestaques = 4;
    } else if (largura >= 768) {
        cardsVisiveisDestaques = 3;
    } else {
        cardsVisiveisDestaques = 2;
    }
}

// ========================================
// INDICADORES (BOLINHAS)
// ========================================

function criarIndicadoresDestaques() {
    const indicadores = document.getElementById('destaquesIndicadores');
    if (!indicadores) return;

    const totalGrupos = Math.ceil(totalDestaques / cardsVisiveisDestaques);

    indicadores.innerHTML = Array.from({ length: totalGrupos }, (_, i) => `
        <button
            class="destaque-dot ${i === 0 ? 'active' : ''}"
            data-index="${i}"
            onclick="irParaGrupoDestaque(${i})"
            aria-label="Ir para grupo ${i + 1}">
        </button>
    `).join('');
}

function irParaGrupoDestaque(grupo) {
    irParaDestaque(grupo * cardsVisiveisDestaques);
}

// ========================================
// NAVEGAÇÃO
// ========================================

function irParaDestaque(index) {
    if (!totalDestaques) totalDestaques = destaquesProdutos.length;
    if (totalDestaques === 0) return;

    const track = document.getElementById('destaquesTrack');
    if (!track) return;

    const card = track.querySelector('.produto-card');
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    // Limita o índice máximo para não sobrar espaço vazio
    const maxIndex = Math.max(0, totalDestaques - cardsVisiveisDestaques);
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;

    destaquesAtual = index;

    const deslocamento = index * (cardWidth + gap);
    track.style.transform = `translateX(-${deslocamento}px)`;

    // Atualiza dot ativo
    const grupoAtual = Math.floor(index / cardsVisiveisDestaques);
    document.querySelectorAll('.destaque-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === grupoAtual);
    });
}

function proximoDestaque() {
    irParaDestaque(destaquesAtual + cardsVisiveisDestaques);
}

function destaqueAnterior() {
    irParaDestaque(destaquesAtual - cardsVisiveisDestaques);
}

// ========================================
// CONFIGURAÇÃO DE NAVEGAÇÃO
// ========================================

function configurarNavegacaoDestaques() {
    const prevBtn = document.getElementById('destaquePrev');
    const nextBtn = document.getElementById('destaqueNext');

    if (prevBtn && !prevBtn.dataset.configurado) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            destaqueAnterior();
            reiniciarAutoplayDestaques();
        });
        prevBtn.dataset.configurado = 'true';
    }

    if (nextBtn && !nextBtn.dataset.configurado) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            proximoDestaque();
            reiniciarAutoplayDestaques();
        });
        nextBtn.dataset.configurado = 'true';
    }

    // Teclado
    if (!document.body.dataset.destaquesTeclado) {
        document.addEventListener('keydown', (e) => {
            const secao = document.getElementById('destaques');
            if (!secao) return;

            const rect = secao.getBoundingClientRect();
            const visivel = rect.top < window.innerHeight && rect.bottom > 0;
            if (!visivel) return;

            if (e.key === 'ArrowLeft') {
                destaqueAnterior();
                reiniciarAutoplayDestaques();
            } else if (e.key === 'ArrowRight') {
                proximoDestaque();
                reiniciarAutoplayDestaques();
            }
        });
        document.body.dataset.destaquesTeclado = 'true';
    }
}

// ========================================
// AUTOPLAY
// ========================================

function iniciarAutoplayDestaques() {
    pausarAutoplayDestaques();
    destaquesAutoplayTimer = setInterval(proximoDestaque, DESTAQUES_AUTOPLAY);
}

function pausarAutoplayDestaques() {
    if (destaquesAutoplayTimer) {
        clearInterval(destaquesAutoplayTimer);
        destaquesAutoplayTimer = null;
    }
}

function reiniciarAutoplayDestaques() {
    pausarAutoplayDestaques();
    iniciarAutoplayDestaques();
}

// ========================================
// SWIPE (MOBILE)
// ========================================

function configurarSwipeDestaques() {
    const viewport = document.querySelector('.destaques-viewport');
    if (!viewport || viewport.dataset.swipeConfigurado === 'true') return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let diffX = 0;
    const SWIPE_THRESHOLD = 50;

    viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        diffX = 0;
        pausarAutoplayDestaques();
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
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

    viewport.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        if (diffX > SWIPE_THRESHOLD) destaqueAnterior();
        else if (diffX < -SWIPE_THRESHOLD) proximoDestaque();
        reiniciarAutoplayDestaques();
    }, { passive: true });

    viewport.addEventListener('touchcancel', () => {
        isDragging = false;
        reiniciarAutoplayDestaques();
    }, { passive: true });

    viewport.dataset.swipeConfigurado = 'true';
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS (compatibilidade)
// ========================================

function configurarEventosDestaques() {
    // Os eventos são configurados em renderizarDestaques()
    console.log('✅ Eventos de destaques configurados via carrossel');
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.renderizarDestaques = renderizarDestaques;
window.configurarEventosDestaques = configurarEventosDestaques;
window.irParaDestaque = irParaDestaque;
window.proximoDestaque = proximoDestaque;
window.destaqueAnterior = destaqueAnterior;
window.irParaGrupoDestaque = irParaGrupoDestaque;

// Compatibilidade com chamadas antigas
window.mudarPaginaDestaques = function (direcao) {
    if (direcao > 0) proximoDestaque();
    else destaqueAnterior();
};

console.log('✅ Módulo de destaques (carrossel) carregado com sucesso!');