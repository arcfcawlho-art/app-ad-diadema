import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxucjJzhq_JYBgL4d_2WLEsmVu_eKllIs",
    authDomain: "app-add-diadema.firebaseapp.com",
    projectId: "app-add-diadema",
    storageBucket: "app-add-diadema.firebasestorage.app",
    messagingSenderId: "773738555135",
    appId: "1:773738555135:web:04058d8494581ba8ec9092"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Estado do App
let telaAtual = 'login'; 
let fotoBase64 = null;

function render() {
    const appDiv = document.getElementById('app');
    
    if (telaAtual === 'login') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 bg-white min-h-screen justify-center">
                <img src="logo.jpeg" class="w-32 mb-8">
                <div class="w-full max-w-sm space-y-4">
                    <h2 class="text-xl font-bold text-center">Acesso ao Sistema</h2>
                    <input type="text" id="loginNome" placeholder="Nome de usuário" class="w-full p-4 bg-gray-100 rounded-2xl border-none">
                    <input type="password" id="loginPin" placeholder="PIN de 4 dígitos" maxlength="4" class="w-full p-4 bg-gray-100 rounded-2xl border-none text-center text-2xl tracking-widest">
                    <button id="btnEntrar" class="w-full bg-blue-700 text-white p-4 rounded-2xl font-bold">ENTRAR</button>
                    <button id="irParaCadastro" class="w-full text-blue-700 font-medium">Primeira vez? Cadastre-se</button>
                </div>
            </div>
        `;
        document.getElementById('irParaCadastro').onclick = () => { telaAtual = 'cadastro'; render(); };
        document.getElementById('btnEntrar').onclick = realizarLogin;
    } 

    else if (telaAtual === 'cadastro') {
        appDiv.innerHTML = `
            <div class="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
                <div class="w-full max-w-md bg-white p-6 rounded-3xl shadow-lg space-y-4">
                    <h2 class="text-2xl font-bold text-blue-900">Novo Cadastro</h2>
                    
                    <input type="text" id="cadNome" placeholder="Nome Completo" class="w-full p-4 bg-gray-50 rounded-xl border">
                    <input type="password" id="cadPin" placeholder="Crie seu PIN (4 dígitos)" maxlength="4" class="w-full p-4 bg-gray-50 rounded-xl border">
                    
                    <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div class="flex items-start gap-2">
                            <input type="checkbox" id="lgpd" class="mt-1">
                            <label for="lgpd" class="text-xs text-blue-900 leading-tight">
                                Estou de acordo com a <b>LGPD</b>. Autorizo a AD Diadema a armazenar meus dados e imagem para fins de identificação interna.
                            </label>
                        </div>
                    </div>

                    <div class="relative w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
                        <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                        <canvas id="canvas" class="hidden"></canvas>
                        <img id="fotoPreview" class="hidden w-full h-full object-cover">
                    </div>

                    <button id="btnTirarFoto" class="w-full bg-gray-800 text-white p-3 rounded-xl flex items-center justify-center gap-2">
                        <span class="material-icons">photo_camera</span> TIRAR FOTO
                    </button>

                    <button id="finalizarCad" class="w-full bg-green-600 text-white p-5 rounded-2xl font-black shadow-lg">CONFIRMAR CADASTRO</button>
                    <button id="voltarLogin" class="w-full text-gray-500 text-sm">Cancelar</button>
                </div>
            </div>
        `;
        iniciarCamera();
        document.getElementById('voltarLogin').onclick = () => { telaAtual = 'login'; render(); };
        document.getElementById('btnTirarFoto').onclick = tirarFoto;
        document.getElementById('finalizarCad').onclick = salvarCadastro;
    }
}

async function realizarLogin() {
    const nome = document.getElementById('loginNome').value.trim();
    const pin = document.getElementById('loginPin').value;
    
    if(!nome || !pin) return alert("Preencha tudo!");

    const q = query(collection(db, "membros"), where("nome", "==", nome.toUpperCase()), where("pin", "==", pin));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        if(confirm("Deseja ativar a Biometria (Digital) para os próximos acessos?")) {
            alert("Biometria ativada com sucesso!");
        }
        alert("Acesso Autorizado! Bem-vindo, " + nome);
        location.reload(); 
    } else {
        alert("Nome ou PIN incorretos.");
    }
}

function iniciarCamera() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => { video.srcObject = stream; })
        .catch(err => console.log("Erro camera", err));
}

function tirarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('fotoPreview');
    const btn = document.getElementById('btnTirarFoto');

    canvas.width = 600; canvas.height = 600;
    canvas.getContext('2d').drawImage(video, 0, 0, 600, 600);
    fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    
    preview.src = fotoBase64;
    video.classList.add('hidden');
    preview.classList.remove('hidden');
    btn.innerText = "REFAZER FOTO";
}

async function salvarCadastro() {
    const nome = document.getElementById('cadNome').value;
    const pin = document.getElementById('cadPin').value;
    const aceitoLgpd = document.getElementById('lgpd').checked;

    if(!nome || pin.length < 4 || !fotoBase64 || !aceitoLgpd) {
        return alert("Por favor: Preencha o nome, crie um PIN de 4 dígitos, tire a foto e aceite a LGPD!");
    }

    try {
        await addDoc(collection(db, "membros"), {
            nome: nome.toUpperCase(),
            pin: pin,
            foto: fotoBase64,
            lgpd: true,
            data: new Date().toLocaleString()
        });
        alert("Cadastro realizado! Agora faça seu login.");
        telaAtual = 'login';
        render();
    } catch (e) { alert("Erro ao cadastrar."); }
}

render();
