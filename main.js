import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

function renderizar() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <img src="logo.png" alt="AD Diadema" class="w-32 h-32 mb-4 object-contain">
            
            <div class="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl">
                <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Ficha de Membro</h2>
                
                <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden mb-4 shadow-inner">
                    <video id="video" autoplay playsinline class="w-full h-full object-cover"></video>
                    <canvas id="canvas" class="hidden"></canvas>
                    <img id="fotoPreview" class="hidden w-full h-full object-cover">
                </div>

                <button id="btnFoto" class="w-full mb-6 flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl font-bold">
                    <span class="material-icons">photo_camera</span> TIRAR FOTO
                </button>

                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-bold text-gray-600 ml-1">NOME COMPLETO</label>
                        <input type="text" id="nome" class="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Nome do membro">
                    </div>

                    <button id="btnSalvar" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95">
                        FINALIZAR CADASTRO
                    </button>
                    <p id="status" class="text-center font-medium"></p>
                </div>
            </div>
        </div>
    `;

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const fotoPreview = document.getElementById('fotoPreview');
    const btnFoto = document.getElementById('btnFoto');
    let fotoBase64 = null;

    // Ligar Câmera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "portrait" } })
        .then(stream => { video.srcObject = stream; })
        .catch(err => { console.error("Erro câmera:", err); });

    // Tirar Foto
    btnFoto.onclick = () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        fotoBase64 = canvas.toDataURL('image/jpeg');
        fotoPreview.src = fotoBase64;
        
        video.classList.add('hidden');
        fotoPreview.classList.remove('hidden');
        btnFoto.innerHTML = '<span class="material-icons">refresh</span> TIRAR OUTRA FOTO';
    };

    // Salvar
    document.getElementById('btnSalvar').onclick = async () => {
        const nome = document.getElementById('nome').value;
        const status = document.getElementById('status');

        if (!nome || !fotoBase64) {
            alert("Por favor, preencha o nome e tire uma foto!");
            return;
        }

        status.innerText = "Enviando para a secretaria...";
        status.className = "text-blue-600 animate-pulse mt-4";

        try {
            await addDoc(collection(db, "membros"), {
                nome: nome,
                foto: fotoBase64,
                data: new Date().toLocaleString("pt-BR")
            });
            status.innerText = "✅ Cadastro realizado com sucesso!";
            status.className = "text-green-600 font-bold mt-4";
            setTimeout(() => location.reload(), 3000);
        } catch (e) {
            status.innerText = "❌ Erro ao salvar.";
            status.className = "text-red-600 mt-4";
        }
    };
}

renderizar();
