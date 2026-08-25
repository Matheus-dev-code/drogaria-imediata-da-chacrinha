// ========================================
// SISTEMA DE CARRINHO
// ========================================

let carrinho = [];
const FRETE_GRATIS_MINIMO = 10.00;

// ========================================
// CARREGAMENTO E PERSISTÊNCIA
// ========================================

function carregarCarrinho() {
    const saved = localStorage.getItem('carrinho');
    
    if (saved) {
        try {
            carrinho = JSON.parse(saved);
            if (!Array.isArray(carrinho)) carrinho = [];
            atualizarBadge();
            atualizarFreteProgresso();
        } catch (e) {
            console.error('❌ Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarBadge();
    atualizarFreteProgresso();
}

// ========================================
// OPERAÇÕES DO CARRINHO
// ========================================

function adicionarAoCarrinho(produto) {
    if (!produto || produto.id === undefined) return;

    const existente = carrinho.find(item => item.id === produto.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            marca: produto.marca,
            linha: produto.linha || produto.marca,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    // 📊 Registra evento no Analytics
    if (typeof registrarAdicaoAoCarrinho === 'function') {
        registrarAdicaoAoCarrinho(produto, 1);
    }

    salvarCarrinho();
    mostrarToast(`${produto.nome} adicionado!`);
    atualizarBotoesCarrinho();
    animarBadge();
    renderizarCarrinho();
}

function removerDoCarrinho(id) {
    const itemRemovido = carrinho.find(item => item.id === id);
    
    carrinho = carrinho.filter(item => item.id !== id);
    
    // 📊 Registra evento no Analytics
    if (itemRemovido && typeof registrarRemocaoDoCarrinho === 'function') {
        registrarRemocaoDoCarrinho(itemRemovido);
    }
    
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotoesCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotoesCarrinho();
}

function estaNoCarrinho(id) {
    return carrinho.some(item => item.id === id);
}

function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => {
        const preco = converterPreco(item.preco);
        const quantidade = Number(item.quantidade || 0);
        return total + (preco * quantidade);
    }, 0);
}

// ========================================
// RENDERIZAÇÃO DO CARRINHO
// ========================================

function renderizarCarrinho() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    const empty = container.parentElement?.querySelector('.cart-empty');
    const footer = document.getElementById('cartFooter');
    const totalSpan = document.getElementById('cartTotal');

    if (carrinho.length === 0) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        if (footer) footer.style.display = 'none';
        atualizarFreteProgresso();
        return;
    }

    if (empty) empty.style.display = 'none';
    if (footer) footer.style.display = 'block';

    let html = '';
    let total = 0;

    carrinho.forEach(item => {
        const precoNum = converterPreco(item.preco);
        const quantidade = Number(item.quantidade || 0);
        const subtotal = precoNum * quantidade;
        total += subtotal;

        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img"
                    onerror="this.src='https://via.placeholder.com/50x50/FF69B4/FFFFFF?text=?'">
                <div class="cart-item-info">
                    <div class="nome">${item.nome}</div>
                    <div class="preco">${item.preco}</div>
                </div>
                <div class="cart-item-actions">
                    <button onclick="alterarQuantidade(${item.id}, -1)">−</button>
                    <span class="qtd">${quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    <button class="btn-remover" onclick="removerDoCarrinho(${item.id})" title="Remover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalSpan) totalSpan.textContent = formatarPreco(total);
    atualizarFreteProgresso();
}

function atualizarFreteProgresso() {
    const container = document.querySelector('.frete-progress');
    const texto = document.getElementById('freteTexto');
    const barra = document.getElementById('freteBarFill');
    const status = document.getElementById('freteStatus');

    if (!container || !texto || !barra || !status) return;

    const total = calcularTotalCarrinho();

    if (carrinho.length === 0) {
        container.classList.remove('visible');
        return;
    }

    container.classList.add('visible');

    if (total >= FRETE_GRATIS_MINIMO) {
        texto.innerHTML = '🎉 <strong>Frete grátis garantido!</strong>';
        barra.style.width = '100%';
        status.textContent = '✅';
        status.style.color = '#4CAF50';
    } else {
        const falta = FRETE_GRATIS_MINIMO - total;
        const percentual = (total / FRETE_GRATIS_MINIMO) * 100;
        texto.innerHTML = `💸 Faltam <strong>${formatarPreco(falta)}</strong> para frete grátis!`;
        barra.style.width = `${Math.min(percentual, 100)}%`;
        status.textContent = '🛒';
        status.style.color = '';
    }
}

// ========================================
// UI DO CARRINHO
// ========================================

function atualizarBotoesCarrinho() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        const id = parseInt(btn.dataset.id);

        if (estaNoCarrinho(id)) {
            btn.classList.add('in-cart');
            btn.innerHTML = '<i class="fas fa-check"></i> No Carrinho';
            btn.style.background = '#4CAF50';
        } else {
            btn.classList.remove('in-cart');
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
            btn.style.background = '';
        }
    });
}

function abrirCarrinho() {
    const overlay = document.getElementById('cartOverlay');
    if (!overlay) return;
    
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderizarCarrinho();
    
    // 📊 Registra evento no Analytics
    if (typeof registrarAberturaCarrinho === 'function') {
        registrarAberturaCarrinho();
    }
}

function fecharCarrinho() {
    const overlay = document.getElementById('cartOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    
    // 📊 Registra evento no Analytics
    if (typeof registrarFechamentoCarrinho === 'function') {
        registrarFechamentoCarrinho();
    }
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio!');
        return;
    }

    const total = calcularTotalCarrinho();
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    // 📊 Registra evento no Analytics
    if (typeof registrarPedidoFinalizado === 'function') {
        registrarPedidoFinalizado(total, totalItens);
    }

    const numeroWhatsApp = '5521969583871';
    let mensagem = '🛒 *PEDIDO - Drogaria Imediata da Chacrinha*\n\n';
    mensagem += '*Produtos:*\n';

    carrinho.forEach(item => {
        const precoNum = converterPreco(item.preco);
        const quantidade = Number(item.quantidade || 0);
        const subtotal = precoNum * quantidade;
        mensagem += `${quantidade}x ${item.nome} - ${item.preco}\n`;
    });

    mensagem += `\n*Total: ${formatarPreco(total)}*\n\n`;
    mensagem += '*Observações:*\n- ';

    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}