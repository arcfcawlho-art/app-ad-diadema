import { Database } from "./services/database.js";

// Estado inicial do App
let state = { 
    user: { nome: "Membro" }, 
    isAdmin: true, 
    view: 'home' 
};

// Função principal de desenho (Render)
function render() {
    const app = document.getElementById('app');
    const isMobile = window.innerWidth < 768; // Detecta se é celular

    app.innerHTML = isMobile ? renderMobile() : renderDesktop();
}

// VISUAL PARA CELULAR (Mobile)
function renderMobile() {
    return `
    <div class="flex flex-col w-full h-full pb-24 bg-gray-50 overflow-y-auto no-scrollbar">
        <header class="bg-[#8b3230] p-8 rounded-b-[40px] shadow-lg text-white">
            <h1 class="text-2xl font-bold">AD Diadema</h1>
            <p class="opacity-80">Paz do Senhor, ${state.user.nome}!</p>
        </header>

        <main class="p-6 grid grid-cols-2 gap-4 -mt-8">
            ${gridBtn('Agenda', 'event')}
            ${gridBtn('Escalas', 'assignment_ind')}
            ${gridBtn('Infantil', 'child_care')}
            ${gridBtn('Perfil', 'person')}
        </main>

        <nav class="fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center px-6">
            <button class="material-icons text-[#8b3230]">home</button>
            <button class="bg-[#8b3230] p-4 rounded-full -mt-12 border-4 border-gray-50 text-white shadow-xl active:scale-90 transition">
                <span class="material-icons text-3xl">fingerprint</span>
            </button>
            <button class="material-icons text-gray-400">person</button>
        </nav>
    </div>`;
}

// VISUAL PARA PC (Desktop)
function renderDesktop() {
    return `
    <aside class="w-64 bg-[#8b3230] text-white flex flex-col p-6 shadow-2xl z-10">
        <h2 class="text-2xl font-bold mb-10 border-b border-red-800 pb-4">AD Diadema</h2>
        <nav class="space-y-4">
            <button class="flex items-center gap-3 w-full p-3 hover:bg-red-800 rounded-xl transition">
                <span class="material-icons">dashboard</span> Painel Geral
            </button>
            <button class="flex items-center gap-3 w-full p-3 hover:bg-red-800 rounded-xl transition">
                <span class="material-icons">people</span> Membros
            </button>
            <button class="flex items-center gap-3 w-full p-3 hover:bg-red-800 rounded-xl transition">
                <span class="material-icons">admin_panel_settings</span> Admin
            </button>
        </nav>
    </aside>

    <main class="flex-1 flex justify-center items-center p-12 bg-gray-100">
        <div class="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-12 min-h-[600px] text-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Secretaria Virtual</h2>
            <p class="text-gray-500 mb-8 text-lg">Selecione uma opção no menu lateral para gerenciar a congregação.</p>
            
            <div class="grid grid-cols-3 gap-6 text-left">
                <div class="p-6 bg-red-50 rounded-2xl border border-red-100">
                    <p class="text-red-800 font-bold">Membros Ativos</p>
                    <p class="text-3xl font-black">150</p>
                </div>
                <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <p class="text-blue-800 font-bold">Online Agora</p>
                    <p class="text-3xl font-black">12</p>
                </div>
                <div class="p-6 bg-green-50 rounded-2xl border border-green-100">
                    <p class="text-green-800 font-bold">Próximos Eventos</p>
                    <p class="text-3xl font-black">3</p>
                </div>
            </div>
        </div>
    </main>`;
}

// Botão de Grid do Celular
function gridBtn(label, icon) {
    return `
    <button class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition">
        <span class="material-icons text-4xl text-[#8b3230]">${icon}</span>
        <span class="font-bold text-gray-700">${label}</span>
    </button>`;
}

// Escuta redimensionamento da tela
window.addEventListener('resize', render);
render(); // Inicia o App
