/**
 * api.js
 * Axios instance with Authorization header injection.
 * All API calls go through this file.
 */
import axios from "axios";

const BASE_URL = "/api"; // Vite proxy handles http://localhost:5000

/** Returns the stored JWT or empty string */
const getToken = () => localStorage.getItem("shfcd_token") || "";

/** Creates an axios instance with auth header */
const authAxios = () =>
    axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

// ── Auth API ──────────────────────────────────────
export const authAPI = {
    register: (data) => axios.post(`${BASE_URL}/auth/register`, data),
    login: (data) => axios.post(`${BASE_URL}/auth/login`, data),
    getMe: (token) =>
        axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

// ── Risk API ──────────────────────────────────────
export const riskAPI = {
    calculateRisk: (data) => authAxios().post("/calculate-risk", data),
    simulate: (data) => authAxios().post("/simulate", data),
    getHistory: (memberName) =>
        authAxios().get("/history", {
            params: memberName ? { memberName } : {},
        }),
};

export default authAxios;
