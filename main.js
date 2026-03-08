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
    
    // TELA DE LOGIN
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen bg-gray-100">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain">
                <div class="w-full max-w-sm space-y-4 bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-red-600">
                    <h2 class="text-xl font-black text-center text-gray-800 uppercase">Acesso ao Portal</h2>
                    <input type="text" id="loginCpf" placeholder="Seu CPF (só números)" maxlength="11" class="w-full p-4 bg-gray-100 rounded-2xl border-none">
                    <input type="password" id="loginPin" placeholder="PIN" maxlength="4" class="w-full p-4 bg-gray-100 rounded-2xl border-none text-center text-2xl tracking-widest">
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg">ENTRAR AGORA</button>
                    <button id="irParaCadastro" class="w-full text-gray-400 font-bold text-xs uppercase pt-2">Criar conta de Membro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    // TELA DE CADASTRO (FICA IGUAL)
    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 min-h-screen bg-gray-100">
                <div class="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl space-y-4">
                    <h2 class="text-2xl font-black text-red-600 text-center uppercase">Novo Cadastro</h2>
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="text" id="cadCpf" placeholder="CPF (11 números)" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="text" id="cadFone" placeholder="DDD + Celular" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="password" id="cadPin" placeholder="PIN (4 números)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    
                    <div class="relative w-full aspect-square bg-black rounded-2xl overflow-hidden shadow-inner border-4 border-white">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl font-bold uppercase text-xs">Capturar Foto</button>
                    <button id="finalizarCad" class="w-full bg-red-600 text-white p-4 rounded-2xl font-black shadow-lg uppercase">Cadastrar</button>
                    <button id="voltarLogin" class="w-full text-gray-400 text-xs font-bold">CANCELAR</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('voltarLogin').onclick = () => { telaAtual = 'login'; render(); };
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }

    // TELA DE DENTRO (A PÁGINA PÓS-LOGIN)
    else if (telaAtual === 'areaMembro') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100 pb-24">
                <div class="bg-red-600 p-6 rounded-b-[3rem] shadow-xl flex items-center justify-between text-white">
                    <div>
                        <p class="text-xs font-bold opacity-80 uppercase tracking-widest text-white">Bem-vindo,</p>
                        <h2 class="text-xl font-black uppercase text-white">${dadosMembro.nome.split(' ')[0]}</h2>
                    </div>
                    <img src="logo.jpeg" class="w-12 h-12 rounded-full border-2 border-white">
                </div>

                <div class="p-6 space-y-6">
                    <div class="bg-white p-6 rounded-[2rem] shadow-lg flex items-center gap-4 border-l-8 border-red-600">
                        <img src="${dadosMembro.foto}" class="w-20 h-20 rounded-2xl object-cover shadow-md">
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Membro Ativo</p>
                            <h3 class="font-black text-gray-800 text-lg uppercase leading-tight">${dadosMembro.nome}</h3>
                            <p class="text-xs text-red-600 font-bold">AD DIADEMA</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white p-6 rounded-3xl shadow-md text-center">
                            <span class="material-icons text-red-600 text-3xl">qr_code_2</span>
                            <p class="text-xs font-black mt-2 uppercase text-gray-700">Minha Ficha</p>
                        </div>
                        <div class="bg-white p-6 rounded-3xl shadow-md text-center">
                            <span class="material-icons text-red-600 text-3xl">event</span>
                            <p class="text-xs font-black mt-2 uppercase text-gray-700">Agenda</p>
                        </div>
                        <div class="bg-white p-6 rounded-3xl shadow-md text-center">
                            <span class="material-icons text-red-600 text-3xl">payments</span>
                            <p class="text-xs font-black mt-2 uppercase text-gray-700">Dízimos</p>
                        </div>
                        <div class="bg-white p-6 rounded-3xl shadow-md text-center">
                            <span class="material-icons text-red-600 text-3xl">groups</span>
                            <p class="text-xs font-black mt-2 uppercase text-gray-700">Cultos</p>
                        </div>
                    </div>
                </div>

                <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-around shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <button class="text-red-600 flex flex-col items-center"><span class="material-icons">home</span><span class="text-[10px] font-bold">Início</span></button>
                    <button class="text-gray-400 flex flex-col items-center"><span class="material-icons">notifications</span><span class="text-[10px] font-bold">Avisos</span></button>
                    <button id="sair" class="text-gray-400 flex flex-col items-center"><span class="material-icons">logout</span><span class="text-[10px] font-bold">Sair</span></button>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }
}

async function realizarLogin() {
    const cpf = document.getElementById('loginCpf').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    
    if(cpf.length < 11 || !pin) return alert("Digite CPF e PIN!");

    try {
        const q = query(collection(db, "membros"), where("cpf", "==", cpf), where("pin", "==", pin));
        const qs = await getDocs(q);

        if (!qs.empty) {
            dadosMembro = qs.docs[0].data();
            telaAtual = 'areaMembro'; 
            render();
        } else {
            alert("⚠️ Dados não encontrados! Verifique o CPF e o PIN.");
        }
    } catch (e) {
        alert("Erro de conexão. Tente novamente.");
    }
}

// Funções de câmera e salvamento (mantidas)
function iniciarCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { video.srcObject = s; }).catch(() => console.log("Sem câmera"));
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
    if(!nome || cpf.length < 11 || !fotoBase64) return alert("Preencha tudo e tire a foto!");
    
    try {
        await addDoc(collection(db, "membros"), {
            nome, cpf, fone, pin, foto: fotoBase64, data: new Date().toLocaleString()
        });
        alert("✅ Cadastro Realizado!");
        telaAtual = 'login'; render();
    } catch (e) { alert("Erro ao salvar."); }
}

render();
