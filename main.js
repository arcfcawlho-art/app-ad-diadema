import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxucjJzh_JYBgL4d_2WLEsmVu_eKllIs",
    authDomain: "app-add-diadema.firebaseapp.com",
    projectId: "app-add-diadema",
    storageBucket: "app-add-diadema.firebasestorage.app",
    messagingSenderId: "773738555135",
    appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let telaAtual = 'login'; 
let subTelaAdmin = 'menu'; // menu, relatorios, auditoria, saídas, promoção
let usuarioLogado = null;
let listaMembros = [];
let logsAuditoria = [];

// --- FUNÇÃO DE AUDITORIA (O CORAÇÃO DO CONTROLE) ---
async function registrarLog(acao) {
    await addDoc(collection(db, "auditoria"), {
        admin: usuarioLogado.nome,
        acao: acao,
        data: new Date().toLocaleString(),
        timestamp: Date.now()
    });
}

// --- FUNÇÕES DE NAVEGAÇÃO ADMIN ---
window.mudarSubTela = async (tela) => {
    subTelaAdmin = tela;
    if(tela === 'relatorios' || tela === 'promoção') {
        const q = query(collection(db, "membros"), where("status", "==", "ativo"));
        const qs = await getDocs(q);
        listaMembros = qs.docs.map(d => ({id: d.id, ...d.data()}));
    }
    if(tela === 'auditoria') {
        const q = query(collection(db, "auditoria"), orderBy("timestamp", "desc"), limit(50));
        const qs = await getDocs(q);
        logsAuditoria = qs.docs.map(d => d.data());
    }
    render();
}

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        // ... (Mantém o login anterior)
    } 

    else if (telaAtual === 'admin') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100 font-sans">
                <div class="bg-gray-900 p-6 text-white flex justify-between items-center shadow-xl">
                    <h2 class="font-black uppercase text-xs tracking-widest">Painel Gestão AD</h2>
                    <button onclick="location.reload()" class="text-[10px] font-bold opacity-50">SAIR</button>
                </div>

                ${subTelaAdmin === 'menu' ? renderMenuAdmin() : ''}
                ${subTelaAdmin === 'relatorios' ? renderRelatorios() : ''}
                ${subTelaAdmin === 'auditoria' ? renderAuditoria() : ''}
                ${subTelaAdmin === 'promoção' ? renderPromocao() : ''}
                
                ${subTelaAdmin !== 'menu' ? `<button onclick="mudarSubTela('menu')" class="fixed bottom-4 right-4 bg-black text-white p-4 rounded-full shadow-2xl"><span class="material-icons">menu</span></button>` : ''}
            </div>
        `;
    }
}

function renderMenuAdmin() {
    return `
        <div class="p-6 grid grid-cols-1 gap-4">
            <button onclick="mudarSubTela('relatorios')" class="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-blue-600 flex items-center gap-6">
                <span class="material-icons text-blue-600 text-4xl">assessment</span>
                <div class="text-left">
                    <p class="font-black uppercase text-sm">1. Relatórios</p>
                    <p class="text-[10px] text-gray-400">Filtros e Impressão de Listas</p>
                </div>
            </button>
            <button onclick="mudarSubTela('auditoria')" class="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-amber-500 flex items-center gap-6">
                <span class="material-icons text-amber-500 text-4xl">security</span>
                <div class="text-left">
                    <p class="font-black uppercase text-sm">2. Auditoria</p>
                    <p class="text-[10px] text-gray-400">Logs de Ações do Sistema</p>
                </div>
            </button>
            <button onclick="alert('Tela de Saídas em desenvolvimento')" class="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-gray-400 flex items-center gap-6">
                <span class="material-icons text-gray-400 text-4xl">logout</span>
                <div class="text-left">
                    <p class="font-black uppercase text-sm font-bold opacity-50">3. Controle de Saída</p>
                    <p class="text-[10px] text-gray-400">Histórico de Desligamentos</p>
                </div>
            </button>
            <button onclick="mudarSubTela('promoção')" class="bg-white p-8 rounded-[2rem] shadow-sm border-l-8 border-red-600 flex items-center gap-6">
                <span class="material-icons text-red-600 text-4xl">stars</span>
                <div class="text-left">
                    <p class="font-black uppercase text-sm">4. Promoção</p>
                    <p class="text-[10px] text-gray-400">Gerenciar Admins e Hierarquia</p>
                </div>
            </button>
        </div>
    `;
}

function renderRelatorios() {
    return `
        <div class="p-4 space-y-4">
            <h3 class="font-black uppercase text-center text-gray-400 text-xs">Filtros de Membresia</h3>
            <div class="bg-white p-6 rounded-3xl shadow-sm space-y-3">
                <select class="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold">
                    <option>Filtrar por Cargo (Todos)</option>
                    <option>Membro</option>
                    <option>Obreiro</option>
                </select>
                <button class="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase text-[10px]">Gerar PDF para Impressão</button>
            </div>
            <div class="bg-white rounded-3xl overflow-hidden">
                <table class="w-full text-[10px] text-left">
                    <thead class="bg-gray-50 font-black uppercase">
                        <tr><th class="p-3">Nome</th><th class="p-3">Cargo</th></tr>
                    </thead>
                    <tbody>
                        ${listaMembros.map(m => `
                            <tr class="border-t"><td class="p-3 font-bold">${m.nome}</td><td class="p-3">${m.cargo}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAuditoria() {
    return `
        <div class="p-4 space-y-3">
            <h3 class="font-black uppercase text-center text-gray-400 text-xs">Registros de Auditoria</h3>
            ${logsAuditoria.map(log => `
                <div class="bg-white p-4 rounded-2xl border-l-4 border-amber-400 shadow-sm">
                    <p class="text-[10px] font-black uppercase">${log.admin}</p>
                    <p class="text-[11px] text-gray-700">${log.acao}</p>
                    <p class="text-[9px] text-gray-400 mt-1">${log.data}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPromocao() {
    return `
        <div class="p-4 space-y-4">
            <h3 class="font-black uppercase text-center text-gray-400 text-xs">Gestão de Privilégios</h3>
            <div class="grid gap-3">
                ${listaMembros.map(m => `
                    <div class="bg-white p-4 rounded-3xl flex items-center justify-between">
                        <div>
                            <p class="font-black text-xs uppercase">${m.nome}</p>
                            <p class="text-[9px] font-bold ${m.nivel === 'admin' ? 'text-blue-600' : 'text-gray-400 uppercase'}">${m.nivel === 'admin' ? 'ACESSO ADMIN' : 'ACESSO COMUM'}</p>
                        </div>
                        <button onclick="promoverMembro('${m.id}', '${m.nivel}', '${m.nome}')" class="p-3 rounded-2xl ${m.nivel === 'admin' ? 'bg-gray-100 text-red-600' : 'bg-red-600 text-white'} font-black text-[9px] uppercase">
                            ${m.nivel === 'admin' ? 'Remover' : 'Promover'}
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.promoverMembro = async (id, nivelAtual, nomeMembro) => {
    const novoNivel = nivelAtual === 'admin' ? 'membro' : 'admin';
    if(confirm(`Deseja alterar o acesso de ${nomeMembro}?`)) {
        await updateDoc(doc(db, "membros", id), { nivel: novoNivel });
        await registrarLog(`${novoNivel === 'admin' ? 'PROMOVEU' : 'REBAIXOU'} o acesso de ${nomeMembro}`);
        mudarSubTela('promoção');
    }
}

// ... Restante das funções de Login e Cadastro (Lembrar de add 'status: ativo' no cadastro)
