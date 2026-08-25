// ========================================
// GOOGLE ANALYTICS - EVENTOS PERSONALIZADOS
// ========================================

// Função para registrar eventos
function registrarEvento(eventName, eventParams = {}) {
    if (typeof window.analytics !== 'undefined') {
        try {
            window.analytics.logEvent(eventName, eventParams);
            console.log(`📊 Evento registrado: ${eventName}`, eventParams);
        } catch (error) {
            console.warn(`⚠️ Erro ao registrar evento ${eventName}:`, error);
        }
    }
}

// ========================================
// EVENTOS DE PRODUTOS
// ========================================

// Quando um produto é visualizado
function registrarVisualizacaoProduto(produto) {
    if (!produto) return;
    
    registrarEvento('view_item', {
        items: [{
            item_id: produto.id,
            item_name: produto.nome,
            item_brand: produto.marca,
            item_category: produto.categoria,
            price: converterPreco(produto.preco)
        }]
    });
}

// Quando um produto é adicionado ao carrinho
function registrarAdicaoAoCarrinho(produto, quantidade = 1) {
    if (!produto) return;
    
    registrarEvento('add_to_cart', {
        items: [{
            item_id: produto.id,
            item_name: produto.nome,
            item_brand: produto.marca,
            item_category: produto.categoria,
            price: converterPreco(produto.preco),
            quantity: quantidade
        }]
    });
}

// Quando um produto é removido do carrinho
function registrarRemocaoDoCarrinho(produto) {
    if (!produto) return;
    
    registrarEvento('remove_from_cart', {
        items: [{
            item_id: produto.id,
            item_name: produto.nome,
            item_brand: produto.marca
        }]
    });
}

// ========================================
// EVENTOS DE BUSCA
// ========================================

// Quando o usuário faz uma busca
function registrarBusca(termo) {
    if (!termo || termo === '') return;
    
    registrarEvento('search', {
        search_term: termo
    });
}

// ========================================
// EVENTOS DE NAVEGAÇÃO
// ========================================

// Quando o usuário filtra por categoria
function registrarFiltroCategoria(categoria) {
    registrarEvento('filter_category', {
        category: categoria
    });
}

// Quando o usuário filtra por marca
function registrarFiltroMarca(marca) {
    registrarEvento('filter_brand', {
        brand: marca
    });
}

// ========================================
// EVENTOS DE CONVERSÃO
// ========================================

// Quando o pedido é finalizado
function registrarPedidoFinalizado(total, quantidadeItens = 0) {
    registrarEvento('begin_checkout', {
        value: total,
        currency: 'BRL',
        items_count: quantidadeItens
    });
}

// Quando o usuário clica no WhatsApp
function registrarCliqueWhatsApp(produto = null) {
    registrarEvento('whatsapp_click', {
        product_name: produto ? produto.nome : 'geral'
    });
}

// ========================================
// EVENTOS DE INTERAÇÃO
// ========================================

// Quando o usuário abre o carrinho
function registrarAberturaCarrinho() {
    registrarEvento('view_cart');
}

// Quando o usuário fecha o carrinho
function registrarFechamentoCarrinho() {
    registrarEvento('close_cart');
}

// Quando o usuário clica em "Verificar Disponibilidade"
function registrarVerificarDisponibilidade(produto) {
    if (!produto) return;
    
    registrarEvento('check_availability', {
        product_name: produto.nome,
        product_brand: produto.marca
    });
}

// ========================================
// FUNÇÃO PARA EXPORTAR (se necessário)
// ========================================

// Torna as funções disponíveis globalmente
if (typeof window !== 'undefined') {
    window.registrarEvento = registrarEvento;
    window.registrarVisualizacaoProduto = registrarVisualizacaoProduto;
    window.registrarAdicaoAoCarrinho = registrarAdicaoAoCarrinho;
    window.registrarRemocaoDoCarrinho = registrarRemocaoDoCarrinho;
    window.registrarBusca = registrarBusca;
    window.registrarFiltroCategoria = registrarFiltroCategoria;
    window.registrarFiltroMarca = registrarFiltroMarca;
    window.registrarPedidoFinalizado = registrarPedidoFinalizado;
    window.registrarCliqueWhatsApp = registrarCliqueWhatsApp;
    window.registrarAberturaCarrinho = registrarAberturaCarrinho;
    window.registrarFechamentoCarrinho = registrarFechamentoCarrinho;
    window.registrarVerificarDisponibilidade = registrarVerificarDisponibilidade;
}

console.log('✅ Analytics configurado com sucesso!');