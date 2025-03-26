import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-VESocPCHcbWYjMhB690IcgwkcayqGdA",
  authDomain: "task-manager-604fe.firebaseapp.com",
  projectId: "task-manager-604fe",
  storageBucket: "task-manager-604fe.firebasestorage.app",
  messagingSenderId: "669376625556",
  appId: "1:669376625556:web:82fb70049f2bafad80ad81",
  measurementId: "G-3F5WYHDLYL"
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
