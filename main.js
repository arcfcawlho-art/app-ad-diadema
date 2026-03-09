import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
let dadosMembro = null;
let listaMembros = [];
let fotoBase64 = null;
let streamCamera = null;

// FUNÇÃO GLOBAL DE EXCLUSÃO (MELHORADA)
window.excluirMembro = async (id) => {
    if(confirm("⚠ ATENÇÃO: Deseja apagar este membro permanentemente?")) {
        try {
            await deleteDoc(doc(db, "membros", id));
            alert("Membro removido!");
            // Atualiza a lista local e renderiza de novo
            listaMembros = listaMembros.filter(m => m.id !== id);
            render();
        } catch (e) {
            alert("Erro ao excluir: " + e.message);
        }
    }
}

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 justify-center min-h-screen bg-gray-100">
                <img src="logo.jpeg" class="w-32 mb-8 object-contain">
                <div class="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-600 text-center">
                    <h2 class="text-xl font-black text-gray-800 uppercase tracking-tighter">Portal AD Diadema</h2>
                    <div class="mt-6 space-y-4">
                        <input type="text" id="loginUser" placeholder="Nome do Usuário" class="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200">
                        <input type="password" id="loginPin" placeholder="PIN (4 dígitos)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-2xl border-none text-center text-2xl tracking-widest ring-1 ring-gray-200">
                    </div>
                    <button id="btnEntrar" class="w-full bg-red-600 text-white p-4 mt-6 rounded-2xl font-black shadow-lg">ENTRAR NO SISTEMA</button>
                    <button id="irParaCadastro" class="w-full text-gray-400 font-bold text-xs uppercase pt-4 hover:text-red-600">Fazer meu Cadastro</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-4 min-h-screen bg-gray-50">
                <div class="w-full max-w-md bg-white p-6 rounded-[2rem] shadow-xl space-y-4">
                    <h2 class="text-2xl font-black text-red-600 text-center uppercase">Novo Cadastro</h2>
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 uppercase">
                    <input type="text" id="cadFone" placeholder="Telefone com DDD" maxlength="11" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    <input type="password" id="cadPin" placeholder="PIN (4 dígitos)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200">
                    
                    <div class="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                        <input type="checkbox" id="checkLgpd" class="mt-1 w-5 h-5 accent-red-600">
                        <label for="checkLgpd" class="text-[10px] text-gray-600 leading-tight">
                            Autorizo a <b>AD Diadema</b> a armazenar meus dados e imagem para fins de identificação interna, conforme a <b>LGPD</b>.
                        </label>
                    </div>

                    <div class="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl font-bold uppercase text-xs">Capturar Minha Foto</button>
                    <button id="finalizarCad" class="w-full bg-red-600 text-white p-5 rounded-2xl font-black shadow-lg uppercase">Confirmar Cadastro</button>
                    <button id="voltarLogin" class="w-full text-gray-400 text-xs font-bold uppercase">Voltar</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('voltarLogin').onclick = () => { desligarCamera(); telaAtual = 'login'; render(); };
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }

    else if (telaAtual === 'admin') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100">
                <div class="bg-gray-900 p-6 text-white flex justify-between items-center sticky top-0 z-50">
                    <div>
                        <h2 class="font-black uppercase text-sm">Administração</h2>
                        <p class="text-[9px] text-red-500 font-bold uppercase">Painel de Controle</p>
                    </div>
                    <button id="sair" class="bg-red-600 px-4 py-2 rounded-lg text-xs font-black">SAIR</button>
                </div>

                <div class="p-4 space-y-4">
                    <div class="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-red-600">
                        <p class="text-[10px] font-black text-gray-400 uppercase">Membros Cadastrados</p>
                        <h3 class="text-4xl font-black text-gray-800">${listaMembros.length}</h3>
                    </div>

                    <div class="grid gap-4">
                        ${listaMembros.length === 0 ? '<p class="text-center text-gray-400 py-10">Nenhum membro encontrado.</p>' : ''}
                        ${listaMembros.map(m => `
                            <div class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100">
                                <img src="${m.foto}" class="w-16 h-16 rounded-xl object-cover border shadow-sm">
                                <div class="flex-1">
                                    <p class="font-black text-sm uppercase text-gray-800 leading-none">${m.nome}</p>
                                    <p class="text-[10px] text-gray-500 mt-1 font-bold">PIN: ${m.pin} | Fone: ${m.fone}</p>
                                    <div class="flex gap-2 mt-3">
                                        <a href="https://wa.me/55${m.fone}" target="_blank" class="bg-green-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                                            <span class="material-icons text-xs">chat</span> WHATSAPP
                                        </a>
                                        <button onclick="window.excluirMembro('${m.id}')" class="bg-gray-100 text-red-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                                            <span class="material-icons text-xs">delete_forever</span> EXCLUIR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.getElementById('sair').onclick = () => { location.reload(); };
    }

    else if (telaAtual === 'areaMembro') {
        appDiv.innerHTML = `
            <div class="flex flex-col min-h-screen bg-gray-100">
                <div class="bg-red-600 p-8 rounded-b-[3.5rem] shadow-xl text-white">
                    <p class="text-xs font-bold opacity-70 uppercase tracking-widest">Paz do Senhor,</p>
                    <h2 class="text-2xl font-black uppercase">${dadosMembro.nome.split(' ')[0]}</h2>
                </div>
                <div class="p-6 flex flex-col items-center flex-1 justify-center">
                    <img src="${dadosMembro.foto}" class="w-56 h-56 rounded-[3rem] border-8 border-white shadow-2xl object-cover mb-6">
                    <h3 class="text-xl font-black text-gray-800 uppercase text-center">${dadosMembro.nome}</h3>
                    <p class="text-red-600 font-black text-xs mt-1 uppercase tracking-[0.2em]">Membro AD Diadema</p>
                    
                    <div class="mt-8 p-6 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
                         <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEMBRO:${dadosMembro.nome}" class="w-32 h-32 opacity-90">
                    </div>

                    <button id="sairApp" class="mt-12 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Encerrar Sessão</button>
                </div>
            </div>
        `;
        document.getElementById('sairApp').onclick = () => { location.reload(); };
    }
}

// LÓGICA DE LOGIN
async function realizarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pin = document.getElementById('loginPin').value.trim();
    
    if (user.toLowerCase() === "admin" && pin === "9999") {
        const todos = await getDocs(collection(db, "membros"));
        listaMembros = todos.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        telaAtual = 'admin';
        render();
        return;
    }

    const q = query(collection(db, "membros"), where("nome", "==", user.toUpperCase()), where("pin", "==", pin));
    const qs = await getDocs(q);

    if (!qs.empty) {
        dadosMembro = qs.docs[0].data();
        telaAtual = 'areaMembro'; 
        render();
    } else { alert("Usuário ou PIN incorretos!"); }
}

// CÂMERA
function iniciarCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(s => { streamCamera = s; document.getElementById('video').srcObject = s; })
        .catch(() => alert("Por favor, autorize a câmera para o cadastro."));
}

function desligarCamera() {
    if (streamCamera) { streamCamera.getTracks().forEach(t => t.stop()); streamCamera = null; }
}

function tirarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('fotoPreview');
    canvas.width = 600; canvas.height = 600;
    canvas.getContext('2d').drawImage(video, 0, 0, 600, 600);
    fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    preview.src = fotoBase64;
    video.classList.add('hidden');
    preview.classList.remove('hidden');
}

// SALVAR COM VALIDAÇÃO LGPD
async function salvarCadastro() {
    const nome = document.getElementById('cadNome').value.toUpperCase().trim();
    const pin = document.getElementById('cadPin').value;
    const fone = document.getElementById('cadFone').value;
    const aceitouLgpd = document.getElementById('checkLgpd').checked;

    if(!aceitouLgpd) return alert("Você precisa aceitar os termos da LGPD para continuar.");
    if(!nome || pin.length < 4 || !fotoBase64 || fone.length < 10) return alert("Preencha todos os campos e tire sua foto!");
    
    try {
        await addDoc(collection(db, "membros"), { 
            nome, pin, fone, foto: fotoBase64, data: new Date().toLocaleString() 
        });
        desligarCamera();
        alert("🎉 Glória a Deus! Cadastro concluído com sucesso.");
        telaAtual = 'login'; render();
    } catch (e) { alert("Erro ao salvar dados."); }
}

render();
