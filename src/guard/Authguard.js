"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthProvider"; 

const AuthGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (user === undefined) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>;
};

export default AuthGuard;
