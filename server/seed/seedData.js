/**
 * seedData.js
 * Populates MongoDB with 6 demo family member financial records.
 * All monetary values are MONTHLY.
 * Run: node seed/seedData.js
 *
 * Covers: 2 Safe, 2 Warning, 2 High Risk scenarios.
 */

require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const FinancialData = require("../models/FinancialData");
const { calculateRisk } = require("../utils/riskEngine");
const { projectSavings } = require("../utils/projectionEngine");

const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/shfcd";

const seedMembers = [
    // ── SAFE ── (monthly figures)
    {
        memberName: "Alice (Safe)",
        income: 10000,      // ₹10,000/mo
        expenses: 5000,     // ₹5,000/mo
        emi: 1500,          // ₹1,500/mo
        creditUtilization: 0.2,
        savings: 40000,
    },
    {
        memberName: "Bob (Safe)",
        income: 7500,
        expenses: 4000,
        emi: 800,
        creditUtilization: 0.1,
        savings: 30000,
    },

    // ── WARNING ──
    {
        memberName: "Carol (Warning)",
        income: 5000,
        expenses: 4300,
        emi: 1667,
        creditUtilization: 0.55,
        savings: 8000,
    },
    {
        memberName: "Dave (Warning)",
        income: 6250,
        expenses: 5400,
        emi: 1833,
        creditUtilization: 0.65,
        savings: 6000,
    },

    // ── HIGH RISK ──
    {
        memberName: "Eve (High Risk)",
        income: 3333,
        expenses: 3750,
        emi: 1500,
        creditUtilization: 0.85,
        savings: 2000,
    },
    {
        memberName: "Frank (High Risk)",
        income: 4167,
        expenses: 4583,
        emi: 1833,
        creditUtilization: 0.9,
        savings: 1000,
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅  Connected to MongoDB");

        await FinancialData.deleteMany({});
        console.log("🗑️  Cleared existing FinancialData collection");

        for (const m of seedMembers) {
            const { riskScore, category, breakdown, suggestions } = calculateRisk(m);
            const projection = projectSavings(
                m.savings,
                m.income,
                m.expenses,
                m.emi,
                3
            );

            await FinancialData.create({
                ...m,
                riskScore,
                category,
                breakdown,
                suggestions,
                projection,
            });

            console.log(`   ➕ Inserted: ${m.memberName} → ${category} (${riskScore})`);
        }

        console.log("\n🌱  Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌  Seed error:", err.message);
        process.exit(1);
    }
}

seed();
