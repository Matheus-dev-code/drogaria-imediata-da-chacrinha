// ========================================
// SISTEMA DE BUSCA INTELIGENTE
// ========================================

// ========================================
// DICIONÁRIO DE CORREÇÕES
// ========================================

const CORRECOES = {
    // ===== Produtos de cabelo =====
    'xampoo': 'shampoo',
    'xampu': 'shampoo',
    'shampo': 'shampoo',
    'champoo': 'shampoo',
    'shampoo': 'shampoo',
    'condicionadr': 'condicionador',
    'condiciondor': 'condicionador',
    'condiconador': 'condicionador',
    'condiciona': 'condicionador',
    'condicionador': 'condicionador',
    'creme pentear': 'creme de pentear',
    'crmepentear': 'creme de pentear',
    'cremedepentear': 'creme de pentear',
    'masccara': 'mascara',
    'mascara': 'máscara',
    'máscara': 'máscara',
    'oleo': 'óleo',
    'oleos': 'óleo',
    'ole': 'óleo',
    'óleo': 'óleo',
    'tonico': 'tônico',
    'tônico': 'tônico',
    'queratina': 'queratina',
    'queratna': 'queratina',
    'queratin': 'queratina',
    'botox': 'botox',
    'botoox': 'botox',
    'capilar': 'capilar',
    'capilr': 'capilar',

    // ===== Barba / aparelhos de barbear =====
    'prestobarba': 'prestobarba',
    'prestobarbas': 'prestobarba',
    'prestobarba3': 'prestobarba 3',
    'prestobarba 3': 'prestobarba 3',
    'presto barba': 'prestobarba',
    'gilete': 'gillette',
    'gillete': 'gillette',
    'gilette': 'gillette',
    'gillet': 'gillette',
    'gillette': 'gillette',
    'bic': 'bic',
    'bique': 'bic',
    'bik': 'bic',
    'barbeador': 'barbeador',
    'barbeadr': 'barbeador',
    'aparelho': 'aparelho',
    'aparelho de barbear': 'aparelho de barbear',
    'aparelhodebarbear': 'aparelho de barbear',
    'lamina': 'lâmina',
    'lamina de barbear': 'lâmina de barbear',
    'laminas': 'lâminas',
    'lâmina': 'lâmina',
    'sensitive': 'sensitive',
    'sensitiv': 'sensitive',
    'ultra grip': 'ultra grip',
    'ultragrip': 'ultra grip',
    'ultra-grip': 'ultra grip',
    'ultra': 'ultra',
    'grip': 'grip',
    'comfort': 'comfort',
    'comfor': 'comfort',
    'comford': 'comfort',
    'soleil': 'soleil',
    'solei': 'soleil',
    'soleil color': 'soleil color',
    'carvao': 'carvão',
    'carvão': 'carvão',
    'carvaum': 'carvão',
    'aloe': 'aloe',
    'aloe vera': 'aloe vera',
    'aloevera': 'aloe vera',

    // ===== Sabonetes =====
    'sabonete': 'sabonete',
    'saboneti': 'sabonete',
    'sabonte': 'sabonete',
    'sabonete liquido': 'sabonete líquido',
    'sabonete liquido': 'sabonete líquido',
    'saboneteliquido': 'sabonete líquido',
    'liquido': 'líquido',
    'barra': 'barra',
    'bara': 'barra',
    'protex': 'protex',
    'protexe': 'protex',
    'proteks': 'protex',
    'lux': 'lux',
    'luxo': 'lux',
    'luks': 'lux',
    'dove': 'dove',
    'dové': 'dove',
    'nivea': 'nivea',
    'nivéa': 'nivea',
    'niveia': 'nivea',
    'rexona': 'rexona',
    'reixona': 'rexona',
    'rexonna': 'rexona',

    // ===== Desodorantes =====
    'desodorante': 'desodorante',
    'desodoranti': 'desodorante',
    'desodorant': 'desodorante',
    'deo': 'desodorante',
    'herbissimo': 'herbíssimo',
    'herbismo': 'herbíssimo',
    'herbissímo': 'herbíssimo',
    'herbissmo': 'herbíssimo',
    'herbissimo': 'herbíssimo',
    'erbissimo': 'herbíssimo',
    'rollon': 'roll-on',
    'roll on': 'roll-on',
    'roll-on': 'roll-on',
    'aerosol': 'aerosol',
    'aerosol': 'aerosol',

    // ===== Novex =====
    'novex': 'novex',
    'novexe': 'novex',
    'novax': 'novex',
    'novexx': 'novex',
    'babozão': 'super babozão',
    'babozzo': 'super babozão',
    'babao': 'super babozão',
    'babaozão': 'super babozão',
    'baboz': 'super babozão',
    'reposicao': 'reposição',
    'reposição de massa': 'reposição de massa',
    'reposicao de massa': 'reposição de massa',
    'massa': 'massa',
    'broto': 'broto',
    'bambu': 'bambu',
    'broto de bambu': 'broto de bambu',
    'hialuronico': 'hialurônico',
    'hialurônico': 'hialurônico',
    'power max': 'power max',
    'powermax': 'power max',
    'meus cachos': 'meus cachos',
    'meuscachos': 'meus cachos',
    'cachos magicos': 'cachos mágicos',
    'cachos mágicos': 'cachos mágicos',
    'santo black': 'santo black',
    'santoblack': 'santo black',
    'cinema': 'cinema',
    'ativador': 'ativador',
    'ativador de cachos': 'ativador de cachos',

    // ===== Marcas conhecidas =====
    'loreal': "l'oréal paris",
    'loréal': "l'oréal paris",
    'oreal': "l'oréal paris",
    'l oreal': "l'oréal paris",
    'salon line': 'salon line',
    'salão line': 'salon line',
    'salonline': 'salon line',
    'salon': 'salon',
    'line': 'line',
    'maxton': 'maxton',
    'maxtom': 'maxton',
    'maxtonn': 'maxton',
    'cor ton': 'cor&ton',
    'corton': 'cor&ton',
    'coreton': 'cor&ton',
    'cor & ton': 'cor&ton',
    'seda': 'seda',
    'seda boom': 'seda boom',
    'sedaboom': 'seda boom',
    'boom': 'boom',
    'kibon': 'kibon',
    'kibom': 'kibon',
    'frutilly': 'frutilly',
    'frutily': 'frutilly',
    'frutilly': 'frutilly',
    'chicabon': 'chicabon',
    'chicabom': 'chicabon',
    'chicabom': 'chicabon',

    // ===== Alimentos =====
    'fofura': 'fofura',
    'fofurinha': 'fofura',
    'fofura': 'fofura',
    'bala': 'bala',
    'balas': 'bala',
    'halls': 'halls',
    'hall': 'halls',
    'halls': 'halls',
    'trident': 'trident',
    'tridenti': 'trident',
    'triden': 'trident',
    'tortuguita': 'tortuguita',
    'tortugita': 'tortuguita',
    'tortug': 'tortuguita',
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
    'chiclete': 'chiclete',
    'chicletes': 'chiclete',
    'doce': 'doce',
    'doces': 'doces',

    // ===== Categorias =====
    'cabelos': 'cabelo',
    'cabelo': 'cabelo',
    'cablos': 'cabelo',
    'caxbelo': 'cabelo',
    'cabeloo': 'cabelo',
    'infantil': 'kids',
    'crianca': 'kids',
    'crianças': 'kids',
    'bebe': 'kids',
    'bebê': 'kids',
    'kids': 'kids',
    'higiene': 'higiene',
    'higien': 'higiene',
    'higieni': 'higiene',
    'corpo': 'corpo',
    'corpol': 'corpo',
    'corporal': 'corporal',
    'pele': 'pele',
    'pel': 'pele',
    'rosto': 'pele',
    'facial': 'pele',
    'barba': 'barba',
    'barbear': 'barbear',
    'perfumaria': 'perfumaria',
    'perfume': 'perfume',
    'colonia': 'colônia',
    'colônia': 'colônia',
    'maquiagem': 'maquiagem',
    'make': 'maquiagem',
    'tinta': 'tinta',
    'tintas': 'tintas',
    'alimento': 'alimento',
    'alimentos': 'alimentos'
};

// ========================================
// NORMALIZAÇÃO DE TEXTO
// ========================================

function normalizarTextoBusca(texto) {
    if (!texto) return '';

    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

// ========================================
// CORREÇÃO DE PALAVRAS
// ========================================

function corrigirPalavra(palavra) {
    const normalizada = normalizarTextoBusca(palavra);

    if (CORRECOES[normalizada]) {
        return CORRECOES[normalizada];
    }

    for (const [erro, correcao] of Object.entries(CORRECOES)) {
        if (normalizada.includes(erro)) {
            return normalizada.replace(erro, correcao);
        }
    }

    return normalizada;
}

// ========================================
// SIMILARIDADE (LEVENSHTEIN)
// ========================================

function calcularSimilaridade(palavra1, palavra2) {
    const a = normalizarTextoBusca(palavra1);
    const b = normalizarTextoBusca(palavra2);

    if (a.includes(b) || b.includes(a)) {
        return 0.9;
    }

    const distancia = levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);

    if (maxLen === 0) return 1;

    return Math.max(0, Math.min(1, 1 - (distancia / maxLen)));
}

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
// BUSCA INTELIGENTE
// ========================================

function buscarProdutosInteligente(termo, produtos) {
    if (!termo || termo.trim() === '') {
        return produtos;
    }

    const termoNormalizado = normalizarTextoBusca(termo);
    const termoCorrigido = corrigirPalavra(termoNormalizado);
    const palavrasBusca = termoCorrigido.split(' ');

    // 1. Busca exata (prioridade máxima)
    const resultadosExatos = produtos.filter(produto => {
        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const descricao = normalizarTextoBusca(produto.descricao);

        return nome.includes(termoCorrigido) ||
               marca.includes(termoCorrigido) ||
               descricao.includes(termoCorrigido);
    });

    // 2. Busca por palavras individuais
    const resultadosPalavras = produtos.filter(produto => {
        if (resultadosExatos.includes(produto)) return false;

        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const descricao = normalizarTextoBusca(produto.descricao);
        const textoCompleto = `${nome} ${marca} ${descricao}`;

        return palavrasBusca.some(palavra => {
            if (textoCompleto.includes(palavra)) return true;

            if (palavra.length > 2) {
                const palavrasProduto = textoCompleto.split(' ');
                return palavrasProduto.some(palavraProduto => {
                    return calcularSimilaridade(palavra, palavraProduto) > 0.7;
                });
            }

            return false;
        });
    });

    // 3. Busca por similaridade (fallback)
    const resultadosSimilaridade = produtos.filter(produto => {
        if (resultadosExatos.includes(produto)) return false;
        if (resultadosPalavras.includes(produto)) return false;

        const nome = normalizarTextoBusca(produto.nome);
        const marca = normalizarTextoBusca(produto.marca);
        const textoCompleto = `${nome} ${marca}`;

        const similaridade = calcularSimilaridade(termoCorrigido, textoCompleto);
        return similaridade > 0.5;
    });

    // Combina (mantendo prioridade)
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
// SUGESTÃO DE CORREÇÃO
// ========================================

function sugerirCorrecao(termo, produtos) {
    if (!termo || termo.trim() === '') return null;

    const termoNormalizado = normalizarTextoBusca(termo);
    const termoCorrigido = corrigirPalavra(termoNormalizado);

    if (termoCorrigido !== termoNormalizado) {
        return termoCorrigido;
    }

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