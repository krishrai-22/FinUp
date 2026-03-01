/**
 * riskEngine.js
 * Core risk calculation logic for SHFCD.
 * All inputs are now MONTHLY figures (income, expenses, emi, savings).
 * Calculates composite risk score (0-100), category, breakdown, and suggestions.
 */

/**
 * calculateRisk - main export
 * @param {Object} data - { income, expenses, emi, creditUtilization, savings }
 *                        All monetary values are MONTHLY.
 * @returns {Object} { riskScore, category, breakdown, suggestions }
 */
function calculateRisk(data) {
  const { income, expenses, emi, creditUtilization, savings } = data;

  if (!income || income <= 0) {
    throw new Error("Income must be a positive number.");
  }

  // All inputs are already monthly — no conversion needed
  const monthlyIncome = income;
  const monthlyExpenses = expenses;
  const monthlyEMI = emi;

  // --- Derived ratios ---
  const emiRatio = emi / income;           // monthly EMI vs monthly income
  const savingsRate = savings / income;
  const creditUtil = creditUtilization;      // already a fraction (0–1)

  // --- Scoring breakdown ---
  let riskScore = 0;
  const suggestions = [];
  const triggered = {};

  // Rule 1: EMI burden > 40% of monthly income
  if (emiRatio > 0.4) {
    riskScore += 30;
    triggered.highEMI = true;
    suggestions.push(
      `Your EMI ratio is ${(emiRatio * 100).toFixed(1)}%; the ideal threshold is below 35%. Consider refinancing or reducing EMI obligations.`
    );
  }

  // Rule 2: Monthly expenses exceed monthly income
  if (expenses > income) {
    riskScore += 40;
    triggered.overspending = true;
    suggestions.push(
      `Monthly expenses (₹${expenses.toLocaleString()}) exceed income (₹${income.toLocaleString()}). Reduce discretionary spend immediately — e.g., reduce food delivery by 40% or cut subscriptions.`
    );
  }

  // Rule 3: High credit utilization
  if (creditUtil > 0.8) {
    riskScore += 30;
    triggered.highCredit = true;
    suggestions.push(
      `Credit utilization is at ${(creditUtil * 100).toFixed(0)}%. Reduce credit usage to below 30% to protect your credit score.`
    );
  }

  // Rule 4: Low savings buffer (less than 2 months of expenses)
  const twoMonthExpenses = 2 * monthlyExpenses;
  if (savings < twoMonthExpenses) {
    riskScore += 20;
    triggered.lowSavings = true;
    suggestions.push(
      `Your savings (₹${savings.toLocaleString()}) cover less than 2 months of expenses. Aim for a 3–6 month emergency fund.`
    );
  }

  // Cap at 100
  riskScore = Math.min(100, riskScore);

  // --- Category ---
  let category;
  if (riskScore <= 30) category = "Safe";
  else if (riskScore <= 60) category = "Warning";
  else category = "High Risk";

  // --- Breakdown object ---
  const breakdown = {
    emiRatioPercent: parseFloat((emiRatio * 100).toFixed(2)),
    savingsMonths: monthlyExpenses > 0
      ? parseFloat((savings / monthlyExpenses).toFixed(2))
      : 0,
    creditUsagePercent: parseFloat((creditUtil * 100).toFixed(2)),
    savingsRatePercent: parseFloat((savingsRate * 100).toFixed(2)),
  };

  return { riskScore, category, breakdown, suggestions };
}

module.exports = { calculateRisk };
