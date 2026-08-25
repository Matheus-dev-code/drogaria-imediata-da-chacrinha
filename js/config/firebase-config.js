// ========================================
// CONFIGURAÇÃO DO FIREBASE
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyC0hMPHp-KXtJ4vEzsZAUtPL_hn5b8FSdU",
    authDomain: "drogariaestoque-c30f3.firebaseapp.com",
    databaseURL: "https://drogariaestoque-c30f3-default-rtdb.firebaseio.com",
    projectId: "drogariaestoque-c30f3",
    storageBucket: "drogariaestoque-c30f3.firebasestorage.app",
    messagingSenderId: "495015342103",
    appId: "1:495015342103:web:90e4a6216cd305f38aec52",
    measurementId: "G-K6NHPR92NG"
};

// Inicializa Firebase se disponível
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.database = firebase.database();
    console.log('🔥 Firebase conectado com sucesso');
} else {
    console.warn('⚠️ Firebase não carregado. Usando localStorage como fallback.');
}