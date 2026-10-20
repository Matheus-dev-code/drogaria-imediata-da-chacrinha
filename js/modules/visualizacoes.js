// ========================================
// CONTADOR DE VISUALIZAÇÕES (Opção C)
// Base aleatória + oscilação leve por dia
// ========================================

const VISITAS_KEY = 'drogaria_visitas_v1';

// Número fixo por produto (base) — gerado uma vez por dia
let basesVisualizacoes = {};

// ========================================
// GERAR HASH SIMPLES A PARTIR DO ID
// Garante que cada produto tenha sempre o mesmo "número base"
// ========================================

function hashDoId(id) {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// ========================================
// PEGA A DATA DE HOJE (YYYY-MM-DD)
// ========================================

function dataDeHoje() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// ========================================
// GERA O NÚMERO BASE PARA O PRODUTO
// Fica entre 25 e 95 (varia por dia, mas estável no mesmo dia)
// ========================================

function gerarBase(id) {
    const hash = hashDoId(id);
    const dataSeed = dataDeHoje().replace(/-/g, '');
    const seedFinal = hash + parseInt(dataSeed.slice(-4), 10);

    // Base entre 25 e 95
    const base = 25 + (seedFinal % 71);
    return base;
}

// ========================================
// CARREGA / GERA O NÚMERO BASE DE TODOS OS PRODUTOS
// ========================================

function carregarBasesVisualizacoes(produtos) {
    if (!Array.isArray(produtos)) return;

    const hoje = dataDeHoje();
    let dados = {};

    try {
        const salvo = localStorage.getItem(VISITAS_KEY);
        if (salvo) dados = JSON.parse(salvo) || {};
    } catch (e) {
        dados = {};
    }

    // Se mudou o dia, zera tudo
    if (dados.data !== hoje) {
        dados = { data: hoje, produtos: {} };
    }

    if (!dados.produtos) dados.produtos = {};

    produtos.forEach(produto => {
        const idStr = String(produto.id);

        if (!dados.produtos[idStr]) {
            dados.produtos[idStr] = {
                base: gerarBase(produto.id),
                extra: Math.floor(Math.random() * 6) // 0 a 5
            };
        }
    });

    try {
        localStorage.setItem(VISITAS_KEY, JSON.stringify(dados));
    } catch (e) {}

    // Salva no objeto global
    basesVisualizacoes = dados.produtos;
}

// ========================================
// RETORNA A QUANTIDADE DE VISUALIZAÇÕES DE UM PRODUTO
// ========================================

function obterVisualizacoes(id) {
    const idStr = String(id);

    if (!basesVisualizacoes[idStr]) {
        // Gera na hora se não existir
        basesVisualizacoes[idStr] = {
            base: gerarBase(id),
            extra: Math.floor(Math.random() * 6)
        };
    }

    return basesVisualizacoes[idStr].base + basesVisualizacoes[idStr].extra;
}

// ========================================
// AUMENTA O CONTADOR (a cada visita no site)
// Isso dá aquela sensação de "está subindo"
// ========================================

function aumentarVisualizacao(id) {
    const idStr = String(id);
    if (!basesVisualizacoes[idStr]) return;

    // Só aumenta 30% das vezes (pra não ser absurdo)
    if (Math.random() < 0.3) {
        basesVisualizacoes[idStr].extra += 1;

        try {
            const salvo = localStorage.getItem(VISITAS_KEY);
            if (salvo) {
                const dados = JSON.parse(salvo);
                if (dados.produtos && dados.produtos[idStr]) {
                    dados.produtos[idStr].extra = basesVisualizacoes[idStr].extra;
                    localStorage.setItem(VISITAS_KEY, JSON.stringify(dados));
                }
            }
        } catch (e) {}
    }
}

// ========================================
// INICIALIZA TUDO
// ========================================

function inicializarVisualizacoes(produtos) {
    carregarBasesVisualizacoes(produtos);
    console.log(`👀 Visualizações inicializadas para ${produtos.length} produtos`);
}

// ========================================
// EXPORTA
// ========================================

window.inicializarVisualizacoes = inicializarVisualizacoes;
window.obterVisualizacoes        = obterVisualizacoes;
window.aumentarVisualizacao     = aumentarVisualizacao;

console.log('✅ Módulo de visualizações carregado!');