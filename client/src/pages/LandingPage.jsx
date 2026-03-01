/**
 * LandingPage.jsx
 * SEOtalos-style dark SaaS landing page for FinUp.
 * Sections: Hero · Features · Stats · Testimonials · FAQ · CTA · Footer
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";

/* ── Sparkle SVG ── */
const Sparkle = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 0C12 0 13.5 9 14.5 10.5C15.5 12 24 12 24 12C24 12 15.5 12 14.5 13.5C13.5 15 12 24 12 24C12 24 10.5 15 9.5 13.5C8.5 12 0 12 0 12C0 12 8.5 12 9.5 10.5C10.5 9 12 0 12 0Z" />
    </svg>
);

/* ── Credit Card graphic ── */
const CreditCard = ({ bg, rotate, zIndex, chip = "#777", last4, name, expiry = "12/28", translateX = 0, translateY = 0 }) => (
    <div
        className="absolute w-80 h-52 rounded-2xl p-6 flex flex-col justify-between"
        style={{
            background: bg,
            transform: `rotate(${rotate}deg) translateX(${translateX}px) translateY(${translateY}px)`,
            zIndex,
            boxShadow: "0 0 40px 8px rgba(255,255,255,0.07), 0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.10)",
        }}
    >
        {/* Top row */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
                <Logo size={14} color="rgba(255,255,255,0.6)" />
                <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase">FinUp</span>
            </div>
            {/* Dual-circle network logo */}
            <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-white/20" style={{ marginRight: "-6px" }} />
                <div className="w-5 h-5 rounded-full bg-white/10" />
            </div>
        </div>

        {/* EMV Chip */}
        <div
            className="w-8 h-6 rounded-sm"
            style={{
                background: chip,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(0,0,0,0.15) 5px, rgba(0,0,0,0.15) 6px)`,
            }}
        />

        {/* Card number */}
        <p className="text-white/60 text-[10px] tracking-[0.25em] font-mono">•••• •••• •••• {last4}</p>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
            <div>
                <p className="text-white/30 text-[7px] uppercase tracking-widest mb-0.5">Card Holder</p>
                <p className="text-white/70 text-[10px] font-semibold tracking-wide">{name}</p>
            </div>
            <div className="text-right">
                <p className="text-white/30 text-[7px] uppercase tracking-widest mb-0.5">Expires</p>
                <p className="text-white/70 text-[10px] font-semibold">{expiry}</p>
            </div>
        </div>
    </div>
);


/* ── Feature card ── */
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 hover:border-white/15 hover:bg-[#141414] transition-all duration-300 group">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl mb-4 group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
        <p className="text-[#666] text-xs leading-relaxed">{desc}</p>
    </div>
);

/* ── Testimonial card ── */
const TestimonialCard = ({ quote, name, role }) => (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <span key={i} className="text-white/80 text-sm">★</span>)}
        </div>
        <p className="text-[#aaa] text-sm leading-relaxed flex-1">"{quote}"</p>
        <div>
            <p className="text-white font-semibold text-sm">{name}</p>
            <p className="text-[#555] text-xs">{role}</p>
        </div>
    </div>
);

/* ── FAQ Item ── */
const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/[0.07]">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left">
                <span className="text-white font-medium text-sm pr-4">{q}</span>
                <span className={`text-[#666] text-lg shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && <p className="text-[#666] text-sm leading-relaxed pb-5 animate-fade-in">{a}</p>}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function LandingPage() {
    const FEATURES = [
        { icon: "⚡", title: "4-Rule Risk Engine", desc: "Composite 0–100 score combining EMI burden, overspending, credit utilisation, and savings buffer into a single actionable number." },
        { icon: "📈", title: "3-Month Projection", desc: "Projects your savings trajectory month-by-month using a live cash-flow model visualised with an interactive Recharts line chart." },
        { icon: "🎚️", title: "What-If Simulator", desc: "Drag sliders to simulate income hikes, expense cuts, or EMI changes. Watch your risk score update in real time instantly." },
        { icon: "👨‍👩‍👧", title: "Family Mode", desc: "Add up to 3 household members, run individual assessments, and see a combined holistic household financial health score." },
        { icon: "🤖", title: "AI Suggestions", desc: "Receive specific, actionable interventions — not generic advice — based on your exact financial figures." },
        { icon: "🔒", title: "Zero Bank Access", desc: "No bank APIs, no account linking, no third-party data sharing. All analysis runs on figures you enter. 100% private." },
    ];

    const TESTIMONIALS = [
        { quote: "I used to think we were doing fine financially. FinUp showed our savings buffer was only 1.2 months. That woke us up.", name: "Riya Mehta", role: "Software Engineer, Bengaluru" },
        { quote: "The what-if simulator helped us decide to refinance. Risk score dropped from 72 to 38 in one change.", name: "Arjun Kapoor", role: "Business Owner, Delhi" },
        { quote: "Family mode was a game changer. We can now see our combined score and act as a household unit.", name: "Priya & Sanjay S.", role: "Household, Chennai" },
    ];

    const FAQS = [
        { q: "What is FinUp?", a: "FinUp (Silent Household Financial Crisis Detector) is an AI-powered tool that scores your household's financial risk on a 0–100 scale based on income, expenses, EMI, credit usage, and savings — giving you an early warning before a crisis escalates." },
        { q: "Do you connect to my bank account?", a: "No. FinUp never connects to any bank APIs or financial accounts. You manually enter your monthly figures. Your data stays on your device and your private MongoDB instance." },
        { q: "How is the risk score calculated?", a: "The 4-rule engine adds points for: EMI > 40% of income (+30), expenses exceeding income (+40), credit utilisation > 80% (+30), and savings covering less than 2 months of expenses (+20). Total is capped at 100." },
        { q: "What does the 3-month projection show?", a: "It models your projected savings balance at the end of each of the next 3 months based on your current monthly cash flow (income − expenses − EMI). A downward trend signals a silent crisis even if your current score looks safe." },
        { q: "Is this free to use?", a: "Yes — fully free for the AMD Slingshot Hackathon MVP. Run it locally with Node.js and MongoDB in under 5 minutes." },
    ];

    const STATS = [
        { value: "4-Rule", label: "Risk Engine" },
        { value: "3-Month", label: "Projection" },
        { value: "0", label: "Bank Connections" },
        { value: "100%", label: "Data Private" },
    ];

    return (
        <div className="bg-[#080808] text-white font-sans overflow-x-hidden">
            <Navbar />

            {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 md:px-10 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
                {/* Blobs */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
                {/* Sparkles */}
                <Sparkle size={48} className="absolute top-28 right-[10%] text-white/20" />
                <Sparkle size={24} className="absolute top-48 right-[25%] text-white/10" />
                <Sparkle size={16} className="absolute bottom-40 right-[18%] text-white/8" />
                <Sparkle size={20} className="absolute top-1/2 left-8 text-white/8" />

                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* ── Left: copy ── */}
                        <div className="animate-slide-up">
                            {/* Badge */}
                            <div className="eyebrow mb-7 w-fit">
                                <Sparkle size={10} className="text-white/60" />
                                AMD Slingshot Hackathon 2026
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
                                Detect your<br />
                                household's{" "}
                                <span className="text-white/40 font-light italic">Financial</span>
                                <br />
                                Crisis.{" "}
                                <span className="text-white/40 font-light italic">Early.</span>
                            </h1>

                            <p className="text-[#666] text-base md:text-lg leading-relaxed mb-8 max-w-md">
                                AI-powered household risk scoring, 3-month savings projection, and
                                family health analysis — without connecting to any bank.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link to="/register" className="btn-primary text-sm px-7 py-3.5">
                                    Start Free Analysis →
                                </Link>
                                <Link to="/login" className="btn-outline text-sm px-7 py-3.5">
                                    Sign in
                                </Link>
                            </div>
                        </div>

                        {/* ── Right: stacked credit cards ── */}
                        <div className="relative hidden lg:flex items-center justify-center" style={{ height: "420px" }}>

                            {/* Deep white glow — far back */}
                            <div className="absolute" style={{ width: 320, height: 200, background: "radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(32px)", zIndex: 0 }} />

                            {/* Card 1 — deep black, back-left */}
                            <CreditCard
                                bg="linear-gradient(135deg, #161616 0%, #080808 100%)"
                                rotate={-18}
                                translateX={-55}
                                translateY={30}
                                zIndex={1}
                                chip="#555"
                                last4="8823"
                                name="ALICE SHARMA"
                                expiry="11/27"
                            />

                            {/* Mid glow — between card 1 and 2 */}
                            <div className="absolute" style={{ width: 180, height: 120, background: "radial-gradient(ellipse, rgba(255,255,255,0.10) 0%, transparent 70%)", top: "45%", left: "38%", transform: "translate(-50%,-50%)", filter: "blur(20px)", zIndex: 2 }} />

                            {/* Card 2 — mid grey, back-right */}
                            <CreditCard
                                bg="linear-gradient(135deg, #4e4e4e 0%, #2a2a2a 100%)"
                                rotate={14}
                                translateX={55}
                                translateY={-15}
                                zIndex={3}
                                chip="#aaa"
                                last4="4291"
                                name="BOB MEHTA"
                                expiry="03/29"
                            />

                            {/* Mid glow — between card 2 and 3 */}
                            <div className="absolute" style={{ width: 160, height: 100, background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)", top: "42%", left: "60%", transform: "translate(-50%,-50%)", filter: "blur(16px)", zIndex: 4 }} />

                            {/* Card 3 — dark grey, front/center */}
                            <CreditCard
                                bg="linear-gradient(135deg, #333333 0%, #1c1c1c 100%)"
                                rotate={-4}
                                translateX={0}
                                translateY={8}
                                zIndex={5}
                                chip="#999"
                                last4="1957"
                                name="CAROL VERMA"
                                expiry="08/28"
                            />

                            {/* Front glow — just behind front card */}
                            <div className="absolute" style={{ width: 260, height: 160, background: "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 65%)", top: "52%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(24px)", zIndex: 4 }} />
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-10 border-t border-white/[0.05]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="eyebrow mb-5 w-fit">
                            <Sparkle size={10} className="text-white/60" />
                            Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">
                            Risk Engine That
                            <br />
                            <span className="text-white/40 font-light italic">Delivers Real Insights</span>
                        </h2>
                        <p className="text-[#555] text-sm mt-4 max-w-md leading-relaxed">
                            Our proven 4-rule methodology helps you detect financial stress faster than ever,
                            with no bank connections required.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-10 border-t border-white/[0.05] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0a0a] pointer-events-none" />
                <Sparkle size={80} className="absolute top-8 right-12 text-white/[0.03]" />
                <Sparkle size={40} className="absolute bottom-12 left-8 text-white/[0.03]" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="eyebrow mb-5 w-fit">
                                <Sparkle size={10} className="text-white/60" />
                                Our Achievements
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                                Proven Risk Detection
                                <br />
                                <span className="text-white/40 font-light italic">You Can Trust</span>
                            </h2>
                            <p className="text-[#555] text-sm leading-relaxed max-w-sm">
                                From individuals to households, we've helped detect financial crises
                                before they become irreversible.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {STATS.map((s) => (
                                <div key={s.label} className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                                    <p className="text-4xl font-black text-white mb-1">{s.value}</p>
                                    <p className="text-[#555] text-xs uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-10 border-t border-white/[0.05]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="eyebrow mb-5 w-fit mx-auto">
                            <Sparkle size={10} className="text-white/60" />
                            Testimonials
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">
                            What People Say
                            <br />
                            <span className="text-white/40 font-light italic">About Us</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-10 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="eyebrow mb-5 w-fit mx-auto">
                            <Sparkle size={10} className="text-white/60" />
                            FAQ
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">
                            Your Questions
                            <br />
                            <span className="text-white/40 font-light italic">Answered</span>
                        </h2>
                    </div>
                    <div>
                        {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          CTA STRIP
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-6 md:px-10 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto text-center">
                    <Sparkle size={40} className="text-white/20 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Start detecting today.</h2>
                    <p className="text-[#555] text-sm mb-8">Free. No bank connection. 5-minute setup.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/register" className="btn-primary text-sm px-8 py-3.5">
                            Start Free Analysis →
                        </Link>
                        <Link to="/login" className="btn-outline text-sm px-8 py-3.5">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
            <footer className="border-t border-white/[0.05] px-6 md:px-10 pt-14 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Logo size={22} color="white" />
                                <span className="font-bold text-white">FinUp</span>
                            </div>
                            <p className="text-[#444] text-xs leading-relaxed">
                                Silent Household Financial Crisis Detector. AMD Slingshot 2026.
                            </p>
                        </div>

                        {[
                            { heading: "Features", links: ["Risk Scoring", "3-Month Projection", "Family Mode", "Simulator"] },
                            { heading: "Product", links: ["How It Works", "Demo Scenarios", "Privacy Policy", "GitHub"] },
                        ].map(({ heading, links }) => (
                            <div key={heading}>
                                <p className="text-[#333] text-[10px] uppercase tracking-widest font-semibold mb-4">{heading}</p>
                                <ul className="space-y-2.5">
                                    {links.map((l) => (
                                        <li key={l}><a href="#" className="text-[#444] text-xs hover:text-white transition-colors">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div>
                            <p className="text-[#333] text-[10px] uppercase tracking-widest font-semibold mb-4">Quick Start</p>
                            <div className="space-y-2">
                                <Link to="/register" className="block text-center text-xs font-semibold bg-white text-black rounded-full px-4 py-2.5 hover:bg-gray-100 transition-colors">
                                    Create account →
                                </Link>
                                <Link to="/login" className="block text-center text-xs border border-white/[0.12] text-[#666] rounded-full px-4 py-2.5 hover:text-white hover:border-white/25 transition-colors">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-[#333] text-xs">© 2026 FinUp · Human Imagination Built with AI</p>
                        <p className="text-[#333] text-xs">No real financial data used · Demo purposes only</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
