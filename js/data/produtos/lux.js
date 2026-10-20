// ========================================
// PRODUTOS Lux
// ========================================

const produtosLux = [

    // ========== Sabonete Líquido 300ml (1) ==========

    {
        id: "lux-sabonete-liquido-bromelia-300ml",
        nome: "Lux Sabonete Líquido Bromélia 300ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Bromélia 300ml",
        preco: "R$ 15,99",
        imagem: "img/lux/liquido/bromelia.webp",
        destaque: false,
        esgotado: false
    },

    // ========== Sabonete Líquido 250ml (2) ==========

    {
        id: "lux-sabonete-liquido-orquidea-negra-250ml",
        nome: "Lux Sabonete Líquido Orquídea Negra 250ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Orquídea Negra 250ml",
        preco: "R$ 11,99",
        imagem: "img/lux/liquido/orquidea.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-liquido-buque-de-jasmin-250ml",
        nome: "Lux Sabonete Líquido Buquê de Jasmin 250ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Buquê Jasmin 250ml",
        preco: "R$ 11,99",
        imagem: "img/lux/liquido/buque.webp",
        destaque: false,
        esgotado: false
    },

    // ========== Sabonete Líquido Refil 200ml (4) ==========

    {
        id: "lux-sabonete-liquido-refil-orquidea-negra-200ml",
        nome: "Lux Sabonete Líquido Refil Orquídea Negra 200ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Refil Orquídea Negra 200ml",
        preco: "R$ 8,49",
        imagem: "img/lux/refil/orquidia.webp",
        destaque: false,
        esgotado: false
    },
    // {
    //     id: "lux-sabonete-liquido-refil-buquet-jasmim-200ml",
    //     nome: "Lux Sabonete Líquido Refil Bouquet de Jasmim 200ml",
    //     marca: "Lux",
    //     tipo: "Higiene",
    //     categoria: "Sabonete",
    //     descricao: "Sabonete Líquido Lux Refil Buque de Jasmim 200ml",
    //     preco: "R$ 8,49",
    //     imagem: "img/lux/refil/buque.webp",
    //     destaque: false,
    //     esgotado: false
    // },
    {
        id: "lux-sabonete-liquido-refil-gardenia-oleo-amendoas-200ml",
        nome: "Lux Sabonete Líquido Refil Gardênia e Óleo de Amêndoas 200ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Refil Gardênia e Óleo de Amêndoas 200ml",
        preco: "R$ 8,49",
        imagem: "img/lux/refil/gardenia.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-liquido-refil-lavanda-200ml",
        nome: "Lux Sabonete Líquido Refil Lavanda 200ml",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete Líquido Lux Refil Lavanda 200ml",
        preco: "R$ 8,49",
        imagem: "img/lux/refil/lavanda.webp",
        destaque: false,
        esgotado: false
    },

    // ========== Sabonete em Barra (7) ==========

    {
        id: "lux-sabonete-barra-bromelia-100g",
        nome: "Lux Sabonete em Barra Bromélia 100g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Bromélia 100g",
        preco: "R$ 3,99",
        imagem: "img/lux/barra/bromelia.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-buque-jasmim-85g",
        nome: "Lux Sabonete em Barra Bouquet de Jasmim 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Buque de Jasmim 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/buque.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-rosas-francesas-85g",
        nome: "Lux Sabonete em Barra Rosas Francesas 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Rosas Francesas 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/rosas.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-flor-de-lotus-85g",
        nome: "Lux Sabonete em Barra Flor de Lótus 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Flor de Lótus 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/flor.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-lirio-azul-85g",
        nome: "Lux Sabonete em Barra Lírio Azul 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Lírio Azul 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/lirio.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-lavanda-85g",
        nome: "Lux Sabonete em Barra Lavanda 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Lavanda 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/lavanda.webp",
        destaque: false,
        esgotado: false
    },
    {
        id: "lux-sabonete-barra-orquidea-negra-85g",
        nome: "Lux Sabonete em Barra Orquídea Negra 85g",
        marca: "Lux",
        tipo: "Higiene",
        categoria: "Sabonete",
        descricao: "Sabonete em Barra Lux Orquídea Negra 85g",
        preco: "R$ 3,49",
        imagem: "img/lux/barra/orquidea.webp",
        destaque: false,
        esgotado: false
    },

];