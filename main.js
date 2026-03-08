import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let telaAtual = 'login'; 
let dadosMembro = null;
let fotoBase64 = null;

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain grayscale">
                <div class="w-full max-w-sm space-y-4 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-600">
                    <h2 class="text-xl font-black text-center text-gray-800 uppercase">Acesso Restrito</h2>
                    <input type="text" id="loginCpf" placeholder="CPF (só números)" maxlength="11" class="w-full p-4 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-red-500">
                    <input type="password" id="loginPin" placeholder="PIN" maxlength="4" class="w-full p-4 bg-gray-100 rounded-xl border-none text-center text-2xl tracking-widest focus:ring-2 focus:ring-red-500">
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all">ENTRAR NO SISTEMA</button>
                    <button id="irParaCadastro" class="w-full text-gray-500 font-bold text-xs uppercase tracking-widest">Novo Membro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 min-h-screen bg-gray-100">
                <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4">
                    <h2 class="text-2xl font-black text-red-600 text-center uppercase">Cadastro Oficial</h2>
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="cadCpf" placeholder="CPF" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                        <input type="text" id="cadFone" placeholder="DDD+Cel" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    </div>
                    <input type="password" id="cadPin" placeholder="Crie seu PIN (4 n°)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    
                    <div class="p-3 bg-gray-50 rounded-xl flex items-center gap-2 border">
                        <input type="checkbox" id="lgpd" class="accent-red-600">
                        <label class="text-[9px] text-gray-500 leading-tight">Autorizo a AD Diadema a tratar meus dados e imagem conforme a LGPD.</label>
                    </div>

                    <div class="relative w-full aspect-square bg-black rounded-xl overflow-hidden shadow-inner">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl font-bold">CAPTURAR IMAGEM</button>
                    <button id="finalizarCad" class="w-full bg-red-600 text-white p-4 rounded-xl font-black shadow-lg">CONFIRMAR E SALVAR</button>
                    <button id="voltarLogin" class="w-full text-gray-400 text-xs">Voltar</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('voltarLogin').onclick = () => { telaAtual = 'login'; render(); };
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }

    else if (telaAtual === 'areaMembro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 min-h-screen bg-gray-200">
                <div class="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-red-600">
                    <div class="p-8 flex flex-col items-center">
                        <img src="${dadosMembro.foto}" class="w-40 h-40 rounded-full border-4 border-gray-100 shadow-md object-cover">
                        <h2 class="text-2xl font-black mt-4 uppercase text-gray-800 text-center leading-none">${dadosMembro.nome}</h2>
                        <div class="mt-1 text-red-600 font-black text-[10px] tracking-[0.3em]">MEMBRO AD DIADEMA</div>
                        
                        <div class="w-full mt-6 space-y-1 text-xs text-gray-500 font-bold border-y py-4 border-gray-100">
                            <div class="flex justify-between"><span>CPF</span><span>${dadosMembro.cpf}</span></div>
                            <div class="flex justify-between"><span>FONE</span><span>${dadosMembro.fone}</span></div>
                        </div>

                        <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEMBRO:${dadosMembro.cpf}" class="w-32 h-32 mx-auto">
                            <p class="text-[9px] text-gray-400 mt-2 text-center">QR CODE DE IDENTIFICAÇÃO</p>
                        </div>
                        
                        <button id="sair" class="mt-8 text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-tighter">Encerrar Sessão</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }
}

async function realizarLogin() {
    const cpf = document.getElementById('loginCpf').value;
    const pin = document.getElementById('loginPin').value;
    if(cpf.length < 11 || !pin) return alert("CPF (11 números) e PIN são obrigatórios.");

    const q = query(collection(db, "membros"), where("cpf", "==", cpf), where("pin", "==", pin));
    const qs = await getDocs(q);
    if (!qs.empty) {
        dadosMembro = qs.docs[0].data();
        telaAtual = 'areaMembro'; 
        render();
    } else { alert("Acesso Negado: CPF ou PIN inválidos."); }
}

function iniciarCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { video.srcObject = s; }).catch(() => alert("Câmera desligada."));
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
    const nome = document.getElementById('cadNome').value;
    const cpf = document.getElementById('cadCpf').value;
    const fone = document.getElementById('cadFone').value;
    const pin = document.getElementById('cadPin').value;
    const lgpd = document.getElementById('lgpd').checked;
    if(!nome || cpf.length < 11 || fone.length < 11 || pin.length < 4 || !fotoBase64 || !lgpd) return alert("Verifique todos os campos!");
    try {
        await addDoc(collection(db, "membros"), {
            nome: nome.toUpperCase(), cpf, fone, pin, foto: fotoBase64, data: new Date().toLocaleString()
        });
        alert("Cadastrado com Sucesso!");
        telaAtual = 'login'; render();
    } catch (e) { alert("Erro ao salvar."); }
}

render();
