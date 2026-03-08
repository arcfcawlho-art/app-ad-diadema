import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Suas configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDxucjJzhq_JYBgL4d_2WLEsmVu_eKllIs",
    authDomain: "app-add-diadema.firebaseapp.com",
    projectId: "app-add-diadema",
    storageBucket: "app-add-diadema.firebasestorage.app",
    messagingSenderId: "773738555135",
    appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esta função vai desenhar a tela na marra
function renderizar() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="flex flex-col items-center p-6 bg-white min-h-screen">
            <h1 class="text-3xl font-bold text-blue-800 mb-6">AD DIADEMA</h1>
            <div class="w-full max-w-md bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                <label class="block text-gray-700 font-bold mb-2">Nome do Irmão(ã):</label>
                <input type="text" id="nome" class="w-full p-3 border rounded-lg mb-4" placeholder="Digite o nome completo">
                
                <button id="btnSalvar" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                    FINALIZAR CADASTRO
                </button>
                <p id="status" class="mt-4 text-center text-sm font-medium"></p>
            </div>
        </div>
    `;

    // Ação do Botão
    document.getElementById('btnSalvar').onclick = async () => {
        const nomeInput = document.getElementById('nome').value;
        const status = document.getElementById('status');

        if (!nomeInput) {
            alert("Por favor, digite o nome!");
            return;
        }

        status.innerText = "Salvando no sistema...";
        status.className = "mt-4 text-center text-blue-600 animate-pulse";

        try {
            await addDoc(collection(db, "membros"), {
                nome: nomeInput,
                dataCadastro: new Date().toISOString()
            });
            status.innerText = "✅ Cadastro realizado com sucesso!";
            status.className = "mt-4 text-center text-green-600 font-bold";
            document.getElementById('nome').value = "";
        } catch (error) {
            console.error(error);
            status.innerText = "❌ Erro ao salvar. Tente novamente.";
            status.className = "mt-4 text-center text-red-600";
        }
    };
}

// Executa a função
renderizar();
