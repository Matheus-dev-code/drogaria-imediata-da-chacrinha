// ========================================
// SISTEMA DE CARRINHO
// ========================================

let carrinho = [];
const FRETE_GRATIS_MINIMO = 10.00;

// Lista de bairros atendidos
const BAIRROS_ATENDIDOS = [
    'Praça Seca',
    'Chacrinha',
    'Bato',
    'Chácara',
    'Capitão Menezes',
    'Capitão Machado'
];

// ========================================
// CARREGAMENTO E PERSISTÊNCIA (sessionStorage)
// - Sobrevive ao F5 (recarregar)
// - Zera ao fechar a aba/navegador
// ========================================

function carregarCarrinho() {
    const saved = sessionStorage.getItem('carrinho');

    if (saved) {
        try {
            carrinho = JSON.parse(saved);
            if (!Array.isArray(carrinho)) carrinho = [];

            // 🔑 Normaliza todos os IDs para string
            carrinho = carrinho.map(item => ({
                ...item,
                id: String(item.id)
            }));

            atualizarBadge();
            atualizarFreteProgresso();
        } catch (e) {
            console.error('❌ Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    }
}

function salvarCarrinho() {
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarBadge();
    atualizarFreteProgresso();
}

// ========================================
// SALVAR E CARREGAR DADOS DO CLIENTE
// ========================================

function salvarDadosCliente(dados) {
    try {
        localStorage.setItem('dadosCliente', JSON.stringify(dados));
        console.log('💾 Dados do cliente salvos com sucesso!');
    } catch (e) {
        console.error('❌ Erro ao salvar dados do cliente:', e);
    }
}

function carregarDadosCliente() {
    try {
        const dados = JSON.parse(localStorage.getItem('dadosCliente') || '{}');
        return dados;
    } catch (e) {
        console.error('❌ Erro ao carregar dados do cliente:', e);
        return {};
    }
}

function limparDadosCliente() {
    localStorage.removeItem('dadosCliente');
    console.log('🗑️ Dados do cliente removidos');
}

// ========================================
// OPERAÇÕES DO CARRINHO
// ========================================

function adicionarAoCarrinho(produto) {
    if (!produto || !produto.nome) {
        console.error('❌ Produto inválido:', produto);
        return;
    }

    console.log(`📦 Tentando adicionar: ${produto.nome} (ID: ${produto.id})`);

    // 🔑 Comparação por string (funciona com ID numérico ou string)
    const existente = carrinho.find(item => {
        if (item.id && produto.id && String(item.id) === String(produto.id)) {
            return true;
        }
        if (item.nome && produto.nome) {
            return item.nome.toLowerCase() === produto.nome.toLowerCase();
        }
        return false;
    });

    if (existente) {
        existente.quantidade = (existente.quantidade || 1) + 1;
        console.log(`📦 ${produto.nome} - Quantidade aumentada para ${existente.quantidade}`);
    } else {
        const novoItem = {
            id: produto.id ? String(produto.id) : String(Date.now()),
            nome: produto.nome,
            marca: produto.marca || '',
            linha: produto.linha || produto.marca || '',
            preco: produto.preco || 'R$ 0,00',
            imagem: produto.imagem || '',
            quantidade: 1
        };

        carrinho.push(novoItem);
        console.log(`🆕 ${produto.nome} - Adicionado ao carrinho!`);
    }

    // 📊 Analytics
    if (typeof registrarAdicaoAoCarrinho === 'function') {
        registrarAdicaoAoCarrinho(produto, 1);
    }

    // Salva e atualiza interface
    salvarCarrinho();
    mostrarToast(`${produto.nome} adicionado!`);
    atualizarBotoesCarrinho();
    animarBadge();
    renderizarCarrinho();

    console.log('🛒 Carrinho atual:', carrinho.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade
    })));
}

function removerDoCarrinho(id) {
    // 🔑 Converte pra string pra garantir comparação consistente
    const idStr = String(id);

    const itemRemovido = carrinho.find(item => String(item.id) === idStr);

    carrinho = carrinho.filter(item => String(item.id) !== idStr);

    if (itemRemovido && typeof registrarRemocaoDoCarrinho === 'function') {
        registrarRemocaoDoCarrinho(itemRemovido);
    }

    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotoesCarrinho();
}

function alterarQuantidade(id, delta) {
    // 🔑 Converte pra string pra garantir comparação consistente
    const idStr = String(id);
    const item = carrinho.find(i => String(i.id) === idStr);

    if (!item) {
        console.warn('⚠️ Item não encontrado no carrinho:', id);
        return;
    }

    item.quantidade = (item.quantidade || 1) + delta;

    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotoesCarrinho();
}

function estaNoCarrinho(id) {
    // 🔑 Comparação por string
    const idStr = String(id);
    return carrinho.some(item => String(item.id) === idStr);
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

        // 🔑 ID escapado para atributo data-id (HTML)
        const idAttr = String(item.id)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        html += `
            <div class="cart-item" data-id="${idAttr}">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img"
                    onerror="this.src='https://via.placeholder.com/50x50/FF69B4/FFFFFF?text=?'">
                <div class="cart-item-info">
                    <div class="nome">${item.nome}</div>
                    <div class="preco">${item.preco}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-qtd-menos" data-id="${idAttr}" data-acao="menos">−</button>
                    <span class="qtd">${quantidade}</span>
                    <button class="btn-qtd-mais" data-id="${idAttr}" data-acao="mais">+</button>
                    <button class="btn-remover" data-id="${idAttr}" data-acao="remover" title="Remover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalSpan) totalSpan.textContent = formatarPreco(total);

    // 🔑 Event delegation: um único listener no container
    if (!container.dataset.eventosCarrinho) {
        container.addEventListener('click', function (e) {
            const btn = e.target.closest('button[data-acao]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const id = btn.dataset.id;        // string
            const acao = btn.dataset.acao;    // 'mais' | 'menos' | 'remover'

            console.log(`🖱️ Clique no carrinho: ação="${acao}", id="${id}"`);

            if (acao === 'mais') {
                alterarQuantidade(id, 1);
            } else if (acao === 'menos') {
                alterarQuantidade(id, -1);
            } else if (acao === 'remover') {
                removerDoCarrinho(id);
            }
        });

        container.dataset.eventosCarrinho = 'true';
        console.log('✅ Event delegation do carrinho configurado');
    }

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
        // 🔑 NÃO converte pra Number — o ID agora é string
        const id = btn.dataset.id;

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

    if (typeof registrarAberturaCarrinho === 'function') {
        registrarAberturaCarrinho();
    }
}

function fecharCarrinho() {
    const overlay = document.getElementById('cartOverlay');
    if (!overlay) return;

    overlay.classList.remove('open');
    document.body.style.overflow = '';

    if (typeof registrarFechamentoCarrinho === 'function') {
        registrarFechamentoCarrinho();
    }
}

// ========================================
// CHECKOUT - DADOS DE ENTREGA
// ========================================

function abrirCheckout() {
    if (carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio!');
        return;
    }

    const total = calcularTotalCarrinho();

    fecharCarrinho();

    const modalExistente = document.getElementById('checkoutModal');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease-out;
        padding: 20px;
        backdrop-filter: blur(4px);
    `;

    const bairrosOptions = BAIRROS_ATENDIDOS.map(bairro =>
        `<option value="${bairro}">${bairro}</option>`
    ).join('');

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            max-width: 520px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
        ">
            <div style="
                background: linear-gradient(135deg, #8B0045, #5C0030);
                color: white;
                padding: 20px 24px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 10;
            ">
                <h3 style="
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                ">
                    📦 Finalizar Pedido
                </h3>
                <button onclick="fecharCheckout()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0 5px;
                    line-height: 1;
                ">&times;</button>
            </div>

            <div style="padding: 24px;">
                <div style="
                    background: #FDF2F8;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 20px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    ">
                        <span style="color: #666;">Total do pedido:</span>
                        <strong style="color: #8B0045; font-size: 20px;">
                            ${formatarPreco(total)}
                        </strong>
                    </div>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                    ">
                        <span style="color: #666;">Itens:</span>
                        <strong>${carrinho.length} produto(s)</strong>
                    </div>
                </div>

                <form id="checkoutForm" onsubmit="event.preventDefault(); processarCheckout();">
                    <div style="margin-bottom: 15px;">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">👤 Nome Completo *</label>
                        <input type="text" id="checkoutNome" required placeholder="Seu nome completo"
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #E0E0E0;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                                transition: border-color 0.3s;
                            ">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">📍 Endereço (Rua, Avenida) *</label>
                        <input type="text" id="checkoutEndereco" required placeholder="Rua, Avenida, etc."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #E0E0E0;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                            ">
                    </div>

                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        margin-bottom: 15px;
                    ">
                        <div>
                            <label style="
                                display: block;
                                margin-bottom: 5px;
                                font-weight: 600;
                                color: #333;
                                font-size: 14px;
                            ">🔢 Número *</label>
                            <input type="text" id="checkoutNumero" required placeholder="Nº"
                                style="
                                    width: 100%;
                                    padding: 12px;
                                    border: 2px solid #E0E0E0;
                                    border-radius: 10px;
                                    font-size: 14px;
                                    outline: none;
                                ">
                        </div>
                        <div>
                            <label style="
                                display: block;
                                margin-bottom: 5px;
                                font-weight: 600;
                                color: #333;
                                font-size: 14px;
                            ">🏘️ Bairro *</label>
                            <select id="checkoutBairro" required
                                style="
                                    width: 100%;
                                    padding: 12px;
                                    border: 2px solid #E0E0E0;
                                    border-radius: 10px;
                                    font-size: 14px;
                                    outline: none;
                                    background: white;
                                    cursor: pointer;
                                ">
                                <option value="">Selecione...</option>
                                ${bairrosOptions}
                            </select>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">🏠 Complemento *</label>
                        <input type="text" id="checkoutComplemento" required placeholder="Apto, bloco, casa, etc."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #E0E0E0;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                            ">
                        <small style="
                            display: block;
                            margin-top: 4px;
                            color: #999;
                            font-size: 11px;
                        ">Se não tiver, digite "Não possui"</small>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">🔍 Ponto de Referência *</label>
                        <input type="text" id="checkoutReferencia" required placeholder="Próximo a..."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #E0E0E0;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                            ">
                        <small style="
                            display: block;
                            margin-top: 4px;
                            color: #999;
                            font-size: 11px;
                        ">Ex: Próximo à padaria, igreja, etc.</small>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">💳 Forma de Pagamento *</label>
                        <select id="checkoutPagamento" required
                            onchange="mostrarObservacaoPagamento(this.value)"
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #E0E0E0;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                                background: white;
                                cursor: pointer;
                            ">
                            <option value="">Selecione...</option>
                            <option value="Dinheiro">💵 Dinheiro</option>
                            <option value="Cartão de Crédito">💳 Cartão de Crédito (Na maquininha)</option>
                            <option value="Cartão de Débito">💳 Cartão de Débito (Na maquininha)</option>
                            <option value="PIX">⚡ PIX</option>
                        </select>

                        <div id="observacaoPix" style="
                            display: none;
                            background: #FFF3CD;
                            border: 1px solid #FFC107;
                            border-radius: 8px;
                            padding: 12px;
                            margin-top: 8px;
                            font-size: 13px;
                            color: #856404;
                        ">
                            <strong>⚠️ Importante PIX:</strong><br>
                            • Solicitar chave para pagamento<br>
                            • Entrega só é liberada após o comprovante ser enviado
                        </div>

                        <div id="observacaoDinheiro" style="
                            display: none;
                            background: #D1ECF1;
                            border: 1px solid #17A2B8;
                            border-radius: 8px;
                            padding: 12px;
                            margin-top: 8px;
                            font-size: 13px;
                            color: #0C5460;
                        ">
                            <strong>💵 Troco:</strong><br>
                            <span style="font-size: 12px;">Se precisar de troco, informe no campo abaixo:</span>
                        </div>
                    </div>

                    <div id="campoTroco" style="
                        display: none;
                        margin-bottom: 15px;
                        animation: fadeIn 0.3s ease;
                    ">
                        <label style="
                            display: block;
                            margin-bottom: 5px;
                            font-weight: 600;
                            color: #333;
                            font-size: 14px;
                        ">💵 Troco para quanto? *</label>
                        <input type="text" id="checkoutTroco" placeholder="Ex: Troco para R$ 100,00"
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #17A2B8;
                                border-radius: 10px;
                                font-size: 14px;
                                outline: none;
                            ">
                    </div>

                    <button type="submit" style="
                        width: 100%;
                        padding: 14px;
                        background: linear-gradient(135deg, #25D366, #128C7E);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        transition: transform 0.2s;
                        margin-top: 10px;
                    ">
                        <i class="fab fa-whatsapp"></i>
                        Enviar Pedido pelo WhatsApp
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const dadosSalvos = carregarDadosCliente();

    setTimeout(() => {
        if (dadosSalvos.nome) {
            document.getElementById('checkoutNome').value = dadosSalvos.nome;
        }
        if (dadosSalvos.endereco) {
            document.getElementById('checkoutEndereco').value = dadosSalvos.endereco;
        }
        if (dadosSalvos.numero) {
            document.getElementById('checkoutNumero').value = dadosSalvos.numero;
        }
        if (dadosSalvos.bairro) {
            document.getElementById('checkoutBairro').value = dadosSalvos.bairro;
        }
        if (dadosSalvos.complemento) {
            document.getElementById('checkoutComplemento').value = dadosSalvos.complemento;
        }
        if (dadosSalvos.referencia) {
            document.getElementById('checkoutReferencia').value = dadosSalvos.referencia;
        }

        if (dadosSalvos.nome) {
            mostrarToast('👋 Bem-vindo de volta! Seus dados foram preenchidos.');
        }
    }, 100);

    setTimeout(() => {
        const input = document.getElementById('checkoutNome');
        if (input) input.focus();
    }, 200);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            fecharCheckout();
        }
    });
}

function mostrarObservacaoPagamento(valor) {
    const obsPix = document.getElementById('observacaoPix');
    const obsDinheiro = document.getElementById('observacaoDinheiro');
    const campoTroco = document.getElementById('campoTroco');
    const inputTroco = document.getElementById('checkoutTroco');

    if (obsPix) obsPix.style.display = 'none';
    if (obsDinheiro) obsDinheiro.style.display = 'none';
    if (campoTroco) campoTroco.style.display = 'none';

    if (inputTroco) inputTroco.required = false;

    if (valor === 'PIX') {
        if (obsPix) obsPix.style.display = 'block';
    } else if (valor === 'Dinheiro') {
        if (obsDinheiro) obsDinheiro.style.display = 'block';
        if (campoTroco) campoTroco.style.display = 'block';
        if (inputTroco) inputTroco.required = true;
    }
}

function fecharCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
}

function processarCheckout() {
    const nome = document.getElementById('checkoutNome').value.trim();
    const endereco = document.getElementById('checkoutEndereco').value.trim();
    const numero = document.getElementById('checkoutNumero').value.trim();
    const bairro = document.getElementById('checkoutBairro').value;
    const complemento = document.getElementById('checkoutComplemento').value.trim();
    const referencia = document.getElementById('checkoutReferencia').value.trim();
    const pagamento = document.getElementById('checkoutPagamento').value;
    const troco = document.getElementById('checkoutTroco').value.trim();

    if (!nome) {
        mostrarToast('⚠️ Informe seu nome completo!');
        document.getElementById('checkoutNome').focus();
        return;
    }

    if (!endereco) {
        mostrarToast('⚠️ Informe seu endereço!');
        document.getElementById('checkoutEndereco').focus();
        return;
    }

    if (!numero) {
        mostrarToast('⚠️ Informe o número!');
        document.getElementById('checkoutNumero').focus();
        return;
    }

    if (!bairro) {
        mostrarToast('⚠️ Selecione o bairro!');
        document.getElementById('checkoutBairro').focus();
        return;
    }

    if (!complemento) {
        mostrarToast('⚠️ Informe o complemento (ou digite "Não possui")!');
        document.getElementById('checkoutComplemento').focus();
        return;
    }

    if (!referencia) {
        mostrarToast('⚠️ Informe um ponto de referência!');
        document.getElementById('checkoutReferencia').focus();
        return;
    }

    if (!pagamento) {
        mostrarToast('⚠️ Selecione a forma de pagamento!');
        document.getElementById('checkoutPagamento').focus();
        return;
    }

    if (pagamento === 'Dinheiro' && !troco) {
        mostrarToast('⚠️ Informe o valor do troco (ou digite "Não precisa")!');
        document.getElementById('checkoutTroco').focus();
        return;
    }

    const dadosCliente = {
        nome: nome,
        endereco: endereco,
        numero: numero,
        bairro: bairro,
        complemento: complemento,
        referencia: referencia
    };

    salvarDadosCliente(dadosCliente);

    const total = calcularTotalCarrinho();
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    if (typeof registrarPedidoFinalizado === 'function') {
        registrarPedidoFinalizado(total, totalItens);
    }

    const numeroWhatsApp = '5521969583871';
    let mensagem = '🛒 *NOVO PEDIDO - Drogaria Imediata da Chacrinha*\n\n';

    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';
    mensagem += '👤 *DADOS DO CLIENTE*\n';
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';
    mensagem += `📝 Nome: ${nome}\n`;
    mensagem += `📍 Endereço: ${endereco}, ${numero}\n`;
    mensagem += `🏘️ Bairro: ${bairro}\n`;
    mensagem += `🏠 Complemento: ${complemento}\n`;
    mensagem += `🔍 Referência: ${referencia}\n`;

    if (pagamento === 'Cartão de Crédito') {
        mensagem += `💳 Pagamento: Cartão de Crédito (Na maquininha)\n`;
    } else if (pagamento === 'Cartão de Débito') {
        mensagem += `💳 Pagamento: Cartão de Débito (Na maquininha)\n`;
    } else if (pagamento === 'Dinheiro') {
        mensagem += `💵 Pagamento: Dinheiro\n`;
        mensagem += `💵 Troco: ${troco}\n`;
    } else if (pagamento === 'PIX') {
        mensagem += `⚡ Pagamento: PIX\n`;
        mensagem += `⚠️ *PIX:* Solicitarei a chave para pagamento. Entrega liberada após envio do comprovante.\n`;
    }

    mensagem += '\n';
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';
    mensagem += '🛍️ *PRODUTOS*\n';
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';

    carrinho.forEach(item => {
        const quantidade = Number(item.quantidade || 0);
        mensagem += `✅ ${quantidade}x ${item.nome}\n`;
        mensagem += `   ${item.preco} cada\n`;
    });

    mensagem += '\n';
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n';
    mensagem += `💰 *TOTAL: ${formatarPreco(total)}*\n`;
    mensagem += '━━━━━━━━━━━━━━━━━━━━\n\n';
    mensagem += '🙏 *Aguardo confirmação do pedido!*';

    // ========================================
    // GUARDA CÓPIA DO CARRINHO (para desfazer)
    // ========================================
    const carrinhoBackup = JSON.parse(JSON.stringify(carrinho));

    // ========================================
    // ABRE WHATSAPP VIA <a> (mais confiável em mobile)
    // ========================================
    const link = document.createElement('a');
    link.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fecha o modal de checkout
    fecharCheckout();

    // ========================================
    // LIMPA O CARRINHO AUTOMATICAMENTE
    // ========================================
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBotoesCarrinho();

    // ========================================
    // TOAST COM OPÇÃO DE DESFAZER
    // ========================================
    mostrarToastComAcao(
        '✅ Pedido enviado! Obrigado 💜',
        'Desfazer',
        () => {
            carrinho = carrinhoBackup;
            salvarCarrinho();
            renderizarCarrinho();
            atualizarBotoesCarrinho();
            mostrarToast('↩️ Carrinho restaurado');
        },
        8000
    );
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

window.carregarCarrinho = carregarCarrinho;
window.salvarCarrinho = salvarCarrinho;
window.salvarDadosCliente = salvarDadosCliente;
window.carregarDadosCliente = carregarDadosCliente;
window.limparDadosCliente = limparDadosCliente;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.estaNoCarrinho = estaNoCarrinho;
window.calcularTotalCarrinho = calcularTotalCarrinho;
window.renderizarCarrinho = renderizarCarrinho;
window.atualizarFreteProgresso = atualizarFreteProgresso;
window.atualizarBotoesCarrinho = atualizarBotoesCarrinho;
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.abrirCheckout = abrirCheckout;
window.fecharCheckout = fecharCheckout;
window.processarCheckout = processarCheckout;
window.mostrarObservacaoPagamento = mostrarObservacaoPagamento;

console.log('✅ Módulo de carrinho carregado com sucesso!');