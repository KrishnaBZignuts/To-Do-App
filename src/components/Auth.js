"use client";
import { useEffect } from "react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Auth() {
  const [user] = useAuthState(auth);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Task Manager</h1>
      {user ? (
        <div className="flex gap-4">
          <span>{user.displayName}</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={login} className="bg-blue-500 px-3 py-1 rounded">
          Login with Google
        </button>
      )}
    </div>
  );
}
