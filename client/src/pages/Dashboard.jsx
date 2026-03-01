/**
 * Dashboard.jsx — Dark SaaS analysis page.
 * Single/Family tab · Input form · Results (RiskMeter + Chart + Suggestions) · History.
 */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RiskMeter from "../components/RiskMeter";
import ProjectionChart from "../components/ProjectionChart";
import Simulator from "../components/Simulator";
import FamilyMode from "../components/FamilyMode";
import { riskAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/* ── Sparkle SVG ── */
const Sparkle = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 0C12 0 13.5 9 14.5 10.5C15.5 12 24 12 24 12C24 12 15.5 12 14.5 13.5C13.5 15 12 24 12 24C12 24 10.5 15 9.5 13.5C8.5 12 0 12 0 12C0 12 8.5 12 9.5 10.5C10.5 9 12 0 12 0Z" />
    </svg>
);

/* ── Preset demo scenarios ── */
const SCENARIOS = [
    { label: "Safe", color: "#22c55e", data: { memberName: "Alice", income: 10000, expenses: 5000, emi: 1500, creditUtilization: 0.2, savings: 40000 } },
    { label: "Warning", color: "#f59e0b", data: { memberName: "Carol", income: 5000, expenses: 4300, emi: 1667, creditUtilization: 0.55, savings: 8000 } },
    { label: "High Risk", color: "#ef4444", data: { memberName: "Eve", income: 3333, expenses: 3750, emi: 1500, creditUtilization: 0.85, savings: 2000 } },
];

const DEFAULT_FORM = { memberName: "", income: "", expenses: "", emi: "", creditUtilization: "", savings: "" };

/* ── Stat row ── */
const StatRow = ({ label, value, note, color }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
        <span className="text-[#555] text-xs">{label}</span>
        <div className="text-right">
            <span className="text-white text-sm font-semibold" style={color ? { color } : {}}>{value}</span>
            {note && <p className="text-[#333] text-[10px]">{note}</p>}
        </div>
    </div>
);

/* ── Category helpers ── */
const categoryBadge = (cat) => {
    if (cat === "Safe") return "badge-safe";
    if (cat === "Warning") return "badge-warning";
    return "badge-danger";
};
const scoreColor = (s) => s <= 30 ? "#22c55e" : s <= 60 ? "#f59e0b" : "#ef4444";

/* ═══════════════════════════════
   MAIN COMPONENT
═══════════════════════════════ */
export default function Dashboard() {
    const { user } = useAuth();
    const [tab, setTab] = useState("single");
    const [form, setForm] = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [showSim, setShowSim] = useState(false);
    const [history, setHistory] = useState([]);
    const [histSearch, setHistSearch] = useState("");
    const [histLoading, setHistLoad] = useState(false);
    const [familyResults, setFamilyR] = useState([]);

    const fetchHistory = async (search = "") => {
        setHistLoad(true);
        try {
            const res = await riskAPI.getHistory(search || undefined);
            setHistory(res.data.records || []);
        } catch { setHistory([]); } finally { setHistLoad(false); }
    };

    useEffect(() => { fetchHistory(); }, [result]);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const applyScenario = (data) => {
        setForm({
            memberName: data.memberName, income: String(data.income), expenses: String(data.expenses),
            emi: String(data.emi), creditUtilization: String(data.creditUtilization), savings: String(data.savings)
        });
        setResult(null); setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(""); setLoading(true);
        try {
            const payload = {
                memberName: form.memberName, income: Number(form.income), expenses: Number(form.expenses),
                emi: Number(form.emi), creditUtilization: Number(form.creditUtilization), savings: Number(form.savings)
            };
            const res = await riskAPI.calculateRisk(payload);
            setResult(res.data);
        } catch (err) { setError(err?.response?.data?.message || "Calculation failed."); }
        finally { setLoading(false); }
    };

    const handleFamily = async (members) => {
        const results = [];
        for (const m of members) {
            try { const r = await riskAPI.calculateRisk(m); results.push({ name: m.memberName, ...r.data }); }
            catch { results.push({ name: m.memberName, error: true }); }
        }
        setFamilyR(results); fetchHistory();
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <Navbar />

            {/* Simulator overlay */}
            {showSim && result && (
                <Simulator
                    baseData={{
                        memberName: form.memberName, income: Number(form.income), expenses: Number(form.expenses),
                        emi: Number(form.emi), creditUtilization: Number(form.creditUtilization), savings: Number(form.savings)
                    }}
                    onClose={() => setShowSim(false)}
                />
            )}

            <div className="max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-20">

                {/* Page header */}
                <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkle size={12} className="text-white/30" />
                            <span className="text-[#444] text-xs uppercase tracking-widest font-medium">Financial Analysis</span>
                        </div>
                        <h1 className="text-3xl font-black text-white">Risk Dashboard</h1>
                        <p className="text-[#444] text-sm mt-1">
                            Welcome back, <span className="text-white/70">{user?.name}</span>. Enter your monthly figures below.
                        </p>
                    </div>
                </div>

                {/* Tab toggle */}
                <div className="flex items-center gap-1 p-1 bg-[#111] border border-white/[0.07] rounded-full mb-10 w-fit">
                    {["single", "family"].map((t) => (
                        <button
                            key={t} onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-white text-black" : "text-[#555] hover:text-white"
                                }`}
                        >
                            {t === "single" ? "Single Member" : "👨‍👩‍👧 Family Mode"}
                        </button>
                    ))}
                </div>

                {/* ══ SINGLE TAB ══ */}
                {tab === "single" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left — input */}
                        <div className="space-y-5 animate-slide-up">
                            {/* Scenarios */}
                            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                                <p className="text-[#444] text-[10px] uppercase tracking-widest font-medium mb-3">Quick scenarios</p>
                                <div className="flex flex-wrap gap-2">
                                    {SCENARIOS.map((s) => (
                                        <button
                                            key={s.label} onClick={() => applyScenario(s.data)}
                                            className="text-xs border border-white/[0.08] rounded-full px-4 py-1.5 hover:border-white/20 transition-all"
                                            style={{ color: s.color }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                                <h2 className="font-bold text-white text-sm mb-5">Monthly Financial Data</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="form-label">Member Name</label>
                                        <input type="text" name="memberName" value={form.memberName} onChange={handleChange}
                                            className="input-field" placeholder="e.g. Alice" required />
                                    </div>

                                    {[
                                        { name: "income", label: "Monthly Income (₹)", step: "1", max: undefined },
                                        { name: "expenses", label: "Monthly Expenses (₹)", step: "1", max: undefined },
                                        { name: "emi", label: "Monthly EMI (₹)", step: "1", max: undefined },
                                        { name: "creditUtilization", label: "Credit Utilization (0–1)", step: "0.01", max: "1" },
                                        { name: "savings", label: "Current Savings (₹)", step: "1", max: undefined },
                                    ].map(({ name, label, step, max }) => (
                                        <div key={name}>
                                            <label className="form-label">{label}</label>
                                            <input type="number" name={name} value={form[name]} onChange={handleChange}
                                                className="input-field" placeholder="0" step={step} min="0" max={max} required />
                                        </div>
                                    ))}

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs">
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit" disabled={loading}
                                        className="btn-primary w-full disabled:opacity-40 mt-1">
                                        {loading ? "Calculating…" : "Calculate Risk →"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right — results */}
                        <div className="space-y-5 animate-slide-up">
                            {!result && !loading && (
                                <div className="bg-[#111] border border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-24 text-center">
                                    <Sparkle size={32} className="text-white/10 mb-5" />
                                    <p className="text-[#444] text-sm">Pick a scenario or enter data<br />to see your risk analysis.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="bg-[#111] border border-white/[0.07] rounded-2xl flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                                </div>
                            )}

                            {result && !loading && (
                                <>
                                    {/* Risk overview */}
                                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                                        <div className="flex items-start justify-between mb-5">
                                            <div>
                                                <h3 className="font-bold text-white text-sm">Risk Overview</h3>
                                                <p className="text-[#444] text-xs mt-0.5">{form.memberName}</p>
                                            </div>
                                            <span className={categoryBadge(result.category)}>{result.category}</span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <RiskMeter score={result.riskScore} category={result.category} />
                                            <div className="flex-1">
                                                <StatRow label="EMI Ratio" value={`${result.breakdown?.emiRatioPercent ?? 0}%`} note="Threshold: 35%" color={result.breakdown?.emiRatioPercent > 40 ? "#ef4444" : undefined} />
                                                <StatRow label="Credit Usage" value={`${result.breakdown?.creditUsagePercent ?? 0}%`} note="Ideal: <30%" color={result.breakdown?.creditUsagePercent > 80 ? "#ef4444" : undefined} />
                                                <StatRow label="Savings Buffer" value={`${result.breakdown?.savingsMonths ?? 0} mo`} note="Target: 3–6" color={result.breakdown?.savingsMonths < 2 ? "#f59e0b" : undefined} />
                                                <StatRow label="Savings Rate" value={`${result.breakdown?.savingsRatePercent ?? 0}%`} />
                                            </div>
                                        </div>

                                        <button onClick={() => setShowSim(true)} className="btn-secondary w-full mt-5 text-xs">
                                            🧪 Open What-If Simulator
                                        </button>
                                    </div>

                                    {/* Projection chart */}
                                    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-white text-sm">3-Month Savings Projection</h3>
                                            <span className="text-[#333] text-[10px] uppercase tracking-widest">Monthly model</span>
                                        </div>
                                        <ProjectionChart projection={result.projection} />
                                        <div className="flex justify-between mt-4">
                                            {result.projection?.map((v, i) => (
                                                <div key={i} className="text-center">
                                                    <p className="text-[#333] text-[10px]">Month {i + 1}</p>
                                                    <p className={`text-xs font-bold mt-0.5 ${v >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                        ₹{v?.toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    {result.suggestions?.length > 0 && (
                                        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                                            <h3 className="font-bold text-white text-sm mb-4">🤖 AI Suggestions</h3>
                                            <ul className="space-y-2.5">
                                                {result.suggestions.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#666] bg-[#141414] border border-white/[0.05] rounded-xl px-4 py-3">
                                                        <span className="text-amber-500 shrink-0 mt-0.5">→</span>{s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ══ FAMILY TAB ══ */}
                {tab === "family" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
                        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6">
                            <h2 className="font-bold text-white text-sm mb-1">Family Members</h2>
                            <p className="text-[#444] text-xs mb-5">Add 2–3 household members for a combined score.</p>
                            <FamilyMode onAnalyzeFamily={handleFamily} />
                        </div>

                        <div className="space-y-4">
                            {familyResults.length === 0 ? (
                                <div className="bg-[#111] border border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                                    <Sparkle size={28} className="text-white/10 mb-4" />
                                    <p className="text-[#444] text-sm">Add members and click<br />"Analyze family" to see results.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Combined score */}
                                    {(() => {
                                        const valid = familyResults.filter((r) => !r.error);
                                        const avg = valid.length ? Math.round(valid.reduce((a, r) => a + r.riskScore, 0) / valid.length) : 0;
                                        return (
                                            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 flex items-center gap-6">
                                                <RiskMeter score={avg} />
                                                <div>
                                                    <p className="text-[#444] text-xs mb-1">Combined household score</p>
                                                    <p className="text-white font-bold">{valid.length} member{valid.length > 1 ? "s" : ""} analyzed</p>
                                                    <p className="text-xs mt-1" style={{ color: scoreColor(avg) }}>
                                                        {avg <= 30 ? "✅ Safe" : avg <= 60 ? "⚠️ Warning" : "🔴 High Risk"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {familyResults.map((r, i) => (
                                        <div key={i} className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="font-semibold text-white text-sm">{r.name}</p>
                                                {r.error ? <span className="badge-danger">Error</span> : <span className={categoryBadge(r.category)}>{r.category}</span>}
                                            </div>
                                            {!r.error && (
                                                <>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <RiskMeter score={r.riskScore} category={r.category} />
                                                        <div className="flex-1"><ProjectionChart projection={r.projection} /></div>
                                                    </div>
                                                    {r.suggestions?.length > 0 && (
                                                        <ul className="space-y-1.5 mt-2">
                                                            {r.suggestions.map((s, si) => (
                                                                <li key={si} className="text-xs text-[#555] flex gap-2">
                                                                    <span className="text-amber-500 shrink-0">→</span>{s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ══ HISTORY ══ */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <Sparkle size={12} className="text-white/30" />
                            <h2 className="font-bold text-white">Assessment History</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text" value={histSearch}
                                onChange={(e) => setHistSearch(e.target.value)}
                                placeholder="Filter by name…"
                                className="input-field text-xs px-3 py-2 w-40"
                            />
                            <button onClick={() => fetchHistory(histSearch)} className="btn-secondary text-xs px-4 py-2">
                                Search
                            </button>
                        </div>
                    </div>

                    {histLoading ? (
                        <div className="text-[#333] text-sm text-center py-12">Loading…</div>
                    ) : history.length === 0 ? (
                        <div className="bg-[#111] border border-white/[0.07] rounded-2xl text-center py-12 text-[#333] text-sm">
                            No records yet. Run an assessment to build history.
                        </div>
                    ) : (
                        <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.06]">
                                            {["Member", "Income", "Expenses", "EMI", "Credit", "Savings", "Score", "Category", "Date"].map((h) => (
                                                <th key={h} className="text-left text-[#333] font-medium uppercase tracking-wide py-4 px-4 first:pl-6 last:pr-6">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((r) => (
                                            <tr key={r._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3.5 px-4 pl-6 text-white font-medium">{r.memberName}</td>
                                                <td className="py-3.5 px-4 text-[#555]">₹{r.income?.toLocaleString()}</td>
                                                <td className="py-3.5 px-4 text-[#555]">₹{r.expenses?.toLocaleString()}</td>
                                                <td className="py-3.5 px-4 text-[#555]">₹{r.emi?.toLocaleString()}</td>
                                                <td className="py-3.5 px-4 text-[#555]">{(r.creditUtilization * 100).toFixed(0)}%</td>
                                                <td className="py-3.5 px-4 text-[#555]">₹{r.savings?.toLocaleString()}</td>
                                                <td className="py-3.5 px-4 font-bold" style={{ color: scoreColor(r.riskScore) }}>{r.riskScore}</td>
                                                <td className="py-3.5 px-4"><span className={categoryBadge(r.category)}>{r.category}</span></td>
                                                <td className="py-3.5 px-4 pr-6 text-[#333]">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
