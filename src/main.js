import { Database } from "./services/database.js";

let state = { view: 'login', user: null, fotoBase64: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastro();
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
                <button onclick="window.tentarLogin()" class="w-full mt-3 bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg">ENTRAR NO APP</button>
            </div>
            <button onclick="window.irPara('cadastro')" class="text-[#8b3230] text-[11px] font-black uppercase hover:underline">Novo Cadastro</button>
        </div>
    </div>`;
}

// --- TELA DE CADASTRO ---
function renderCadastro() {
    return `
    <div class="min-h-screen w-screen p-4 bg-gray-100 flex flex-col items-center overflow-y-auto pb-10">
        <div class="bg-white w-full max-w-lg p-8 rounded-[32px] shadow-2xl border-t-8 border-[#8b3230] my-4">
            <h2 class="text-[#8b3230] font-black mb-1 uppercase text-center italic">Ficha de Membro</h2>
            
            <div class="flex flex-col items-center my-6">
                <div id="photoPreview" class="w-32 h-32 bg-gray-200 rounded-2xl overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
                    <span class="material-icons text-gray-400 text-4xl">person</span>
                </div>
                <button onclick="window.abrirCamera()" class="mt-3 bg-gray-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                    <span class="material-icons text-sm">photo_camera</span> Tirar Foto
                </button>
                <video id="videoFeed" autoplay playsinline class="hidden w-32 h-32 rounded-2xl mt-2 object-cover border-2 border-[#8b3230]"></video>
                <button id="btnCapture" onclick="window.capturarFoto()" class="hidden mt-2 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Capturar AGORA</button>
            </div>

            <div class="space-y-4">
                <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="grid grid-cols-2 gap-3">
                    <input id="regNasc" type="date" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold text-gray-500">
                    <input id="regZap" type="tel" maxlength="15" oninput="window.validaZap(this)" placeholder="WHATSAPP (11 nrs)" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                </div>
                <input id="regCPF" type="tel" maxlength="14" oninput="window.validaCPF(this)" placeholder="CPF (11 números)" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                <input id="regCong" type="text" placeholder="CONGREGAÇÃO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <input id="regPIN" type="tel" maxlength="4" placeholder="CRIE SEU PIN (4 NÚMEROS)" class="w-full p-4 bg-red-50 rounded-xl border-none text-center font-black">
                <div class="flex items-start gap-2 text-[10px] p-2">
                    <input type="checkbox" id="regLGPD" checked class="w-4 h-4 accent-[#8b3230]"> Aceito a LGPD
                </div>
            </div>
            <button onclick="window.finalizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-xl mt-8">FINALIZAR E ENTRAR</button>
            <button onclick="window.irPara('login')" class="w-full mt-4 text-gray-400 text-[10px] font-black uppercase text-center">Voltar</button>
        </div>
        <canvas id="canvas" class="hidden"></canvas>
    </div>`;
}

// --- TELA HOME (DENTRO DO APP) ---
function renderHome() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <span class="material-icons text-6xl text-green-500 mb-4">check_circle</span>
        <h2 class="text-2xl font-black text-[#8b3230] uppercase italic">Acesso Liberado</h2>
        <p class="text-gray-500 mt-2 font-bold uppercase">Seja Bem-vindo ao App</p>
        <div class="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs text-[10px] font-black">
            <div class="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">MINHA FICHA</div>
            <div class="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">CULTOS</div>
        </div>
        <button onclick="location.reload()" class="mt-12 text-gray-300 font-bold text-[10px] uppercase underline">Sair e fechar</button>
    </div>`;
}

// --- FUNÇÕES DE VALIDAÇÃO RÍGIDA ---
window.validaZap = (i) => {
    let v = i.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    i.value = v;
};

window.validaCPF = (i) => {
    let v = i.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    i.value = v;
};

// --- LOGICA DE CÂMERA ---
window.abrirCamera = async () => {
    const video = document.getElementById('videoFeed');
    const preview = document.getElementById('photoPreview');
    const btnCap = document.getElementById('btnCapture');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
        video.classList.remove('hidden'); preview.classList.add('hidden'); btnCap.classList.remove('hidden');
    } catch (e) { alert("Câmera bloqueada ou indisponível."); }
};

window.capturarFoto = () => {
    const video = document.getElementById('videoFeed');
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    state.fotoBase64 = canvas.toDataURL('image/jpeg', 0.5);
    document.getElementById('photoPreview').innerHTML = `<img src="${state.fotoBase64}" class="w-full h-full object-cover">`;
    document.getElementById('photoPreview').classList.remove('hidden');
    video.classList.add('hidden'); document.getElementById('btnCapture').classList.add('hidden');
    video.srcObject.getTracks().forEach(t => t.stop());
};

// --- NAVEGAÇÃO ---
window.irPara = (v) => { state.view = v; render(); };

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if (pin.length === 4) {
        state.view = 'home';
        render();
    } else { alert("O PIN deve ter 4 números."); }
};

window.finalizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    if (!nome || pin.length < 4) return alert("Preencha Nome e o PIN de 4 dígitos.");
    
    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, pin, foto: state.fotoBase64 });
        alert("Enviado com sucesso!");
    } catch (e) {
        alert("MODO TESTE: Indo para o app mesmo sem banco.");
    }
    state.view = 'home';
    render();
};

render();
