// Configuração do Firebase (Use os seus dados que já estão no projeto)
const firebaseConfig = {
  apiKey: "AIzaSyDxucjJzhq_JYBgL4d_2WLEsmVu_eKllIs",
  authDomain: "app-add-diadema.firebaseapp.com",
  projectId: "app-add-diadema",
  storageBucket: "app-add-diadema.firebasestorage.app",
  messagingSenderId: "773738555135",
  appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para Salvar Membro
async function salvarMembro(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnFinalizar');
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        whatsapp: document.getElementById('whatsapp').value,
        dataCadastro: new Date().toISOString(),
        foto: document.getElementById('fotoPreview').src // Pega a foto da câmera
    };

    try {
        // "membros" é o nome da coleção que criamos nas regras
        await db.collection("membros").add(dados);
        alert("Cadastro realizado com sucesso, bem-vindo à AD Diadema!");
        location.reload(); // Recarrega a página para limpar
    } catch (error) {
        console.error("Erro ao salvar: ", error);
        alert("Erro ao salvar. Verifique se a internet está ok.");
        btn.innerText = "Finalizar Cadastro";
        btn.disabled = false;
    }
}

// Lógica da Câmera (Reutilizando o que já temos)
// ... (Ajuste aqui com as funções de abrir camera e tirar foto que já fizemos)
