/**
 * Simulator.jsx
 * What-If dark SaaS modal for real-time what-if financial simulations.
 */
import React, { useState, useEffect } from "react";
import { riskAPI } from "../api";

const Sparkle = ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 0C12 0 13.5 9 14.5 10.5C15.5 12 24 12 24 12C24 12 15.5 12 14.5 13.5C13.5 15 12 24 12 24C12 24 10.5 15 9.5 13.5C8.5 12 0 12 0 12C0 12 8.5 12 9.5 10.5C10.5 9 12 0 12 0Z" />
    </svg>
);

export default function Simulator({ baseData, onClose }) {
    const [incomeAdj, setIncomeAdj] = useState(0);
    const [expenseAdj, setExpenseAdj] = useState(0);
    const [emiAdj, setEmiAdj] = useState(0);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        try {
            const res = await riskAPI.simulate({
                ...baseData,
                adjustIncomePercent: incomeAdj,
                adjustExpensePercent: expenseAdj,
                adjustEMI: emiAdj,
            });
            setResult(res.data);
        } catch {/* ignore */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { run(); }, [incomeAdj, expenseAdj, emiAdj]);

    const adjusted = {
        income: Math.round(baseData.income * (1 + incomeAdj / 100)),
        expenses: Math.round(baseData.expenses * (1 + expenseAdj / 100)),
        emi: baseData.emi + emiAdj,
    };

    const scoreColor = !result ? "#888" :
        result.riskScore <= 30 ? "#22c55e" :
            result.riskScore <= 60 ? "#f59e0b" : "#ef4444";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative bg-[#0e0e0e] border border-white/[0.10] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <Sparkle size={14} className="text-white/40" />
                        <div>
                            <h2 className="text-white font-bold text-sm">What-If Simulator</h2>
                            <p className="text-[#555] text-xs">Adjust sliders to see real-time impact</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#555] hover:text-white hover:border-white/30 transition-all">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Sliders */}
                    {[
                        { label: "Income Adjustment", value: incomeAdj, set: setIncomeAdj, min: -50, max: 50, unit: "%", suffix: incomeAdj >= 0 ? `+${incomeAdj}%` : `${incomeAdj}%` },
                        { label: "Expense Adjustment", value: expenseAdj, set: setExpenseAdj, min: -50, max: 50, unit: "%", suffix: expenseAdj >= 0 ? `+${expenseAdj}%` : `${expenseAdj}%` },
                        { label: "EMI Change (₹/mo)", value: emiAdj, set: setEmiAdj, min: -50000, max: 50000, unit: "₹", suffix: emiAdj >= 0 ? `+₹${emiAdj.toLocaleString()}` : `-₹${Math.abs(emiAdj).toLocaleString()}` },
                    ].map(({ label, value, set, min, max, suffix }) => (
                        <div key={label}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[#888] text-xs uppercase tracking-widest font-medium">{label}</label>
                                <span className="text-white text-xs font-bold">{suffix}</span>
                            </div>
                            <input
                                type="range" min={min} max={max} value={value}
                                onChange={(e) => set(Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                            />
                            <div className="flex justify-between text-[#333] text-[10px] mt-1">
                                <span>{min}{label.includes("₹") ? "" : "%"}</span>
                                <span>0</span>
                                <span>+{max}{label.includes("₹") ? "" : "%"}</span>
                            </div>
                        </div>
                    ))}

                    {/* Result */}
                    <div className="bg-[#141414] border border-white/[0.07] rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
                            {/* Score */}
                            <div className="p-5 flex flex-col items-center justify-center">
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <div
                                            className="text-4xl font-black mb-1"
                                            style={{ color: scoreColor }}
                                        >
                                            {result?.riskScore ?? "—"}
                                        </div>
                                        <p className="text-[#555] text-xs uppercase tracking-widest">Score</p>
                                        {result?.category && (
                                            <p className="text-xs font-semibold mt-1.5" style={{ color: scoreColor }}>
                                                {result.category}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Adjusted figures */}
                            <div className="p-5 space-y-2.5">
                                <p className="text-[#444] text-[10px] uppercase tracking-widest mb-3">Adjusted figures</p>
                                {[
                                    { label: "Income", val: `₹${adjusted.income.toLocaleString()}` },
                                    { label: "Expenses", val: `₹${adjusted.expenses.toLocaleString()}` },
                                    { label: "EMI", val: `₹${adjusted.emi.toLocaleString()}` },
                                ].map(({ label, val }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-[#555] text-xs">{label}</span>
                                        <span className="text-white text-xs font-semibold">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projection strip */}
                        {result?.projection && (
                            <div className="border-t border-white/[0.06] p-4">
                                <p className="text-[#444] text-[10px] uppercase tracking-widest mb-3">3-Month Savings Projection</p>
                                <div className="flex gap-3">
                                    {result.projection.map((v, i) => (
                                        <div key={i} className="flex-1 text-center">
                                            <p className="text-[#444] text-[10px] mb-1">Mo {i + 1}</p>
                                            <p className={`text-xs font-bold ${v >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                ₹{v.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggestions */}
                    {result?.suggestions?.length > 0 && (
                        <div className="space-y-2">
                            {result.suggestions.map((s, i) => (
                                <div key={i} className="flex gap-2.5 text-xs text-[#666] bg-[#141414] border border-white/[0.05] rounded-xl px-4 py-3">
                                    <span className="text-amber-500 shrink-0">→</span>
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
