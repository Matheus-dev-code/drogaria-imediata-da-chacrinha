// ========================================
// BANNERS PROMOCIONAIS POR MARCA
// ========================================
// Para adicionar uma imagem, basta criar o arquivo em:
// img/banners/nome-da-marca.webp
// E ajustar a propriedade "imagem"
//
// CAMPOS DISPONÍVEIS:
// - marca:     nome exibido no banner
// - filtro:    valor da marca no <select id="marcaSelect">
// - busca:     (OPCIONAL) termo que será digitado no campo de busca
//              Se preenchido, além de filtrar a marca, faz uma busca por esse termo
// - titulo:    título do banner
// - subtitulo: subtítulo do banner
// - imagem:    caminho da imagem
// - cor:       cor de fundo (fallback se não tiver imagem)

const bannersPromocionais = [
    {
        id: 1,
        marca: "Salon Line",
        filtro: "salon line",
        // sem "busca" → mostra TODOS os produtos Salon Line
        titulo: "Salon Line",
        subtitulo: "Cachos perfeitos todos os dias",
        imagem: "img/banners/salon-line.webp",
        cor: "#8B0045"
    },
    {
        id: 2,
        marca: "Salon Line",
        filtro: "salon line",
        busca: "gelatina",              // 👈 busca por "gelatina"
        titulo: "Novas Gelatinas Salon Line",
        subtitulo: "Venha conhecer a linha completa de gelatinas",
        imagem: "img/banners/gelatinas-salon-line.webp",
        cor: "#8B0045"
    },
    {
        id: 3,
        marca: "Skala",
        filtro: "skala",
        titulo: "Skala",
        subtitulo: "Cuidado que cabe no bolso",
        imagem: "img/banners/skala.webp",
        cor: "#E91E63"
    },
    {
        id: 4,
        marca: "Seda",
        filtro: "seda",
        titulo: "Seda",
        subtitulo: "Brilho e maciez para o seu cabelo",
        imagem: "img/banners/seda.webp",
        cor: "#FF9800"
    },
    {
        id: 5,
        marca: "Dove",
        filtro: "dove",
        titulo: "Dove",
        subtitulo: "Cuidado real para sua pele",
        imagem: "img/banners/dove.webp",
        cor: "#00BCD4"
    },
    {
        id: 6,
        marca: "Rexona",
        filtro: "rexona",
        titulo: "Rexona",
        subtitulo: "Não te abandona nunca",
        imagem: "img/banners/rexona.webp",
        cor: "#3F51B5"
    },
    {
        id: 7,
        marca: "L'Oréal Paris",
        filtro: "l'oréal paris",
        titulo: "L'Oréal Paris",
        subtitulo: "Porque você vale muito",
        imagem: "img/banners/loreal.webp",
        cor: "#000000"
    },
    // {
    //     id: 8,
    //     marca: "Pantene",
    //     filtro: "pantene",
    //     titulo: "Pantene",
    //     subtitulo: "Cabelo forte e saudável",
    //     imagem: "img/banners/pantene.webp",
    //     cor: "#FFC107"
    // },
    {
        id: 9,
        marca: "Nivea",
        filtro: "nivea",
        titulo: "Nivea",
        subtitulo: "Cuide da sua pele",
        imagem: "img/banners/nivea.webp",
        cor: "#1565C0"
    }
];

console.log('✅ Banners carregados:', bannersPromocionais.length);