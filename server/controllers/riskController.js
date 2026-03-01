const FinancialData = require("../models/FinancialData");
const { calculateRisk } = require("../utils/riskEngine");
const { projectSavings } = require("../utils/projectionEngine");
const { getAISuggestions } = require("../utils/geminiService");

/* ─────────────────────────────────────────────
   POST /api/calculate-risk
   Calculates risk, saves record, returns result.
───────────────────────────────────────────── */
const calculateRiskHandler = async (req, res) => {
    try {
        const { memberName, income, expenses, emi, creditUtilization, savings } =
            req.body;

        // ── Input validation ──
        if (
            !memberName ||
            income == null ||
            expenses == null ||
            emi == null ||
            creditUtilization == null ||
            savings == null
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required: memberName, income, expenses, emi, creditUtilization, savings.",
            });
        }

        if (typeof income !== "number" || income <= 0) {
            return res.status(400).json({
                success: false,
                message: "Income must be a positive number.",
            });
        }

        if (creditUtilization < 0 || creditUtilization > 1) {
            return res.status(400).json({
                success: false,
                message: "creditUtilization must be between 0 and 1.",
            });
        }

        // ── Rule-based risk calculation ──
        const { riskScore, category, breakdown, suggestions: ruleSuggestions } = calculateRisk({
            income, expenses, emi, creditUtilization, savings,
        });

        // ── 3-month savings projection ──
        const projection = projectSavings(savings, income, expenses, emi, 3);

        // ── Gemini AI suggestions (with fallback) ──
        const aiSuggestions = await getAISuggestions(
            { memberName, income, expenses, emi, creditUtilization, savings },
            riskScore, category, breakdown, projection
        );
        const suggestions = aiSuggestions || ruleSuggestions;

        // ── Persist to DB ──
        const record = await FinancialData.create({
            userId: req.user ? req.user._id : null,
            memberName, income, expenses, emi, creditUtilization, savings,
            riskScore, category, breakdown, suggestions, projection,
        });

        res.status(201).json({
            success: true,
            riskScore, category, breakdown, suggestions, projection,
            aiPowered: !!aiSuggestions,
            record,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Server error during risk calculation.",
        });
    }
};

/* ─────────────────────────────────────────────
   POST /api/simulate
   No DB save unless `save` flag is true.
   Accepts adjustments over base data.
───────────────────────────────────────────── */
const simulateHandler = async (req, res) => {
    try {
        const {
            memberName, income, expenses, emi, creditUtilization, savings,
            adjustExpensePercent = 0, adjustIncomePercent = 0, adjustEMI = 0,
            save = false,
        } = req.body;

        if (!income || income <= 0) {
            return res.status(400).json({ success: false, message: "Income must be a positive number." });
        }

        // Apply adjustments
        const adjIncome   = income   * (1 + adjustIncomePercent  / 100);
        const adjExpenses = expenses * (1 + adjustExpensePercent / 100);
        const adjEMI      = emi + adjustEMI;

        const { riskScore, category, breakdown, suggestions: ruleSuggestions } = calculateRisk({
            income: adjIncome, expenses: adjExpenses, emi: adjEMI, creditUtilization, savings,
        });

        const projection = projectSavings(savings, adjIncome, adjExpenses, adjEMI, 3);

        // ── Gemini AI suggestions (with fallback) ──
        const aiSuggestions = await getAISuggestions(
            { memberName, income: adjIncome, expenses: adjExpenses, emi: adjEMI, creditUtilization, savings },
            riskScore, category, breakdown, projection
        );
        const suggestions = aiSuggestions || ruleSuggestions;

        let record = null;
        if (save) {
            record = await FinancialData.create({
                userId: req.user ? req.user._id : null,
                memberName: memberName || "Simulation",
                income: adjIncome, expenses: adjExpenses, emi: adjEMI,
                creditUtilization, savings, riskScore, category, breakdown, suggestions, projection,
            });
        }

        res.status(200).json({
            success: true,
            adjusted: { income: adjIncome, expenses: adjExpenses, emi: adjEMI },
            riskScore, category, breakdown, suggestions, projection,
            aiPowered: !!aiSuggestions,
            ...(record && { record }),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || "Server error during simulation." });
    }
};

/* ─────────────────────────────────────────────
   GET /api/history
   Returns last 20 records (optional ?memberName= filter).
───────────────────────────────────────────── */
const getHistoryHandler = async (req, res) => {
    try {
        const filter = {};
        if (req.query.memberName) {
            filter.memberName = { $regex: req.query.memberName, $options: "i" };
        }
        // If user is authenticated, scope to their records
        if (req.user) {
            filter.userId = req.user._id;
        }

        const records = await FinancialData.find(filter)
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ success: true, count: records.length, records });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = { calculateRiskHandler, simulateHandler, getHistoryHandler };
