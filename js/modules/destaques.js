// ========================================
// SISTEMA DE DESTAQUES
// ========================================

const DESTAQUES_POR_PAGINA = 4;
let paginaDestaques = 1;
let produtosDestaques = [];

// ========================================
// RENDERIZAÇÃO DOS DESTAQUES
// ========================================

function renderizarDestaques(produtos, pagina = 1) {
    const grid = document.getElementById('destaquesGrid');
    if (!grid) return;

    const todosDestaques = produtos.filter(p => p.destaque === true);
    produtosDestaques = todosDestaques;

    const totalPaginas = Math.ceil(todosDestaques.length / DESTAQUES_POR_PAGINA);

    if (todosDestaques.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:20px;color:var(--gray);">Nenhum destaque no momento.</p>';
        
        const paginacao = document.getElementById('destaquesPaginacao');
        if (paginacao) paginacao.style.display = 'none';
        
        return;
    }

    if (pagina > totalPaginas) pagina = totalPaginas;
    if (pagina < 1) pagina = 1;

    paginaDestaques = pagina;

    const inicio = (pagina - 1) * DESTAQUES_POR_PAGINA;
    const fim = inicio + DESTAQUES_POR_PAGINA;
    const destaquesPagina = todosDestaques.slice(inicio, fim);

    grid.innerHTML = '';

    destaquesPagina.forEach((produto, index) => {
        const card = criarProdutoCard(produto, true);
        grid.appendChild(card);
        setTimeout(() => card.classList.add('visible'), index * 100);
    });

    atualizarPaginacaoDestaques(totalPaginas);

    const pagContainer = document.getElementById('destaquesPaginacao');
    if (pagContainer) {
        pagContainer.style.display = totalPaginas > 1 ? 'flex' : 'none';
    }
}

function atualizarPaginacaoDestaques(totalPaginas) {
    const prevBtn = document.getElementById('destaquePrev');
    const nextBtn = document.getElementById('destaqueNext');
    const info = document.getElementById('destaqueInfo');

    if (prevBtn) prevBtn.disabled = paginaDestaques <= 1;
    if (nextBtn) nextBtn.disabled = paginaDestaques >= totalPaginas;
    if (info) info.textContent = `Página ${paginaDestaques} de ${totalPaginas}`;
}

function mudarPaginaDestaques(direcao) {
    const totalPaginas = Math.ceil(produtosDestaques.length / DESTAQUES_POR_PAGINA);
    const novaPagina = paginaDestaques + direcao;

    if (novaPagina < 1 || novaPagina > totalPaginas) return;

    renderizarDestaques(produtosEnriquecidos, novaPagina);

    const destaquesSection = document.getElementById('destaques');
    if (destaquesSection) scrollParaElemento(destaquesSection);
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS
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