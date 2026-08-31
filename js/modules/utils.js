// ========================================
// FUNÇÕES UTILITÁRIAS
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
    return `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;
}

function normalizarTexto(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

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
        'creme-seda': 'Creme de Pentear',
        'facial': 'Facial',
        'corporal': 'Corporal',
        'capilar': 'Capilar',
        'labial': 'Labial',
        'tinta': 'Tinta',
        'descolorante': 'Descolorante',
        'agua oxigenada': 'Água Oxigenada'
    };

    return categorias[categoria] || categoria;
}

function scrollParaElemento(elemento, offset = 20) {
    if (!elemento) return;

    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const adminBar = document.getElementById('adminBar');
    const extraOffset = adminBar ? adminBar.offsetHeight : 0;

    const targetPosition = elemento.getBoundingClientRect().top + 
        window.pageYOffset - headerHeight - extraOffset - offset;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// EXPORTA FUNÇÕES GLOBAIS
window.converterPreco = converterPreco;
window.formatarPreco = formatarPreco;
window.normalizarTexto = normalizarTexto;
window.formatarCategoria = formatarCategoria;
window.scrollParaElemento = scrollParaElemento;

console.log('✅ Utils carregado com sucesso!');