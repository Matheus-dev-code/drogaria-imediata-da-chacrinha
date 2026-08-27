// ========================================
// SISTEMA DE ADMINISTRAÇÃO - VERSÃO MELHORADA
// ========================================

let isAdmin = false;
let adminLoginAttempts = 0;
const ADMIN_EMAIL = 'admin@drogariaimediata.com';

// ========================================
// AUTENTICAÇÃO
// ========================================

function verificarAdmin() {
    return new Promise((resolve) => {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('⚠️ Firebase Authentication não disponível.');
            isAdmin = false;
            resolve(false);
            return;
        }

        firebase.auth().onAuthStateChanged((user) => {
            isAdmin = !!user;
            console.log(`🔐 Admin status: ${isAdmin ? 'LOGADO' : 'DESLOGADO'}`);
            
            // Se estiver logado, mostra a barra de admin
            if (isAdmin) {
                setTimeout(() => criarBarraAdmin(), 100);
            } else {
                removerBarraAdmin();
            }
            
            resolve(isAdmin);
        });
    });
}

function autenticarAdmin(senha) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('⚠️ Firebase não disponível para autenticação');
        return Promise.resolve(false);
    }

    return firebase.auth()
        .signInWithEmailAndPassword(ADMIN_EMAIL, senha)
        .then(() => {
            isAdmin = true;
            console.log('✅ Admin autenticado com sucesso!');
            mostrarToast('👑 Modo administrador ativado!');
            setTimeout(() => location.reload(), 500);
            return true;
        })
        .catch((error) => {
            console.error('❌ Erro ao entrar como admin:', error.code);
            const mensagem = error.code === 'auth/wrong-password' 
                ? '❌ Senha incorreta! Tente novamente.' 
                : '❌ Erro ao autenticar. Verifique sua conexão.';
            mostrarToast(mensagem);
            return false;
        });
}

function logoutAdmin() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            isAdmin = false;
            removerBarraAdmin();
            mostrarToast('👋 Modo administrador desativado');
            setTimeout(() => location.reload(), 500);
        });
    } else {
        isAdmin = false;
        removerBarraAdmin();
        location.reload();
    }
}

// ========================================
// BARRA DE ADMIN
// ========================================

function criarBarraAdmin() {
    // Remove barra existente
    removerBarraAdmin();

    const header = document.querySelector('header');
    const adminBar = document.createElement('div');
    adminBar.id = 'adminBar';
    
    const alturaHeader = header ? header.offsetHeight : 70;

    adminBar.style.cssText = `
        position: fixed;
        top: ${alturaHeader}px;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #8B0045, #5C0030);
        color: white;
        padding: 10px 20px;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        z-index: 997;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        box-shadow: 0 4px 20px rgba(139, 0, 69, 0.3);
        border-bottom: 2px solid #C9A24A;
    `;

    adminBar.innerHTML = `
        <span style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">👑</span>
            <strong style="color:#FFD700;">Modo Administrador</strong>
            <span style="font-size:11px;opacity:0.7;background:rgba(255,255,255,0.15);padding:2px 12px;border-radius:12px;">
                ${new Date().toLocaleTimeString()}
            </span>
        </span>
        <span style="font-size:12px;opacity:0.8;">
            💡 Clique no botão <strong>"ESGOTAR"</strong> nos produtos para gerenciar
        </span>
        <div style="display:flex;gap:8px;align-items:center;">
            <button id="resetEstoqueBtn" style="
                background:#ff4444;
                color:white;
                border:none;
                border-radius:20px;
                padding:6px 18px;
                font-size:12px;
                font-weight:700;
                cursor:pointer;
                transition:all 0.2s;
                display:flex;
                align-items:center;
                gap:6px;
            ">
                🔄 Resetar Todos
            </button>
            <button id="logoutAdminBtn" style="
                background:rgba(255,255,255,0.15);
                color:white;
                border:1px solid rgba(255,255,255,0.3);
                border-radius:20px;
                padding:6px 18px;
                font-size:12px;
                font-weight:600;
                cursor:pointer;
                transition:all 0.2s;
                display:flex;
                align-items:center;
                gap:6px;
            ">
                🚪 Sair
            </button>
        </div>
    `;

    document.body.appendChild(adminBar);

    // Eventos
    document.getElementById('resetEstoqueBtn').addEventListener('click', resetarTodosEsgotados);
    document.getElementById('logoutAdminBtn').addEventListener('click', logoutAdmin);

    // Hover effects
    document.getElementById('resetEstoqueBtn').addEventListener('mouseenter', function() {
        this.style.background = '#cc0000';
        this.style.transform = 'scale(1.05)';
    });
    document.getElementById('resetEstoqueBtn').addEventListener('mouseleave', function() {
        this.style.background = '#ff4444';
        this.style.transform = 'scale(1)';
    });

    document.getElementById('logoutAdminBtn').addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255,255,255,0.25)';
    });
    document.getElementById('logoutAdminBtn').addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255,255,255,0.15)';
    });
}

function removerBarraAdmin() {
    const barra = document.getElementById('adminBar');
    if (barra) barra.remove();
}

// ========================================
// BOTÃO ADMIN NO HEADER
// ========================================

function adicionarBotaoAdmin() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Verifica se já existe
    if (document.getElementById('adminToggleBtn')) return;

    const btnAdmin = document.createElement('button');
    btnAdmin.id = 'adminToggleBtn';
    btnAdmin.innerHTML = '🔐';
    btnAdmin.title = isAdmin ? 'Sair do modo Admin' : 'Entrar no modo Admin';
    btnAdmin.style.cssText = `
        background: ${isAdmin ? '#4CAF50' : 'transparent'};
        border: 2px solid ${isAdmin ? '#4CAF50' : 'var(--primary)'};
        border-radius: 50%;
        width: 38px;
        height: 38px;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${isAdmin ? 'white' : 'var(--primary)'};
        position: relative;
    `;

    // Tooltip
    const tooltip = document.createElement('span');
    tooltip.style.cssText = `
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--ink);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    `;
    tooltip.textContent = isAdmin ? '👑 Admin' : '🔐 Admin';
    btnAdmin.appendChild(tooltip);

    btnAdmin.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });
    btnAdmin.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });

    btnAdmin.addEventListener('click', () => {
        if (isAdmin) {
            logoutAdmin();
        } else {
            mostrarLoginAdmin();
        }
    });

    // Insere antes do carrinho
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        navActions.insertBefore(btnAdmin, cartIcon);
    } else {
        navActions.appendChild(btnAdmin);
    }
}

// ========================================
// MODAL DE LOGIN
// ========================================

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
        backdrop-filter: blur(6px);
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 35px 30px;
            border-radius: 20px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            text-align: center;
            animation: slideUp 0.3s ease;
        ">
            <div style="font-size: 48px; margin-bottom: 10px;">👑</div>
            <h2 style="color: #8B0045; margin-bottom: 6px; font-family: var(--font-display);">
                Acesso Administrador
            </h2>
            <p style="color: #666; margin-bottom: 24px; font-size: 14px;">
                Digite a senha para gerenciar o estoque
            </p>
            <input
                type="password"
                id="senhaAdminInput"
                placeholder="Digite a senha"
                style="
                    width: 100%;
                    padding: 14px 18px;
                    border: 2px solid #ddd;
                    border-radius: 12px;
                    font-size: 16px;
                    margin-bottom: 16px;
                    outline: none;
                    transition: border-color 0.3s;
                    font-family: var(--font-body);
                "
                autofocus
            >
            <div style="display: flex; gap: 10px;">
                <button id="btnLoginAdmin" style="
                    flex: 1;
                    padding: 14px;
                    background: #8B0045;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: var(--font-body);
                ">🔓 Entrar</button>
                <button id="btnFecharModal" style="
                    flex: 1;
                    padding: 14px;
                    background: #eee;
                    color: #333;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: var(--font-body);
                ">Cancelar</button>
            </div>
            <p id="erroSenha" style="
                color: #ff4444;
                font-size: 13px;
                margin-top: 14px;
                display: none;
                font-weight: 600;
            ">❌ Senha incorreta! Tente novamente.</p>
            <p style="margin-top: 14px; font-size: 12px; color: #999;">
                <strong style="color: #8B0045;"></strong>
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    // Foco no input
    setTimeout(() => {
        const input = document.getElementById('senhaAdminInput');
        if (input) input.focus();
    }, 200);

    // Eventos
    document.getElementById('btnLoginAdmin').addEventListener('click', async function() {
        const input = document.getElementById('senhaAdminInput');
        const erro = document.getElementById('erroSenha');
        const btn = this;
        const senha = input.value.trim();

        if (!senha) {
            erro.textContent = '⚠️ Digite a senha!';
            erro.style.display = 'block';
            input.focus();
            return;
        }

        btn.disabled = true;
        btn.textContent = '⏳ Entrando...';

        const sucesso = await autenticarAdmin(senha);

        if (sucesso) {
            modal.remove();
        } else {
            btn.disabled = false;
            btn.textContent = '🔓 Entrar';
            erro.style.display = 'block';
            input.value = '';
            input.focus();
            setTimeout(() => erro.style.display = 'none', 4000);
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
        if (e.target === modal) modal.remove();
    });
}

// ========================================
// GERENCIAMENTO DE ESTOQUE - MELHORADO
// ========================================

function alternarEsgotado(produtoId) {
    if (!isAdmin) {
        mostrarToast('⚠️ Apenas administradores podem alterar o estoque!');
        return;
    }

    // Encontra o produto
    const produto = produtosEnriquecidos.find(p => p.id === produtoId);
    if (!produto) {
        console.error('❌ Produto não encontrado:', produtoId);
        return;
    }

    // Alterna o estado
    const novoEstado = !produto.esgotado;
    produto.esgotado = novoEstado;

    // Salva no Firebase e localStorage
    salvarEstadoFirebase(produtoId, novoEstado);

    // Atualiza a interface
    const card = document.querySelector(`.produto-card[data-id="${produtoId}"]`);
    if (card) {
        card.classList.toggle('esgotado', novoEstado);
        
        // Atualiza badge de esgotado na imagem
        const imgDiv = card.querySelector('.produto-imagem');
        let badge = imgDiv.querySelector('.esgotado-badge-img');
        
        if (novoEstado) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'esgotado-badge-img';
                badge.textContent = 'ESGOTADO';
                imgDiv.appendChild(badge);
            }
        } else {
            if (badge) badge.remove();
        }
    }

    // Atualiza botão de toggle
    const toggleBtn = document.querySelector(`.btn-toggle-esgotado[data-id="${produtoId}"]`);
    if (toggleBtn) {
        toggleBtn.textContent = novoEstado ? '✅ Em Estoque' : '🚫 Esgotar';
        toggleBtn.style.background = novoEstado ? '#4CAF50' : '#ff4444';
    }

    // Atualiza o botão de adicionar ao carrinho
    const btnAdd = document.querySelector(`.btn-add-cart[data-id="${produtoId}"]`);
    if (btnAdd) {
        if (novoEstado) {
            btnAdd.disabled = true;
            btnAdd.innerHTML = '❌ Esgotado';
            btnAdd.style.background = '#999';
            btnAdd.style.cursor = 'not-allowed';
            btnAdd.classList.add('btn-esgotado');
        } else {
            btnAdd.disabled = false;
            btnAdd.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
            btnAdd.style.background = '';
            btnAdd.style.cursor = 'pointer';
            btnAdd.classList.remove('btn-esgotado');
        }
    }

    // Mensagem de feedback
    const mensagem = novoEstado 
        ? `🚫 "${produto.nome}" marcado como ESGOTADO` 
        : `✅ "${produto.nome}" marcado como EM ESTOQUE`;
    mostrarToast(mensagem);
    
    console.log(`📦 Estoque atualizado: ${produto.nome} -> ${novoEstado ? 'ESGOTADO' : 'EM ESTOQUE'}`);
}

function salvarEstadoFirebase(id, esgotado) {
    // Salva no localStorage (fallback)
    const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');
    
    if (esgotado) {
        esgotados[id] = true;
    } else {
        delete esgotados[id];
    }
    
    localStorage.setItem('produtosEsgotados', JSON.stringify(esgotados));

    // Salva no Firebase se disponível
    if (typeof window.database !== 'undefined' && window.database) {
        const updates = {};
        updates[id] = esgotado;
        
        window.database.ref('estoque').update(updates)
            .then(() => {
                console.log(`✅ Estoque salvo no Firebase: ${id} -> ${esgotado}`);
            })
            .catch((error) => {
                console.error('❌ Erro ao salvar no Firebase:', error);
                mostrarToast('⚠️ Estoque salvo apenas localmente (Firebase offline)');
            });
    } else {
        console.log(`✅ Estoque salvo no localStorage: ${id} -> ${esgotado}`);
    }
}

function carregarEstoqueFirebase() {
    return new Promise((resolve) => {
        // Primeiro carrega do localStorage
        carregarEstoqueLocal();

        // Depois tenta sincronizar com Firebase
        if (typeof window.database === 'undefined' || !window.database) {
            console.warn('⚠️ Firebase não disponível. Usando apenas localStorage.');
            resolve();
            return;
        }

        const estoqueRef = window.database.ref('estoque');

        estoqueRef.on('value', (snapshot) => {
            const data = snapshot.val() || {};
            console.log('📦 Dados do Firebase recebidos:', Object.keys(data).length, 'produtos');
            
            // Atualiza os produtos
            produtosEnriquecidos.forEach(produto => {
                const id = String(produto.id);
                if (data.hasOwnProperty(id)) {
                    produto.esgotado = data[id] === true;
                }
            });

            // Atualiza interface
            renderizarProdutos(produtosEnriquecidos);
            renderizarDestaques(produtosEnriquecidos);
            
            // Adiciona botões de toggle para admin
            if (isAdmin) {
                adicionarBotoesToggleEsgotado();
            }
            
            resolve();
        }, (error) => {
            console.error('❌ Erro ao carregar estoque do Firebase:', error);
            resolve();
        });
    });
}

function carregarEstoqueLocal() {
    const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');

    produtosEnriquecidos.forEach(produto => {
        const id = String(produto.id);
        if (esgotados.hasOwnProperty(id)) {
            produto.esgotado = esgotados[id] === true;
        }
    });

    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);
    
    if (isAdmin) {
        adicionarBotoesToggleEsgotado();
    }
}

function resetarTodosEsgotados() {
    if (!isAdmin) return;

    if (!confirm('⚠️ ATENÇÃO! Isso vai marcar TODOS os produtos como "Em Estoque".\n\nDeseja continuar?')) {
        return;
    }

    // Reseta localmente
    localStorage.removeItem('produtosEsgotados');

    produtosEnriquecidos.forEach(produto => {
        produto.esgotado = false;
    });

    // Reseta no Firebase
    if (typeof window.database !== 'undefined' && window.database) {
        window.database.ref('estoque').set({})
            .then(() => {
                mostrarToast('✅ Todos os produtos foram resetados para "Em Estoque"!');
            })
            .catch((error) => {
                console.error('❌ Erro ao resetar no Firebase:', error);
                mostrarToast('⚠️ Resetado localmente! (Firebase offline)');
            });
    } else {
        mostrarToast('✅ Todos os produtos foram resetados para "Em Estoque"!');
    }

    // Atualiza interface
    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);
    
    if (isAdmin) {
        adicionarBotoesToggleEsgotado();
    }
}

// ========================================
// BOTÕES DE TOGGLE NOS CARDS
// ========================================

function adicionarBotoesToggleEsgotado() {
    if (!isAdmin) return;

    // Espera os cards serem renderizados
    setTimeout(() => {
        document.querySelectorAll('.produto-card').forEach(card => {
            const id = card.dataset.id;
            if (!id) return;

            // Verifica se já tem o botão
            if (card.querySelector('.btn-toggle-esgotado')) return;

            const infoDiv = card.querySelector('.produto-info');
            if (!infoDiv) return;

            // Encontra o produto
            const produto = produtosEnriquecidos.find(p => String(p.id) === String(id));
            if (!produto) return;

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn-toggle-esgotado';
            toggleBtn.dataset.id = id;
            toggleBtn.textContent = produto.esgotado ? '✅ Em Estoque' : '🚫 Esgotar';
            toggleBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: 8px;
                margin-top: 6px;
                border: none;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                font-family: var(--font-body);
                background: ${produto.esgotado ? '#4CAF50' : '#ff4444'};
                color: white;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;

            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                alternarEsgotado(Number(id));
            });

            // Insere antes do botão WhatsApp
            const btnWhatsapp = infoDiv.querySelector('.btn-whatsapp');
            if (btnWhatsapp) {
                infoDiv.insertBefore(toggleBtn, btnWhatsapp);
            } else {
                infoDiv.appendChild(toggleBtn);
            }
        });
    }, 200);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Observa mudanças no DOM para adicionar botões de toggle
function observarCards() {
    const observer = new MutationObserver(() => {
        if (isAdmin) {
            adicionarBotoesToggleEsgotado();
        }
    });

    const target = document.getElementById('produtosGrid');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    }
}

// EXPORTA FUNÇÕES GLOBAIS
window.isAdmin = isAdmin;
window.verificarAdmin = verificarAdmin;
window.autenticarAdmin = autenticarAdmin;
window.logoutAdmin = logoutAdmin;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.alternarEsgotado = alternarEsgotado;
window.salvarEstadoFirebase = salvarEstadoFirebase;
window.carregarEstoqueFirebase = carregarEstoqueFirebase;
window.carregarEstoqueLocal = carregarEstoqueLocal;
window.resetarTodosEsgotados = resetarTodosEsgotados;
window.adicionarBotoesToggleEsgotado = adicionarBotoesToggleEsgotado;
window.adicionarBotaoAdmin = adicionarBotaoAdmin;
window.criarBarraAdmin = criarBarraAdmin;
window.removerBarraAdmin = removerBarraAdmin;

console.log('✅ Admin.js carregado com sucesso!');