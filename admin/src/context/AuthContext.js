"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      checkAuth(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (authToken) => {
    console.log("Checking auth with token:", authToken);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Auth check response:", res.status);
      setIsAuthenticated(res.ok);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = (authToken) => {
    console.log("Setting token:", authToken);
    setToken(authToken);
    localStorage.setItem('adminToken', authToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
