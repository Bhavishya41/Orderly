"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status by calling a protected endpoint
    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          credentials: "include", // send cookies
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
