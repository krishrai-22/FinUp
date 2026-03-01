const mongoose = require("mongoose");

/**
 * FinancialData Schema
 * Stores a single risk assessment record for a household member.
 */
const FinancialDataSchema = new mongoose.Schema(
    {
        // Owner (optional link to User)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        memberName: {
            type: String,
            required: [true, "Member name is required"],
            trim: true,
        },

        // Annual figures (INR)
        income: { type: Number, required: true, min: 1 },
        expenses: { type: Number, required: true, min: 0 },
        emi: { type: Number, required: true, min: 0 },

        // Ratio 0–1
        creditUtilization: { type: Number, required: true, min: 0, max: 1 },

        // Current savings balance
        savings: { type: Number, required: true },

        // Computed outputs
        riskScore: { type: Number, required: true },
        category: {
            type: String,
            enum: ["Safe", "Warning", "High Risk"],
            required: true,
        },
        breakdown: {
            emiRatioPercent: Number,
            savingsMonths: Number,
            creditUsagePercent: Number,
            savingsRatePercent: Number,
        },
        suggestions: [String],

        // 3-month savings projection array
        projection: [Number],
    },
    { timestamps: true }
);

module.exports = mongoose.model("FinancialData", FinancialDataSchema);
