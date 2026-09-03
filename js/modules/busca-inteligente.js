// ========================================
// SISTEMA DE BUSCA INTELIGENTE
// ========================================

// ========================================
// DICIONÁRIO DE CORREÇÕES COMUNS
// ========================================

const CORRECOES = {
    // Erros comuns em produtos de cabelo
    'xampoo': 'shampoo',
    'xampu': 'shampoo',
    'shampo': 'shampoo',
    'champoo': 'shampoo',
    'condicionadr': 'condicionador',
    'condiciondor': 'condicionador',
    'condiconador': 'condicionador',
    'condiciona': 'condicionador',
    'creme pentear': 'creme de pentear',
    'crmepentear': 'creme de pentear',
    'masccara': 'mascara',
    'mascara': 'máscara',
    'oleo': 'óleo',
    'oleos': 'óleo',
    'ole': 'óleo',
    'tonico': 'tônico',
    'tonico': 'tônico',

    // Erros comuns em marcas
    'loreal': 'l\'oréal paris',
    'loréal': 'l\'oréal paris',
    'oreal': 'l\'oréal paris',
    'salon line': 'salon line',
    'salão line': 'salon line',
    'salonline': 'salon line',
    'nivea': 'nivea',
    'nivéa': 'nivea',
    'rexona': 'rexona',
    'reixona': 'rexona',
    'dove': 'dove',
    'dové': 'dove',
    'maxton': 'maxton',
    'maxtom': 'maxton',
    'cor ton': 'cor&ton',
    'corton': 'cor&ton',
    'coreton': 'cor&ton',

    // Erros em alimentos
    'fofura': 'fofura',
    'fofurinha': 'fofura',
    'bala': 'bala',
    'halls': 'halls',
    'hall': 'halls',
    'trident': 'trident',
    'tridenti': 'trident',
    'tortuguita': 'tortuguita',
    'tortugita': 'tortuguita',
    'nutella': 'nutella',
    'nutela': 'nutella',
    'nutelinha': 'nutella',
    'kinder': 'kinder',
    'kinder joy': 'kinder joy',
    'kinder ovo': 'kinder joy',
    'bis': 'bis',
    'biss': 'bis',
    'lacta': 'lacta',
    'lactha': 'lacta',

    // Erros comuns em categorias
    'cabelos': 'cabelo',
    'cabelo': 'cabelo',
    'cablos': 'cabelo',
    'caxbelo': 'cabelo',
    'infantil': 'kids',
    'crianca': 'kids',
    'crianças': 'kids',
    'bebe': 'kids',
    'bebê': 'kids',
    'higiene': 'higiene',
    'higien': 'higiene',
    'corpo': 'corpo',
    'corpol': 'corpo',
    'pele': 'pele',
    'pel': 'pele',
    'rosto': 'pele',
    'facial': 'pele'
};

// ========================================
// FUNÇÃO PARA NORMALIZAR TEXTO
// ========================================

function normalizarTextoBusca(texto) {
    if (!texto) return '';
    
    return String(texto)
        .normalize('NFD')                    // Remove acentos
        .replace(/[\u0300-\u036f]/g, '')    // Remove diacríticos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');               // Remove espaços duplicados
}

// ========================================
// FUNÇÃO PARA CORRIGIR PALAVRAS COMUNS
// ========================================

function corrigirPalavra(palavra) {
    const normalizada = normalizarTextoBusca(palavra);
    
    // Verifica se a palavra está no dicionário de correções
    if (CORRECOES[normalizada]) {
        return CORRECOES[normalizada];
    }
    
    // Verifica se a palavra contém alguma correção
    for (const [erro, correcao] of Object.entries(CORRECOES)) {
        if (normalizada.includes(erro)) {
            return normalizada.replace(erro, correcao);
        }
    }
    
    return normalizada;
}

// ========================================
// FUNÇÃO PARA CALCULAR SIMILARIDADE
// ========================================

function calcularSimilaridade(palavra1, palavra2) {
    const a = normalizarTextoBusca(palavra1);
    const b = normalizarTextoBusca(palavra2);
    
    // Se uma palavra está contida na outra
    if (a.includes(b) || b.includes(a)) {
        return 0.9;
    }
    
    // Distância de Levenshtein (simplificada)
    const distancia = levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    
    if (maxLen === 0) return 1;
    
    const similaridade = 1 - (distancia / maxLen);
    return Math.max(0, Math.min(1, similaridade));
}

// ========================================
// DISTÂNCIA DE LEVENSHTEIN
// ========================================

function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i-1] === a[j-1]) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

// ========================================
// FUNÇÃO PRINCIPAL DE BUSCA INTELIGENTE
// ========================================

function buscarProdutosInteligente(termo, produtos) {
    if (!termo || termo.trim() === '') {
        return produtos;
    }
    
    const termoNormalizado = normalizarTextoBusca(termo);
    const termoCorrigido = corrigirPalavra(termoNormalizado);
    const palavrasBusca = termoCorrigido.split(' ');
    
    // Primeiro: busca exata (prioridade máxima)
    const resultadosExatos = produtos.filter(produto => {
        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const descricao = normalizarTextoBusca(produto.descricao);
        
        // Verifica se o termo completo está no nome, marca ou descrição
        return nome.includes(termoCorrigido) || 
               marca.includes(termoCorrigido) || 
               descricao.includes(termoCorrigido);
    });
    
    // Segundo: busca por palavras individuais
    const resultadosPalavras = produtos.filter(produto => {
        // Ignora produtos já encontrados na busca exata
        if (resultadosExatos.includes(produto)) return false;
        
        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const descricao = normalizarTextoBusca(produto.descricao);
        const textoCompleto = `${nome} ${marca} ${descricao}`;
        
        // Verifica se pelo menos uma palavra da busca está presente
        return palavrasBusca.some(palavra => {
            // Busca a palavra exata
            if (textoCompleto.includes(palavra)) return true;
            
            // Busca por similaridade (se a palavra for longa o suficiente)
            if (palavra.length > 2) {
                const palavrasProduto = textoCompleto.split(' ');
                return palavrasProduto.some(palavraProduto => {
                    return calcularSimilaridade(palavra, palavraProduto) > 0.7;
                });
            }
            
            return false;
        });
    });
    
    // Terceiro: busca por similaridade (fallback)
    const resultadosSimilaridade = produtos.filter(produto => {
        // Ignora produtos já encontrados
        if (resultadosExatos.includes(produto)) return false;
        if (resultadosPalavras.includes(produto)) return false;
        
        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const textoCompleto = `${nome} ${marca}`;
        
        // Verifica similaridade geral
        const similaridade = calcularSimilaridade(termoCorrigido, textoCompleto);
        return similaridade > 0.5;
    });
    
    // Combina os resultados (mantendo a ordem de prioridade)
    const resultados = [
        ...resultadosExatos,
        ...resultadosPalavras,
        ...resultadosSimilaridade
    ];
    
    // Remove duplicatas
    const vistos = new Set();
    return resultados.filter(produto => {
        const id = produto.id || produto.nome;
        if (vistos.has(id)) return false;
        vistos.add(id);
        return true;
    });
}

// ========================================
// FUNÇÃO PARA SUGERIR CORREÇÕES
// ========================================

function sugerirCorrecao(termo, produtos) {
    if (!termo || termo.trim() === '') return null;
    
    const termoNormalizado = normalizarTextoBusca(termo);
    const termoCorrigido = corrigirPalavra(termoNormalizado);
    
    // Se o termo foi corrigido e é diferente do original
    if (termoCorrigido !== termoNormalizado) {
        return termoCorrigido;
    }
    
    // Busca por produtos com nomes similares para sugerir
    const todosNomes = produtos.map(p => normalizarTextoBusca(p.nome));
    const maisSimilar = todosNomes.reduce((melhor, nome) => {
        const similaridade = calcularSimilaridade(termoNormalizado, nome);
        if (similaridade > 0.6 && similaridade < 0.9 && similaridade > (melhor.similaridade || 0)) {
            return { nome, similaridade };
        }
        return melhor;
    }, { similaridade: 0 });
    
    return maisSimilar.nome || null;
}

// ========================================
// EXPORTA FUNÇÕES GLOBAIS
// ========================================

window.buscarProdutosInteligente = buscarProdutosInteligente;
window.sugerirCorrecao = sugerirCorrecao;
window.normalizarTextoBusca = normalizarTextoBusca;
window.corrigirPalavra = corrigirPalavra;
window.calcularSimilaridade = calcularSimilaridade;

console.log('✅ Busca inteligente carregada com sucesso!');