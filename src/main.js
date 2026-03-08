import { Database } from "./services/database.js";

// O estado inicial começa na LOGIN.
let state = { view: 'login' };

function render() {
    const app = document.getElementById('app');
    
    // Se a visão for LOGIN, mostra a entrada
    if (state.view === 'login') {
        app.innerHTML = `
            <div class="h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 class="text-[#8b3230] font-black text-2xl mb-10">AD DIADEMA</h1>
                <button onclick="window.entrarDireto()" class="bg-[#8b3230] text-white p-6 rounded-2xl font-bold w-full max-w-xs shadow-2xl">
                    CLIQUE AQUI PARA ENTRAR
                </button>
                <button onclick="window.mudarPagina('cadastro')" class="mt-8 text-gray-400 font-bold uppercase text-xs">Fazer Cadastro</button>
            </div>
        `;
    } 
    // Se a visão for CADASTRO, mostra a ficha
    else if (state.view === 'cadastro') {
        app.innerHTML = `
            <div class="h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
                <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                    <h2 class="font-black text-[#8b3230] mb-4">FICHA DE MEMBRO</h2>
                    <input id="n" type="text" placeholder="NOME" class="w-full p-4 mb-4 bg-gray-50 rounded-xl">
                    <button onclick="window.entrarDireto()" class="w-full bg-[#8b3230] text-white p-4 rounded-xl font-bold">FINALIZAR E ENTRAR</button>
                </div>
            </div>
        `;
    }
    // SE A VISÃO FOR HOME, ESSA É A PÁGINA PRINCIPAL QUE VOCÊ QUER
    else {
        app.innerHTML = `
            <div class="h-screen flex flex-col items-center justify-center bg-white p-6">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <span class="material-icons text-white text-4xl">check</span>
                </div>
                <h1 class="text-2xl font-black text-[#8b3230]">PÁGINA PRINCIPAL</h1>
                <p class="text-gray-500 mb-10">Você finalmente entrou no sistema!</p>
                
                <div class="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div class="p-6 bg-gray-50 rounded-2xl border text-center font-bold text-[10px]">MINHA FICHA</div>
                    <div class="p-6 bg-gray-50 rounded-2xl border text-center font-bold text-[10px]">ESCALAS</div>
                </div>

                <button onclick="location.reload()" class="mt-20 text-red-300 font-bold text-xs uppercase">Sair</button>
            </div>
        `;
    }
}

// FUNÇÕES DE COMANDO (window. para o HTML enxergar)
window.mudarPagina = (v) => { state.view = v; render(); };
window.entrarDireto = () => { state.view = 'home'; render(); };

// Inicia o app
render();
