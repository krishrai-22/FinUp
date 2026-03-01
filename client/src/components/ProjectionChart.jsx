/**
 * ProjectionChart.jsx
 * Line chart showing 3-month savings projection using Recharts.
 * Dark theme, custom tooltip.
 */
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        return (
            <div className="bg-[#1c1c1c] border border-[#333] rounded-lg px-4 py-3 text-sm shadow-xl">
                <p className="text-[#a0a0a0] mb-1">{label}</p>
                <p
                    className="font-bold"
                    style={{ color: val >= 0 ? "#22c55e" : "#ef4444" }}
                >
                    ₹{val?.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function ProjectionChart({ projection = [] }) {
    if (!projection.length) {
        return (
            <div className="flex items-center justify-center h-48 text-[#616161] text-sm">
                No projection data yet. Calculate risk to see your 3-month outlook.
            </div>
        );
    }

    const data = projection.map((val, i) => ({
        month: `Month ${i + 1}`,
        savings: val,
    }));

    const minVal = Math.min(...projection);
    const maxVal = Math.max(...projection);
    const lineColor = minVal < 0 ? "#ef4444" : "#22c55e";

    return (
        <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#616161", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#616161", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        width={50}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Zero baseline */}
                    <ReferenceLine y={0} stroke="#444" strokeDasharray="4 2" />
                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke={lineColor}
                        strokeWidth={2.5}
                        dot={{ fill: lineColor, strokeWidth: 0, r: 5 }}
                        activeDot={{ r: 7, fill: lineColor }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
