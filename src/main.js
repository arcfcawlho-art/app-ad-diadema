import { Database } from "./services/database.js";

// 1. COMEÇA DESLOGADO (user: null)
let state = { user: null, view: 'login' };

function render() {
    const app = document.getElementById('app');
    
    // Se não tem usuário, mostra a tela de LOGIN
    if (!state.user) {
        app.innerHTML = renderLogin();
    } else {
        // Se já logou, mostra o Dashboard (PC ou Celular)
        const isMobile = window.innerWidth < 768;
        app.innerHTML = isMobile ? renderMobile() : renderDesktop();
    }
}

// TELA DE LOGIN (O que você sentiu falta)
function renderLogin() {
    return `
    <div class="h-screen w-screen flex items-center justify-center bg-[#8b3230] p-6">
        <div class="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
            <div class="mb-6 flex justify-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                   <span class="material-icons text-4xl text-[#8b3230]">church</span>
                </div>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-800 mb-2">AD Diadema</h2>
            <p class="text-gray-500 mb-8">Entre com seu PIN ou Digital</p>

            <div class="space-y-4">
                <input id="userPIN" type="password" placeholder="Digite seu PIN" 
                    class="w-full p-4 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-red-800 outline-none text-center text-xl tracking-widest">
                
                <button onclick="window.entrar()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-red-900 transition">
                    ENTRAR
                </button>

                <div class="flex items-center gap-4 my-6">
                    <hr class="flex-1 border-gray-200">
                    <span class="text-gray-400 text-xs font-bold uppercase">Ou use</span>
                    <hr class="flex-1 border-gray-200">
                </div>

                <button onclick="window.biometria()" class="flex items-center justify-center gap-3 w-full border-2 border-gray-100 p-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50">
                    <span class="material-icons text-[#8b3230]">fingerprint</span>
                    Acesso Biométrico
                </button>
            </div>
        </div>
    </div>`;
}

// LÓGICA DE ENTRADA
window.entrar = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin === "1234") { // Exemplo de PIN
        state.user = { nome: "Fabrício" };
        render();
    } else {
        alert("PIN Incorreto!");
    }
};

window.biometria = async () => {
    alert("Iniciando leitura da Digital...");
    // Aqui entra a lógica do WebAuthn que te mandei no PDF
    state.user = { nome: "Fabrício (via Digital)" };
    render();
};

// ... (Mantenha aqui as funções renderMobile e renderDesktop que te mandei antes)

window.addEventListener('resize', render);
render();
