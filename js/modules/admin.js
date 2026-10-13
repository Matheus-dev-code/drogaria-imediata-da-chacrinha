// ========================================
// SISTEMA DE ADMINISTRAÇÃO
// Acesso: duplo clique no logo OU Ctrl+Shift+A
// ========================================

let isAdmin = false;
let adminLoginAttempts = 0;
const ADMIN_EMAIL = 'admin@drogariaimediata.com';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutos

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

    if (adminLoginAttempts >= MAX_ATTEMPTS) {
        console.warn('🚫 Login bloqueado por muitas tentativas.');
        mostrarToast('🚫 Muitas tentativas. Aguarde 5 minutos.');
        return Promise.resolve(false);
    }

    return firebase.auth()
        .signInWithEmailAndPassword(ADMIN_EMAIL, senha)
        .then(() => {
            adminLoginAttempts = 0;
            isAdmin = true;
            console.log('✅ Admin autenticado com sucesso!');
            mostrarToast('👑 Modo administrador ativado!');
            setTimeout(() => location.reload(), 500);
            return true;
        })
        .catch((error) => {
            console.error('❌ Erro ao entrar como admin:', error.code);

            adminLoginAttempts++;

            let mensagem;
            if (error.code === 'auth/wrong-password') {
                if (adminLoginAttempts >= MAX_ATTEMPTS) {
                    mensagem = '🚫 Bloqueado por 5 minutos. Muitas tentativas.';
                    setTimeout(() => {
                        adminLoginAttempts = 0;
                    }, LOCKOUT_TIME);
                } else {
                    mensagem = `❌ Senha incorreta (${adminLoginAttempts}/${MAX_ATTEMPTS})`;
                }
            } else if (error.code === 'auth/too-many-requests') {
                mensagem = '🚫 Muitas tentativas. Aguarde alguns minutos.';
                adminLoginAttempts = MAX_ATTEMPTS;
                setTimeout(() => { adminLoginAttempts = 0; }, LOCKOUT_TIME);
            } else if (error.code === 'auth/user-not-found') {
                mensagem = '❌ Usuário não encontrado.';
            } else if (error.code === 'auth/network-request-failed') {
                mensagem = '❌ Erro de conexão. Verifique sua internet.';
            } else {
                mensagem = '❌ Erro ao autenticar. Tente novamente.';
            }

            mostrarToast(mensagem);
            return false;
        });
}

function logoutAdmin() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            isAdmin = false;
            adminLoginAttempts = 0;
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
        </span>
        <span style="font-size:12px;opacity:0.8;">
            💡 Clique em <strong>"ESGOTAR"</strong> nos produtos
        </span>
        <div style="display:flex;gap:8px;align-items:center;">
            <button id="resetEstoqueBtn" style="
                background:#ff4444;color:white;border:none;border-radius:20px;
                padding:6px 18px;font-size:12px;font-weight:700;cursor:pointer;
                transition:all 0.2s;display:flex;align-items:center;gap:6px;
            ">🔄 Resetar Todos</button>
            <button id="logoutAdminBtn" style="
                background:rgba(255,255,255,0.15);color:white;
                border:1px solid rgba(255,255,255,0.3);border-radius:20px;
                padding:6px 18px;font-size:12px;font-weight:600;cursor:pointer;
                transition:all 0.2s;display:flex;align-items:center;gap:6px;
            ">🚪 Sair</button>
        </div>
    `;

    document.body.appendChild(adminBar);

    document.getElementById('resetEstoqueBtn').addEventListener('click', resetarTodosEsgotados);
    document.getElementById('logoutAdminBtn').addEventListener('click', logoutAdmin);
}

function removerBarraAdmin() {
    const barra = document.getElementById('adminBar');
    if (barra) barra.remove();
}

// ========================================
// ACESSO ESCONDIDO AO ADMIN
// ========================================

/**
 * Configura formas escondidas de acessar o painel admin:
 * 1. Duplo clique no logo
 * 2. Ctrl + Shift + A (atalho de teclado)
 */
function configurarAcessoAdminEscondido() {
    // 1. Duplo clique no logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('dblclick', function (e) {
            e.preventDefault();
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

    // 2. Atalho de teclado: Ctrl + Shift + A
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();

            if (isAdmin) {
                if (confirm('Você está logado como administrador. Deseja sair?')) {
                    logoutAdmin();
                }
            } else {
                mostrarLoginAdmin();
            }
        }
    });

    console.log('🔐 Acesso admin escondido configurado (duplo clique no logo ou Ctrl+Shift+A)');
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
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); display: flex; align-items: center;
        justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease-out;
        backdrop-filter: blur(6px); padding: 20px;
    `;

    modal.innerHTML = `
        <div style="
            background: white; padding: 35px 30px; border-radius: 20px;
            max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            text-align: center; animation: slideUp 0.3s ease;
        ">
            <div style="font-size: 48px; margin-bottom: 10px;">👑</div>
            <h2 style="color: #8B0045; margin-bottom: 6px; font-family: var(--font-display);">
                Acesso Administrador
            </h2>
            <p style="color: #666; margin-bottom: 24px; font-size: 14px;">
                Digite a senha para gerenciar o estoque
            </p>
            <input type="password" id="senhaAdminInput" placeholder="Digite a senha"
                style="
                    width: 100%; padding: 14px 18px; border: 2px solid #ddd;
                    border-radius: 12px; font-size: 16px; margin-bottom: 16px;
                    outline: none; transition: border-color 0.3s;
                    font-family: var(--font-body);
                " autofocus>
            <div style="display: flex; gap: 10px;">
                <button id="btnLoginAdmin" style="
                    flex: 1; padding: 14px; background: #8B0045; color: white;
                    border: none; border-radius: 12px; font-size: 16px;
                    font-weight: 700; cursor: pointer; transition: all 0.3s;
                    font-family: var(--font-body);
                ">🔓 Entrar</button>
                <button id="btnFecharModal" style="
                    flex: 1; padding: 14px; background: #eee; color: #333;
                    border: none; border-radius: 12px; font-size: 16px;
                    font-weight: 600; cursor: pointer; transition: all 0.3s;
                    font-family: var(--font-body);
                ">Cancelar</button>
            </div>
            <p id="erroSenha" style="
                color: #ff4444; font-size: 13px; margin-top: 14px;
                display: none; font-weight: 600;
            ">❌ Senha incorreta! Tente novamente.</p>
            <p id="tentativasRestantes" style="
                color: #999; font-size: 12px; margin-top: 8px; display: none;
            "></p>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        const input = document.getElementById('senhaAdminInput');
        if (input) input.focus();
    }, 200);

    atualizarTentativasRestantes();

    document.getElementById('btnLoginAdmin').addEventListener('click', async function () {
        const input = document.getElementById('senhaAdminInput');
        const erro = document.getElementById('erroSenha');
        const btn = this;
        const senha = input.value.trim();

        if (adminLoginAttempts >= MAX_ATTEMPTS) {
            erro.textContent = '🚫 Muitas tentativas. Aguarde 5 minutos.';
            erro.style.display = 'block';
            return;
        }

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
            atualizarTentativasRestantes();

            if (adminLoginAttempts < MAX_ATTEMPTS) {
                setTimeout(() => erro.style.display = 'none', 4000);
            }
        }
    });

    document.getElementById('senhaAdminInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('btnLoginAdmin').click();
        }
    });

    document.getElementById('btnFecharModal').addEventListener('click', function () {
        modal.remove();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.remove();
    });
}

function atualizarTentativasRestantes() {
    const el = document.getElementById('tentativasRestantes');
    if (!el) return;

    const restantes = MAX_ATTEMPTS - adminLoginAttempts;

    if (adminLoginAttempts > 0 && restantes > 0) {
        el.textContent = `⚠️ Tentativas restantes: ${restantes}`;
        el.style.display = 'block';
    } else if (restantes <= 0) {
        el.textContent = '🚫 Bloqueado por 5 minutos.';
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

// ========================================
// GERENCIAMENTO DE ESTOQUE
// ========================================

function alternarEsgotado(produtoId) {
    if (!isAdmin) {
        mostrarToast('⚠️ Apenas administradores podem alterar o estoque!');
        return;
    }

    const produto = produtosEnriquecidos.find(p => String(p.id) === String(produtoId));
    if (!produto) {
        console.error('❌ Produto não encontrado:', produtoId);
        return;
    }

    const novoEstado = !produto.esgotado;
    produto.esgotado = novoEstado;

    salvarEstadoFirebase(produto.id, novoEstado);
    reconstruirCardProduto(produto);

    const mensagem = novoEstado
        ? `🚫 "${produto.nome}" marcado como ESGOTADO`
        : `✅ "${produto.nome}" marcado como EM ESTOQUE`;
    mostrarToast(mensagem);
}

function reconstruirCardProduto(produto) {
    const cardAntigo = document.querySelector(`.produto-card[data-id="${produto.id}"]`);
    if (!cardAntigo) return;

    if (typeof criarProdutoCard !== 'function') return;

    const cardNovo = criarProdutoCard(produto);
    cardNovo.classList.add('visible');

    if (isAdmin && typeof adicionarBotaoToggleEmUmCard === 'function') {
        adicionarBotaoToggleEmUmCard(cardNovo, produto);
    }

    cardAntigo.replaceWith(cardNovo);

    if (typeof atualizarBotoesCarrinho === 'function') {
        atualizarBotoesCarrinho();
    }
}

function adicionarBotaoToggleEmUmCard(card, produto) {
    const infoDiv = card.querySelector('.produto-info');
    if (!infoDiv) return;
    if (card.querySelector('.btn-toggle-esgotado')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-toggle-esgotado';
    toggleBtn.dataset.id = produto.id;
    toggleBtn.textContent = produto.esgotado ? '✅ Em Estoque' : '🚫 Esgotar';
    toggleBtn.style.cssText = `
        display: block; width: 100%; padding: 8px; margin-top: 6px;
        border: none; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; transition: all 0.2s; font-family: var(--font-body);
        background: ${produto.esgotado ? '#4CAF50' : '#ff4444'};
        color: white; text-transform: uppercase; letter-spacing: 0.5px;
    `;

    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        alternarEsgotado(produto.id);
    });

    const btnWhatsapp = infoDiv.querySelector('.btn-whatsapp');
    if (btnWhatsapp) {
        infoDiv.insertBefore(toggleBtn, btnWhatsapp);
    } else {
        infoDiv.appendChild(toggleBtn);
    }
}

function atualizarCardEsgotado(produto) {
    reconstruirCardProduto(produto);
}

function salvarEstadoFirebase(id, esgotado) {
    const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');
    const idStr = String(id);

    if (esgotado) {
        esgotados[idStr] = true;
    } else {
        delete esgotados[idStr];
    }

    localStorage.setItem('produtosEsgotados', JSON.stringify(esgotados));

    if (typeof window.database !== 'undefined' && window.database) {
        const updates = {};
        updates[idStr] = esgotado;

        window.database.ref('estoque').update(updates)
            .then(() => console.log(`✅ Estoque salvo: ${idStr} -> ${esgotado}`))
            .catch((error) => {
                console.error('❌ Erro ao salvar:', error);
                mostrarToast('⚠️ Estoque salvo apenas localmente');
            });
    }
}

function carregarEstoqueFirebase() {
    return new Promise((resolve) => {
        try { carregarEstoqueLocal(); } catch (e) { console.warn(e); }

        if (typeof window.database === 'undefined' || !window.database) {
            resolve();
            return;
        }

        try {
            const estoqueRef = window.database.ref('estoque');

            estoqueRef.on('value', (snapshot) => {
                const data = snapshot.val() || {};
                let houveMudanca = false;

                produtosEnriquecidos.forEach(produto => {
                    const id = String(produto.id);
                    const novoEstado = data.hasOwnProperty(id) ? data[id] === true : false;

                    if (produto.esgotado !== novoEstado) {
                        produto.esgotado = novoEstado;
                        houveMudanca = true;
                    }
                });

                if (!houveMudanca) { resolve(); return; }

                if (typeof renderizarProdutos === 'function') renderizarProdutos(produtosEnriquecidos);
                if (typeof renderizarDestaques === 'function') renderizarDestaques(produtosEnriquecidos);
                if (isAdmin && typeof adicionarBotoesToggleEsgotado === 'function') {
                    adicionarBotoesToggleEsgotado();
                }

                resolve();
            }, (error) => {
                console.error('❌ Erro no listener:', error);
                resolve();
            });
        } catch (e) {
            console.error('❌ Erro:', e);
            resolve();
        }
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

    if (isAdmin) adicionarBotoesToggleEsgotado();
}

function resetarTodosEsgotados() {
    if (!isAdmin) return;
    if (!confirm('⚠️ Isso vai marcar TODOS os produtos como "Em Estoque".\n\nDeseja continuar?')) return;

    localStorage.removeItem('produtosEsgotados');

    produtosEnriquecidos.forEach(produto => {
        produto.esgotado = false;
    });

    if (typeof window.database !== 'undefined' && window.database) {
        window.database.ref('estoque').set({})
            .then(() => mostrarToast('✅ Todos resetados!'))
            .catch(() => mostrarToast('⚠️ Resetado localmente!'));
    } else {
        mostrarToast('✅ Todos resetados!');
    }

    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);

    if (isAdmin) adicionarBotoesToggleEsgotado();
}

// ========================================
// BOTÕES DE TOGGLE NOS CARDS (ADMIN)
// ========================================

function adicionarBotoesToggleEsgotado() {
    if (!isAdmin) return;

    setTimeout(() => {
        document.querySelectorAll('.produto-card').forEach(card => {
            const id = card.dataset.id;
            if (!id) return;
            if (card.querySelector('.btn-toggle-esgotado')) return;

            const produto = produtosEnriquecidos.find(p => String(p.id) === String(id));
            if (!produto) return;

            adicionarBotaoToggleEmUmCard(card, produto);
        });
    }, 50);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

function observarCards() {
    const observer = new MutationObserver(() => {
        if (isAdmin) adicionarBotoesToggleEsgotado();
    });

    const target = document.getElementById('produtosGrid');
    if (target) observer.observe(target, { childList: true, subtree: true });
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.isAdmin = isAdmin;
window.verificarAdmin = verificarAdmin;
window.autenticarAdmin = autenticarAdmin;
window.logoutAdmin = logoutAdmin;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.alternarEsgotado = alternarEsgotado;
window.atualizarCardEsgotado = atualizarCardEsgotado;
window.reconstruirCardProduto = reconstruirCardProduto;
window.adicionarBotaoToggleEmUmCard = adicionarBotaoToggleEmUmCard;
window.salvarEstadoFirebase = salvarEstadoFirebase;
window.carregarEstoqueFirebase = carregarEstoqueFirebase;
window.carregarEstoqueLocal = carregarEstoqueLocal;
window.resetarTodosEsgotados = resetarTodosEsgotados;
window.adicionarBotoesToggleEsgotado = adicionarBotoesToggleEsgotado;
window.criarBarraAdmin = criarBarraAdmin;
window.removerBarraAdmin = removerBarraAdmin;
window.configurarAcessoAdminEscondido = configurarAcessoAdminEscondido;

console.log('✅ Admin.js carregado! (Acesso: duplo clique no logo ou Ctrl+Shift+A)');