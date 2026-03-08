import { db } from "../config/firebase.js";
import { ref, update, get, onValue } from "firebase/database";

export const Database = {
    // Função para salvar sem apagar dados antigos (Seguro para LGPD e PIN)
    async salvar(path, dados) {
        return update(ref(db, path), { 
            ...dados, 
            ultimaAtualizacao: new Date().toISOString() 
        });
    },
    // Função para buscar dados
    async buscar(path) {
        const snapshot = await get(ref(db, path));
        return snapshot.exists() ? snapshot.val() : null;
    }
};
