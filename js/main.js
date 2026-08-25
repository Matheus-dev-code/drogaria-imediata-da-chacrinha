// ========================================
// ARQUIVO PRINCIPAL - JUNTA TODOS OS PRODUTOS
// ========================================

const todosProdutos = [
    ...produtosSalonLineKids,
    ...produtosSalonLineAdulto,
    ...produtosSeda,
    ...produtosLoreal,
    ...produtosPaixao,
    ...produtosMaxton,
    ...produtosCoreton,
    ...produtosDove,
    ...produtosNivea,
    ...produtosMuriel,
    ...produtosAcnezil,
    ...produtosAsepxia,
    ...produtosBepantriz,
    ...produtosBepantol,
    ...produtosCicatricure,
    ...produtosFacebeautiful,
    ...produtosRexona,
    ...produtosBabysec,
    ...produtosMonange,
    ...produtosGiovannababy,
    ...produtosMarcia,
    ...produtosNatuhair,
    ...produtosGranado,
];

// ========================================
// ADICIONA CAMPOS DE PROMOÇÃO E AVALIAÇÃO
// ========================================

const idsPromocao = [
    101, 201, 301, 401, 501,
    601, 701, 801, 901, 1001
];

const idsAvaliacao = {
    101: 4.8,
    201: 4.7,
    301: 4.6,
    401: 4.9,
    501: 4.5,
    601: 4.4,
    701: 4.3,
    801: 4.7,
    901: 4.6,
    1001: 4.8,
};

function enriquecerProdutos(produtos) {
    return produtos.map(produto => {
        // Promoção
        produto.promocao = idsPromocao.includes(produto.id);

        // Avaliação
        if (idsAvaliacao[produto.id]) {
            produto.avaliacao = idsAvaliacao[produto.id];
        } else {
            produto.avaliacao = Math.round((4.0 + Math.random() * 0.9) * 10) / 10;
            if (produto.avaliacao > 4.9) {
                produto.avaliacao = 4.9;
            }
        }

        produto.totalAvaliacoes = Math.floor(50 + Math.random() * 200);

        // 🔥 NOVO: Garante que o campo 'linha' exista
        // Se o produto já tem 'linha' (como os da L'Oréal), mantém
        // Se não tem, cria um valor padrão baseado na marca
        if (!produto.linha) {
            // Tenta extrair a linha do nome do produto (se tiver)
            const nomeParts = produto.nome.split(' - ');
            if (nomeParts.length > 1) {
                // Pega a primeira parte do nome como linha (ex: "Shampoo Óleo Extraordinário" -> "Óleo Extraordinário")
                const possibleLine = nomeParts[0].replace(/^(Shampoo|Condicionador|Máscara|Creme|Kit|Óleo|Sabonete|Desodorante|Hidratante)\s+/i, '').trim();
                if (possibleLine && possibleLine.length > 2) {
                    produto.linha = possibleLine;
                } else {
                    produto.linha = produto.marca;
                }
            } else {
                // Se não tem linha definida, usa a marca
                produto.linha = produto.marca;
            }
        }

        // Se a linha estiver vazia, usa a marca
        if (!produto.linha || produto.linha.trim() === '') {
            produto.linha = produto.marca;
        }

        return produto;
    });
}

const produtosEnriquecidos = enriquecerProdutos(todosProdutos);

// ========================================
// FUNÇÕES UTILITÁRIAS DE PREÇO
// ========================================

function converterPreco(preco) {
    if (typeof preco === 'number') {
        return preco;
    }

    if (typeof preco !== 'string') {
        return 0;
    }

    let valor = preco
        .replace(/R\$/gi, '')
        .replace(/\s/g, '')
        .trim();

    if (valor.includes(',')) {
        valor = valor.replace(/\./g, '').replace(',', '.');
    }

    return parseFloat(valor) || 0;
}

function formatarPreco(valor) {
    return `R$ ${Number(valor || 0)
        .toFixed(2)
        .replace('.', ',')}`;
}

// ========================================
// SISTEMA DE CARRINHO
// ========================================

let carrinho = [];

function carregarCarrinho() {
    const saved = localStorage.getItem('carrinho');

    if (saved) {
        try {
            carrinho = JSON.parse(saved);

            if (!Array.isArray(carrinho)) {
                carrinho = [];
            }

            atualizarBadge();
            atualizarFreteProgresso();

        } catch (e) {
            console.error('❌ Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    }
}

function salvarCarrinho() {
    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    );

    atualizarBadge();
    atualizarFreteProgresso();
}

function atualizarBadge() {
    const badge = document.getElementById('cartBadge');

    if (!badge) return;

    const total = carrinho.reduce(
        (sum, item) => sum + Number(item.quantidade || 0),
        0
    );

    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

// ========================================
// BARRA DE PROGRESSO DO FRETE GRÁTIS
// ========================================

const FRETE_GRATIS_MINIMO = 10.00;

function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => {
        const preco = converterPreco(item.preco);
        const quantidade = Number(item.quantidade || 0);

        return total + (preco * quantidade);
    }, 0);
}

function atualizarFreteProgresso() {
    const container = document.querySelector('.frete-progress');
    const texto = document.getElementById('freteTexto');
    const barra = document.getElementById('freteBarFill');
    const status = document.getElementById('freteStatus');

    if (!container || !texto || !barra || !status) {
        return;
    }

    const total = calcularTotalCarrinho();

    if (carrinho.length === 0) {
        container.classList.remove('visible');
        return;
    }

    container.classList.add('visible');

    if (total >= FRETE_GRATIS_MINIMO) {

        texto.innerHTML =
            '🎉 <strong>Frete grátis garantido!</strong>';

        barra.style.width = '100%';

        status.textContent = '✅';
        status.style.color = '#4CAF50';

    } else {

        const falta = FRETE_GRATIS_MINIMO - total;

        const percentual =
            (total / FRETE_GRATIS_MINIMO) * 100;

        texto.innerHTML =
            `💸 Faltam <strong>${formatarPreco(falta)}</strong> para frete grátis!`;

        barra.style.width =
            `${Math.min(percentual, 100)}%`;

        status.textContent = '🛒';
        status.style.color = '';
    }
}

// ========================================
// RENDERIZAÇÃO DE ESTRELAS
// ========================================

function renderizarEstrelas(avaliacao) {

    const valor = Number(avaliacao) || 0;

    const estrelasCheias = Math.floor(valor);

    const meiaEstrela =
        valor - estrelasCheias >= 0.5;

    const estrelasVazias =
        5 -
        estrelasCheias -
        (meiaEstrela ? 1 : 0);

    let html = '';

    for (let i = 0; i < estrelasCheias; i++) {
        html += '<i class="fas fa-star"></i>';
    }

    if (meiaEstrela) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < estrelasVazias; i++) {
        html += '<i class="fas fa-star vazia"></i>';
    }

    return html;
}

// ========================================
// FUNÇÕES DO CARRINHO
// ========================================

function adicionarAoCarrinho(produto) {

    if (!produto || produto.id === undefined) {
        return;
    }

    const existente =
        carrinho.find(item => item.id === produto.id);

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

    salvarCarrinho();

    mostrarToast(
        `${produto.nome} adicionado!`
    );

    atualizarBotoesCarrinho();
    animarBadge();
    renderizarCarrinho();
}

function removerDoCarrinho(id) {

    carrinho =
        carrinho.filter(item => item.id !== id);

    salvarCarrinho();

    renderizarCarrinho();
    atualizarBotoesCarrinho();
}

function alterarQuantidade(id, delta) {

    const item =
        carrinho.find(i => i.id === id);

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

    return carrinho.some(
        item => item.id === id
    );
}

function atualizarBotoesCarrinho() {

    document
        .querySelectorAll('.btn-add-cart')
        .forEach(btn => {

            const id =
                parseInt(btn.dataset.id);

            if (estaNoCarrinho(id)) {

                btn.classList.add('in-cart');

                btn.innerHTML =
                    '<i class="fas fa-check"></i> No Carrinho';

                btn.style.background =
                    '#4CAF50';

            } else {

                btn.classList.remove('in-cart');

                btn.innerHTML =
                    '<i class="fas fa-cart-plus"></i> Adicionar';

                btn.style.background = '';
            }
        });
}

function animarBadge() {

    const badge =
        document.getElementById('cartBadge');

    if (!badge) return;

    badge.classList.remove('pulse');

    setTimeout(() => {
        badge.classList.add('pulse');
    }, 10);
}

function mostrarToast(mensagem) {

    const toast =
        document.getElementById('toastNotification');

    if (!toast) return;

    const span =
        toast.querySelector('span');

    if (span) {
        span.textContent = mensagem;
    }

    toast.classList.add('show');

    clearTimeout(toast._timeout);

    toast._timeout =
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
}

// ========================================
// RENDERIZAÇÃO DO CARRINHO
// ========================================

function renderizarCarrinho() {

    const container =
        document.getElementById('cartItems');

    if (!container) return;

    const empty =
        container.parentElement
            ?.querySelector('.cart-empty');

    const footer =
        document.getElementById('cartFooter');

    const totalSpan =
        document.getElementById('cartTotal');

    if (carrinho.length === 0) {

        container.innerHTML = '';

        if (empty) {
            empty.style.display = 'block';
        }

        if (footer) {
            footer.style.display = 'none';
        }

        atualizarFreteProgresso();

        return;
    }

    if (empty) {
        empty.style.display = 'none';
    }

    if (footer) {
        footer.style.display = 'block';
    }

    let html = '';
    let total = 0;

    carrinho.forEach(item => {

        const precoNum =
            converterPreco(item.preco);

        const quantidade =
            Number(item.quantidade || 0);

        const subtotal =
            precoNum * quantidade;

        total += subtotal;

        html += `
            <div class="cart-item" data-id="${item.id}">

                <img
                    src="${item.imagem}"
                    alt="${item.nome}"
                    class="cart-item-img"
                    onerror="this.src='https://via.placeholder.com/50x50/FF69B4/FFFFFF?text=?'"
                >

                <div class="cart-item-info">

                    <div class="nome">
                        ${item.nome}
                    </div>

                    <div class="preco">
                        ${item.preco}
                    </div>

                </div>

                <div class="cart-item-actions">

                    <button
                        onclick="alterarQuantidade(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span class="qtd">
                        ${quantidade}
                    </span>

                    <button
                        onclick="alterarQuantidade(${item.id}, 1)"
                    >
                        +
                    </button>

                    <button
                        class="btn-remover"
                        onclick="removerDoCarrinho(${item.id})"
                        title="Remover"
                    >
                        <i class="fas fa-times"></i>
                    </button>

                </div>

            </div>
        `;
    });

    container.innerHTML = html;

    if (totalSpan) {
        totalSpan.textContent =
            formatarPreco(total);
    }

    atualizarFreteProgresso();
}

// ========================================
// FINALIZAR PEDIDO VIA WHATSAPP
// ========================================

function finalizarPedido() {

    if (carrinho.length === 0) {

        mostrarToast(
            'Seu carrinho está vazio!'
        );

        return;
    }

    const numeroWhatsApp =
        '5521969583871';

    let mensagem =
        '🛒 *PEDIDO - Drogaria Imediata da Chacrinha*\n\n';

    mensagem +=
        '*Produtos:*\n';

    let total = 0;

    carrinho.forEach(item => {

        const precoNum =
            converterPreco(item.preco);

        const quantidade =
            Number(item.quantidade || 0);

        const subtotal =
            precoNum * quantidade;

        total += subtotal;

        mensagem +=
            `${quantidade}x ${item.nome} - ${item.preco}\n`;
    });

    mensagem +=
        `\n*Total: ${formatarPreco(total)}*\n\n`;

    mensagem +=
        '*Observações:*\n- ';

    window.open(
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
    );
}

// ========================================
// ABRIR/FECHAR CARRINHO
// ========================================

function abrirCarrinho() {

    const overlay =
        document.getElementById('cartOverlay');

    if (!overlay) return;

    overlay.classList.add('open');

    document.body.style.overflow =
        'hidden';

    renderizarCarrinho();
}

function fecharCarrinho() {

    const overlay =
        document.getElementById('cartOverlay');

    if (!overlay) return;

    overlay.classList.remove('open');

    document.body.style.overflow = '';
}

// ========================================
// SISTEMA DE AUTENTICAÇÃO ADMIN
// ========================================

let isAdmin = false;

const ADMIN_EMAIL =
    'admin@drogariaimediata.com';

function verificarAdmin() {

    return new Promise((resolve) => {

        if (
            typeof firebase === 'undefined' ||
            !firebase.auth
        ) {

            console.warn(
                '⚠️ Firebase Authentication não disponível.'
            );

            resolve(false);
            return;
        }

        firebase
            .auth()
            .onAuthStateChanged((user) => {

                isAdmin = !!user;

                resolve(isAdmin);
            });
    });
}

function autenticarAdmin(senha) {

    if (
        typeof firebase === 'undefined' ||
        !firebase.auth
    ) {
        return Promise.resolve(false);
    }

    return firebase
        .auth()
        .signInWithEmailAndPassword(
            ADMIN_EMAIL,
            senha
        )
        .then(() => {

            isAdmin = true;

            location.reload();

            return true;
        })
        .catch((error) => {

            console.error(
                '❌ Erro ao entrar como admin:',
                error.code
            );

            return false;
        });
}

function logoutAdmin() {

    if (
        typeof firebase !== 'undefined' &&
        firebase.auth
    ) {

        firebase
            .auth()
            .signOut()
            .then(() => {

                isAdmin = false;

                location.reload();
            });

    } else {

        isAdmin = false;

        location.reload();
    }
}

function mostrarLoginAdmin() {

    const modalExistente =
        document.getElementById('adminModal');

    if (modalExistente) {
        modalExistente.remove();
    }

    const modal =
        document.createElement('div');

    modal.id = 'adminModal';

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
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            text-align: center;
        ">

            <h2 style="
                color: #8B0045;
                margin-bottom: 10px;
            ">
                🔐 Acesso Administrador
            </h2>

            <p style="
                color: #666;
                margin-bottom: 20px;
                font-size: 14px;
            ">
                Digite a senha para gerenciar os estoques
            </p>

            <input
                type="password"
                id="senhaAdminInput"
                placeholder="Digite a senha"
                style="
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    font-size: 16px;
                    margin-bottom: 15px;
                    outline: none;
                    transition: border-color 0.3s;
                "
            >

            <div style="
                display: flex;
                gap: 10px;
            ">

                <button
                    id="btnLoginAdmin"
                    style="
                        flex: 1;
                        padding: 12px;
                        background: #8B0045;
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    "
                >
                    Entrar
                </button>

                <button
                    id="btnFecharModal"
                    style="
                        flex: 1;
                        padding: 12px;
                        background: #ccc;
                        color: #333;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    "
                >
                    Cancelar
                </button>

            </div>

            <p
                id="erroSenha"
                style="
                    color: #ff4444;
                    font-size: 13px;
                    margin-top: 12px;
                    display: none;
                "
            >
                Senha incorreta! Tente novamente.
            </p>

        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {

        const input =
            document.getElementById(
                'senhaAdminInput'
            );

        if (input) {
            input.focus();
        }

    }, 100);

    document
        .getElementById('btnLoginAdmin')
        .addEventListener(
            'click',
            async function () {

                const input =
                    document.getElementById(
                        'senhaAdminInput'
                    );

                const erro =
                    document.getElementById(
                        'erroSenha'
                    );

                const btn = this;

                const senha =
                    input.value;

                btn.disabled = true;
                btn.textContent =
                    'Entrando...';

                const sucesso =
                    await autenticarAdmin(senha);

                if (sucesso) {

                    modal.remove();

                } else {

                    btn.disabled = false;

                    btn.textContent =
                        'Entrar';

                    erro.style.display =
                        'block';

                    input.value = '';

                    input.focus();

                    setTimeout(() => {

                        erro.style.display =
                            'none';

                    }, 3000);
                }
            }
        );

    document
        .getElementById('senhaAdminInput')
        .addEventListener(
            'keypress',
            function (e) {

                if (e.key === 'Enter') {

                    document
                        .getElementById(
                            'btnLoginAdmin'
                        )
                        .click();
                }
            }
        );

    document
        .getElementById('btnFecharModal')
        .addEventListener(
            'click',
            function () {

                modal.remove();
            }
        );

    modal.addEventListener(
        'click',
        function (e) {

            if (e.target === modal) {
                modal.remove();
            }
        }
    );
}

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

function formatarCategoria(categoria) {

    const categorias = {

        'creme-pentear':
            'Creme de Pentear',

        'shampoo':
            'Shampoo',

        'condicionador':
            'Condicionador',

        'mascara':
            'Máscara',

        'oleo':
            'Óleo/Finalizador',

        'tonico':
            'Tônico/Tratamento',

        'kit':
            'Kit',

        'desodorante':
            'Desodorante',

        'sabonete':
            'Sabonete',

        'creme-corpo':
            'Creme Corporal',

        'creme-de-pentear-kids':
            'Creme de Pentear',

        'gelatina-kids':
            'Gelatina',

        'ativador-de-cachos-kids':
            'Ativador de Cachos',

        'shampoo-kids':
            'Shampoo',

        'condicionador-kids':
            'Condicionador',

        'mascara-kids':
            'Máscara',

        'kit-kids':
            'Kit',

        'creme-kids':
            'Creme',

        'creme-multifuncional-kids':
            'Creme Multifuncional',

        'sabonete-kids':
            'Sabonete',

        'shampoo-seda':
            'Shampoo',

        'condicionador-seda':
            'Condicionador',

        'creme-seda':
            'Creme de Pentear'
    };

    return categorias[categoria] || categoria;
}

// ========================================
// SISTEMA DE ESGOTADO COM FIREBASE
// ========================================

let carregandoEstoque = true;

function verificarFirebase() {

    if (
        typeof window.database ===
        'undefined'
    ) {

        console.warn(
            '⚠️ Firebase não disponível. Usando localStorage como fallback.'
        );

        return false;
    }

    return true;
}

function carregarEstoqueFirebase() {

    return new Promise((resolve) => {

        if (!verificarFirebase()) {

            carregarEstoqueLocal();

            resolve();

            return;
        }

        const estoqueRef =
            window.database.ref('estoque');

        estoqueRef.on(
            'value',
            (snapshot) => {

                const data =
                    snapshot.val() || {};

                carregandoEstoque = false;

                produtosEnriquecidos.forEach(
                    produto => {

                        produto.esgotado =
                            data[produto.id] ||
                            false;
                    }
                );

                renderizarProdutos(
                    produtosEnriquecidos
                );

                renderizarDestaques(
                    produtosEnriquecidos
                );

                resolve();
            },
            (error) => {

                console.error(
                    '❌ Erro ao carregar estoque do Firebase:',
                    error
                );

                carregarEstoqueLocal();

                resolve();
            }
        );
    });
}

function carregarEstoqueLocal() {

    const esgotados =
        JSON.parse(
            localStorage.getItem(
                'produtosEsgotados'
            ) || '{}'
        );

    produtosEnriquecidos.forEach(
        produto => {

            produto.esgotado =
                esgotados[produto.id] ||
                false;
        }
    );

    carregandoEstoque = false;

    renderizarProdutos(
        produtosEnriquecidos
    );

    renderizarDestaques(
        produtosEnriquecidos
    );
}

function salvarEstadoFirebase(
    id,
    esgotado
) {

    if (!isAdmin) return;

    if (!verificarFirebase()) {

        const esgotados =
            JSON.parse(
                localStorage.getItem(
                    'produtosEsgotados'
                ) || '{}'
            );

        if (esgotado) {

            esgotados[id] = true;

        } else {

            delete esgotados[id];
        }

        localStorage.setItem(
            'produtosEsgotados',
            JSON.stringify(esgotados)
        );

        return;
    }

    const updates = {};

    updates[id] = esgotado;

    window.database
        .ref('estoque')
        .update(updates)
        .then(() => {

            console.log(
                '✅ Estoque atualizado no Firebase:',
                id,
                esgotado
            );

        })
        .catch((error) => {

            console.error(
                '❌ Erro ao salvar no Firebase:',
                error
            );

            alert(
                'Erro ao salvar a alteração. Tente novamente.'
            );
        });
}

function resetarTodosEsgotados() {

    if (!isAdmin) return;

    if (
        !confirm(
            '⚠️ Resetar TODOS os estados de esgotado? Isso vai marcar todos os produtos como "Em Estoque".'
        )
    ) {
        return;
    }

    if (verificarFirebase()) {

        window.database
            .ref('estoque')
            .set({})
            .then(() => {

                produtosEnriquecidos.forEach(
                    produto => {
                        produto.esgotado = false;
                    }
                );

                renderizarProdutos(
                    produtosEnriquecidos
                );

                renderizarDestaques(
                    produtosEnriquecidos
                );

                alert(
                    '✅ Todos os estados foram resetados!'
                );
            })
            .catch((error) => {

                console.error(
                    '❌ Erro ao resetar:',
                    error
                );

                alert(
                    'Erro ao resetar. Tente novamente.'
                );
            });

    } else {

        localStorage.removeItem(
            'produtosEsgotados'
        );

        produtosEnriquecidos.forEach(
            produto => {
                produto.esgotado = false;
            }
        );

        renderizarProdutos(
            produtosEnriquecidos
        );

        renderizarDestaques(
            produtosEnriquecidos
        );

        alert(
            '✅ Todos os estados foram resetados (local)!'
        );
    }
}

// ========================================
// CRIAÇÃO DE CARDS
// ========================================

function criarProdutoCard(
    produto,
    isDestaque = false
) {

    const card =
        document.createElement('div');

    card.className =
        'produto-card';

    if (produto.destaque) {
        card.classList.add('destaque');
    }

    if (produto.esgotado) {
        card.classList.add('esgotado');
    }

    if (produto.promocao) {
        card.classList.add('promocao');
    }

    card.setAttribute(
        'data-tipo',
        produto.tipo
    );

    card.setAttribute(
        'data-categoria',
        produto.categoria
    );

    card.setAttribute(
        'data-marca',
        String(produto.marca || '')
            .toLowerCase()
    );

    // 🔥 NOVO: Atributo para filtrar por linha
    card.setAttribute(
        'data-linha',
        String(produto.linha || '')
            .toLowerCase()
    );

    // ========================================
    // IMAGEM
    // ========================================

    const imagemDiv =
        document.createElement('div');

    imagemDiv.className =
        'produto-imagem';

    const img =
        document.createElement('img');

    img.src =
        produto.imagem;

    img.alt =
        produto.nome;

    img.loading =
        'lazy';

    img.onerror = function () {

        this.src =
            'https://via.placeholder.com/400x400/FF69B4/FFFFFF?text=Sem+Imagem';
    };

    imagemDiv.appendChild(img);

    // ========================================
    // BADGE DE PROMOÇÃO
    // ========================================

    if (produto.promocao) {

        const badge =
            document.createElement('div');

        badge.className =
            'badge-promocao';

        badge.innerHTML =
            '<i class="fas fa-fire"></i> PROMOÇÃO';

        imagemDiv.appendChild(badge);
    }

    // ========================================
    // DESTAQUE
    // ========================================

    if (
        produto.destaque &&
        !produto.promocao
    ) {

        const tag =
            document.createElement('span');

        tag.className =
            'tag-promocao';

        tag.textContent =
            'Destaque';

        imagemDiv.appendChild(tag);
    }

    // ========================================
    // ESGOTADO
    // ========================================

    if (produto.esgotado) {

        const esgotadoBadge =
            document.createElement('div');

        esgotadoBadge.className =
            'esgotado-badge-img';

        esgotadoBadge.textContent =
            'ESGOTADO';

        imagemDiv.appendChild(
            esgotadoBadge
        );
    }

    // ========================================
    // NO CARRINHO
    // ========================================

    if (estaNoCarrinho(produto.id)) {

        const badge =
            document.createElement('div');

        badge.className =
            'no-carrinho-badge';

        badge.innerHTML =
            '<i class="fas fa-check"></i> No Carrinho';

        imagemDiv.appendChild(badge);
    }

    // ========================================
    // INFORMAÇÕES
    // ========================================

    const infoDiv =
        document.createElement('div');

    infoDiv.className =
        'produto-info';

    const tagsDiv =
        document.createElement('div');

    tagsDiv.className =
        'produto-tags';

    const marcaSpan =
        document.createElement('span');

    marcaSpan.className =
        'produto-categoria';

    marcaSpan.textContent =
        produto.marca;

    const tipoSpan =
        document.createElement('span');

    tipoSpan.className =
        'produto-tipo';

    if (produto.tipo === 'kids') {
        tipoSpan.classList.add(
            'kids-tag'
        );
    }

    tipoSpan.textContent =
        formatarCategoria(
            produto.categoria
        );

    tagsDiv.appendChild(
        marcaSpan
    );

    tagsDiv.appendChild(
        tipoSpan
    );

    infoDiv.appendChild(
        tagsDiv
    );

    // ========================================
    // 🔥 NOVO: EXIBIÇÃO DA LINHA
    // ========================================

    // Só exibe a linha se for diferente da marca (para não repetir)
    const linhaExibir = produto.linha && produto.linha !== produto.marca;
    if (linhaExibir) {
        const linhaSpan = document.createElement('span');
        linhaSpan.className = 'produto-linha';
        linhaSpan.textContent = `📌 ${produto.linha}`;
        linhaSpan.style.cssText = `
            display: inline-block;
            font-size: 11px;
            color: var(--gray);
            margin-bottom: 4px;
            font-weight: 500;
            background: var(--gray-light);
            padding: 2px 10px;
            border-radius: 12px;
        `;
        // Insere antes do nome do produto
        infoDiv.insertBefore(linhaSpan, infoDiv.querySelector('.produto-nome'));
    }

    // ========================================
    // NOME E DESCRIÇÃO
    // ========================================

    infoDiv.innerHTML += `
        <h3 class="produto-nome">
            ${produto.nome}
        </h3>

        <p class="produto-descricao">
            ${produto.descricao}
        </p>
    `;

    // ========================================
    // AVALIAÇÃO
    // ========================================

    const avaliacaoDiv =
        document.createElement('div');

    avaliacaoDiv.className =
        'produto-avaliacao';

    avaliacaoDiv.innerHTML = `
        <div class="estrelas">
            ${renderizarEstrelas(produto.avaliacao)}
        </div>

        <span class="avaliacao-numero">
            ${Number(produto.avaliacao).toFixed(1)}
        </span>

        <span class="avaliacao-total">
            (${produto.totalAvaliacoes})
        </span>
    `;

    infoDiv.appendChild(
        avaliacaoDiv
    );

    // ========================================
    // PREÇO
    // ========================================

    const precoDiv =
        document.createElement('p');

    precoDiv.className =
        'produto-preco';

    if (produto.promocao) {

        const precoNum =
            converterPreco(
                produto.preco
            );

        const precoOriginal =
            precoNum * 1.2;

        precoDiv.innerHTML =
            `${produto.preco}
            <span class="preco-antigo">
                ${formatarPreco(precoOriginal)}
            </span>`;

    } else {

        precoDiv.textContent =
            produto.preco;
    }

    infoDiv.appendChild(
        precoDiv
    );

    // ========================================
    // FRETE GRÁTIS
    // ========================================

    const precosFreteGratis = [
        '8.90',
        '12.99',
        '13.99',
        '14.99',
        '15.99',
        '16.99',
        '17.99'
    ];

    const precoProduto =
        converterPreco(
            produto.preco
        );

    const temFreteGratis =
        precosFreteGratis.some(
            p => Math.abs(
                parseFloat(p) -
                precoProduto
            ) < 0.01
        );

    if (temFreteGratis) {

        const freteSpan =
            document.createElement('span');

        freteSpan.className =
            'frete-gratis';

        freteSpan.textContent =
            'Frete Grátis';

        infoDiv.appendChild(
            freteSpan
        );
    }

    // ========================================
    // CONTROLE ADMINISTRATIVO
    // ========================================

    if (isAdmin) {

        const btnEsgotado =
            document.createElement('button');

        btnEsgotado.className =
            'btn-esgotado';

        btnEsgotado.textContent =
            produto.esgotado
                ? '✅ Em Estoque'
                : '❌ Esgotado';

        btnEsgotado.style.background =
            produto.esgotado
                ? '#4CAF50'
                : '#ff4444';

        btnEsgotado.style.color =
            'white';

        btnEsgotado.style.border =
            'none';

        btnEsgotado.style.borderRadius =
            '8px';

        btnEsgotado.style.padding =
            '8px 12px';

        btnEsgotado.style.fontSize =
            '12px';

        btnEsgotado.style.fontWeight =
            '600';

        btnEsgotado.style.cursor =
            'pointer';

        btnEsgotado.style.marginBottom =
            '8px';

        btnEsgotado.style.width =
            '100%';

        btnEsgotado.style.transition =
            'all 0.2s';

        btnEsgotado.addEventListener(
            'click',
            function (e) {

                e.stopPropagation();

                if (!isAdmin) return;

                produto.esgotado =
                    !produto.esgotado;

                this.textContent =
                    produto.esgotado
                        ? '✅ Em Estoque'
                        : '❌ Esgotado';

                this.style.background =
                    produto.esgotado
                        ? '#4CAF50'
                        : '#ff4444';

                if (produto.esgotado) {

                    card.classList.add(
                        'esgotado'
                    );

                    if (
                        !imagemDiv.querySelector(
                            '.esgotado-badge-img'
                        )
                    ) {

                        const badge =
                            document.createElement('div');

                        badge.className =
                            'esgotado-badge-img';

                        badge.textContent =
                            'ESGOTADO';

                        imagemDiv.appendChild(
                            badge
                        );
                    }

                } else {

                    card.classList.remove(
                        'esgotado'
                    );

                    const badge =
                        imagemDiv.querySelector(
                            '.esgotado-badge-img'
                        );

                    if (badge) {
                        badge.remove();
                    }
                }

                salvarEstadoFirebase(
                    produto.id,
                    produto.esgotado
                );
            }
        );

        infoDiv.appendChild(
            btnEsgotado
        );
    }

    // ========================================
    // WHATSAPP
    // ========================================

    const btnWhatsapp =
        document.createElement('button');

    btnWhatsapp.className =
        'btn-whatsapp';

    btnWhatsapp.innerHTML =
        '<i class="fab fa-whatsapp"></i> Verificar Disponibilidade';

    btnWhatsapp.addEventListener(
        'click',
        () => verificarDisponibilidade(
            produto.nome,
            produto.marca,
            produto.preco
        )
    );

    infoDiv.appendChild(
        btnWhatsapp
    );

    // ========================================
    // CARRINHO
    // ========================================

    if (!produto.esgotado) {

        const btnCarrinho =
            document.createElement('button');

        btnCarrinho.className =
            'btn-add-cart';

        btnCarrinho.dataset.id =
            produto.id;

        if (estaNoCarrinho(produto.id)) {

            btnCarrinho.classList.add(
                'in-cart'
            );

            btnCarrinho.innerHTML =
                '<i class="fas fa-check"></i> No Carrinho';

            btnCarrinho.style.background =
                '#4CAF50';

        } else {

            btnCarrinho.innerHTML =
                '<i class="fas fa-cart-plus"></i> Adicionar';
        }

        btnCarrinho.addEventListener(
            'click',
            function (e) {

                e.stopPropagation();

                adicionarAoCarrinho(
                    produto
                );
            }
        );

        infoDiv.appendChild(
            btnCarrinho
        );
    }

    card.appendChild(
        imagemDiv
    );

    card.appendChild(
        infoDiv
    );

    return card;
}

// ========================================
// WHATSAPP - DISPONIBILIDADE
// ========================================

function verificarDisponibilidade(
    nome,
    marca,
    preco
) {

    const numeroWhatsApp =
        '5521969583871';

    const mensagem =
        `Olá! Gostaria de verificar a disponibilidade do produto:\n\n` +
        `*${nome}*\n` +
        `Marca: ${marca}\n` +
        `Preço: ${preco}\n\n` +
        `Tem em estoque? Poderia me informar o prazo de entrega?`;

    window.open(
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
    );
}

// ========================================
// PAGINAÇÃO DOS DESTAQUES
// ========================================

const DESTAQUES_POR_PAGINA = 4;

let paginaDestaques = 1;

let produtosDestaques = [];

function renderizarDestaques(
    produtos,
    pagina = 1
) {

    const grid =
        document.getElementById(
            'destaquesGrid'
        );

    if (!grid) return;

    const todosDestaques =
        produtos.filter(
            p => p.destaque === true
        );

    produtosDestaques =
        todosDestaques;

    const totalPaginas =
        Math.ceil(
            todosDestaques.length /
            DESTAQUES_POR_PAGINA
        );

    if (todosDestaques.length === 0) {

        grid.innerHTML =
            '<p style="text-align:center;grid-column:1/-1;padding:20px;color:var(--gray);">Nenhum destaque no momento.</p>';

        const paginacao =
            document.getElementById(
                'destaquesPaginacao'
            );

        if (paginacao) {
            paginacao.style.display =
                'none';
        }

        return;
    }

    if (pagina > totalPaginas) {
        pagina = totalPaginas;
    }

    if (pagina < 1) {
        pagina = 1;
    }

    paginaDestaques =
        pagina;

    const inicio =
        (pagina - 1) *
        DESTAQUES_POR_PAGINA;

    const fim =
        inicio +
        DESTAQUES_POR_PAGINA;

    const destaquesPagina =
        todosDestaques.slice(
            inicio,
            fim
        );

    grid.innerHTML = '';

    destaquesPagina.forEach(
        (produto, index) => {

            const card =
                criarProdutoCard(
                    produto,
                    true
                );

            grid.appendChild(card);

            setTimeout(() => {
                card.classList.add(
                    'visible'
                );
            }, index * 100);
        }
    );

    atualizarPaginacaoDestaques(
        totalPaginas
    );

    const pagContainer =
        document.getElementById(
            'destaquesPaginacao'
        );

    if (pagContainer) {

        pagContainer.style.display =
            totalPaginas > 1
                ? 'flex'
                : 'none';
    }
}

function atualizarPaginacaoDestaques(
    totalPaginas
) {

    const prevBtn =
        document.getElementById(
            'destaquePrev'
        );

    const nextBtn =
        document.getElementById(
            'destaqueNext'
        );

    const info =
        document.getElementById(
            'destaqueInfo'
        );

    if (prevBtn) {
        prevBtn.disabled =
            paginaDestaques <= 1;
    }

    if (nextBtn) {
        nextBtn.disabled =
            paginaDestaques >= totalPaginas;
    }

    if (info) {
        info.textContent =
            `Página ${paginaDestaques} de ${totalPaginas}`;
    }
}

function mudarPaginaDestaques(
    direcao
) {

    const totalPaginas =
        Math.ceil(
            produtosDestaques.length /
            DESTAQUES_POR_PAGINA
        );

    const novaPagina =
        paginaDestaques +
        direcao;

    if (
        novaPagina < 1 ||
        novaPagina > totalPaginas
    ) {
        return;
    }

    renderizarDestaques(
        produtosEnriquecidos,
        novaPagina
    );

    const destaquesSection =
        document.getElementById(
            'destaques'
        );

    if (destaquesSection) {

        const header =
            document.querySelector(
                'header'
            );

        const headerHeight =
            header
                ? header.offsetHeight
                : 0;

        const adminBar =
            document.getElementById(
                'adminBar'
            );

        const extraOffset =
            adminBar
                ? adminBar.offsetHeight
                : 0;

        const targetPosition =
            destaquesSection
                .getBoundingClientRect()
                .top +
            window.pageYOffset -
            headerHeight -
            extraOffset -
            20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// SISTEMA DE PAGINAÇÃO DOS PRODUTOS
// ========================================

const PRODUTOS_POR_PAGINA = 12;

let paginaAtual = 1;

let produtosFiltrados =
    [...produtosEnriquecidos];

function scrollParaPesquisa() {

    const searchContainer =
        document.querySelector(
            '.search-container'
        );

    const header =
        document.querySelector(
            'header'
        );

    if (!searchContainer) return;

    const headerHeight =
        header
            ? header.offsetHeight
            : 0;

    const adminBar =
        document.getElementById(
            'adminBar'
        );

    const extraOffset =
        adminBar
            ? adminBar.offsetHeight
            : 0;

    const targetPosition =
        searchContainer
            .getBoundingClientRect()
            .top +
        window.pageYOffset -
        headerHeight -
        extraOffset -
        10;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function mostrarPagina(
    scrollParaProdutos = false
) {

    const grid =
        document.getElementById(
            'produtosGrid'
        );

    const contador =
        document.getElementById(
            'contador-produtos'
        );

    if (!grid) return;

    grid.innerHTML = '';

    if (produtosFiltrados.length === 0) {

        grid.innerHTML =
            '<p style="text-align:center;grid-column:1/-1;padding:40px;">Nenhum produto encontrado</p>';

        if (contador) {
            contador.textContent = '';
        }

        const paginacao =
            document.getElementById(
                'paginacao'
            );

        if (paginacao) {
            paginacao.style.display =
                'none';
        }

        return;
    }

    const total =
        produtosFiltrados.length;

    if (contador) {

        contador.textContent =
            `Mostrando ${total} produto${total > 1 ? 's' : ''}`;
    }

    const inicio =
        (paginaAtual - 1) *
        PRODUTOS_POR_PAGINA;

    const fim =
        inicio +
        PRODUTOS_POR_PAGINA;

    const produtosPagina =
        produtosFiltrados.slice(
            inicio,
            fim
        );

    produtosPagina.forEach(
        (produto, index) => {

            setTimeout(() => {

                const card =
                    criarProdutoCard(
                        produto
                    );

                grid.appendChild(
                    card
                );

                setTimeout(() => {

                    card.classList.add(
                        'visible'
                    );

                }, 50);

            }, index * 50);
        }
    );

    atualizarPaginacao();
    atualizarBotoesCarrinho();

    if (scrollParaProdutos) {

        setTimeout(() => {
            scrollParaPesquisa();
        }, 100);
    }
}

function atualizarPaginacao() {

    const container =
        document.querySelector(
            '.produtos .container'
        );

    if (!container) return;

    let paginacaoDiv =
        document.getElementById(
            'paginacao'
        );

    if (!paginacaoDiv) {

        paginacaoDiv =
            document.createElement(
                'div'
            );

        paginacaoDiv.id =
            'paginacao';

        paginacaoDiv.className =
            'paginacao';

        container.appendChild(
            paginacaoDiv
        );
    }

    const totalPaginas =
        Math.ceil(
            produtosFiltrados.length /
            PRODUTOS_POR_PAGINA
        );

    if (totalPaginas <= 1) {

        paginacaoDiv.style.display =
            'none';

        return;
    }

    paginacaoDiv.style.display =
        'flex';

    let html = '';

    html += `
        <button
            class="btn-pagina"
            ${paginaAtual === 1 ? 'disabled' : ''}
            onclick="mudarPagina(${paginaAtual - 1})"
        >
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (
        let i = 1;
        i <= totalPaginas;
        i++
    ) {

        if (
            i === 1 ||
            i === totalPaginas ||
            (
                i >= paginaAtual - 1 &&
                i <= paginaAtual + 1
            )
        ) {

            html += `
                <button
                    class="btn-pagina ${i === paginaAtual ? 'active' : ''}"
                    onclick="mudarPagina(${i})"
                >
                    ${i}
                </button>
            `;

        } else if (
            i === paginaAtual - 2 ||
            i === paginaAtual + 2
        ) {

            html += `
                <span class="btn-pagina pontos">
                    ...
                </span>
            `;
        }
    }

    html += `
        <button
            class="btn-pagina"
            ${paginaAtual === totalPaginas ? 'disabled' : ''}
            onclick="mudarPagina(${paginaAtual + 1})"
        >
            <i class="fas fa-chevron-right"></i>
        </button>

        <span class="info-pagina">
            Página ${paginaAtual} de ${totalPaginas}
        </span>
    `;

    paginacaoDiv.innerHTML =
        html;
}

function mudarPagina(pagina) {

    paginaAtual =
        pagina;

    mostrarPagina(true);
}

function renderizarProdutos(
    produtosArray
) {

    produtosFiltrados =
        [...produtosArray];

    paginaAtual = 1;

    mostrarPagina(false);
}

// ========================================
// SISTEMA DE FILTROS
// ========================================

let categoriaAtual =
    'todos';

let marcaAtual =
    'todas';

// 🔥 NOVO: Filtro por linha
let linhaAtual =
    'todas';

function normalizarTexto(texto) {

    return String(texto || '')
        .normalize('NFD')
        .replace(
            /[\u0300-\u036f]/g,
            ''
        )
        .toLowerCase()
        .trim();
}

function aplicarFiltros() {

    produtosFiltrados =
        produtosEnriquecidos.filter(
            produto => {

                const tipoMatch =
                    categoriaAtual === 'todos' ||
                    produto.tipo ===
                    categoriaAtual;

                const marcaMatch =
                    marcaAtual === 'todas' ||
                    normalizarTexto(
                        produto.marca
                    ) ===
                    normalizarTexto(
                        marcaAtual
                    );

                // 🔥 NOVO: Verifica se a linha corresponde
                const linhaMatch =
                    linhaAtual === 'todas' ||
                    normalizarTexto(
                        produto.linha || ''
                    ) ===
                    normalizarTexto(
                        linhaAtual
                    );

                return (
                    tipoMatch &&
                    marcaMatch &&
                    linhaMatch
                );
            }
        );

    paginaAtual = 1;

    mostrarPagina(true);
}

// 🔥 NOVO: Função para extrair linhas únicas dos produtos
function obterLinhasUnicas() {
    const linhas = new Set();
    produtosEnriquecidos.forEach(produto => {
        if (produto.linha && produto.linha !== produto.marca) {
            linhas.add(produto.linha);
        }
    });
    return Array.from(linhas).sort();
}

// ========================================
// EVENTOS PARA FILTROS
// ========================================

document
    .querySelectorAll('.btn-categoria')
    .forEach(btn => {

        btn.addEventListener(
            'click',
            function () {

                document
                    .querySelectorAll(
                        '.btn-categoria'
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                'active'
                            )
                    );

                this.classList.add(
                    'active'
                );

                categoriaAtual =
                    this.getAttribute(
                        'data-categoria'
                    );

                aplicarFiltros();
            }
        );
    });

document
    .querySelectorAll('.btn-marca')
    .forEach(btn => {

        btn.addEventListener(
            'click',
            function () {

                document
                    .querySelectorAll(
                        '.btn-marca'
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                'active'
                            )
                    );

                this.classList.add(
                    'active'
                );

                marcaAtual =
                    this.getAttribute(
                        'data-marca'
                    );

                aplicarFiltros();
            }
        );
    });

// 🔥 NOVO: Cria os botões de filtro por linha
function criarFiltrosLinha() {
    const linhasUnicas = obterLinhasUnicas();
    const container = document.querySelector('.marca-filtro');
    
    if (!container || linhasUnicas.length === 0) return;

    // Cria um novo container para as linhas
    const linhaContainer = document.createElement('div');
    linhaContainer.className = 'linha-filtro';
    linhaContainer.style.cssText = `
        margin-top: 16px;
        padding: 0 16px;
    `;

    const titulo = document.createElement('h3');
    titulo.textContent = 'Filtrar por Linha';
    titulo.style.cssText = `
        color: var(--gray);
        font-weight: 600;
        margin-bottom: 12px;
        font-size: 13px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.6px;
    `;
    linhaContainer.appendChild(titulo);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'linha-buttons';
    buttonsDiv.style.cssText = `
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    `;

    // Botão "Todas"
    const btnTodas = document.createElement('button');
    btnTodas.className = 'btn-linha active';
    btnTodas.textContent = 'Todas';
    btnTodas.style.cssText = `
        padding: 8px 16px;
        border: 1.5px solid var(--border);
        background: var(--paper);
        color: var(--gray);
        border-radius: 50px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12.5px;
        white-space: nowrap;
        transition: all 0.25s ease;
        touch-action: manipulation;
        flex-shrink: 0;
    `;
    btnTodas.dataset.linha = 'todas';
    buttonsDiv.appendChild(btnTodas);

    linhasUnicas.forEach(linha => {
        const btn = document.createElement('button');
        btn.className = 'btn-linha';
        btn.textContent = linha;
        btn.style.cssText = `
            padding: 8px 16px;
            border: 1.5px solid var(--border);
            background: var(--paper);
            color: var(--gray);
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12.5px;
            white-space: nowrap;
            transition: all 0.25s ease;
            touch-action: manipulation;
            flex-shrink: 0;
        `;
        btn.dataset.linha = linha;
        buttonsDiv.appendChild(btn);

        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-linha').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'var(--paper)';
                b.style.color = 'var(--gray)';
                b.style.borderColor = 'var(--border)';
            });
            this.classList.add('active');
            this.style.background = 'var(--secondary)';
            this.style.color = 'var(--primary-dark)';
            this.style.borderColor = 'var(--secondary)';

            linhaAtual = this.dataset.linha;
            aplicarFiltros();
        });
    });

    // Evento para o botão "Todas"
    btnTodas.addEventListener('click', function() {
        document.querySelectorAll('.btn-linha').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'var(--paper)';
            b.style.color = 'var(--gray)';
            b.style.borderColor = 'var(--border)';
        });
        this.classList.add('active');
        this.style.background = 'var(--secondary)';
        this.style.color = 'var(--primary-dark)';
        this.style.borderColor = 'var(--secondary)';

        linhaAtual = 'todas';
        aplicarFiltros();
    });

    linhaContainer.appendChild(buttonsDiv);
    container.parentNode.insertBefore(linhaContainer, container.nextSibling);
}

const searchInput =
    document.getElementById(
        'search-input'
    );

if (searchInput) {

    searchInput.addEventListener(
        'input',
        function () {

            const termo =
                normalizarTexto(
                    this.value
                );

            if (termo === '') {

                aplicarFiltros();

                return;
            }

            produtosFiltrados =
                produtosEnriquecidos.filter(
                    produto => {

                        return (
                            normalizarTexto(
                                produto.nome
                            ).includes(
                                termo
                            ) ||

                            normalizarTexto(
                                produto.marca
                            ).includes(
                                termo
                            ) ||

                            normalizarTexto(
                                produto.descricao
                            ).includes(
                                termo
                            ) ||

                            normalizarTexto(
                                formatarCategoria(
                                    produto.categoria
                                )
                            ).includes(
                                termo
                            ) ||

                            // 🔥 NOVO: Busca também pela linha
                            normalizarTexto(
                                produto.linha || ''
                            ).includes(
                                termo
                            )
                        );
                    }
                );

            paginaAtual = 1;

            mostrarPagina(true);
        }
    );
}

// ========================================
// ROLAGEM HORIZONTAL
// ========================================

function habilitarScrollHorizontal(
    seletor
) {

    document
        .querySelectorAll(seletor)
        .forEach(el => {

            el.addEventListener(
                'wheel',
                function (e) {

                    if (
                        this.scrollWidth >
                        this.clientWidth
                    ) {

                        e.preventDefault();

                        this.scrollLeft +=
                            e.deltaY;
                    }
                },
                {
                    passive: false
                }
            );
        });
}

habilitarScrollHorizontal(
    '.categoria-buttons'
);

habilitarScrollHorizontal(
    '.marca-buttons'
);

// 🔥 NOVO: Scroll horizontal para os botões de linha
setTimeout(() => {
    habilitarScrollHorizontal('.linha-buttons');
}, 500);

// ========================================
// MENU MOBILE
// ========================================

const menuToggle =
    document.getElementById(
        'menu-toggle'
    );

const navMenu =
    document.getElementById(
        'nav-menu'
    );

if (menuToggle && navMenu) {

    menuToggle.addEventListener(
        'click',
        () => {

            navMenu.classList.toggle(
                'active'
            );

            const icon =
                menuToggle.querySelector(
                    'i'
                );

            if (icon) {

                icon.classList.toggle(
                    'fa-bars'
                );

                icon.classList.toggle(
                    'fa-times'
                );
            }
        }
    );

    document
        .querySelectorAll(
            '#nav-menu a'
        )
        .forEach(link => {

            link.addEventListener(
                'click',
                () => {

                    navMenu.classList.remove(
                        'active'
                    );

                    const icon =
                        menuToggle.querySelector(
                            'i'
                        );

                    if (icon) {

                        icon.classList.add(
                            'fa-bars'
                        );

                        icon.classList.remove(
                            'fa-times'
                        );
                    }
                }
            );
        });

    document.addEventListener(
        'click',
        (e) => {

            const header =
                document.querySelector(
                    'header'
                );

            if (
                header &&
                !header.contains(e.target) &&
                navMenu.classList.contains(
                    'active'
                )
            ) {

                navMenu.classList.remove(
                    'active'
                );

                const icon =
                    menuToggle.querySelector(
                        'i'
                    );

                if (icon) {

                    icon.classList.add(
                        'fa-bars'
                    );

                    icon.classList.remove(
                        'fa-times'
                    );
                }
            }
        }
    );
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================

const btnTopo =
    document.getElementById(
        'btnTopo'
    );

if (btnTopo) {

    window.addEventListener(
        'scroll',
        () => {

            btnTopo.classList.toggle(
                'show',
                window.scrollY > 400
            );
        }
    );

    btnTopo.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    );
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {

    if (
        typeof IntersectionObserver ===
        'undefined'
    ) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                'visible'
                            );
                        }
                    }
                );

            },
            {
                threshold: 0.1,
                rootMargin:
                    '0px 0px -50px 0px'
            }
        );

    document
        .querySelectorAll(
            '.produto-card, .destaques-grid .produto-card, .sobre-texto'
        )
        .forEach(el => {

            el.classList.add(
                'reveal'
            );

            observer.observe(el);
        });
}

// ========================================
// EVENTOS DO CARRINHO
// ========================================

const cartIcon =
    document.getElementById(
        'cartIcon'
    );

if (cartIcon) {

    cartIcon.addEventListener(
        'click',
        abrirCarrinho
    );
}

const cartClose =
    document.getElementById(
        'cartClose'
    );

if (cartClose) {

    cartClose.addEventListener(
        'click',
        fecharCarrinho
    );
}

const cartOverlay =
    document.getElementById(
        'cartOverlay'
    );

if (cartOverlay) {

    cartOverlay.addEventListener(
        'click',
        function (e) {

            if (e.target === this) {
                fecharCarrinho();
            }
        }
    );
}

const btnFinalizarPedido =
    document.getElementById(
        'btnFinalizarPedido'
    );

if (btnFinalizarPedido) {

    btnFinalizarPedido.addEventListener(
        'click',
        finalizarPedido
    );
}

const btnEsvaziarCarrinho =
    document.getElementById(
        'btnEsvaziarCarrinho'
    );

if (btnEsvaziarCarrinho) {

    btnEsvaziarCarrinho.addEventListener(
        'click',
        function () {

            if (carrinho.length === 0) {
                return;
            }

            if (
                confirm(
                    'Tem certeza que deseja esvaziar o carrinho?'
                )
            ) {

                carrinho = [];

                salvarCarrinho();

                renderizarCarrinho();

                atualizarBotoesCarrinho();

                mostrarToast(
                    'Carrinho esvaziado!'
                );
            }
        }
    );
}

// ========================================
// EVENTOS DE PAGINAÇÃO DOS DESTAQUES
// ========================================

const destaquePrev =
    document.getElementById(
        'destaquePrev'
    );

if (destaquePrev) {

    destaquePrev.addEventListener(
        'click',
        () =>
            mudarPaginaDestaques(-1)
    );
}

const destaqueNext =
    document.getElementById(
        'destaqueNext'
    );

if (destaqueNext) {

    destaqueNext.addEventListener(
        'click',
        () =>
            mudarPaginaDestaques(1)
    );
}

// ========================================
// INICIALIZAR
// ========================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        // Carrinho
        carregarCarrinho();

        // Admin
        await verificarAdmin();

        // 🔥 Cria os filtros de linha
        criarFiltrosLinha();

        const grid =
            document.getElementById(
                'produtosGrid'
            );

        if (grid) {

            grid.innerHTML =
                '<p style="text-align:center;grid-column:1/-1;padding:40px;">🔄 Carregando estoque...</p>';
        }

        // Estoque
        await carregarEstoqueFirebase();

        setTimeout(() => {

            atualizarBotoesCarrinho();

            initScrollReveal();

        }, 500);

        // ========================================
        // HEADER AO ROLAR
        // ========================================

        window.addEventListener(
            'scroll',
            () => {

                const header =
                    document.querySelector(
                        'header'
                    );

                if (!header) return;

                if (window.scrollY > 50) {

                    header.style.background =
                        'rgba(255,255,255,0.98)';

                    header.style.backdropFilter =
                        'blur(10px)';

                } else {

                    header.style.background =
                        'white';

                    header.style.backdropFilter =
                        'none';
                }
            }
        );

        // ========================================
        // ANO DO RODAPÉ
        // ========================================

        const footerYear =
            document.querySelector(
                '.footer-bottom p'
            );

        if (footerYear) {

            footerYear.innerHTML =
                footerYear.innerHTML.replace(
                    '2026',
                    new Date().getFullYear()
                );
        }

        // ========================================
        // LOGIN ADMIN PELO LOGO
        // ========================================

        const logo =
            document.querySelector(
                '.logo'
            );

        if (logo) {

            logo.addEventListener(
                'dblclick',
                function (e) {

                    e.stopPropagation();

                    if (isAdmin) {

                        if (
                            confirm(
                                'Você está logado como administrador. Deseja sair?'
                            )
                        ) {

                            logoutAdmin();
                        }

                    } else {

                        mostrarLoginAdmin();
                    }
                }
            );
        }

        // ========================================
        // BARRA ADMIN
        // ========================================

        if (isAdmin) {

            const header =
                document.querySelector(
                    'header'
                );

            const adminBar =
                document.createElement(
                    'div'
                );

            adminBar.id =
                'adminBar';

            const alturaHeader =
                header
                    ? header.offsetHeight
                    : 0;

            adminBar.style.cssText = `
                position: fixed;
                top: ${alturaHeader}px;
                left: 0;
                right: 0;
                background: #8B0045;
                color: white;
                padding: 8px 16px;
                text-align: center;
                font-size: 13px;
                font-weight: 500;
                z-index: 998;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            `;

            adminBar.innerHTML = `
                <span>
                    👑 <strong>Modo Administrador</strong>
                    - Gerenciando estoques
                </span>

                <button
                    id="resetEstoqueBtn"
                    style="
                        background:#ff4444;
                        color:white;
                        border:none;
                        border-radius:20px;
                        padding:4px 16px;
                        font-size:12px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    🔄 Resetar Todos
                </button>

                <button
                    id="logoutAdminBtn"
                    style="
                        background:transparent;
                        color:white;
                        border:1px solid white;
                        border-radius:20px;
                        padding:4px 16px;
                        font-size:12px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    🚪 Sair
                </button>

                <span style="
                    font-size:11px;
                    opacity:0.7;
                ">
                    💾 Salvando em tempo real
                </span>
            `;

            document.body.appendChild(
                adminBar
            );

            const resetBtn =
                document.getElementById(
                    'resetEstoqueBtn'
                );

            if (resetBtn) {

                resetBtn.addEventListener(
                    'click',
                    resetarTodosEsgotados
                );
            }

            const logoutBtn =
                document.getElementById(
                    'logoutAdminBtn'
                );

            if (logoutBtn) {

                logoutBtn.addEventListener(
                    'click',
                    logoutAdmin
                );
            }
        }
    }
);

// ========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ========================================

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(anchor => {

        anchor.addEventListener(
            'click',
            function (e) {

                e.preventDefault();

                const target =
                    document.querySelector(
                        this.getAttribute(
                            'href'
                        )
                    );

                if (!target) return;

                const header =
                    document.querySelector(
                        'header'
                    );

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const adminBar =
                    document.getElementById(
                        'adminBar'
                    );

                const extraOffset =
                    adminBar
                        ? adminBar.offsetHeight
                        : 0;

                const targetPosition =
                    target
                        .getBoundingClientRect()
                        .top +
                    window.pageYOffset -
                    headerHeight -
                    extraOffset -
                    20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        );
    });

    // ========================================
// CONTROLE DOS DROPDOWNS DE FILTROS
// ========================================

function atualizarFiltrosAtivos() {
    const container = document.getElementById('filtrosAtivos');
    const ativos = [];
    
    if (categoriaAtual !== 'todos') {
        const btn = document.querySelector(`.btn-categoria[data-categoria="${categoriaAtual}"]`);
        if (btn) {
            const nome = btn.querySelector('span')?.textContent || categoriaAtual;
            ativos.push(nome);
        }
    }
    
    if (marcaAtual !== 'todas') {
        ativos.push(marcaAtual);
    }
    
    if (linhaAtual !== 'todas') {
        ativos.push(linhaAtual);
    }
    
    if (ativos.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `Filtros: ${ativos.map(a => `<span class="ativo">${a}</span>`).join(' ')}`;
}

function obterLinhasPorMarca(marca) {
    const linhas = new Set();
    produtosEnriquecidos.forEach(produto => {
        if (normalizarTexto(produto.marca) === normalizarTexto(marca)) {
            if (produto.linha && produto.linha !== produto.marca) {
                linhas.add(produto.linha);
            }
        }
    });
    return Array.from(linhas).sort();
}

function atualizarSelectMarcas() {
    const select = document.getElementById('marcaSelect');
    const opcoes = select.options;
    let temOpcao = false;
    
    for (let i = 0; i < opcoes.length; i++) {
        if (opcoes[i].value === marcaAtual) {
            temOpcao = true;
            break;
        }
    }
    
    if (!temOpcao && marcaAtual !== 'todas') {
        marcaAtual = 'todas';
        select.value = 'todas';
        document.getElementById('linhasWrapper').style.display = 'none';
        linhaAtual = 'todas';
    }
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================

window.adicionarAoCarrinho =
    adicionarAoCarrinho;

window.removerDoCarrinho =
    removerDoCarrinho;

window.alterarQuantidade =
    alterarQuantidade;

window.abrirCarrinho =
    abrirCarrinho;

window.fecharCarrinho =
    fecharCarrinho;

window.finalizarPedido =
    finalizarPedido;

window.mudarPagina =
    mudarPagina;

window.mudarPaginaDestaques =
    mudarPaginaDestaques;

window.mostrarLoginAdmin =
    mostrarLoginAdmin;

window.logoutAdmin =
    logoutAdmin;

window.verificarDisponibilidade =
    verificarDisponibilidade;