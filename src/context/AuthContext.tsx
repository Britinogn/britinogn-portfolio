// src/context/AuthProvider.tsx
import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "../hooks/useAuth";
import { User } from "../types";
import {
    setToken as saveToken,
    setUser as saveUser,
    logout as clearAuth,
} from "../services/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    function login(newToken: string, newUser: User) {
        saveToken(newToken);
        saveUser(newUser);
        setToken(newToken);
        setUser(newUser);
    }

    function logout() {
        clearAuth();
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            loading,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}
