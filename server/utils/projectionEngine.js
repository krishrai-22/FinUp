/**
 * projectionEngine.js
 * Projects savings over N months given MONTHLY income, expenses, and EMI.
 */

/**
 * projectSavings
 * @param {number} currentSavings  - current savings balance
 * @param {number} monthlyIncome   - monthly income
 * @param {number} monthlyExpenses - monthly expenses
 * @param {number} monthlyEMI      - monthly EMI payments
 * @param {number} months          - number of months to project (default 3)
 * @returns {number[]} array of savings values at end of each month
 */
function projectSavings(
    currentSavings,
    monthlyIncome,
    monthlyExpenses,
    monthlyEMI,
    months = 3
) {
    const monthlyCashFlow = monthlyIncome - monthlyExpenses - monthlyEMI;

    const projection = [];
    let balance = currentSavings;

    for (let i = 1; i <= months; i++) {
        balance += monthlyCashFlow;
        projection.push(Math.round(balance));
    }

    return projection;
}

module.exports = { projectSavings };
