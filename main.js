import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, getDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxucjJzhq_JYBgL4d_2WLEsmVu_eKllIs",
    authDomain: "app-add-diadema.firebaseapp.com",
    projectId: "app-add-diadema",
    storageBucket: "app-add-diadema.firebasestorage.app",
    messagingSenderId: "773738555135",
    appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// >>> COLOQUE SEU CPF AQUI PARA LIBERAR O ADMIN <<<
const CPF_ADMIN = "12345678901"; 

let telaAtual = 'login'; 
let dadosMembro = null;
let listaMembros = []; // Para o Admin ver todos
let fotoBase64 = null;
let streamCamera = null;

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen bg-gray-100">
                <img src="logo.jpeg" class="w-32 mb-8">
                <div class="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-600">
                    <h2 class="text-xl font-black text-center text-gray-800 uppercase">Login AD Diadema</h2>
                    <input type="text" id="loginCpf" placeholder="CPF (só números)" class="w-full p-4 bg-gray-100 rounded-2xl border-none mb-4">
                    <input type="password" id="loginPin" placeholder="PIN" maxlength="4" class="w-full p-4 bg-gray-100 rounded-2xl border-none text-center text-2xl tracking-widest mb-4">
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg">ENTRAR</button>
                    <button id="irParaCadastro" class="w-full text-gray-400 font-bold text-xs uppercase mt-4">Novo Membro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'admin') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-200">
                <div class="bg-gray-800 p-6 text-white flex justify-between items-center shadow-lg">
                    <h2 class="font-black uppercase tracking-tighter text-lg">Painel Admin AD</h2>
                    <button id="sair" class="bg-red-600 px-4 py-2 rounded-lg text-xs font-bold">SAIR</button>
                </div>
                
                <div class="p-4">
                    <div class="bg-white p-4 rounded-xl mb-6 shadow-sm">
                        <p class="text-[10px] font-black text-gray-400 uppercase">Total de Membros</p>
                        <h3 class="text-3xl font-black text-red-600">${listaMembros.length}</h3>
                    </div>

                    <h4 class="font-black text-gray-500 uppercase text-xs mb-3 ml-1">Lista de Cadastros</h4>
                    <div class="space-y-3">
                        ${listaMembros.map(m => `
                            <div class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                                <img src="${m.foto}" class="w-12 h-12 rounded-full object-cover">
                                <div class="flex-1">
                                    <p class="font-black text-sm uppercase leading-tight">${m.nome}</p>
                                    <p class="text-[10px] text-gray-400">CPF: ${m.cpf}</p>
                                </div>
                                <button onclick="window.excluirMembro('${m.id}')" class="text-gray-300 hover:text-red-600">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }

    // ... (Telas de Cadastro, Área Membro e Carteirinha permanecem as mesmas das versões anteriores)
    else if (telaAtual === 'cadastro') { /* Código de Cadastro já enviado antes */ }
    else if (telaAtual === 'areaMembro') { /* Código de Área Membro enviado antes */ }
}

async function realizarLogin() {
    const cpf = document.getElementById('loginCpf').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    
    const q = query(collection(db, "membros"), where("cpf", "==", cpf), where("pin", "==", pin));
    const qs = await getDocs(q);

    if (!qs.empty) {
        dadosMembro = qs.docs[0].data();
        
        // SE FOR O SEU CPF, ELE CARREGA TODOS E MUDA PRO ADMIN
        if (cpf === CPF_ADMIN) {
            const todos = await getDocs(collection(db, "membros"));
            listaMembros = todos.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            telaAtual = 'admin';
        } else {
            telaAtual = 'areaMembro'; 
        }
        render();
    } else { alert("Acesso Negado!"); }
}

// Função Global para o Admin excluir membro
window.excluirMembro = async (id) => {
    if(confirm("Deseja realmente excluir este membro?")) {
        await deleteDoc(doc(db, "membros", id));
        alert("Excluído!");
        location.reload();
    }
}

// Funções de câmera omitidas aqui para brevidade, mas devem ser mantidas no seu arquivo
// ...

render();
