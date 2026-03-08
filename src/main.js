import { Database } from "./services/database.js";

// Estado do App: controla qual tela mostrar
let state = { 
    user: null, 
    view: 'login', // pode ser 'login', 'dashboard' ou 'cadastro'
    isAdmin: true 
};

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

// --- TELA DE LOGIN ---
function renderLogin() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-[#8b3230] p-6">
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center border-t-8 border-[#8b3230]">
            <img src="logo.png" alt="Logo" class="w-24 mx-auto mb-4">
            <h2 class="text-xl font-bold text-gray-800 mb-1 leading-tight">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            <p class="text-sm text-gray-500 mb-8">Entre com seu PIN ou Digital</p>

            <div class="space-y-4">
                <input id="userPIN" type="password" placeholder="Digite seu PIN" 
                    class="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#8b3230] outline-none text-center text-2xl tracking-widest transition-all">
                
                <button onclick="window.entrar()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
                    ENTRAR
                </button>

                <div class="flex items-center gap-4 py-2">
                    <hr class="flex-1 border-gray-100">
                    <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Ou use</span>
                    <hr class="flex-1 border-gray-200">
                </div>

                <button onclick="window.biometria()" class="flex items-center justify-center gap-3 w-full bg-gray-50 p-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition">
                    <span class="material-icons text-[#8b3230]">fingerprint</span>
                    Acesso Biométrico
                </button>

                <button onclick="window.mudarParaCadastro()" class="mt-4 text-[#8b3230] text-sm font-bold hover:underline">
                    Não tem conta? Cadastre-se aqui
                </button>
            </div>
        </div>
    </div>`;
}

// --- TELA DE AUTO-CADASTRO ---
function renderCadastro() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-gray-100 p-6 overflow-y-auto">
        <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl">
            <h2 class="text-2xl font-bold text-[#8b3230] mb-6 text-center">Cadastro de Membro</h2>
            
            <div class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-gray-400 ml-2">FOTO DE PERFIL</label>
                    <input type="file" id="fotoMembro" accept="image/*" class="w-full p-3 bg-gray-50 rounded-xl border border-gray-100">
                </div>
                <input id="nomeMembro" type="text" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8b3230]">
                <input id="congregacaoMembro" type="text" placeholder="Sua Congregação" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8b3230]">
                <input id="novoPIN" type="password" maxlength="4" placeholder="Crie um PIN (4 dígitos)" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8b3230] text-center text-xl">
                
                <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg mt-4">
                    FINALIZAR CADASTRO
                </button>
                <button onclick="state.view = 'login'; render();" class="w-full text-gray-400 text-sm font-bold mt-2">
                    Voltar para o Login
                </button>
            </div>
        </div>
    </div>`;
}

// --- VISUAL CELULAR (PÓS LOGIN) ---
function renderMobile() {
    return `
    <div class="flex flex-col w-full h-full pb-24 bg-gray-50 overflow-y-auto no-scrollbar">
        <header class="bg-[#8b3230] p-8 rounded-b-[40px] shadow-lg text-white">
            <div class="flex items-center gap-4">
                <img src="logo.png" class="w-12 brightness-0 invert" alt="Logo">
                <div>
                    <h1 class="text-lg font-bold leading-tight">ASSEMBLÉIA DE DEUS</h1>
                    <p class="text-xs opacity-70">Olá, ${state.user.nome}!</p>
                </div>
            </div>
        </header>

        <main class="p-6 grid grid-cols-2 gap-4 -mt-8">
            ${gridBtn('Agenda', 'event')}
            ${gridBtn('Minha Escala', 'assignment_ind')}
            ${gridBtn('Orações', 'favorite')}
            ${gridBtn('Infantil', 'child_care')}
            ${gridBtn('Membros', 'people')}
            ${gridBtn('Financeiro', 'payments')}
        </main>

        <nav class="fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center px-6">
            <span class="material-icons text-[#8b3230]">home</span>
            <button class="bg-[#8b3230] p-4 rounded-full -mt-12 border-4 border-gray-50 text-white shadow-xl">
                <span class="material-icons text-3xl">fingerprint</span>
            </button>
            <span class="material-icons text-gray-400">person</span>
        </nav>
    </div>`;
}

// --- VISUAL DESKTOP (SECRETARIA) ---
function renderDesktop() {
    return `
    <aside class="w-72 bg-[#8b3230] text-white flex flex-col p-8 shadow-2xl">
        <img src="logo.png" class="w-20 mb-4 brightness-0 invert" alt="Logo">
        <h2 class="text-lg font-bold mb-10 leading-tight">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
        <nav class="space-y-4">
            ${menuItem('Painel Geral', 'dashboard')}
            ${menuItem('Cadastrar Membro', 'person_add')}
            ${menuItem('Relatórios', 'description')}
            ${menuItem('Configurações', 'settings')}
        </nav>
    </aside>
    <main class="flex-1 p-12 bg-gray-100 overflow-y-auto">
        <div class="bg-white rounded-3xl shadow-xl p-10 min-h-full">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Secretaria Virtual</h2>
            <div class="grid grid-cols-3 gap-8 mb-12">
                <div class="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <p class="text-red-800 font-bold text-sm">MEMBROS ATIVOS</p>
                    <h3 class="text-4xl font-black">150</h3>
                </div>
                <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p class="text-blue-800 font-bold text-sm">ONLINE AGORA</p>
                    <h3 class="text-4xl font-black">12</h3>
                </div>
            </div>
        </div>
    </main>`;
}

// === FUNÇÕES DE LÓGICA ===

window.mudarParaCadastro = () => {
    state.view = 'cadastro';
    render();
};

window.entrar = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "1234") { 
        state.user = { nome: "Fabrício" };
        state.view = 'dashboard';
        render();
    } else {
        alert("PIN Incorreto!");
    }
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('nomeMembro').value;
    const congregacao = document.getElementById('congregacaoMembro').value;
    const pin = document.getElementById('novoPIN').value;
    
    if(!nome || !pin) return alert("Preencha Nome e PIN!");

    try {
        const id = Date.now().toString();
        await Database.salvar(`membros/${id}`, { nome, congregacao, pin, cargo: 'Membro' });
        alert("Cadastro realizado com sucesso! Use seu PIN para entrar.");
        state.view = 'login';
        render();
    } catch (e) {
        alert("Erro ao cadastrar: " + e.message);
    }
};

function gridBtn(label, icon) {
    return `
    <button class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition">
        <span class="material-icons text-3xl text-[#8b3230]">${icon}</span>
        <span class="font-bold text-gray-700 text-[10px] uppercase">${label}</span>
    </button>`;
}

function menuItem(label, icon) {
    return `
    <button class="flex items-center gap-3 w-full p-4 hover:bg-red-900 rounded-2xl transition font-medium">
        <span class="material-icons">${icon}</span> ${label}
    </button>`;
}

window.addEventListener('resize', render);
render();
