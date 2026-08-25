// ========================================
// SISTEMA DE ADMINISTRAÇÃO
// ========================================

let isAdmin = false;
const ADMIN_EMAIL = 'admin@drogariaimediata.com';

// ========================================
// AUTENTICAÇÃO
// ========================================

function verificarAdmin() {
    return new Promise((resolve) => {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('⚠️ Firebase Authentication não disponível.');
            resolve(false);
            return;
        }

        firebase.auth().onAuthStateChanged((user) => {
            isAdmin = !!user;
            resolve(isAdmin);
        });
    });
}

function autenticarAdmin(senha) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        return Promise.resolve(false);
    }

    return firebase.auth()
        .signInWithEmailAndPassword(ADMIN_EMAIL, senha)
        .then(() => {
            isAdmin = true;
            location.reload();
            return true;
        })
        .catch((error) => {
            console.error('❌ Erro ao entrar como admin:', error.code);
            return false;
        });
}

function logoutAdmin() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            isAdmin = false;
            location.reload();
        });
    } else {
        isAdmin = false;
        location.reload();
    }
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
            <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
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
                ">Cancelar</button>
            </div>
            <p id="erroSenha" style="
                color: #ff4444;
                font-size: 13px;
                margin-top: 12px;
                display: none;
            ">Senha incorreta! Tente novamente.</p>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        const input = document.getElementById('senhaAdminInput');
        if (input) input.focus();
    }, 100);

    document.getElementById('btnLoginAdmin').addEventListener('click', async function() {
        const input = document.getElementById('senhaAdminInput');
        const erro = document.getElementById('erroSenha');
        const btn = this;
        const senha = input.value;

        btn.disabled = true;
        btn.textContent = 'Entrando...';

        const sucesso = await autenticarAdmin(senha);

        if (sucesso) {
            modal.remove();
        } else {
            btn.disabled = false;
            btn.textContent = 'Entrar';
            erro.style.display = 'block';
            input.value = '';
            input.focus();
            setTimeout(() => erro.style.display = 'none', 3000);
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
// GERENCIAMENTO DE ESTOQUE
// ========================================

function carregarEstoqueFirebase() {
    return new Promise((resolve) => {
        carregarEstoqueLocal();

        if (!verificarFirebase()) {
            resolve();
            return;
        }

        const estoqueRef = window.database.ref('estoque');

        estoqueRef.on('value', (snapshot) => {
            const data = snapshot.val() || {};
            carregandoEstoque = false;

            produtosEnriquecidos.forEach(produto => {
                produto.esgotado = data[produto.id] || false;
            });

            renderizarProdutos(produtosEnriquecidos);
            renderizarDestaques(produtosEnriquecidos);
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
        produto.esgotado = esgotados[produto.id] || false;
    });

    carregandoEstoque = false;
    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);
}

function salvarEstadoFirebase(id, esgotado) {
    if (!isAdmin) return;

    const esgotados = JSON.parse(localStorage.getItem('produtosEsgotados') || '{}');

    if (esgotado) {
        esgotados[id] = true;
    } else {
        delete esgotados[id];
    }

    localStorage.setItem('produtosEsgotados', JSON.stringify(esgotados));

    if (!verificarFirebase()) return;

    const updates = {};
    updates[id] = esgotado;

    window.database.ref('estoque').update(updates)
        .then(() => console.log('✅ Estoque atualizado no Firebase:', id, esgotado))
        .catch((error) => console.error('❌ Erro ao salvar no Firebase:', error));
}

function resetarTodosEsgotados() {
    if (!isAdmin) return;

    if (!confirm('⚠️ Resetar TODOS os estados de esgotado? Isso vai marcar todos os produtos como "Em Estoque".')) {
        return;
    }

    localStorage.removeItem('produtosEsgotados');

    produtosEnriquecidos.forEach(produto => {
        produto.esgotado = false;
    });

    renderizarProdutos(produtosEnriquecidos);
    renderizarDestaques(produtosEnriquecidos);

    if (verificarFirebase()) {
        window.database.ref('estoque').set({})
            .then(() => alert('✅ Todos os estados foram resetados!'))
            .catch((error) => {
                console.error('❌ Erro ao resetar no Firebase:', error);
                alert('✅ Resetado localmente! (Firebase falhou)');
            });
    } else {
        alert('✅ Todos os estados foram resetados (local)!');
    }
}

function verificarFirebase() {
    if (typeof window.database === 'undefined') {
        console.warn('⚠️ Firebase não disponível. Usando localStorage como fallback.');
        return false;
    }
    return true;
}

// ========================================
// CRIAÇÃO DA BARRA DE ADMIN
// ========================================

function criarBarraAdmin() {
    const header = document.querySelector('header');
    const adminBar = document.createElement('div');

    adminBar.id = 'adminBar';
    const alturaHeader = header ? header.offsetHeight : 0;

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
        <span>👑 <strong>Modo Administrador</strong> - Gerenciando estoques</span>
        <button id="resetEstoqueBtn" style="
            background:#ff4444;
            color:white;
            border:none;
            border-radius:20px;
            padding:4px 16px;
            font-size:12px;
            font-weight:600;
            cursor:pointer;
        ">🔄 Resetar Todos</button>
        <button id="logoutAdminBtn" style="
            background:transparent;
            color:white;
            border:1px solid white;
            border-radius:20px;
            padding:4px 16px;
            font-size:12px;
            font-weight:600;
            cursor:pointer;
        ">🚪 Sair</button>
        <span style="font-size:11px;opacity:0.7;">💾 Salvando em tempo real</span>
    `;

    document.body.appendChild(adminBar);

    document.getElementById('resetEstoqueBtn').addEventListener('click', resetarTodosEsgotados);
    document.getElementById('logoutAdminBtn').addEventListener('click', logoutAdmin);
}