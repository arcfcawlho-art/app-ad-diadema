import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDxucjJzhq_JYBgL4d_2WLEsmVu_eKllIs",
  authDomain: "app-add-diadema.firebaseapp.com",
  projectId: "app-add-diadema",
  storageBucket: "app-add-diadema.firebasestorage.app",
  messagingSenderId: "618584991265",
  appId: "1:618584991265:web:f2432bb1268986d7aa2568",
  databaseURL: "https://app-add-diadema-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
