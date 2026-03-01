/**
 * AuthContext.jsx
 * Global authentication state: stores user + JWT token,
 * provides login/register/logout functions.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("shfcd_token") || "");
    const [loading, setLoading] = useState(true);

    // On mount: try to restore session from stored token
    useEffect(() => {
        const init = async () => {
            if (token) {
                try {
                    const res = await authAPI.getMe(token);
                    setUser(res.data.user);
                } catch {
                    // Token expired or invalid — clear it
                    localStorage.removeItem("shfcd_token");
                    setToken("");
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    const register = async (name, email, password) => {
        const res = await authAPI.register({ name, email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem("shfcd_token", t);
        setToken(t);
        setUser(u);
        return u;
    };

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem("shfcd_token", t);
        setToken(t);
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.removeItem("shfcd_token");
        setToken("");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
