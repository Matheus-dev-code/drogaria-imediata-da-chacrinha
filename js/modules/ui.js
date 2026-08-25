// ========================================
// INTERFACE DO USUÁRIO
// ========================================

// ========================================
// ESTRELAS DE AVALIAÇÃO
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

    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
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
// WHATSAPP
// ========================================

function verificarDisponibilidade(nome, marca, preco) {
    const numeroWhatsApp = '5521969583871';
    const mensagem = `Olá! Gostaria de verificar a disponibilidade do produto:\n\n` +
        `*${nome}*\n` +
        `Marca: ${marca}\n` +
        `Preço: ${preco}\n\n` +
        `Tem em estoque? Poderia me informar o prazo de entrega?`;

    // 📊 Registra evento no Analytics
    if (typeof registrarVerificarDisponibilidade === 'function') {
        registrarVerificarDisponibilidade({ nome, marca });
    }

    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
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