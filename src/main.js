import { Database } from "./services/database.js";

let state = { view: 'login', user: null, fotoBase64: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastroCompleto();
    else app.innerHTML = renderHome();
}

// --- TELA DE LOGIN ---
function renderLogin() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6">
        <img src="logo.jpeg" class="w-24 mb-4 rounded-xl shadow-md">
        <h1 class="text-lg font-black text-[#8b3230] text-center mb-10 uppercase italic">AD DIADEMA</h1>
        <div class="w-full max-w-xs space-y-6 text-center">
            <button onclick="window.autenticarDigital()" class="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border shadow-sm active:scale-95 transition">
                <span class="material-icons text-3xl text-[#8b3230]">fingerprint</span>
            </button>
            <div class="pt-4">
                <input id="userPIN" type="tel" maxlength="4" placeholder="PIN DE 4 DÍGITOS" class="w-full p-4 bg-gray-50 rounded-2xl text-center font-bold outline-none focus:ring-1 focus:ring-[#8b3230]">
                <button onclick="window.tentarLogin()" class="w-full mt-3 bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg">ACESSAR</button>
            </div>
            <button onclick="window.irParaCadastro()" class="text-[#8b3230] text-[11px] font-black uppercase hover:underline">Novo Cadastro</button>
        </div>
    </div>`;
}

// --- TELA DE CADASTRO COMPLETO ---
function renderCadastroCompleto() {
    return `
    <div class="min-h-screen w-screen p-4 bg-gray-100 flex flex-col items-center overflow-y-auto pb-10">
        <div class="bg-white w-full max-w-lg p-8 rounded-[32px] shadow-2xl border-t-8 border-[#8b3230] my-4">
            <h2 class="text-[#8b3230] font-black mb-1 uppercase text-center italic">Ficha de Membro</h2>
            
            <div class="flex flex-col items-center my-6">
                <div id="photoPreview" class="w-32 h-32 bg-gray-200 rounded-2xl overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
                    <span class="material-icons text-gray-400 text-4xl">person</span>
                </div>
                <button onclick="window.abrirCamera()" class="mt-3 bg-gray-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                    <span class="material-icons text-sm">photo_camera</span> Abrir Câmera
                </button>
                <video id="videoFeed" autoplay playsinline class="hidden w-32 h-32 rounded-2xl mt-2 object-cover border-2 border-[#8b3230]"></video>
                <button id="btnCapture" onclick="window.capturarFoto()" class="hidden mt-2 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic">Bater Foto Agora</button>
            </div>

            <div class="space-y-4">
                <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="grid grid-cols-2 gap-3">
                    <input id="regNasc" type="date" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold text-gray-500">
                    <input id="regZap" type="tel" maxlength="15" oninput="window.mascaraFone(this)" placeholder="WHATSAPP (11 nrs)" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                </div>
                <input id="regCPF" type="tel" maxlength="14" oninput="window.mascaraCPF(this)" placeholder="CPF (11 números)" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                <input id="regCong" type="text" placeholder="CONGREGAÇÃO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                    <p class="text-[9px] font-black text-red-800 mb-2 uppercase">Crie seu PIN de 4 dígitos</p>
                    <input id="regPIN" type="tel" maxlength="4" placeholder="0 0 0 0" class="w-full p-3 rounded-xl border-none text-center text-2xl font-black">
                </div>
                <div class="flex items-start gap-2 text-[10px] text-gray-500 font-medium p-2">
                    <input type="checkbox" id="regLGPD" class="w-4 h-4 accent-[#8b3230]"> Aceito os termos da LGPD (Lei Geral de Proteção de Dados)
                </div>
            </div>
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-xl mt-8 italic uppercase text-sm">ENVIAR FICHA OFICIAL</button>
            <button onclick="window.voltarLogin()" class="w-full mt-4 text-gray-400 text-[10px] font-black uppercase text-center tracking-widest">Cancelar</button>
        </div>
        <canvas id="canvas" class="hidden"></canvas>
    </div>`;
}

// --- MÁSCARAS RÍGIDAS (BLOQUEIA EXCESSO) ---
window.mascaraFone = (i) => {
    let v = i.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (v.length > 11) v = v.substring(0, 11); // Trava em 11 números
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    i.value = v;
};

window.mascaraCPF = (i) => {
    let v = i.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (v.length > 11) v = v.substring(0, 11); // Trava em 11 números
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    i.value = v;
};

// --- LOGICA DA CÂMERA ---
window.abrirCamera = async () => {
    const video = document.getElementById('videoFeed');
    const preview = document.getElementById('photoPreview');
    const btnCap = document.getElementById('btnCapture');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        video.srcObject = stream;
        video.classList.remove('hidden');
        preview.classList.add('hidden');
        btnCap.classList.remove('hidden');
    } catch (err) { alert("Permita o acesso à câmera nas configurações."); }
};

window.capturarFoto = () => {
    const video = document.getElementById('videoFeed');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('photoPreview');
    const btnCap = document.getElementById('btnCapture');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    state.fotoBase64 = canvas.toDataURL('image/jpeg', 0.6);
    preview.innerHTML = `<img src="${state.fotoBase64}" class="w-full h-full object-cover">`;
    preview.classList.remove('hidden'); video.classList.add('hidden'); btnCap.classList.add('hidden');
    video.srcObject.getTracks().forEach(track => track.stop());
};

// --- NAVEGAÇÃO E SALVAMENTO ---
window.irParaCadastro = () => { state.view = 'cadastro'; render(); };
window.voltarLogin = () => { state.view = 'login'; render(); };

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin.length === 4) {
        state.user = { nome: "Membro AD Diadema" };
        state.view = 'home';
        render();
    } else { alert("Digite o PIN de 4 números."); }
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const cpf = document.getElementById('regCPF').value;
    const zap = document.getElementById('regZap').value;
    const pin = document.getElementById('regPIN').value;
    const lgpd = document.getElementById('regLGPD').checked;

    if(!nome || pin.length < 4 || !lgpd) return alert("Preencha Nome, PIN de 4 dígitos e aceite a LGPD.");
    if(cpf.length < 14) return alert("CPF incompleto! Digite os 11 números.");
    if(zap.length < 14) return alert("WhatsApp incompleto! Digite o DDD + número.");

    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, cpf, zap, pin, foto: state.fotoBase64 });
        alert("Ficha enviada com sucesso!");
        state.view = 'login'; render();
    } catch(e) { alert("Cadastro simulado (Modo Desenvolvedor)."); state.view = 'login'; render(); }
};

function renderHome() {
    return `<div class="h-screen w-screen flex flex-col items-center justify-center p-10 bg-gray-50">
        <h2 class="text-xl font-black text-[#8b3230] uppercase italic">Paz do Senhor, ${state.user.nome}</h2>
        <button onclick="location.reload()" class="mt-10 bg-gray-200 px-6 py-2 rounded-xl font-bold text-[10px]">SAIR</button>
    </div>`;
}

render();
