import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxucjJzh_JYBgL4d_2WLEsmVu_eKllIs",
    authDomain: "app-add-diadema.firebaseapp.com",
    projectId: "app-add-diadema",
    storageBucket: "app-add-diadema.firebasestorage.app",
    messagingSenderId: "773738555135",
    appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let telaAtual = 'login'; 
let dadosMembro = null;
let listaMembros = [];
let fotoBase64 = null;
let streamCamera = null;

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen bg-gray-100 font-sans">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain">
                <div class="w-full max-w-sm space-y-4 bg-white p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-600">
                    <h2 class="text-xl font-black text-center text-gray-800 uppercase tracking-tighter">Acesso Rápido</h2>
                    <input type="text" id="loginUser" placeholder="Seu Nome" class="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-red-500">
                    <input type="password" id="loginPin" placeholder="PIN de 4 dígitos" maxlength="4" class="w-full p-4 bg-gray-100 rounded-2xl border-none text-center text-2xl tracking-widest focus:ring-2 focus:ring-red-500">
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">ENTRAR</button>
                    <button id="irParaCadastro" class="w-full text-gray-400 font-bold text-xs uppercase pt-2 tracking-widest">Criar Cadastro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 min-h-screen bg-gray-100">
                <div class="w-full max-w-md bg-white p-6 rounded-[2rem] shadow-xl space-y-4">
                    <h2 class="text-2xl font-black text-red-600 text-center uppercase">Novo Membro</h2>
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="text" id="cadFone" placeholder="Telefone com DDD" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="password" id="cadPin" placeholder="Crie seu PIN (4 dígitos)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    
                    <div class="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl font-bold uppercase text-xs">Capturar Foto</button>
                    <button id="finalizarCad" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg uppercase">Finalizar</button>
                    <button id="voltarLogin" class="w-full text-gray-400 text-xs font-bold uppercase">Voltar</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('voltarLogin').onclick = () => { desligarCamera(); telaAtual = 'login'; render(); };
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }

    else if (telaAtual === 'admin') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-200 font-sans">
                <div class="bg-gray-800 p-6 text-white flex justify-between items-center shadow-lg">
                    <h2 class="font-black uppercase text-sm tracking-widest">Painel Administrador</h2>
                    <button id="sair" class="bg-red-600 px-4 py-2 rounded-lg text-xs font-bold">SAIR</button>
                </div>
                <div class="p-4 space-y-4">
                    <div class="bg-white p-6 rounded-2xl shadow-sm">
                        <p class="text-[10px] font-black text-gray-400 uppercase">Membros Cadastrados</p>
                        <h3 class="text-4xl font-black text-red-600">${listaMembros.length}</h3>
                    </div>
                    <div class="space-y-2">
                        ${listaMembros.map(m => `
                            <div class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                                <img src="${m.foto}" class="w-12 h-12 rounded-full object-cover border">
                                <div class="flex-1">
                                    <p class="font-black text-xs uppercase text-gray-800">${m.nome}</p>
                                    <p class="text-[10px] text-gray-400 font-bold">${m.fone || 'Sem fone'}</p>
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

    else if (telaAtual === 'areaMembro') {
        // TELA SIMPLIFICADA PÓS LOGIN
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100">
                <div class="bg-red-600 p-8 rounded-b-[3rem] shadow-xl text-white">
                    <p class="text-xs font-bold opacity-70 uppercase tracking-widest">Paz do Senhor,</p>
                    <h2 class="text-2xl font-black uppercase">${dadosMembro.nome.split(' ')[0]}</h2>
                </div>
                <div class="p-6 flex flex-col items-center flex-1 justify-center">
                    <img src="${dadosMembro.foto}" class="w-48 h-48 rounded-[2rem] border-8 border-white shadow-2xl object-cover mb-6">
                    <h3 class="text-xl font-black text-gray-800 uppercase text-center">${dadosMembro.nome}</h3>
                    <p class="text-red-600 font-black text-xs mt-2 uppercase tracking-[0.2em]">Membro AD Diadema</p>
                    
                    <div class="mt-8 p-4 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
                         <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${dadosMembro.nome}" class="w-32 h-32 opacity-80">
                    </div>

                    <button id="sair" class="mt-12 text-gray-400 font-bold text-xs uppercase tracking-widest">Sair do App</button>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }
}

async function realizarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    
    // LOGIN SUPER ADMIN (Porta Secreta)
    if (user.toLowerCase() === "admin" && pin === "9999") {
        const todos = await getDocs(collection(db, "membros"));
        listaMembros = todos.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        telaAtual = 'admin';
        render();
        return;
    }

    // LOGIN NORMAL POR NOME
    const q = query(collection(db, "membros"), where("nome", "==", user.toUpperCase()), where("pin", "==", pin));
    const qs = await getDocs(q);

    if (!qs.empty) {
        dadosMembro = qs.docs[0].data();
        telaAtual = 'areaMembro'; 
        render();
    } else { 
        alert("Nome ou PIN incorretos. Dica: Use o nome em MAIÚSCULO como cadastrou."); 
    }
}

function iniciarCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { streamCamera = s; document.getElementById('video').srcObject = s; });
}

function desligarCamera() {
    if (streamCamera) { streamCamera.getTracks().forEach(t => t.stop()); streamCamera = null; }
}

function tirarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('fotoPreview');
    canvas.width = 600; canvas.height = 600;
    canvas.getContext('2d').drawImage(video, 0, 0, 600, 600);
    fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    preview.src = fotoBase64;
    video.classList.add('hidden');
    preview.classList.remove('hidden');
}

async function salvarCadastro() {
    const nome = document.getElementById('cadNome').value.toUpperCase().trim();
    const pin = document.getElementById('cadPin').value;
    const fone = document.getElementById('cadFone').value;
    if(!nome || pin.length < 4 || !fotoBase64) return alert("Preencha Nome, PIN e tire a foto!");
    
    try {
        await addDoc(collection(db, "membros"), { nome, pin, fone, foto: fotoBase64, data: new Date().toLocaleString() });
        desligarCamera();
        alert("Cadastro Concluído!");
        telaAtual = 'login'; render();
    } catch (e) { alert("Erro ao salvar."); }
}

window.excluirMembro = async (id) => {
    if(confirm("Excluir este membro?")) {
        await deleteDoc(doc(db, "membros", id));
        location.reload();
    }
}

render();
