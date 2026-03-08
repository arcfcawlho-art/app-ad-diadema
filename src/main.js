import { Database } from "./services/database.js";

let state = { view: 'login', user: null };

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    if (state.view === 'login') app.innerHTML = renderLogin();
    else if (state.view === 'cadastro') app.innerHTML = renderCadastro();
    else app.innerHTML = renderHome();
}

function renderLogin() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6">
        <img src="logo.jpeg" class="w-32 mb-6 rounded-2xl shadow-lg">
        <h1 class="text-xl font-black text-[#8b3230] text-center mb-12 uppercase tracking-tight">
            ASSEMBLÉIA DE DEUS<br>DE DIADEMA
        </h1>

        <div class="w-full max-w-xs space-y-8 text-center">
            <button onclick="window.autenticarDigital()" class="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-100 shadow-inner active:scale-90 transition">
                <span class="material-icons text-5xl text-[#8b3230]">fingerprint</span>
            </button>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Toque para entrar com biometria</p>

            <div class="pt-8">
                <input id="userPIN" type="password" maxlength="4" placeholder="OU DIGITE SEU PIN" 
                    class="w-full p-4 bg-gray-50 rounded-2xl text-center text-xl font-bold border-none outline-none focus:ring-2 focus:ring-[#8b3230]">
                <button onclick="window.tentarLogin()" class="w-full mt-4 bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-lg">ENTRAR</button>
            </div>

            <button onclick="state.view = 'cadastro'; render();" class="text-[#8b3230] text-sm font-bold uppercase tracking-tighter hover:underline">
                Primeiro Acesso / Cadastro
            </button>
        </div>
    </div>`;
}

function renderCadastro() {
    return `
    <div class="h-screen w-screen p-6 bg-gray-50 flex flex-col items-center justify-center">
        <div class="bg-white w-full max-w-sm p-8 rounded-[32px] shadow-xl">
            <h2 class="text-[#8b3230] font-black mb-6 uppercase text-center">Ficha de Cadastro</h2>
            <input id="regNome" type="text" placeholder="NOME COMPLETO" class="w-full p-4 mb-4 rounded-2xl bg-gray-50 border-none">
            <input id="regPIN" type="password" maxlength="4" placeholder="CRIE UM PIN" class="w-full p-4 mb-8 rounded-2xl bg-gray-50 border-none text-center font-bold">
            <button onclick="window.realizarCadastro()" class="w-full bg-[#8b3230] text-white p-4 rounded-2xl font-bold shadow-md">SALVAR</button>
            <button onclick="state.view = 'login'; render();" class="w-full mt-4 text-gray-400 text-xs font-bold uppercase">Voltar</button>
        </div>
    </div>`;
}

function renderHome() {
    return `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <span class="material-icons text-6xl text-green-500 mb-4">check_circle</span>
        <h2 class="text-2xl font-black text-[#8b3230] uppercase">Acesso Liberado</h2>
        <p class="text-gray-500 mt-2">Paz do Senhor, ${state.user?.nome || 'Membro'}!</p>
        <button onclick="location.reload()" class="mt-8 text-gray-400 font-bold text-xs uppercase">Sair</button>
    </div>`;
}

window.autenticarDigital = () => {
    alert("Iniciando leitura de biometria...");
    setTimeout(() => {
        state.user = { nome: "Usuário Bio" };
        state.view = 'home';
        render();
    }, 1000);
};

window.tentarLogin = () => {
    const pin = document.getElementById('userPIN').value;
    if(pin.length === 4) {
        state.user = { nome: "Usuário PIN" };
        state.view = 'home';
        render();
    } else alert("Digite o PIN de 4 dígitos");
};

window.realizarCadastro = async () => {
    const nome = document.getElementById('regNome').value;
    const pin = document.getElementById('regPIN').value;
    if(!nome || !pin) return alert("Preencha tudo!");
    
    try {
        await Database.salvar(`membros/${Date.now()}`, { nome, pin });
        alert("Cadastro salvo com sucesso!");
        state.view = 'login';
        render();
    } catch(e) {
        alert("Erro ao conectar com o banco. Verifique a internet.");
    }
};

render();
