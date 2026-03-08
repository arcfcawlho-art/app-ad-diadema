import { Database } from "./services/database.js";

let state = { view: 'login', user: null, fotoBase64: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastroCompleto();
    else app.innerHTML = renderHome();
}

// ... (renderLogin e funções de máscara permanecem as mesmas) ...

function renderCadastroCompleto() {
    return `
    <div class="min-h-screen w-screen p-4 bg-gray-100 flex flex-col items-center overflow-y-auto">
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
                <button id="btnCapture" onclick="window.capturarFoto()" class="hidden mt-2 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Bater Foto</button>
            </div>

            <div class="space-y-4">
                <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="grid grid-cols-2 gap-3">
                    <input id="regNasc" type="date" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold text-gray-500">
                    <input id="regZap" type="tel" maxlength="15" onkeyup="window.mascaraFone(this)" placeholder="WHATSAPP" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                </div>
                <input id="regCPF" type="tel" maxlength="14" onkeyup="window.mascaraCPF(this)" placeholder="CPF (11 números)" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                <input id="regCong" type="text" placeholder="CONGREGAÇÃO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                    <p class="text-[9px] font-black text-red-800 mb-2 uppercase">Crie seu PIN</p>
                    <input id="regPIN" type="password" maxlength="4" placeholder="0 0 0 0" class="w-full p-3 rounded-xl border-none text-center text-2xl font-black">
                </div>
                <div class="flex items-start gap-2 text-[10px] text-gray-500 font-medium">
                    <input type="checkbox" id="regLGPD" class="w-4 h-4 accent-[#8b3230]"> Aceito os termos da LGPD
                </div>
            </div>
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-xl mt-8">ENVIAR FICHA</button>
            <button onclick="window.voltarLogin()" class="w-full mt-4 text-gray-400 text-[10px] font-black uppercase text-center">Voltar</button>
        </div>
        <canvas id="canvas" class="hidden"></canvas>
    </div>`;
}

// --- LÓGICA DA CÂMERA ---
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
    } catch (err) {
        alert("Erro ao abrir câmera. Verifique as permissões do seu celular.");
    }
};

window.capturarFoto = () => {
    const video = document.getElementById('videoFeed');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('photoPreview');
    const btnCap = document.getElementById('btnCapture');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    state.fotoBase64 = canvas.toDataURL('image/jpeg', 0.7); // Salva a foto em formato de texto (compacto)
    
    preview.innerHTML = `<img src="${state.fotoBase64}" class="w-full h-full object-cover">`;
    preview.classList.remove('hidden');
    video.classList.add('hidden');
    btnCap.classList.add('hidden');

    // Desliga a câmera para economizar bateria
    video.srcObject.getTracks().forEach(track => track.stop());
};

// --- ALTERAÇÃO NO SALVAMENTO ---
window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    const lgpd = document.getElementById('regLGPD').checked;

    if(!nome || !pin || !lgpd) return alert("Preencha Nome, PIN e aceite a LGPD.");

    const dados = {
        nome,
        pin,
        foto: state.fotoBase64, // Envia a foto junto com o cadastro
        dataCadastro: new Date().toLocaleString()
    };

    try {
        await Database.salvar(`membros/${Date.now()}`, dados);
        alert("Sucesso! Foto e ficha enviadas.");
        state.view = 'login';
        state.fotoBase64 = null;
        render();
    } catch(e) {
        alert("Aviso: Cadastro simulado.");
        state.view = 'login';
        render();
    }
};

// ... (Mantenha as outras funções: renderLogin, renderHome, mascaras, etc) ...
// Adicione as mascaras e os renders que faltam aqui conforme as versões anteriores.
