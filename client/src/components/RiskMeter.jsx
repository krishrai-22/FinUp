/**
 * RiskMeter.jsx
 * Circular SVG gauge displaying risk score 0-100.
 * Color bands: green (0-30), amber (31-60), red (61-100).
 */
import React from "react";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(score) {
    if (score <= 30) return "#22c55e";
    if (score <= 60) return "#f59e0b";
    return "#ef4444";
}

function getCategory(score) {
    if (score <= 30) return "Safe";
    if (score <= 60) return "Warning";
    return "High Risk";
}

export default function RiskMeter({ score = 0, category }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const offset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;
    const color = getColor(clampedScore);
    const cat = category || getCategory(clampedScore);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                {/* Background track */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        stroke="#252525"
                        strokeWidth="10"
                    />
                    {/* Progress arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
                    />
                </svg>

                {/* Score text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="text-3xl font-black"
                        style={{ color, transition: "color 0.5s ease" }}
                    >
                        {clampedScore}
                    </span>
                    <span className="text-[10px] text-[#616161] uppercase tracking-wider">
                        Score
                    </span>
                </div>
            </div>

            {/* Category badge */}
            <div className="mt-3 text-center">
                <span
                    className="text-sm font-semibold px-3 py-1 rounded-full border"
                    style={{
                        color,
                        borderColor: color + "33",
                        backgroundColor: color + "10",
                    }}
                >
                    {cat}
                </span>
            </div>
        </div>
    );
}
