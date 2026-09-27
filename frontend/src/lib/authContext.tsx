"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, setAccessToken } from "@/lib/apiClient";
import type { AuthResponse, User } from "@/types/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: any) => Promise<User>;
  logout: () => Promise<void>;
  quickLogin: (role: "admin" | "trainer" | "trainee") => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  admin: { email: "admin@capacity-connect.example", password: "AdminPassword123!" },
  trainer: { email: "rajesh.sharma@capacity-connect.example", password: "TrainerPassword123!" },
  trainee: { email: "arun.kumar@capacity-connect.example", password: "TraineePassword123!" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("cc_token") : null;
      if (storedToken) {
        setAccessToken(storedToken);
      }
      try {
        const currentUser = await apiClient<User>("/auth/me");
        setUser(currentUser);
      } catch (err) {
        // Clear expired token
        setAccessToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("cc_token");
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleAuthSuccess = (res: AuthResponse): User => {
    setAccessToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("cc_token", res.access_token);
    }
    setUser(res.user);
    return res.user;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return handleAuthSuccess(res);
  };

  const register = async (payload: any): Promise<User> => {
    const res = await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return handleAuthSuccess(res);
  };

  const logout = async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (_) {
      // Ignore network errors on logout
    }
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cc_token");
    }
    setUser(null);
    router.push("/");
  };

  const quickLogin = async (role: "admin" | "trainer" | "trainee"): Promise<User> => {
    const creds = DEMO_CREDENTIALS[role];
    const loggedUser = await login(creds.email, creds.password);
    if (loggedUser.role === "admin") {
      router.push("/admin/dashboard");
    } else if (loggedUser.role === "trainer") {
      router.push("/trainer/dashboard");
    } else {
      router.push("/trainee/dashboard");
    }
    return loggedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
