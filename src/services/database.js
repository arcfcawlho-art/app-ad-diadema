import { db } from "../config/firebase.js";
import { ref, set, get, child } from "firebase/database";

export const Database = {
  async salvar(path, data) {
    try {
      await set(ref(db, path), data);
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  },
  async buscar(path) {
    try {
      const snapshot = await get(child(ref(db), path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return null;
    }
  }
};
