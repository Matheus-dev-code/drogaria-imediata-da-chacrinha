// ========================================
// ARQUIVO PRINCIPAL - JUNTA TODOS OS PRODUTOS
// ========================================

const todosProdutos = [
    ...produtosSalonLineKids,
    ...produtosSalonLineAdulto,  
    ...produtosSeda,
    ...produtosLoreal
];

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

function criarProdutoCard(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    if (produto.destaque) card.classList.add('destaque');
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

function aplicarFiltros() {
    produtosFiltrados = todosProdutos.filter(produto => {
        const tipoMatch = categoriaAtual === 'todos' || produto.tipo === categoriaAtual;
        const marcaMatch = marcaAtual === 'todas' || produto.marca.toLowerCase() === marcaAtual;
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
    const termo = this.value.toLowerCase();
    
    if (termo === '') {
        aplicarFiltros();
        return;
    }
    
    produtosFiltrados = todosProdutos.filter(produto => {
        return produto.nome.toLowerCase().includes(termo) ||
               produto.marca.toLowerCase().includes(termo) ||
               produto.descricao.toLowerCase().includes(termo) ||
               formatarCategoria(produto.categoria).toLowerCase().includes(termo);
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

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(todosProdutos);
    
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
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', new Date().getFullYear());
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});