import { Database } from "./services/database.js";

let state = { view: 'login', user: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastro();
    else app.innerHTML = renderHome();
}

// TELA DE LOGIN - Biometria menor e mais discreta
function renderLogin() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6">
        <img src="logo.jpeg" class="w-24 mb-4 rounded-xl shadow-md">
        <h1 class="text-lg font-black text-[#8b3230] text-center mb-10 uppercase tracking-tighter italic">
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
                <button onclick="window.tentarLogin()" class="w-full mt-3 bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-md active:scale-95 transition">ACESSAR</button>
            </div>

            <button onclick="window.irParaCadastro()" class="text-[#8b3230] text-[11px] font-black uppercase tracking-tighter hover:underline block w-full mt-4">
                Solicitar Novo Cadastro
            </button>
        </div>
    </div>`;
}

// TELA DE CADASTRO - Corrigida para abrir sempre
function renderCadastro() {
    return `
    <div class="h-screen w-screen p-6 bg-gray-100 flex flex-col items-center justify-center">
        <div class="bg-white w-full max-w-sm p-8 rounded-[32px] shadow-2xl border-t-4 border-[#8b3230]">
            <h2 class="text-[#8b3230] font-black mb-2 uppercase text-center text-lg">Nova Ficha</h2>
            <p class="text-center text-gray-400 text-[10px] mb-6 font-bold uppercase">Preencha seus dados oficiais</p>
            
            <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 mb-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-[#8b3230]">
            <input id="regPIN" type="password" maxlength="4" placeholder="CRIE UM PIN" class="w-full p-4 mb-6 rounded-xl bg-gray-50 border-none text-center font-bold">
            
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-4 rounded-xl font-bold shadow-lg mb-4">SALVAR NO SISTEMA</button>
            <button onclick="window.voltarLogin()" class="w-full text-gray-400 text-[10px] font-black uppercase tracking-widest">Cancelar</button>
        </div>
    </div>`;
}

function renderHome() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span class="material-icons text-4xl text-green-600">verified</span>
        </div>
        <h2 class="text-xl font-black text-[#8b3230] uppercase italic">Paz do Senhor</h2>
        <p class="text-gray-500 mt-1 font-medium">${state.user?.nome || 'Membro'}</p>
        <div class="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            <div class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-tighter">Minha Ficha</div>
            <div class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-tighter">Escala</div>
        </div>
        <button onclick="location.reload()" class="mt-12 text-gray-300 font-bold text-[10px] uppercase tracking-[0.2em]">Sair do App</button>
    </div>`;
}

// FUNÇÕES DE NAVEGAÇÃO
window.irParaCadastro = () => { state.view = 'cadastro'; render(); };
window.voltarLogin = () => { state.view = 'login'; render(); };

window.autenticarDigital = () => {
    alert("Lendo biometria...");
    setTimeout(() => {
        state.user = { nome: "Acesso por Digital" };
        state.view = 'home';
        render();
    }, 800);
};

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin.length === 4) {
        state.user = { nome: "Membro AD Diadema" };
        state.view = 'home';
        render();
    } else alert("O PIN deve ter 4 números.");
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    if(!nome || !pin) return alert("Por favor, preencha todos os campos!");
    
    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, pin, data: new Date().toLocaleDateString() });
        alert("Cadastro realizado com sucesso!");
        state.view = 'login';
        render();
    } catch(e) {
        alert("Erro ao salvar. Verifique sua conexão.");
    }
};

render();
