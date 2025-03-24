
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNxpuhZD2VcgKriyCamAaMuVEnRv0azpM",
  authDomain: "to-do-app-73ab2.firebaseapp.com",
  projectId: "to-do-app-73ab2",
  storageBucket: "to-do-app-73ab2.firebasestorage.app",
  messagingSenderId: "175934665235",
  appId: "1:175934665235:web:e3dcb9a81f6461d70245e6",
  measurementId: "G-TZH3V93C90"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

const tasksCollection = collection(db, "tasks");
export { app, analytics, tasksCollection };