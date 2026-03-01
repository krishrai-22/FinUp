/**
 * geminiService.js
 * Generates AI-powered financial suggestions using Google Gemini.
 * Called after the rule-based risk engine runs, enriching the suggestions
 * with genuinely personalised, natural-language advice.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialise Gemini client (key from .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * getAISuggestions
 * @param {Object} financialData  - { memberName, income, expenses, emi, creditUtilization, savings }
 * @param {number} riskScore      - 0–100 composite score
 * @param {string} category       - "Safe" | "Warning" | "High Risk"
 * @param {Object} breakdown      - { emiRatioPercent, savingsMonths, creditUsagePercent, savingsRatePercent }
 * @param {number[]} projection   - 3-element array of projected month-end savings
 * @returns {Promise<string[]>}   - Array of 3–5 suggestion strings
 */
async function getAISuggestions(financialData, riskScore, category, breakdown, projection) {
  if (!process.env.GEMINI_API_KEY) {
    return ["Add GEMINI_API_KEY to .env to enable AI-powered suggestions."];
  }

  const { memberName, income, expenses, emi, creditUtilization, savings } = financialData;

  const prompt = `
You are a concise, expert personal finance advisor.

A household member named "${memberName}" has the following MONTHLY financial profile:
- Monthly Income: ₹${income.toLocaleString("en-IN")}
- Monthly Expenses: ₹${expenses.toLocaleString("en-IN")}
- Monthly EMI: ₹${emi.toLocaleString("en-IN")}
- Credit Utilization: ${(creditUtilization * 100).toFixed(0)}%
- Current Savings: ₹${savings.toLocaleString("en-IN")}

Risk Analysis Results:
- Risk Score: ${riskScore}/100
- Category: ${category}
- EMI Ratio: ${breakdown.emiRatioPercent}% (ideal: <35%)
- Savings Buffer: ${breakdown.savingsMonths} months (ideal: 3–6 months)
- Credit Usage: ${breakdown.creditUsagePercent}% (ideal: <30%)
- Savings Rate: ${breakdown.savingsRatePercent}%
- 3-Month Savings Projection: Month 1: ₹${projection[0]?.toLocaleString("en-IN")}, Month 2: ₹${projection[1]?.toLocaleString("en-IN")}, Month 3: ₹${projection[2]?.toLocaleString("en-IN")}

Based on this data, provide EXACTLY 4 specific, actionable financial suggestions tailored to this person's situation.
Rules:
- Each suggestion must be concrete and specific to their numbers (mention actual ₹ figures where helpful).
- Do NOT use generic advice like "save more money" or "spend less".
- Keep each suggestion to 1–2 sentences max.
- Return ONLY a JSON array of 4 strings. No explanation, no markdown, no preamble.
Example format: ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"]
`.trim();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON array from response (Gemini sometimes wraps in markdown)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array in Gemini response");

    const suggestions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(suggestions)) throw new Error("Parsed value is not an array");

    return suggestions;
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    // Graceful fallback — return null so controller can use rule-based suggestions
    return null;
  }
}

module.exports = { getAISuggestions };
