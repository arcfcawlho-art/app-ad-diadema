import { Database } from "./services/database.js";

let state = { view: 'login', user: null, fotoBase64: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Roteamento simples
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastro();
    else if (state.view === 'home') app.innerHTML = renderHome();
}

function renderLogin() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6">
        <img src="logo.jpeg" class="w-24 mb-4 rounded-xl">
        <h1 class="text-lg font-black text-[#8b3230] mb-10 uppercase italic">AD DIADEMA</h1>
        <div class="w-full max-w-xs space-y-6">
            <button onclick="window.forcarEntrada()" class="mx-auto block w-16 h-16 bg-gray-50 rounded-2xl border shadow-sm active:scale-90">
                <span class="material-icons text-3xl text-[#8b3230]">fingerprint</span>
            </button>
            <input id="userPIN" type="tel" maxlength="4" placeholder="PIN 4 DÍGITOS" class="w-full p-4 bg-gray-50 rounded-2xl text-center font-black outline-none border focus:border-[#8b3230]">
            <button onclick="window.tentarLogin()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg">ENTRAR</button>
            <button onclick="window.mudarView('cadastro')" class="w-full text-[#8b3230] text-[10px] font-black uppercase">Novo Cadastro</button>
        </div>
    </div>`;
}

function renderCadastro() {
    return `
    <div class="min-h-screen w-screen p-4 bg-gray-100 flex flex-col items-center overflow-y-auto">
        <div class="bg-white w-full max-w-md p-8 rounded-[32px] shadow-2xl border-t-8 border-[#8b3230] my-4">
            <h2 class="text-[#8b3230] font-black mb-6 uppercase text-center italic">Ficha de Membro</h2>
            <div class="space-y-4">
                <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                <div class="grid grid-cols-2 gap-3">
                    <input id="regZap" type="tel" maxlength="15" oninput="window.mZap(this)" placeholder="ZAP (11 nrs)" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                    <input id="regCPF" type="tel" maxlength="14" oninput="window.mCPF(this)" placeholder="CPF (11 nrs)" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                </div>
                <input id="regPIN" type="tel" maxlength="4" placeholder="CRIE SEU PIN (4 DÍGITOS)" class="w-full p-4 bg-red-50 rounded-xl text-center font-black">
            </div>
            <button onclick="window.finalizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-xl mt-8 uppercase italic">Finalizar e Entrar</button>
            <button onclick="window.mudarView('login')" class="w-full mt-4 text-gray-400 text-[10px] font-black uppercase">Voltar</button>
        </div>
    </div>`;
}

function renderHome() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <span class="material-icons text-6xl text-green-500 mb-4">verified</span>
        <h2 class="text-xl font-black text-[#8b3230] uppercase italic">Acesso Liberado</h2>
        <p class="text-gray-500 mt-2 font-bold uppercase">Bem-vindo à Secretaria Virtual</p>
        <button onclick="location.reload()" class="mt-12 text-gray-400 font-bold text-[10px] uppercase underline italic">Sair do Sistema</button>
    </div>`;
}

// LÓGICA DE NAVEGAÇÃO
window.mudarView = (v) => { state.view = v; render(); };

window.forcarEntrada = () => { state.view = 'home'; render(); };

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if (pin.length === 4) {
        state.view = 'home';
        render();
    } else {
        alert("Digite os 4 números do PIN.");
    }
};

window.finalizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    
    if (!nome || pin.length < 4) return alert("Preencha o Nome e o PIN.");

    // Tenta salvar, mas NÃO TRAVA se der erro
    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, pin });
    } catch (e) {
        console.log("Erro de banco ignorado para teste.");
    }
    
    state.view = 'home';
    render();
};

// MÁSCARAS
window.mZap = (i) => {
    let v = i.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    i.value = v;
};

window.mCPF = (i) => {
    let v = i.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    i.value = v;
};

// Inicializa
render();
