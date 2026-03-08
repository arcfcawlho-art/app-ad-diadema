import { Database } from "./services/database.js";

let state = { user: null, view: 'login' };

function render() {
    const app = document.getElementById('app');
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
            <img src="logo.jpeg" alt="Logo" class="w-24 mx-auto mb-4">
            <h2 class="text-xl font-bold text-gray-800 mb-6 leading-tight uppercase">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            
            <div class="space-y-4">
                <input id="userPIN" type="password" maxlength="4" placeholder="PIN de 4 dígitos" 
                    class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-center text-2xl tracking-widest">
                <button onclick="window.entrar()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg active:scale-95 transition">ENTRAR</button>
                <button onclick="window.biometria()" class="flex items-center justify-center gap-3 w-full bg-gray-50 p-4 rounded-2xl font-bold text-gray-700">
                    <span class="material-icons text-[#8b3230]">fingerprint</span> Digital
                </button>
                <button onclick="state.view = 'cadastro'; render();" class="mt-4 text-[#8b3230] text-sm font-bold hover:underline">Não tem conta? Cadastre-se aqui</button>
            </div>
        </div>
    </div>`;
}

function renderCadastro() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-gray-100 p-4 overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border-t-8 border-[#8b3230] my-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Ficha de Membro</h2>
            <p class="text-center text-gray-500 mb-8 text-sm">Preencha todos os dados para o cadastro oficial.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="text-[10px] font-bold text-gray-400 uppercase ml-2">Foto de Perfil</label>
                    <input type="file" id="regFoto" accept="image/*" class="w-full p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                </div>
                
                <div class="md:col-span-2">
                    <input id="regNome" type="text" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                </div>

                <input id="regNascimento" type="date" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regWhatsapp" type="tel" placeholder="WhatsApp (00) 00000-0000" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                
                <input id="regCPF" type="text" placeholder="CPF" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                <input id="regCong" type="text" placeholder="Congregação" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">

                <div class="md:col-span-2">
                    <input id="regEndereco" type="text" placeholder="Endereço Completo (Rua, Nº, Bairro)" class="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#8b3230]">
                </div>

                <div class="md:col-span-2 bg-red-50 p-4 rounded-2xl">
                    <label class="block text-center text-xs font-bold text-red-800 mb-2">CRIE SEU PIN DE ACESSO (4 NÚMEROS)</label>
                    <input id="regPIN" type="password" maxlength="4" placeholder="0 0 0 0" class="w-full p-4 bg-white rounded-xl outline-none text-center text-2xl tracking-[1em]">
                </div>

                <div class="md:col-span-2 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl mt-2">
                    <input type="checkbox" id="regLGPD" class="mt-1 w-5 h-5 accent-[#8b3230]">
                    <label for="regLGPD" class="text-[11px] text-gray-600 leading-tight">
                        Estou ciente e concordo com o tratamento dos meus dados pessoais para fins eclesiásticos e de gestão ministerial, conforme a <b>Lei Geral de Proteção de Dados (LGPD)</b>.
                    </label>
                </div>
            </div>
            
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-5 rounded-2xl font-bold shadow-lg mt-8 active:scale-95 transition">
                FINALIZAR CADASTRO OFICIAL
            </button>
            <button onclick="state.view = 'login'; render();" class="w-full text-gray-400 text-sm font-bold mt-4">Voltar para o Início</button>
        </div>
    </div>`;
}

// LÓGICA DE CADASTRO
window.realizarCadastro = async () => {
    const dados = {
        nome: document.getElementById('regNome').value,
        nascimento: document.getElementById('regNascimento').value,
        whatsapp: document.getElementById('regWhatsapp').value,
        cpf: document.getElementById('regCPF').value,
        congregacao: document.getElementById('regCong').value,
        endereco: document.getElementById('regEndereco').value,
        pin: document.getElementById('regPIN').value,
        lgpd: document.getElementById('regLGPD').checked
    };

    if (!dados.nome || !dados.pin) return alert("Nome e PIN são obrigatórios!");
    if (!dados.lgpd) return alert("Você precisa aceitar os termos da LGPD para continuar.");
    if (dados.pin.length < 4) return alert("O PIN deve ter 4 números.");

    try {
        await Database.salvar(`membros/${Date.now()}`, dados);
        alert("Cadastro realizado com sucesso! Bem-vindo à ASSEMBLÉIA DE DEUS DE DIADEMA.");
        state.view = 'login';
        render();
    } catch (e) {
        alert("Erro ao salvar: " + e.message);
    }
};

// ... (Mantenha aqui as funções renderMobile, renderDesktop, gridBtn e entrar que já usamos)
window.entrar = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "1234") { 
        state.user = { nome: "Usuário" };
        render();
    } else { alert("PIN Incorreto!"); }
};

function renderMobile() {
    return `
    <div class="flex flex-col w-full h-full pb-24 bg-gray-50 overflow-y-auto">
        <header class="bg-[#8b3230] p-8 rounded-b-[40px] shadow-lg text-white">
            <div class="flex items-center gap-4">
                <img src="logo.jpeg" class="w-12 rounded-full border border-white" alt="Logo">
                <h1 class="text-sm font-bold leading-tight uppercase">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h1>
            </div>
        </header>
        <main class="p-6 grid grid-cols-2 gap-4 -mt-8">
            ${gridBtn('Membros', 'people')}
            ${gridBtn('Agenda', 'event')}
            ${gridBtn('Escalas', 'assignment_ind')}
            ${gridBtn('Orações', 'favorite')}
        </main>
        <nav class="fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center px-6">
            <span class="material-icons text-[#8b3230]">home</span>
            <div class="bg-[#8b3230] p-4 rounded-full -mt-12 text-white shadow-xl">
                <span class="material-icons text-3xl">fingerprint</span>
            </div>
            <span class="material-icons text-gray-400">person</span>
        </nav>
    </div>`;
}

function renderDesktop() {
    return `
    <div class="flex h-screen w-screen">
        <aside class="w-72 bg-[#8b3230] text-white flex flex-col p-8">
            <img src="logo.jpeg" class="w-20 mb-4 rounded-full border-2 border-white" alt="Logo">
            <h2 class="text-sm font-bold mb-10 leading-tight uppercase">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            <nav class="space-y-4">
                <button class="flex items-center gap-3 w-full p-4 hover:bg-red-900 rounded-2xl transition font-bold uppercase text-xs">
                    <span class="material-icons">dashboard</span> Painel Geral
                </button>
            </nav>
        </aside>
        <main class="flex-1 p-12 bg-gray-100 flex items-center justify-center">
            <div class="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center">
                <h2 class="text-3xl font-bold text-gray-800">Secretaria Virtual</h2>
                <p class="text-gray-500 mt-4 text-lg text-center">Gestão de Membros e Ministérios</p>
            </div>
        </main>
    </div>`;
}

function gridBtn(label, icon) {
    return `<button class="bg-white p-6 rounded-3xl shadow-sm border flex flex-col items-center gap-2 active:scale-95 transition">
        <span class="material-icons text-3xl text-[#8b3230]">${icon}</span>
        <span class="font-bold text-gray-700 text-[10px] uppercase">${label}</span>
    </button>`;
}

window.addEventListener('resize', render);
render();
