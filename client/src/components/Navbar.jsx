/**
 * Navbar.jsx — Dark transparent navbar that solidifies on scroll.
 * Logo left · Sign in + Get Started right.
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate("/"); };

    // On dashboard always show solid
    const solid = scrolled || location.pathname !== "/";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid
                ? "bg-[#080808]/95 backdrop-blur-md border-b border-white/[0.07]"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <Logo size={24} color="white" />
                    <span className="font-bold text-white text-base tracking-tight">FinUp</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-white/50 text-sm hidden sm:block">
                                {user.name}
                            </span>
                            <Link to="/dashboard" className="btn-outline text-xs px-4 py-2">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn-primary text-xs px-4 py-2">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
                                Sign in
                            </Link>
                            <Link to="/register" className="btn-primary text-xs px-5 py-2.5">
                                Get Started →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
