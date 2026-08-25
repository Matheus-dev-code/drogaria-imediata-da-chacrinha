// ========================================
// SISTEMA DE FILTROS
// ========================================

let categoriaAtual = 'todos';
let marcaAtual = 'todas';
let linhaAtual = 'todas';

// ========================================
// APLICAÇÃO DE FILTROS
// ========================================

function aplicarFiltros() {
    produtosFiltrados = produtosEnriquecidos.filter(produto => {
        const tipoMatch = categoriaAtual === 'todos' || produto.tipo === categoriaAtual;
        const marcaMatch = marcaAtual === 'todas' || 
            normalizarTexto(produto.marca) === normalizarTexto(marcaAtual);
        const linhaMatch = linhaAtual === 'todas' || 
            normalizarTexto(produto.linha || '') === normalizarTexto(linhaAtual);

        return tipoMatch && marcaMatch && linhaMatch;
    });

    paginaAtual = 1;
    mostrarPagina(true);
    atualizarFiltrosAtivos();
}

function atualizarFiltrosAtivos() {
    const container = document.getElementById('filtrosAtivos');
    if (!container) return;

    const ativos = [];

    if (categoriaAtual !== 'todos') {
        const btn = document.querySelector(`.btn-categoria[data-categoria="${categoriaAtual}"]`);
        if (btn) {
            const nome = btn.querySelector('span')?.textContent || categoriaAtual;
            ativos.push(nome);
        }
    }

    if (marcaAtual !== 'todas') {
        const select = document.getElementById('marcaSelect');
        const option = select?.querySelector(`option[value="${marcaAtual}"]`);
        ativos.push(option?.textContent || marcaAtual);
    }

    if (linhaAtual !== 'todas') {
        const select = document.getElementById('linhaSelect');
        const option = select?.querySelector(`option[value="${linhaAtual}"]`);
        ativos.push(option?.textContent || linhaAtual);
    }

    if (ativos.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `Filtros: ${ativos.map(a => `<span class="ativo">${a}</span>`).join(' ')}`;
}

// ========================================
// LINHAS POR MARCA
// ========================================

function obterLinhasPorMarca(marca) {
    const linhas = new Set();
    
    produtosEnriquecidos.forEach(produto => {
        if (normalizarTexto(produto.marca) === normalizarTexto(marca)) {
            if (produto.linha && produto.linha !== produto.marca) {
                linhas.add(produto.linha);
            }
        }
    });

    return Array.from(linhas).sort();
}

function atualizarSelectMarcas() {
    const select = document.getElementById('marcaSelect');
    if (!select) return;

    const opcoes = select.options;
    let temOpcao = false;

    for (let i = 0; i < opcoes.length; i++) {
        if (opcoes[i].value === marcaAtual) {
            temOpcao = true;
            break;
        }
    }

    if (!temOpcao && marcaAtual !== 'todas') {
        marcaAtual = 'todas';
        select.value = 'todas';
        document.getElementById('linhasWrapper').style.display = 'none';
        linhaAtual = 'todas';
    }
}

// ========================================
// CONFIGURAÇÃO DOS EVENTOS DE FILTRO
// ========================================

function configurarEventosFiltros() {
    // Categorias
    document.querySelectorAll('.btn-categoria').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-categoria').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            categoriaAtual = this.getAttribute('data-categoria');
            aplicarFiltros();
        });
    });

    // Select de Marcas
    const marcaSelect = document.getElementById('marcaSelect');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function() {
            const valor = this.value;
            marcaAtual = valor;

            const linhasWrapper = document.getElementById('linhasWrapper');
            const linhaSelect = document.getElementById('linhaSelect');
            const linhas = obterLinhasPorMarca(valor);

            if (linhas.length > 0 && valor !== 'todas') {
                linhasWrapper.style.display = 'block';
                linhaSelect.innerHTML = '<option value="todas">Todas as Linhas</option>';
                
                linhas.forEach(linha => {
                    const option = document.createElement('option');
                    option.value = linha;
                    option.textContent = linha;
                    linhaSelect.appendChild(option);
                });
                
                linhaAtual = 'todas';
            } else {
                linhasWrapper.style.display = 'none';
                linhaAtual = 'todas';
            }

            aplicarFiltros();
        });
    }

    // Select de Linhas
    const linhaSelect = document.getElementById('linhaSelect');
    if (linhaSelect) {
        linhaSelect.addEventListener('change', function() {
            linhaAtual = this.value;
            aplicarFiltros();
        });
    }

    // Busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const termo = normalizarTexto(this.value);

            if (termo === '') {
                aplicarFiltros();
                return;
            }

            produtosFiltrados = produtosEnriquecidos.filter(produto => {
                return normalizarTexto(produto.nome).includes(termo) ||
                    normalizarTexto(produto.marca).includes(termo) ||
                    normalizarTexto(produto.descricao).includes(termo) ||
                    normalizarTexto(formatarCategoria(produto.categoria)).includes(termo) ||
                    normalizarTexto(produto.linha || '').includes(termo);
            });

            paginaAtual = 1;
            mostrarPagina(true);
        });
    }
}