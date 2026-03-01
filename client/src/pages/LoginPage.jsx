/**
 * LoginPage.jsx — Dark glassmorphism auth page.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

// Sparkle SVG
const Sparkle = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 0C12 0 13.5 9 14.5 10.5C15.5 12 24 12 24 12C24 12 15.5 12 14.5 13.5C13.5 15 12 24 12 24C12 24 10.5 15 9.5 13.5C8.5 12 0 12 0 12C0 12 8.5 12 9.5 10.5C10.5 9 12 0 12 0Z" />
    </svg>
);

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            {/* Sparkle decoratives */}
            <Sparkle size={32} className="absolute top-20 left-16 text-white/10 animate-pulse" />
            <Sparkle size={20} className="absolute bottom-32 right-24 text-white/8 animate-pulse" style={{ animationDelay: "1s" }} />
            <Sparkle size={14} className="absolute top-1/3 right-16 text-white/6" />

            <div className="w-full max-w-sm relative z-10 animate-slide-up">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <Logo size={30} color="white" />
                        <span className="font-bold text-white text-lg">FinUp</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white text-center">Welcome back</h1>
                    <p className="text-[#666] text-sm mt-2 text-center">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-7">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                type="email" name="email" value={form.email} onChange={handleChange}
                                className="input-field" placeholder="you@example.com" required
                            />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input
                                type="password" name="password" value={form.password} onChange={handleChange}
                                className="input-field" placeholder="••••••••" required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-40">
                            {loading ? "Signing in…" : "Sign in →"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[#555] text-sm mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-white hover:underline">Create one →</Link>
                </p>
            </div>
        </div>
    );
}
