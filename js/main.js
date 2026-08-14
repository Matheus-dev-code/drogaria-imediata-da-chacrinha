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
];

// ========================================
// SISTEMA DE AUTENTICAÇÃO ADMIN
// ========================================

let isAdmin = false;
const ADMIN_SENHA = 'admin123';

function verificarAdmin() {
    const sessionAdmin = sessionStorage.getItem('adminAutenticado');
    if (sessionAdmin === 'true') {
        isAdmin = true;
    }
    return isAdmin;
}

function autenticarAdmin(senha) {
    if (senha === ADMIN_SENHA) {
        isAdmin = true;
        sessionStorage.setItem('adminAutenticado', 'true');
        location.reload();
        return true;
    }
    return false;
}

function logoutAdmin() {
    isAdmin = false;
    sessionStorage.removeItem('adminAutenticado');
    location.reload();
}

function mostrarLoginAdmin() {
    const modalExistente = document.getElementById('adminModal');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
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
            <h2 style="color: #8B0045; margin-bottom: 10px;">🔐 Acesso Administrador</h2>
            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">Digite a senha para gerenciar os estoques</p>
            <input type="password" id="senhaAdminInput" placeholder="Digite a senha" style="
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #ddd;
                border-radius: 10px;
                font-size: 16px;
                margin-bottom: 15px;
                outline: none;
                transition: border-color 0.3s;
            ">
            <div style="display: flex; gap: 10px;">
                <button id="btnLoginAdmin" style="
                    flex: 1;
                    padding: 12px;
                    background: #8B0045;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                ">Entrar</button>
                <button id="btnFecharModal" style="
                    flex: 1;
                    padding: 12px;
                    background: #ccc;
                    color: #333;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                ">Cancelar</button>
            </div>
            <p id="erroSenha" style="color: #ff4444; font-size: 13px; margin-top: 12px; display: none;">Senha incorreta! Tente novamente.</p>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        document.getElementById('senhaAdminInput').focus();
    }, 100);

    document.getElementById('btnLoginAdmin').addEventListener('click', function() {
        const senha = document.getElementById('senhaAdminInput').value;
        const erro = document.getElementById('erroSenha');
        if (autenticarAdmin(senha)) {
            modal.remove();
        } else {
            erro.style.display = 'block';
            document.getElementById('senhaAdminInput').value = '';
            document.getElementById('senhaAdminInput').focus();
            setTimeout(() => {
                erro.style.display = 'none';
            }, 3000);
        }
    });

    document.getElementById('senhaAdminInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btnLoginAdmin').click();
        }
    });

    document.getElementById('btnFecharModal').addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========================================
// FUNÇÕES UTILITÁRIAS
// ========================================

function formatarCategoria(categoria) {
    const categorias = {
        'creme-pentear': 'Creme de Pentear',
        'shampoo': 'Shampoo',
        'condicionador': 'Condicionador',
        'mascara': 'Máscara',
        'oleo': 'Óleo/Finalizador',
        'tonico': 'Tônico/Tratamento',
        'kit': 'Kit',
        'desodorante': 'Desodorante',
        'sabonete': 'Sabonete',
        'creme-corpo': 'Creme Corporal',
        'creme-de-pentear-kids': 'Creme de Pentear',
        'gelatina-kids': 'Gelatina',
        'ativador-de-cachos-kids': 'Ativador de Cachos',
        'shampoo-kids': 'Shampoo',
        'condicionador-kids': 'Condicionador',
        'mascara-kids': 'Máscara',
        'kit-kids': 'Kit',
        'creme-kids': 'Creme',
        'creme-multifuncional-kids': 'Creme Multifuncional',
        'sabonete-kids': 'Sabonete',
        'shampoo-seda': 'Shampoo',
        'condicionador-seda': 'Condicionador',
        'creme-seda': 'Creme de Pentear'
    };
    return categorias[categoria] || categoria;
}

// ========================================
// SISTEMA DE ESGOTADO COM FIREBASE
// ========================================

let carregandoEstoque = true;

// Função para verificar se o Firebase está disponível
function verificarFirebase() {
    if (typeof window.database === 'undefined') {
        console.warn('⚠️ Firebase não disponível. Usando localStorage como fallback.');
        return false;
    }
    return true;
}

// Carrega os dados do Firebase
function carregarEstoqueFirebase() {
    return new Promise((resolve) => {
        if (!verificarFirebase()) {
            carregarEstoqueLocal();
            resolve();
            return;
        }

        const estoqueRef = window.database.ref('estoque');
        estoqueRef.on('value', (snapshot) => {
            const data = snapshot.val() || {};
            carregandoEstoque = false;
            
            // Aplica os dados aos produtos
            todosProdutos.forEach(produto => {
                if (produto.id in data) {
                    produto.esgotado = data[produto.id];
                } else {
                    produto.esgotado = false;
                }
            });
            
            // Renderiza os produtos
            renderizarProdutos(todosProdutos);
            resolve();
        }, (error) => {
            console.error('❌ Erro ao carregar estoque do Firebase:', error);
            carregarEstoqueLocal();
            resolve();
        });
    });
}

// Fallback: Carrega do localStorage se Firebase falhar
function carregarEstoqueLocal() {
    const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');
    todosProdutos.forEach(produto => {
        if (produto.id in esgotados) {
            produto.esgotado = esgotados[produto.id];
        } else {
            produto.esgotado = false;
        }
    });
    carregandoEstoque = false;
    renderizarProdutos(todosProdutos);
}

// Salva o estado no Firebase
function salvarEstadoFirebase(id, esgotado) {
    if (!isAdmin) return;
    
    if (!verificarFirebase()) {
        // Fallback para localStorage
        const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');
        if (esgotado) {
            esgotados[id] = true;
        } else {
            delete esgotados[id];
        }
        localStorage.setItem('produtosEsgotados', JSON.stringify(esgotados));
        return;
    }

    const updates = {};
    updates[id] = esgotado;
    window.database.ref('estoque').update(updates)
        .then(() => {
            console.log('✅ Estoque atualizado no Firebase:', id, esgotado);
        })
        .catch((error) => {
            console.error('❌ Erro ao salvar no Firebase:', error);
            alert('Erro ao salvar a alteração. Tente novamente.');
        });
}

// Resetar todos os estoques
function resetarTodosEsgotados() {
    if (!isAdmin) return;
    
    if (confirm('⚠️ Resetar TODOS os estados de esgotado? Isso vai marcar todos os produtos como "Em Estoque".')) {
        if (verificarFirebase()) {
            window.database.ref('estoque').set({})
                .then(() => {
                    todosProdutos.forEach(produto => {
                        produto.esgotado = false;
                    });
                    renderizarProdutos(todosProdutos);
                    alert('✅ Todos os estados foram resetados!');
                })
                .catch((error) => {
                    console.error('❌ Erro ao resetar:', error);
                    alert('Erro ao resetar. Tente novamente.');
                });
        } else {
            localStorage.removeItem('produtosEsgotados');
            todosProdutos.forEach(produto => {
                produto.esgotado = false;
            });
            renderizarProdutos(todosProdutos);
            alert('✅ Todos os estados foram resetados (local)!');
        }
    }
}

// ========================================
// CRIAÇÃO DE CARDS
// ========================================

function criarProdutoCard(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    if (produto.destaque) card.classList.add('destaque');
    if (produto.esgotado) card.classList.add('esgotado');
    card.setAttribute('data-tipo', produto.tipo);
    card.setAttribute('data-categoria', produto.categoria);
    card.setAttribute('data-marca', produto.marca.toLowerCase());
    
    const imagemDiv = document.createElement('div');
    imagemDiv.className = 'produto-imagem';
    
    const img = document.createElement('img');
    img.src = produto.imagem;
    img.alt = produto.nome;
    img.loading = 'lazy';
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/400x400/FF69B4/FFFFFF?text=Sem+Imagem';
    };
    imagemDiv.appendChild(img);
    
    if (produto.destaque) {
        const tag = document.createElement('span');
        tag.className = 'tag-promocao';
        tag.textContent = 'Destaque';
        imagemDiv.appendChild(tag);
    }
    
    if (produto.esgotado) {
        const esgotadoBadge = document.createElement('div');
        esgotadoBadge.className = 'esgotado-badge-img';
        esgotadoBadge.textContent = 'ESGOTADO';
        imagemDiv.appendChild(esgotadoBadge);
    }
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'produto-info';
    
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'produto-tags';
    
    const marcaSpan = document.createElement('span');
    marcaSpan.className = 'produto-categoria';
    marcaSpan.textContent = produto.marca;
    
    const tipoSpan = document.createElement('span');
    tipoSpan.className = 'produto-tipo';
    if (produto.tipo === 'kids') tipoSpan.classList.add('kids-tag');
    tipoSpan.textContent = formatarCategoria(produto.categoria);
    
    tagsDiv.appendChild(marcaSpan);
    tagsDiv.appendChild(tipoSpan);
    infoDiv.appendChild(tagsDiv);
    
    infoDiv.innerHTML += `
        <h3 class="produto-nome">${produto.nome}</h3>
        <p class="produto-descricao">${produto.descricao}</p>
        <p class="produto-preco">${produto.preco}</p>
    `;
    
    const precosFreteGratis = ['8.90', '12.99', '13.99', '14.99', '15.99', '16.99', '17.99'];
    if (precosFreteGratis.some(p => produto.preco.includes(p))) {
        const freteSpan = document.createElement('span');
        freteSpan.className = 'frete-gratis';
        freteSpan.textContent = 'Frete Grátis';
        infoDiv.appendChild(freteSpan);
    }
    
    // Botão de alternar esgotado - SÓ APARECE PARA ADMIN
    if (isAdmin) {
        const btnEsgotado = document.createElement('button');
        btnEsgotado.className = 'btn-esgotado';
        btnEsgotado.textContent = produto.esgotado ? '✅ Em Estoque' : '❌ Esgotado';
        btnEsgotado.style.background = produto.esgotado ? '#4CAF50' : '#ff4444';
        btnEsgotado.style.color = 'white';
        btnEsgotado.style.border = 'none';
        btnEsgotado.style.borderRadius = '8px';
        btnEsgotado.style.padding = '8px 12px';
        btnEsgotado.style.fontSize = '12px';
        btnEsgotado.style.fontWeight = '600';
        btnEsgotado.style.cursor = 'pointer';
        btnEsgotado.style.marginBottom = '8px';
        btnEsgotado.style.width = '100%';
        btnEsgotado.style.transition = 'all 0.2s';

        btnEsgotado.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!isAdmin) return;
            
            produto.esgotado = !produto.esgotado;
            this.textContent = produto.esgotado ? '✅ Em Estoque' : '❌ Esgotado';
            this.style.background = produto.esgotado ? '#4CAF50' : '#ff4444';
            
            if (produto.esgotado) {
                card.classList.add('esgotado');
                if (!imagemDiv.querySelector('.esgotado-badge-img')) {
                    const badge = document.createElement('div');
                    badge.className = 'esgotado-badge-img';
                    badge.textContent = 'ESGOTADO';
                    imagemDiv.appendChild(badge);
                }
            } else {
                card.classList.remove('esgotado');
                const badge = imagemDiv.querySelector('.esgotado-badge-img');
                if (badge) badge.remove();
            }
            
            // Salva no Firebase
            salvarEstadoFirebase(produto.id, produto.esgotado);
        });
        
        infoDiv.appendChild(btnEsgotado);
    }
    
    const btnWhatsapp = document.createElement('button');
    btnWhatsapp.className = 'btn-whatsapp';
    btnWhatsapp.innerHTML = '<i class="fab fa-whatsapp"></i> Verificar Disponibilidade';
    btnWhatsapp.addEventListener('click', () => verificarDisponibilidade(produto.nome, produto.marca, produto.preco));
    infoDiv.appendChild(btnWhatsapp);
    
    card.appendChild(imagemDiv);
    card.appendChild(infoDiv);
    
    return card;
}

function verificarDisponibilidade(nome, marca, preco) {
    const numeroWhatsApp = '5521969583871';
    const mensagem = `Olá! Gostaria de verificar a disponibilidade do produto:\n\n*${nome}*\nMarca: ${marca}\nPreço: ${preco}\n\nTem em estoque? Poderia me informar o prazo de entrega?`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// ========================================
// SISTEMA DE PAGINAÇÃO
// ========================================

const PRODUTOS_POR_PAGINA = 12;
let paginaAtual = 1;
let produtosFiltrados = [...todosProdutos];

function scrollParaPesquisa() {
    const searchContainer = document.querySelector('.search-container');
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = searchContainer.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function mostrarPagina(scrollParaProdutos = false) {
    const grid = document.getElementById('produtosGrid');
    const contador = document.getElementById('contador-produtos');
    grid.innerHTML = '';
    
    if (produtosFiltrados.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;">Nenhum produto encontrado</p>';
        contador.textContent = '';
        const paginacao = document.getElementById('paginacao');
        if (paginacao) paginacao.style.display = 'none';
        return;
    }
    
    const total = produtosFiltrados.length;
    contador.textContent = `Mostrando ${total} produto${total > 1 ? 's' : ''}`;
    
    const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
    const fim = inicio + PRODUTOS_POR_PAGINA;
    const produtosPagina = produtosFiltrados.slice(inicio, fim);
    
    produtosPagina.forEach((produto, index) => {
        setTimeout(() => grid.appendChild(criarProdutoCard(produto)), index * 30);
    });
    
    atualizarPaginacao();
    
    if (scrollParaProdutos) {
        setTimeout(() => {
            scrollParaPesquisa();
        }, 100);
    }
}

function atualizarPaginacao() {
    const container = document.querySelector('.produtos .container');
    let paginacaoDiv = document.getElementById('paginacao');
    
    if (!paginacaoDiv) {
        paginacaoDiv = document.createElement('div');
        paginacaoDiv.id = 'paginacao';
        paginacaoDiv.className = 'paginacao';
        container.appendChild(paginacaoDiv);
    }
    
    const totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
    
    if (totalPaginas <= 1) {
        paginacaoDiv.style.display = 'none';
        return;
    }
    
    paginacaoDiv.style.display = 'flex';
    
    let html = '';
    
    html += `<button class="btn-pagina" ${paginaAtual === 1 ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
            html += `<button class="btn-pagina ${i === paginaAtual ? 'active' : ''}" onclick="mudarPagina(${i})">${i}</button>`;
        } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
            html += `<span class="btn-pagina pontos">...</span>`;
        }
    }
    
    html += `<button class="btn-pagina" ${paginaAtual === totalPaginas ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    html += `<span class="info-pagina">Página ${paginaAtual} de ${totalPaginas}</span>`;
    
    paginacaoDiv.innerHTML = html;
}

function mudarPagina(pagina) {
    paginaAtual = pagina;
    mostrarPagina(true);
}

function renderizarProdutos(produtosArray) {
    produtosFiltrados = [...produtosArray];
    paginaAtual = 1;
    mostrarPagina(false);
}

// ========================================
// SISTEMA DE FILTROS
// ========================================

let categoriaAtual = 'todos';
let marcaAtual = 'todas';

function normalizarTexto(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function aplicarFiltros() {
    produtosFiltrados = todosProdutos.filter(produto => {
        const tipoMatch = categoriaAtual === 'todos' || produto.tipo === categoriaAtual;
        const marcaMatch = marcaAtual === 'todas' || normalizarTexto(produto.marca) === normalizarTexto(marcaAtual);
        return tipoMatch && marcaMatch;
    });
    
    paginaAtual = 1;
    mostrarPagina(true);
}

document.querySelectorAll('.btn-categoria').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        categoriaAtual = this.getAttribute('data-categoria');
        aplicarFiltros();
    });
});

document.querySelectorAll('.btn-marca').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-marca').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        marcaAtual = this.getAttribute('data-marca');
        aplicarFiltros();
    });
});

document.getElementById('search-input').addEventListener('input', function() {
    const termo = normalizarTexto(this.value);
    
    if (termo === '') {
        aplicarFiltros();
        return;
    }
    
    produtosFiltrados = todosProdutos.filter(produto => {
        return normalizarTexto(produto.nome).includes(termo) ||
               normalizarTexto(produto.marca).includes(termo) ||
               normalizarTexto(produto.descricao).includes(termo) ||
               normalizarTexto(formatarCategoria(produto.categoria)).includes(termo);
    });
    
    paginaAtual = 1;
    mostrarPagina(true);
});

// ========================================
// MENU MOBILE
// ========================================

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

document.addEventListener('click', (e) => {
    const header = document.querySelector('header');
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});

// ========================================
// INICIALIZAR
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    verificarAdmin();
    
    // Mostra loading enquanto carrega o estoque
    const grid = document.getElementById('produtosGrid');
    grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;">🔄 Carregando estoque...</p>';
    
    // Carrega os dados do Firebase
    await carregarEstoqueFirebase();
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255,255,255,0.98)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    });
    
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
    }

    // Clique duplo no logo para login admin
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

    // Barra de admin quando logado
    if (isAdmin) {
        const header = document.querySelector('header');
        const adminBar = document.createElement('div');
        adminBar.id = 'adminBar';
        adminBar.style.cssText = `
            position: fixed;
            top: ${header.offsetHeight}px;
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
            <span>👑 <strong>Modo Administrador</strong> - Gerenciando estoques</span>
            <button id="resetEstoqueBtn" style="
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 4px 16px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            ">🔄 Resetar Todos</button>
            <button id="logoutAdminBtn" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                border-radius: 20px;
                padding: 4px 16px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            ">🚪 Sair</button>
            <span style="font-size: 11px; opacity: 0.7;">💾 Salvando em tempo real</span>
        `;
        document.body.appendChild(adminBar);

        document.getElementById('resetEstoqueBtn').addEventListener('click', function() {
            resetarTodosEsgotados();
        });

        document.getElementById('logoutAdminBtn').addEventListener('click', function() {
            logoutAdmin();
        });
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const adminBar = document.getElementById('adminBar');
            const extraOffset = adminBar ? adminBar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});