import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNxpuhZD2VcgKriyCamAaMuVEnRv0azpM",
  authDomain: "to-do-app-73ab2.firebaseapp.com",
  projectId: "to-do-app-73ab2",
  storageBucket: "to-do-app-73ab2.appspot.com", 
  messagingSenderId: "175934665235",
  appId: "1:175934665235:web:e3dcb9a81f6461d70245e6",
  measurementId: "G-TZH3V93C90",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const db = getFirestore(app);
export const tasksCollection = collection(db, "tasks");
export const userCollection = collection(db, "user");

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, analytics };
