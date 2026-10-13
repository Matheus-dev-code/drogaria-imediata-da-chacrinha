// ========================================
// INTERFACE DO USUÁRIO
// ========================================

// ========================================
// ESTRELAS DE AVALIAÇÃO (mantida caso use depois)
// ========================================

function renderizarEstrelas(avaliacao) {
    const valor = Number(avaliacao) || 0;
    const estrelasCheias = Math.floor(valor);
    const meiaEstrela = valor - estrelasCheias >= 0.5;
    const estrelasVazias = 5 - estrelasCheias - (meiaEstrela ? 1 : 0);

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
// NOTIFICAÇÕES (TOAST)
// ========================================

function mostrarToast(mensagem) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    const span = toast.querySelector('span');
    if (span) span.textContent = mensagem;

    const btnAntigo = toast.querySelector('.toast-acao');
    if (btnAntigo) btnAntigo.remove();

    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ========================================
// TOAST COM AÇÃO (DESFAZER)
// ========================================

function mostrarToastComAcao(mensagem, textoBotao, callbackAcao, duracao = 6000) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    const span = toast.querySelector('span');
    if (span) span.textContent = mensagem;

    const btnAntigo = toast.querySelector('.toast-acao');
    if (btnAntigo) btnAntigo.remove();

    if (textoBotao && typeof callbackAcao === 'function') {
        const btn = document.createElement('button');
        btn.className = 'toast-acao';
        btn.textContent = textoBotao;
        btn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.4);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            margin-left: 12px;
            transition: background 0.2s;
            font-family: var(--font-body);
        `;
        btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.3)');
        btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,0.2)');
        btn.addEventListener('click', () => {
            callbackAcao();
            toast.classList.remove('show');
            const b = toast.querySelector('.toast-acao');
            if (b) b.remove();
        });
        toast.appendChild(btn);
    }

    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
        const b = toast.querySelector('.toast-acao');
        if (b) b.remove();
    }, duracao);
}

// ========================================
// BADGE DO CARRINHO
// ========================================

function atualizarBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    const total = carrinho.reduce((sum, item) => sum + Number(item.quantidade || 0), 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

function animarBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    badge.classList.remove('pulse');
    setTimeout(() => badge.classList.add('pulse'), 10);
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.produto-card, .destaques-grid .produto-card, .sobre-texto')
        .forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
}

// ========================================
// SCROLL HORIZONTAL
// ========================================

function habilitarScrollHorizontal(seletor) {
    document.querySelectorAll(seletor).forEach(el => {
        el.addEventListener('wheel', function(e) {
            if (this.scrollWidth > this.clientWidth) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });
}

// ========================================
// MENU MOBILE
// ========================================

function configurarMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    document.addEventListener('click', (e) => {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================

function configurarBotaoTopo() {
    const btnTopo = document.getElementById('btnTopo');
    if (!btnTopo) return;

    window.addEventListener('scroll', () => {
        btnTopo.classList.toggle('show', window.scrollY > 400);
    });

    btnTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// WHATSAPP — VERIFICAR DISPONIBILIDADE
// ========================================

function verificarDisponibilidade(nome, marca, preco) {
    const numeroWhatsApp = '5521969583871';
    const mensagem = `Olá! Gostaria de verificar a disponibilidade do produto:\n\n` +
        `*${nome}*\n` +
        `Marca: ${marca}\n` +
        `Preço: ${preco}\n\n` +
        `Tem em estoque? Poderia me informar o prazo de entrega?`;

    if (typeof registrarVerificarDisponibilidade === 'function') {
        registrarVerificarDisponibilidade({ nome, marca });
    }

    const link = document.createElement('a');
    link.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// 📱 COMPARTILHAR PRODUTO NO WHATSAPP
// ========================================

function compartilharProduto(produto) {
    if (!produto) return;

    const nome = produto.nome || 'Produto';
    const marca = produto.marca || '';
    const preco = produto.preco || '';
    const descricao = produto.descricao || '';

    // Monta a URL do site (raiz)
    const url = window.location.origin + window.location.pathname;

    // Monta a mensagem
    let mensagem = `Olha que achei na Drogaria Imediata da Chacrinha:\n\n`;
    mensagem += `✨ *${nome}*\n`;

    if (marca) {
        mensagem += `🏷️ Marca: ${marca}\n`;
    }
    if (preco) {
        mensagem += `💰 Preço: ${preco}\n`;
    }
    if (descricao) {
        mensagem += `📝 ${descricao}\n`;
    }

    mensagem += `\n🛒 Confira aqui: ${url}`;

    // Mostra toast
    if (typeof mostrarToast === 'function') {
        mostrarToast('📱 Abrindo WhatsApp...');
    }

    // Registra no Analytics (se existir)
    if (typeof registrarEvento === 'function') {
        registrarEvento('share', {
            content_type: 'product',
            item_id: produto.id,
            item_name: nome
        });
    }

    // Abre WhatsApp via <a> (mais confiável em mobile)
    const link = document.createElement('a');
    link.href = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ========================================

function configurarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) scrollParaElemento(target);
        });
    });
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.renderizarEstrelas = renderizarEstrelas;
window.mostrarToast = mostrarToast;
window.mostrarToastComAcao = mostrarToastComAcao;
window.atualizarBadge = atualizarBadge;
window.animarBadge = animarBadge;
window.initScrollReveal = initScrollReveal;
window.habilitarScrollHorizontal = habilitarScrollHorizontal;
window.configurarMenuMobile = configurarMenuMobile;
window.configurarBotaoTopo = configurarBotaoTopo;
window.verificarDisponibilidade = verificarDisponibilidade;
window.compartilharProduto = compartilharProduto;
window.configurarSmoothScroll = configurarSmoothScroll;

console.log('✅ Módulo UI carregado com sucesso!');