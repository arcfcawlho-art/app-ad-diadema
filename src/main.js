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
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
            <img src="logo.jpeg" alt="Logo" class="w-24 mx-auto mb-4">
            <h2 class="text-xl font-bold text-gray-800 mb-6 leading-tight uppercase">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            
            <div class="space-y-4">
                <input id="userPIN" type="password" maxlength="4" placeholder="PIN de 4 dígitos" 
                    class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-center text-2xl tracking-widest">
                
                <button onclick="window.entrar()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg active:scale-95 transition">
                    ENTRAR
                </button>

                <button onclick="window.biometria()" class="flex items-center justify-center gap-3 w-full bg-gray-50 p-4 rounded-2xl font-bold text-gray-700">
                    <span class="material-icons text-[#8b3230]">fingerprint</span>
                    Acesso Biométrico
                </button>

                <button onclick="state.view = 'cadastro'; render();" class="mt-4 text-[#8b3230] text-sm font-bold hover:underline">
                    Não tem conta? Cadastre-se aqui
                </button>
            </div>
        </div>
    </div>`;
}

function renderCadastro() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-gray-100 p-6 overflow-y-auto">
        <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border-t-8 border-[#8b3230]">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Novo Cadastro</h2>
            <div class="space-y-4">
                <input id="regNome" type="text" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-2xl outline-none">
                <input id="regCong" type="text" placeholder="Congregação" class="w-full p-4 bg-gray-50 rounded-2xl outline-none">
                <input id="regPIN" type="password" maxlength="4" placeholder="Crie seu PIN (4 números)" class="w-full p-4 bg-gray-50 rounded-2xl outline-none text-center text-xl">
                
                <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg mt-4">
                    FINALIZAR
                </button>
                <button onclick="state.view = 'login'; render();" class="w-full text-gray-400 text-sm font-bold mt-2">
                    Voltar
                </button>
            </div>
        </div>
    </div>`;
}

function renderMobile() {
    return `
    <div class="flex flex-col w-full h-full pb-24 bg-gray-50 overflow-y-auto">
        <header class="bg-[#8b3230] p-8 rounded-b-[40px] shadow-lg text-white">
            <div class="flex items-center gap-4">
                <img src="logo.jpeg" class="w-12 rounded-full border border-white" alt="Logo">
                <h1 class="text-sm font-bold leading-tight">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h1>
            </div>
        </header>
        <main class="p-6 grid grid-cols-2 gap-4 -mt-8">
            ${gridBtn('Agenda', 'event')}
            ${gridBtn('Membros', 'people')}
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
            <h2 class="text-lg font-bold mb-10 leading-tight uppercase">ASSEMBLÉIA DE DEUS<br>DE DIADEMA</h2>
            <nav class="space-y-4">
                <button class="flex items-center gap-3 w-full p-4 hover:bg-red-900 rounded-2xl transition">
                    <span class="material-icons">dashboard</span> Painel
                </button>
            </nav>
        </aside>
        <main class="flex-1 p-12 bg-gray-100 flex items-center justify-center">
            <div class="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center">
                <h2 class="text-3xl font-bold text-gray-800">Bem-vindo à Secretaria</h2>
                <p class="text-gray-500 mt-4 text-lg">Selecione uma opção no menu lateral.</p>
            </div>
        </main>
    </div>`;
}

window.entrar = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "1234") { 
        state.user = { nome: "Usuário" };
        render();
    } else {
        alert("PIN Incorreto!");
    }
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    if(!nome || !pin) return alert("Preencha Nome e PIN!");
    
    await Database.salvar(`membros/${Date.now()}`, { nome, pin });
    alert("Cadastrado! Use seu PIN para entrar.");
    state.view = 'login';
    render();
};

function gridBtn(label, icon) {
    return `<button class="bg-white p-6 rounded-3xl shadow-sm border flex flex-col items-center gap-2 active:scale-95 transition">
        <span class="material-icons text-3xl text-[#8b3230]">${icon}</span>
        <span class="font-bold text-gray-700 text-[10px] uppercase">${label}</span>
    </button>`;
}

window.addEventListener('resize', render);
render();
