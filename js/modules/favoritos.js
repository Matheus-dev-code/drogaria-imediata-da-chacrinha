// ========================================
// SISTEMA DE FAVORITOS (SEM CONTA)
// ========================================

const FAVORITOS_KEY = 'drogaria_favoritos';

let favoritos = [];

// ========================================
// CARREGAR / SALVAR
// ========================================

function carregarFavoritos() {
    try {
        const salvos = localStorage.getItem(FAVORITOS_KEY);
        favoritos = salvos ? JSON.parse(salvos) : [];
        if (!Array.isArray(favoritos)) favoritos = [];
        favoritos = favoritos.map(String);
    } catch (e) {
        console.warn('⚠️ Erro ao carregar favoritos:', e);
        favoritos = [];
    }
    atualizarBadgeFavoritos();
}

function salvarFavoritos() {
    try {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    } catch (e) {
        console.warn('⚠️ Erro ao salvar favoritos:', e);
    }
    atualizarBadgeFavoritos();
}

// ========================================
// AÇÕES
// ========================================

function isFavorito(id) {
    return favoritos.includes(String(id));
}

function toggleFavorito(id) {
    const idStr = String(id);
    const idx = favoritos.indexOf(idStr);

    if (idx > -1) {
        favoritos.splice(idx, 1);
        mostrarToast('💔 Removido dos favoritos');
    } else {
        favoritos.push(idStr);
        mostrarToast('❤️ Adicionado aos favoritos!');
    }

    salvarFavoritos();
    atualizarIconesFavoritos();
    animarBadgeFavoritos();

    // Atualiza modal se estiver aberto
    if (document.getElementById('favoritosModal')) {
        renderizarFavoritosModal();
    }
}

function removerFavorito(id) {
    const idStr = String(id);
    favoritos = favoritos.filter(f => f !== idStr);
    salvarFavoritos();
    atualizarIconesFavoritos();
    renderizarFavoritosModal();
}

function limparFavoritos() {
    if (favoritos.length === 0) return;
    if (!confirm('Tem certeza que deseja limpar todos os favoritos?')) return;

    favoritos = [];
    salvarFavoritos();
    atualizarIconesFavoritos();
    renderizarFavoritosModal();
    mostrarToast('🗑️ Favoritos limpos!');
}

// ========================================
// UI — BADGE NO HEADER
// ========================================

function atualizarBadgeFavoritos() {
    const badge = document.getElementById('favoritosBadge');
    if (!badge) return;

    const total = favoritos.length;
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

function animarBadgeFavoritos() {
    const badge = document.getElementById('favoritosBadge');
    if (!badge) return;
    badge.classList.remove('pulse');
    setTimeout(() => badge.classList.add('pulse'), 10);
}

// ========================================
// UI — CORAÇÕES NOS CARDS
// ========================================

function atualizarIconesFavoritos() {
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        const id = btn.dataset.id;
        if (isFavorito(id)) {
            btn.classList.add('ativo');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('ativo');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// ========================================
// MODAL DE FAVORITOS
// ========================================

function abrirFavoritosModal() {
    const modalExistente = document.getElementById('favoritosModal');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.id = 'favoritosModal';
    modal.className = 'favoritos-overlay';
    modal.innerHTML = `
        <div class="favoritos-modal">
            <div class="favoritos-header">
                <h2><i class="fas fa-heart"></i> Meus Favoritos</h2>
                <button class="favoritos-close" id="favoritosClose">&times;</button>
            </div>
            <div class="favoritos-body" id="favoritosBody"></div>
            <div class="favoritos-footer" id="favoritosFooter">
                <button class="btn-limpar-favoritos" onclick="limparFavoritos()">
                    <i class="fas fa-trash"></i> Limpar Tudo
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    renderizarFavoritosModal();

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharFavoritosModal();
    });

    document.getElementById('favoritosClose').addEventListener('click', fecharFavoritosModal);
}

function fecharFavoritosModal() {
    const modal = document.getElementById('favoritosModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
}

function renderizarFavoritosModal() {
    const body = document.getElementById('favoritosBody');
    const footer = document.getElementById('favoritosFooter');
    if (!body) return;

    if (favoritos.length === 0) {
        body.innerHTML = `
            <div class="favoritos-vazio">
                <i class="far fa-heart"></i>
                <p>Você ainda não tem favoritos</p>
                <small>Clique no ❤️ dos produtos para salvá-los aqui</small>
            </div>
        `;
        if (footer) footer.style.display = 'none';
        return;
    }

    if (footer) footer.style.display = 'flex';

    const produtos = (typeof produtosEnriquecidos !== 'undefined' && Array.isArray(produtosEnriquecidos))
        ? produtosEnriquecidos
        : [];

    const favoritosProdutos = favoritos
        .map(id => produtos.find(p => String(p.id) === String(id)))
        .filter(Boolean);

    if (favoritosProdutos.length === 0) {
        body.innerHTML = `
            <div class="favoritos-vazio">
                <i class="far fa-heart"></i>
                <p>Nenhum produto favoritado está disponível</p>
            </div>
        `;
        return;
    }

    body.innerHTML = favoritosProdutos.map(produto => {
        const preco = produto.preco || 'R$ 0,00';
        const img = produto.imagem || 'https://via.placeholder.com/60x60/FF69B4/FFFFFF?text=?';
        const esgotado = produto.esgotado === true;

        return `
            <div class="favorito-item" data-id="${produto.id}">
                <img src="${img}" alt="${produto.nome}" class="favorito-img"
                    onerror="this.src='https://via.placeholder.com/60x60/FF69B4/FFFFFF?text=?'">
                <div class="favorito-info">
                    <div class="favorito-nome">${produto.nome}</div>
                    <div class="favorito-marca">${produto.marca || ''}</div>
                    <div class="favorito-preco">${preco}</div>
                </div>
                <div class="favorito-acoes">
                    ${esgotado
                        ? `<span class="favorito-esgotado">ESGOTADO</span>`
                        : `<button class="btn-fav-add-cart" onclick="adicionarFavoritoAoCarrinho('${produto.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>`
                    }
                    <button class="btn-fav-remover" onclick="removerFavorito('${produto.id}')" title="Remover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function adicionarFavoritoAoCarrinho(id) {
    const produtos = (typeof produtosEnriquecidos !== 'undefined' && Array.isArray(produtosEnriquecidos))
        ? produtosEnriquecidos
        : [];

    const produto = produtos.find(p => String(p.id) === String(id));
    if (!produto) return;

    if (typeof adicionarAoCarrinho === 'function') {
        adicionarAoCarrinho(produto);
    }
}

// ========================================
// CONFIGURAR BOTÃO DO HEADER
// ========================================

function configurarBotaoFavoritos() {
    const btn = document.getElementById('favoritosIcon');
    if (!btn) return;

    btn.addEventListener('click', abrirFavoritosModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharFavoritosModal();
    });
}

// ========================================
// EXPORTA
// ========================================

window.carregarFavoritos              = carregarFavoritos;
window.salvarFavoritos                = salvarFavoritos;
window.isFavorito                     = isFavorito;
window.toggleFavorito                 = toggleFavorito;
window.removerFavorito                = removerFavorito;
window.limparFavoritos                = limparFavoritos;
window.atualizarIconesFavoritos       = atualizarIconesFavoritos;
window.atualizarBadgeFavoritos        = atualizarBadgeFavoritos;
window.abrirFavoritosModal            = abrirFavoritosModal;
window.fecharFavoritosModal           = fecharFavoritosModal;
window.renderizarFavoritosModal       = renderizarFavoritosModal;
window.adicionarFavoritoAoCarrinho    = adicionarFavoritoAoCarrinho;
window.configurarBotaoFavoritos       = configurarBotaoFavoritos;

console.log('✅ Módulo de favoritos carregado!');