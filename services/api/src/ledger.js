export function buildMonthlyLedger({ userId, month, accounts, transactions, benefitInstances }) {
  const monthTransactions = transactions
    .filter((transaction) => transaction.userId === userId)
    .filter((transaction) => transaction.date.startsWith(month))
    .filter((transaction) => !transaction.removedAt)
    .filter((transaction) => transaction.amount > 0);

  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const benefitByTransactionId = new Map();

  for (const benefit of benefitInstances) {
    for (const usage of benefit.usages || []) {
      benefitByTransactionId.set(usage.transactionId, benefit.benefitName);
    }
  }

  return {
    id: `${userId}-${month}`,
    month,
    totalSpend: roundMoney(sum(monthTransactions.map((transaction) => transaction.amount))),
    categorySummaries: summarize(monthTransactions, (transaction) => transaction.category || transaction.personalFinanceCategoryPrimary || "Other"),
    cardSummaries: summarize(monthTransactions, (transaction) => accountById.get(transaction.accountId)?.displayName || "Unknown card"),
    topMerchants: summarize(monthTransactions, (transaction) => transaction.merchantName || transaction.name || "Unknown merchant").slice(0, 5),
    transactions: monthTransactions
      .sort((left, right) => right.date.localeCompare(left.date))
      .map((transaction) => ({
        id: transaction.id,
        merchantName: transaction.merchantName || transaction.name || "Unknown merchant",
        date: transaction.date,
        amount: transaction.amount,
        category: transaction.category || transaction.personalFinanceCategoryPrimary || "Other",
        cardName: accountById.get(transaction.accountId)?.displayName || "Unknown card",
        benefitMatchLabel: benefitByTransactionId.get(transaction.id) || null
      }))
  };
}

function summarize(transactions, labelForTransaction) {
  const totals = new Map();

  for (const transaction of transactions) {
    const label = labelForTransaction(transaction);
    totals.set(label, roundMoney((totals.get(label) || 0) + transaction.amount));
  }

  return [...totals.entries()]
    .map(([label, amount]) => ({
      id: slug(label),
      label,
      amount
    }))
    .sort((left, right) => right.amount - left.amount);
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

