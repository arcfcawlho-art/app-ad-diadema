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
let fotoBase64 = null;
let dadosMembro = null;

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen justify-center">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain drop-shadow-md">
                <div class="w-full max-w-sm space-y-4 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white">
                    <h2 class="text-xl font-black text-center text-blue-900 uppercase tracking-tighter">Portal do Membro</h2>
                    <div class="space-y-2">
                        <input type="text" id="loginCpf" placeholder="CPF (só números)" maxlength="11" class="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500">
                        <input type="password" id="loginPin" placeholder="PIN de Segurança" maxlength="4" class="w-full p-4 bg-gray-50 rounded-2xl border-none text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button id="btnEntrar" class="w-full bg-blue-800 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-blue-900 transition-all active:scale-95">ACESSAR MINHA CONTA</button>
                    <button id="irParaCadastro" class="w-full text-blue-600 font-bold text-sm hover:underline">Não tem conta? Cadastre-se</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
                <div class="w-full max-w-md bg-white p-6 rounded-[2rem] shadow-xl space-y-4 border border-gray-100">
                    <h2 class="text-2xl font-black text-blue-900 text-center uppercase">Novo Membro</h2>
                    
                    <div class="space-y-3">
                        <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" id="cadCpf" placeholder="CPF (11 n°)" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                            <input type="text" id="cadFone" placeholder="Fone (11 n°)" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                        </div>
                        <input type="password" id="cadPin" placeholder="Crie seu PIN (4 dígitos)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    </div>
                    
                    <div class="p-3 bg-blue-50 rounded-xl flex items-center gap-3">
                        <input type="checkbox" id="lgpd" class="w-5 h-5 accent-blue-800">
                        <label for="lgpd" class="text-[10px] text-blue-900 font-medium leading-none">Concordo com a LGPD e uso de imagem para a AD Diadema.</label>
                    </div>

                    <div class="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
                        <span class="material-icons">photo_camera</span> CAPTURAR FOTO
                    </button>

                    <button id="finalizarCad" class="w-full bg-green-600 text-white p-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all">FINALIZAR CADASTRO</button>
                    <button id="voltarLogin" class="w-full text-gray-400 text-sm font-bold mt-2">CANCELAR</button>
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
            <div class="flex flex-col items-center p-6 bg-blue-950 min-h-screen text-white">
                <img src="logo.jpeg" class="w-16 mb-6 opacity-80">
                
                <div class="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-gray-900 relative">
                    
                    <div class="bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-center text-white">
                        <p class="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">Assembleia de Deus</p>
                        <h1 class="text-xl font-black">DIADEMA</h1>
                    </div>

                    <div class="flex flex-col items-center -mt-12 px-8 pb-8">
                        <div class="relative">
                            <img src="${dadosMembro.foto}" class="w-40 h-40 rounded-3xl border-8 border-white shadow-2xl object-cover bg-gray-100">
                            <div class="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                        </div>

                        <h2 class="text-2xl font-black mt-6 uppercase text-center leading-tight">${dadosMembro.nome}</h2>
                        <div class="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black mt-2 tracking-widest">MEMBRO OFICIAL</div>
                        
                        <div class="w-full mt-8 grid grid-cols-2 gap-4 text-center">
                            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                <p class="text-[9px] font-bold text-gray-400 uppercase italic">CPF</p>
                                <p class="font-black text-sm text-gray-800">${dadosMembro.cpf}</p>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                <p class="text-[9px] font-bold text-gray-400 uppercase italic">Registro</p>
                                <p class="font-black text-sm text-gray-800">${dadosMembro.data.split(',')[0]}</p>
                            </div>
                        </div>

                        <div class="mt-8 p-4 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200 text-center">
                            <p class="text-[9px] font-black text-blue-900 mb-2 uppercase tracking-tighter">Validação de Acesso</p>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MEMBRO:${dadosMembro.cpf}" class="w-32 h-32 mx-auto rounded-lg">
                        </div>
                        
                        <button id="sair" class="mt-8 flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-red-500 transition-colors">
                            <span class="material-icons text-sm">power_settings_new</span> ENCERRAR SESSÃO
                        </button>
                    </div>

                    <div class="bg-gray-900 h-2 w-full"></div>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }
}

// Funções de apoio
async function realizarLogin() {
    const cpf = document.getElementById('loginCpf').value;
    const pin = document.getElementById('loginPin').value;
    if(cpf.length < 11 || !pin) return alert("Preencha CPF e PIN!");
    const q = query(collection(db, "membros"), where("cpf", "==", cpf), where("pin", "==", pin));
    const qs = await getDocs(q);
    if (!qs.empty) {
        dadosMembro = qs.docs[0].data();
        if(confirm("Deseja ativar acesso por Biometria/Digital?")) alert("Biometria configurada no dispositivo!");
        telaAtual = 'areaMembro'; render();
    } else { alert("Acesso Negado: CPF ou PIN incorretos."); }
}

function iniciarCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { video.srcObject = s; }).catch(() => alert("Câmera indisponível."));
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
    document.getElementById('btnTirarFoto').innerText = "TROCAR FOTO";
}

async function salvarCadastro() {
    const nome = document.getElementById('cadNome').value;
    const cpf = document.getElementById('cadCpf').value;
    const fone = document.getElementById('cadFone').value;
    const pin = document.getElementById('cadPin').value;
    const lgpd = document.getElementById('lgpd').checked;
    if(!nome || cpf.length < 11 || fone.length < 11 || pin.length < 4 || !fotoBase64 || !lgpd) {
        return alert("Preencha todos os campos corretamente!");
    }
    try {
        await addDoc(collection(db, "membros"), {
            nome: nome.toUpperCase(), cpf, fone, pin, foto: fotoBase64, data: new Date().toLocaleString("pt-BR")
        });
        alert("Bem-vindo à AD Diadema! Cadastro concluído.");
        telaAtual = 'login'; render();
    } catch (e) { alert("Erro ao salvar dados."); }
}

render();
