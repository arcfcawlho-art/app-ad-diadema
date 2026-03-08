import { db } from "../config/firebase.js";
import { ref, update, get, onValue } from "firebase/database";

export const Database = {
    async salvar(path, dados) {
        return update(ref(db, path), { ...dados, updated: new Date().toISOString() });
    },
    async buscar(path) {
        const snap = await get(ref(db, path));
        return snap.exists() ? snap.val() : null;
    }
};