/**
 * FamilyMode.jsx — Dark SaaS family members input panel.
 * Allows adding up to 3 household members for combined analysis.
 */
import React, { useState } from "react";

const EMPTY_MEMBER = {
    memberName: "", income: "", expenses: "",
    emi: "", creditUtilization: "", savings: "",
};

export default function FamilyMode({ onAnalyzeFamily }) {
    const [members, setMembers] = useState([{ ...EMPTY_MEMBER }]);

    const addMember = () => {
        if (members.length < 3) setMembers([...members, { ...EMPTY_MEMBER }]);
    };

    const removeMember = (i) => setMembers(members.filter((_, idx) => idx !== i));

    const handleChange = (i, field, value) => {
        const updated = [...members];
        updated[i] = { ...updated[i], [field]: value };
        setMembers(updated);
    };

    const handleSubmit = () => {
        const parsed = members.map((m) => ({
            memberName: m.memberName,
            income: Number(m.income),
            expenses: Number(m.expenses),
            emi: Number(m.emi),
            creditUtilization: Number(m.creditUtilization),
            savings: Number(m.savings),
        }));
        onAnalyzeFamily(parsed);
    };

    const FIELDS = [
        { key: "income", label: "Monthly Income (₹)" },
        { key: "expenses", label: "Monthly Expenses (₹)" },
        { key: "emi", label: "Monthly EMI (₹)" },
        { key: "creditUtilization", label: "Credit Util. (0–1)" },
        { key: "savings", label: "Savings (₹)" },
    ];

    return (
        <div className="space-y-5">
            {members.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/[0.10] flex items-center justify-center text-[10px] font-bold text-white">
                                {i + 1}
                            </div>
                            <span className="text-white text-xs font-semibold">Member {i + 1}</span>
                        </div>
                        {members.length > 1 && (
                            <button
                                onClick={() => removeMember(i)}
                                className="text-[#444] hover:text-red-400 text-xs transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input
                                type="text" value={m.memberName}
                                onChange={(e) => handleChange(i, "memberName", e.target.value)}
                                className="input-field" placeholder="e.g. Alice" required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {FIELDS.map(({ key, label }) => (
                                <div key={key}>
                                    <label className="form-label">{label}</label>
                                    <input
                                        type="number" value={m[key]} min="0" step="1"
                                        onChange={(e) => handleChange(i, key, e.target.value)}
                                        className="input-field" placeholder="0" required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3">
                {members.length < 3 && (
                    <button onClick={addMember} className="btn-secondary flex-1 text-xs">
                        + Add member
                    </button>
                )}
                <button onClick={handleSubmit} className="btn-primary flex-1 text-xs">
                    Analyze family →
                </button>
            </div>
        </div>
    );
}
