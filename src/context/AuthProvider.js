"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext(null); 

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
