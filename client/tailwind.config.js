/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                // Minimal B&W fintech palette
                bg: {
                    primary: "#0a0a0a",
                    secondary: "#111111",
                    card: "#161616",
                    elevated: "#1c1c1c",
                },
                border: {
                    subtle: "#252525",
                    default: "#333333",
                    strong: "#444444",
                },
                text: {
                    primary: "#f0f0f0",
                    secondary: "#a0a0a0",
                    muted: "#616161",
                },
                accent: {
                    white: "#ffffff",
                    gray: "#888888",
                },
                status: {
                    safe: "#22c55e",
                    warning: "#f59e0b",
                    danger: "#ef4444",
                },
            },
            animation: {
                "fade-in": "fadeIn 0.4s ease-out",
                "slide-up": "slideUp 0.4s ease-out",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
                slideUp: {
                    "0%": { opacity: 0, transform: "translateY(12px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
