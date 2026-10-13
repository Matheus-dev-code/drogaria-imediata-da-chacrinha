// ========================================
// BARRA DE PESQUISA NO HEADER (Desktop + Mobile)
// ========================================

function configurarHeaderSearch() {
    const input = document.getElementById('header-search-input');
    const clearBtn = document.getElementById('header-search-clear');
    const searchSecao = document.getElementById('search-input');
    const buscaMobileIcon = document.getElementById('buscaMobileIcon');
    const headerSearch = document.querySelector('.header-search');

    if (!input) return;

    let debounceTimer;

    // ========================================
    // MOBILE: botão 🔍 abre/fecha a barra
    // ========================================
    if (buscaMobileIcon && headerSearch) {
        buscaMobileIcon.addEventListener('click', function (e) {
            e.stopPropagation();

            const aberta = headerSearch.classList.toggle('mobile-aberta');

            if (aberta) {
                setTimeout(() => input.focus(), 100);
            }
        });

        // Fecha ao clicar fora
        document.addEventListener('click', function (e) {
            if (!headerSearch.contains(e.target) && !buscaMobileIcon.contains(e.target)) {
                headerSearch.classList.remove('mobile-aberta');
            }
        });

        // Fecha ao apertar ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                headerSearch.classList.remove('mobile-aberta');
            }
        });
    }

    // ========================================
    // INPUT: digitar / enter / esc
    // ========================================
    input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const termo = this.value;

        if (clearBtn) {
            clearBtn.classList.toggle('visible', termo.length > 0);
        }

        // Sincroniza com a busca da seção de filtros
        if (searchSecao) {
            searchSecao.value = termo;
            searchSecao.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Rola até os produtos depois que o usuário digitar
        debounceTimer = setTimeout(() => {
            if (termo.length > 0) {
                const produtosSection = document.getElementById('produtos');
                if (produtosSection && typeof scrollParaElemento === 'function') {
                    // Fecha a barra mobile antes de rolar
                    if (headerSearch) headerSearch.classList.remove('mobile-aberta');
                    scrollParaElemento(produtosSection);
                }
            }
        }, 800);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();

            // Fecha a barra mobile
            if (headerSearch) headerSearch.classList.remove('mobile-aberta');

            const produtosSection = document.getElementById('produtos');
            if (produtosSection) {
                setTimeout(() => {
                    if (typeof scrollParaElemento === 'function') {
                        scrollParaElemento(produtosSection);
                    } else {
                        produtosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        }

        if (e.key === 'Escape') {
            this.value = '';
            if (clearBtn) clearBtn.classList.remove('visible');

            if (searchSecao) {
                searchSecao.value = '';
                searchSecao.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (headerSearch) headerSearch.classList.remove('mobile-aberta');
        }
    });

    // ========================================
    // BOTÃO LIMPAR
    // ========================================
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            input.value = '';
            this.classList.remove('visible');

            if (searchSecao) {
                searchSecao.value = '';
                searchSecao.dispatchEvent(new Event('input', { bubbles: true }));
            }

            input.focus();
        });
    }

    console.log('✅ Barra de pesquisa do header configurada (Desktop + Mobile)');
}

window.configurarHeaderSearch = configurarHeaderSearch;

console.log('✅ Módulo header-search carregado!');