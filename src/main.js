import { Database } from "./services/database.js";

let state = { user: null, view: 'login' };

function render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (state.view === 'login') {
        app.innerHTML = renderLogin();
    } else if (state.view === 'cadastro') {
        app.innerHTML = renderCadastro();
    } else {
        const isMobile = window.innerWidth < 768;
        app.innerHTML = isMobile ? renderMobile() : renderDesktop();
    }
}

function renderLogin() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-[#8b3230] p-6">
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center border-t-8 border-[#8b3230]">
            <img src="logo.jpeg" alt="Logo" class="w-24 mx-auto mb-4 rounded-xl">
            <h2 class="text-lg font-bold text-gray-800 mb-6 uppercase leading-tight">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            <div class="space-y-4">
                <input id="userPIN" type="password" maxlength="4" placeholder="PIN de 4 dígitos" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-center text-2xl tracking-widest">
                <button onclick="window.entrar()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg active:scale-95 transition">ENTRAR</button>
                <button onclick="window.mudarView('cadastro')" class="mt-4 text-[#8b3230] text-sm font-bold hover:underline block w-full">Não tem conta? Cadastre-se aqui</button>
            </div>
        </div>
    </div>`;
}

function renderCadastro() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-gray-100 p-4 overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border-t-8 border-[#8b3230] my-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Ficha de Membro</h2>
            <p class="text-center text-gray-500 mb-6 text-xs uppercase font-bold">Assembleia de Deus de Diadema</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="text-[10px] font-bold text-gray-400 ml-2">FOTO DE PERFIL</label>
                    <input type="file" id="regFoto" accept="image/*" class="w-full p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                </div>
                <input id="regNome" type="text" placeholder="Nome Completo" class="md:col-span-2 w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regNascimento" type="date" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regWhatsapp" type="tel" placeholder="WhatsApp (00) 00000-0000" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regCPF" type="text" placeholder="CPF" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regCong" type="text" placeholder="Congregação / Setor" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <div class="md:col-span-2 bg-red-50 p-4 rounded-2xl">
                    <label class="block text-center text-xs font-bold text-red-800 mb-2 uppercase">Crie seu PIN de 4 números</label>
                    <input id="regPIN" type="password" maxlength="4" placeholder="0 0 0 0" class="w-full p-4 bg-white rounded-xl outline-none text-center text-2xl tracking-[0.5em]">
                </div>
                <div class="md:col-span-2 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <input type="checkbox" id="regLGPD" class="w-5 h-5 accent-[#8b3230] mt-1">
                    <label for="regLGPD" class="text-[11px] text-gray-600 leading-tight">
                        Autorizo a <b>ASSEMBLÉIA DE DEUS DE DIADEMA</b> a utilizar meus dados para fins de cadastro e comunicação ministerial, conforme a <b>LGPD</b>.
                    </label>
                </div>
            </div>
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-lg mt-8 active:scale-95 transition">FINALIZAR CADASTRO</button>
            <button onclick="window.mudarView('login')" class="w-full text-gray-400 text-sm font-bold mt-4">Voltar ao Início</button>
        </div>
    </div>`;
}

window.mudarView = (v) => { state.view = v; render(); };

window.entrar = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "1234") { 
        state.user = { nome: "Usuário Teste" }; 
        state.view = 'dashboard';
        render(); 
    } else { alert("PIN Incorreto!"); }
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    const lgpd = document.getElementById('regLGPD').checked;

    if (!nome || !pin || !lgpd) return alert("Preencha o nome, PIN e aceite a LGPD!");

    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, pin, status: 'Pendente' });
        alert("Cadastro enviado com sucesso! Aguarde a aprovação.");
        window.mudarView('login');
    } catch (e) {
        alert("Erro no banco de dados. Verifique a internet.");
    }
};

function renderMobile() { 
    return `<div class="p-10 text-center"><img src="logo.jpeg" class="w-20 mx-auto mb-4"><h1 class="text-xl font-bold">ASSEMBLÉIA DE DEUS DE DIADEMA</h1><p class="mt-4 text-gray-500 italic">Bem-vindo ao painel mobile!</p><button onclick="location.reload()" class="mt-10 text-red-800 font-bold uppercase text-xs">Sair do App</button></div>`; 
}

function renderDesktop() { 
    return `<div class="p-10 text-center"><h1 class="text-3xl font-bold uppercase">ASSEMBLÉIA DE DEUS DE DIADEMA</h1><p class="mt-4">Secretaria Virtual</p><button onclick="location.reload()" class="mt-10 text-red-800 font-bold uppercase text-xs">Sair</button></div>`; 
}

window.addEventListener('resize', render);
render();
