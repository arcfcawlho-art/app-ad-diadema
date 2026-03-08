import { Database } from "./services/database.js";

let state = { view: 'login', user: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastroCompleto();
    else app.innerHTML = renderHome();
}

// TELA DE LOGIN - Com biometria menor e elegante
function renderLogin() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6">
        <img src="logo.jpeg" class="w-24 mb-4 rounded-xl shadow-md">
        <h1 class="text-lg font-black text-[#8b3230] text-center mb-10 uppercase tracking-tighter italic leading-tight">
            ASSEMBLÉIA DE DEUS<br>DE DIADEMA
        </h1>

        <div class="w-full max-w-xs space-y-6 text-center">
            <button onclick="window.autenticarDigital()" class="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm active:scale-95 transition">
                <span class="material-icons text-3xl text-[#8b3230]">fingerprint</span>
            </button>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Entrar com biometria</p>

            <div class="pt-4">
                <input id="userPIN" type="password" maxlength="4" placeholder="OU PIN DE 4 DÍGITOS" 
                    class="w-full p-4 bg-gray-50 rounded-2xl text-center text-lg font-bold border-none outline-none focus:ring-1 focus:ring-[#8b3230]">
                <button onclick="window.tentarLogin()" class="w-full mt-3 bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg active:scale-95 transition text-sm">ACESSAR</button>
            </div>

            <button onclick="window.irParaCadastro()" class="text-[#8b3230] text-[11px] font-black uppercase tracking-tighter hover:underline block w-full mt-4">
                Solicitar Novo Cadastro
            </button>
        </div>
    </div>`;
}

// TELA DE CADASTRO COMPLETO - Ficha Ministerial
function renderCadastroCompleto() {
    return `
    <div class="min-h-screen w-screen p-4 bg-gray-100 flex flex-col items-center overflow-y-auto">
        <div class="bg-white w-full max-w-lg p-8 rounded-[32px] shadow-2xl border-t-8 border-[#8b3230] my-4">
            <h2 class="text-[#8b3230] font-black mb-1 uppercase text-center text-xl italic">Ficha de Membro</h2>
            <p class="text-center text-gray-400 text-[10px] mb-8 font-bold uppercase tracking-[0.2em]">Cadastro Geral de Membros</p>
            
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-3">
                    <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold uppercase">
                    <div class="grid grid-cols-2 gap-3">
                        <input id="regNasc" type="date" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold text-gray-500">
                        <input id="regZap" type="tel" placeholder="WHATSAPP" class="p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                    </div>
                    <input id="regCPF" type="text" placeholder="CPF" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                    <input id="regCong" type="text" placeholder="CONGREGAÇÃO / SETOR" class="w-full p-4 rounded-xl bg-gray-50 border-none text-xs font-bold">
                </div>

                <div class="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p class="text-center text-[9px] font-black text-red-800 mb-2 uppercase tracking-tight">Crie seu PIN de 4 números para acesso</p>
                    <input id="regPIN" type="password" maxlength="4" placeholder="0 0 0 0" class="w-full p-3 rounded-xl bg-white border-none text-center text-2xl tracking-[0.5em] font-black">
                </div>

                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <input type="checkbox" id="regLGPD" class="w-5 h-5 accent-[#8b3230] mt-1">
                    <label for="regLGPD" class="text-[10px] text-gray-500 leading-tight font-medium">
                        Autorizo a <b>AD DIADEMA</b> a utilizar meus dados conforme a <b>LGPD</b> para fins de cadastro ministerial e comunicações da igreja.
                    </label>
                </div>
            </div>
            
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-xl mt-8 active:scale-95 transition text-sm uppercase">ENVIAR FICHA</button>
            <button onclick="window.voltarLogin()" class="w-full mt-4 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Cancelar e Voltar</button>
        </div>
    </div>`;
}

function renderHome() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <span class="material-icons text-4xl text-green-600">verified</span>
        </div>
        <h2 class="text-xl font-black text-[#8b3230] uppercase italic">Paz do Senhor</h2>
        <p class="text-gray-500 mt-1 font-bold text-xs uppercase">${state.user?.nome || 'Membro'}</p>
        
        <div class="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            <div class="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center gap-2">
                <span class="material-icons text-[#8b3230]">person</span>
                <span class="text-[9px] font-black uppercase tracking-tighter">Minha Ficha</span>
            </div>
            <div class="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center gap-2">
                <span class="material-icons text-[#8b3230]">event</span>
                <span class="text-[9px] font-black uppercase tracking-tighter">Escala</span>
            </div>
        </div>
        
        <button onclick="location.reload()" class="mt-12 text-gray-300 font-bold text-[10px] uppercase tracking-[0.2em]">Sair do App</button>
    </div>`;
}

// FUNÇÕES DE NAVEGAÇÃO E LÓGICA
window.irParaCadastro = () => { state.view = 'cadastro'; render(); };
window.voltarLogin = () => { state.view = 'login'; render(); };

window.autenticarDigital = () => {
    alert("Iniciando leitura de biometria...");
    setTimeout(() => {
        state.user = { nome: "Acesso Biométrico" };
        state.view = 'home';
        render();
    }, 800);
};

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "0000") {
        state.user = { nome: "Administrador" };
        state.view = 'home'; // No futuro, aqui vai para a Secretaria
        render();
    } else if(pin.length === 4) {
        state.user = { nome: "Membro AD Diadema" };
        state.view = 'home';
        render();
    } else alert("O PIN deve ter 4 números.");
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    const lgpd = document.getElementById('regLGPD').checked;

    if(!nome || !pin || !lgpd) return alert("Por favor, preencha o Nome, o PIN e aceite os termos da LGPD.");
    
    const dados = {
        nome,
        nascimento: document.getElementById('regNasc').value,
        whatsapp: document.getElementById('regZap').value,
        cpf: document.getElementById('regCPF').value,
        congregacao: document.getElementById('regCong').value,
        pin,
        dataCadastro: new Date().toLocaleString()
    };

    try {
        await Database.salvar(`membros/${Date.now()}`, dados);
        alert("Ficha enviada com sucesso para a Secretaria!");
        state.view = 'login';
        render();
    } catch(e) {
        alert("Erro ao enviar. Verifique a conexão.");
    }
};

render();
