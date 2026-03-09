import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- ESTADO GLOBAL ---
let telaAtual = 'login'; 
let subTelaAdmin = 'menu';
let abaRelatorio = 'adultos'; 
let usuarioLogado = null;
let listaMembros = [];
let logsAuditoria = [];
let fotoBase64 = null;
let streamCamera = null;

// --- UTILITÁRIOS ---
function calcularIdade(dataNasc) {
    if (!dataNasc) return 99; 
    try {
        const hoje = new Date();
        const nasc = new Date(dataNasc);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) { idade--; }
        return idade;
    } catch (e) { return 99; }
}

window.mudarAba = (novaAba) => {
    abaRelatorio = novaAba;
    render();
}

window.mudarSubTela = async (tela) => {
    subTelaAdmin = tela;
    try {
        if(tela === 'relatorios' || tela === 'promoção') {
            const qs = await getDocs(collection(db, "membros"));
            listaMembros = qs.docs.map(d => ({id: d.id, ...d.data()}));
        }
        if(tela === 'auditoria') {
            const q = query(collection(db, "auditoria"), orderBy("timestamp", "desc"), limit(30));
            const qs = await getDocs(q);
            logsAuditoria = qs.docs.map(d => d.data());
        }
    } catch (e) { console.error("Erro ao carregar dados:", e); }
    render();
}

// --- RENDERIZAÇÃO ---
function render() {
    const appDiv = document.getElementById('app');
    if(!appDiv) return;

    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen bg-gray-100">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain">
                <div class="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-600">
                    <h2 class="text-xl font-black text-center text-gray-800 uppercase">Login AD Diadema</h2>
                    <div class="mt-6 space-y-4">
                        <input type="text" id="loginUser" placeholder="Nome" class="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 uppercase">
                        <input type="password" id="loginPin" placeholder="PIN" maxlength="4" class="w-full p-4 bg-gray-50 rounded-2xl border-none text-center text-2xl tracking-widest ring-1 ring-gray-200">
                    </div>
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 mt-6 rounded-2xl font-black shadow-lg">ENTRAR</button>
                    <button id="irParaCadastro" class="w-full text-gray-400 font-bold text-xs uppercase pt-4">Novo Cadastro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'admin') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100">
                <div class="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <h2 class="font-black uppercase text-xs">Admin AD Diadema</h2>
                    <button onclick="location.reload()" class="text-[10px] font-bold">SAIR</button>
                </div>
                ${subTelaAdmin === 'menu' ? renderMenuAdmin() : ''}
                ${subTelaAdmin === 'relatorios' ? renderRelatorios() : ''}
                ${subTelaAdmin === 'auditoria' ? renderAuditoria() : ''}
                ${subTelaAdmin === 'promoção' ? renderPromocao() : ''}
                ${subTelaAdmin !== 'menu' ? `<button onclick="mudarSubTela('menu')" class="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-2xl"><span class="material-icons">arrow_back</span></button>` : ''}
            </div>
        `;
    }

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 min-h-screen bg-gray-100">
                <div class="w-full max-w-md bg-white p-6 rounded-[2rem] shadow-xl space-y-4">
                    <h2 class="text-xl font-black text-red-600 text-center uppercase">Cadastro de Membro</h2>
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 uppercase">
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-gray-400 uppercase ml-2">Data de Nascimento</label>
                        <input type="date" id="cadDataNasc" class="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <select id="cadSexo" class="p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 text-sm">
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                        <input type="text" id="cadFone" placeholder="WhatsApp" class="p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    </div>
                    <select id="cadCongregacao" class="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 text-sm font-bold">
                        <option value="Sede">Sede</option>
                        <option value="Eldorado">Eldorado</option>
                        <option value="Conceição">Conceição</option>
                    </select>
                    <input type="password" id="cadPin" placeholder="PIN de 4 dígitos" maxlength="4" class="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 text-center text-xl tracking-widest">
                    <div class="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border-4 border-white">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>
                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl font-bold uppercase text-xs">Capturar Foto</button>
                    <button id="finalizarCad" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg">FINALIZAR</button>
                    <button onclick="location.reload()" class="w-full text-gray-400 text-[10px] font-black uppercase">Voltar</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }
}

// --- SUB-TELAS ADMIN ---
function renderMenuAdmin() {
    return `
        <div class="p-6 grid gap-4">
            <button onclick="mudarSubTela('relatorios')" class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-blue-600 flex items-center gap-4">
                <span class="material-icons text-blue-600">assessment</span>
                <p class="font-black uppercase text-xs">1. Relatórios</p>
            </button>
            <button onclick="mudarSubTela('auditoria')" class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-amber-500 flex items-center gap-4">
                <span class="material-icons text-amber-500">security</span>
                <p class="font-black uppercase text-xs">2. Auditoria</p>
            </button>
            <button class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-gray-300 flex items-center gap-4 opacity-50">
                <span class="material-icons text-gray-400">logout</span>
                <p class="font-black uppercase text-xs">3. Saídas</p>
            </button>
            <button onclick="mudarSubTela('promoção')" class="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-red-600 flex items-center gap-4">
                <span class="material-icons text-red-600">stars</span>
                <p class="font-black uppercase text-xs">4. Promoção</p>
            </button>
        </div>
    `;
}

function renderRelatorios() {
    const filtrados = listaMembros.filter(m => {
        const idade = calcularIdade(m.dataNascimento);
        return abaRelatorio === 'infantil' ? idade <= 10 : idade > 10;
    });

    return `
        <div class="p-4 space-y-4">
            <div class="flex bg-gray-200 p-1 rounded-2xl">
                <button onclick="mudarAba('adultos')" class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase ${abaRelatorio === 'adultos' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}">Adultos</button>
                <button onclick="mudarAba('infantil')" class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase ${abaRelatorio === 'infantil' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}">Infantil</button>
            </div>
            <div class="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm">
                <p class="font-black uppercase text-xs text-gray-400">Total na Lista</p>
                <p class="font-black text-2xl text-red-600">${filtrados.length}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table class="w-full text-left text-[11px]">
                    <thead class="bg-gray-50 font-black uppercase text-gray-400">
                        <tr><th class="p-4">Nome</th><th class="p-4 text-right">Idade</th></tr>
                    </thead>
                    <tbody>
                        ${filtrados.map(m => `
                            <tr class="border-t"><td class="p-4 font-bold uppercase">${m.nome}</td><td class="p-4 text-right font-black">${m.dataNascimento ? calcularIdade(m.dataNascimento) : '--'}a</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// --- FUNÇÕES DE LÓGICA ---
async function realizarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    
    if (user.toLowerCase() === "admin" && pin === "9999") {
        usuarioLogado = { nome: "Super Admin", nivel: "admin" };
        telaAtual = 'admin';
        mudarSubTela('menu');
        return;
    }

    const q = query(collection(db, "membros"), where("nome", "==", user.toUpperCase()), where("pin", "==", pin));
    const qs = await getDocs(q);
    if (!qs.empty) {
        usuarioLogado = qs.docs[0].data();
        if (usuarioLogado.nivel === 'admin') {
            telaAtual = 'admin';
            mudarSubTela('menu');
        } else {
            telaAtual = 'areaMembro'; // Define conforme sua tela de membro
            render();
        }
    } else { alert("Dados incorretos!"); }
}

async function salvarCadastro() {
    const nome = document.getElementById('cadNome').value.toUpperCase().trim();
    const dataNascimento = document.getElementById('cadDataNasc').value;
    const pin = document.getElementById('cadPin').value;
    const fone = document.getElementById('cadFone').value;

    if(!nome || !dataNascimento || pin.length < 4 || !fotoBase64) return alert("Preencha tudo!");

    try {
        await addDoc(collection(db, "membros"), { 
            nome, dataNascimento, pin, fone, foto: fotoBase64, 
            status: 'ativo', nivel: 'membro', cargo: 'Membro',
            data: new Date().toLocaleString() 
        });
        desligarCamera();
        alert("Cadastrado!");
        location.reload();
    } catch (e) { alert("Erro ao salvar."); }
}

// --- CAMERA ---
function iniciarCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { streamCamera = s; document.getElementById('video').srcObject = s; });
}
function desligarCamera() { if (streamCamera) { streamCamera.getTracks().forEach(t => t.stop()); streamCamera = null; } }
function tirarFoto() {
    const canvas = document.getElementById('canvas');
    canvas.width = 400; canvas.height = 400;
    canvas.getContext('2d').drawImage(document.getElementById('video'), 0, 0, 400, 400);
    fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    document.getElementById('fotoPreview').src = fotoBase64;
    document.getElementById('video').classList.add('hidden');
    document.getElementById('fotoPreview').classList.remove('hidden');
}

render();
