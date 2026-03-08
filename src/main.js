import { Database } from "./services/database.js";

let state = { user: null, isAdmin: true, view: 'home' };

function render() {
    const app = document.getElementById('app');
    const isMobile = window.innerWidth < 768;
    app.innerHTML = isMobile ? renderMobile() : renderDesktop();
}

function renderMobile() {
    return `
    <div class="flex flex-col w-full h-full pb-20 bg-gray-50 overflow-y-auto no-scrollbar">
        <header class="bg-[#8b3230] p-8 rounded-b-[40px] shadow-lg text-white">
            <h1 class="text-2xl font-bold">AD Diadema</h1>
            <p class="opacity-80">Paz do Senhor!</p>
        </header>
        <main class="p-6 grid grid-cols-2 gap-4 -mt-8">
            ${gridBtn('Agenda', 'event')}
            ${gridBtn('Escalas', 'assignment_ind')}
            ${gridBtn('Infantil', 'child_care')}
            ${gridBtn('Perfil', 'person')}
        </main>
        <nav class="fixed bottom-0 w-full h-20 bg-white border-t flex justify-around items-center px-6">
            <span class="material-icons text-[#8b3230]">home</span>
            <div class="bg-[#8b3230] p-4 rounded-full -mt-12 border-4 border-gray-50 text-white shadow-xl">
                <span class="material-icons text-3xl">fingerprint</span>
            </div>
            <span class="material-icons text-gray-400">person</span>
        </nav>
    </div>`;
}

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
        </aside>
    <main class="flex-1 flex justify-center items-center p-12 bg-gray-100">
        <div class="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-12 min-h-[600px] text-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Bem-vindo à Secretaria</h2>
            <p class="text-gray-500">Selecione uma opção no menu lateral para começar.</p>
        </div>
    </main>`;
}

function gridBtn(label, icon) {
    return `
    <button class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition">
        <span class="material-icons text-4xl text-[#8b3230]">${icon}</span>
        <span class="font-bold text-gray-700">${label}</span>
    </button>`;
}

window.addEventListener('resize', render);
render();