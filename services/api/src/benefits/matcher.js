export function buildBenefitInstances({ userId, accounts, transactions, benefitRules, now = new Date() }) {
  const instances = [];

  for (const account of accounts) {
    if (!account.cardProductId) {
      continue;
    }

    const rules = benefitRules.filter((rule) => rule.cardProductId === account.cardProductId);
    for (const rule of rules) {
      const period = periodForRule(rule, now);
      const eligibleTransactions = transactions
        .filter((transaction) => transaction.accountId === account.id)
        .filter((transaction) => isDateInPeriod(transaction.date, period))
        .filter((transaction) => transaction.amount > 0)
        .map((transaction) => matchTransaction(rule, transaction))
        .filter(Boolean);

      let remaining = rule.limitAmount;
      const usages = [];

      for (const match of eligibleTransactions) {
        if (remaining <= 0) {
          break;
        }

        const amount = Math.min(match.transaction.amount, remaining);
        remaining -= amount;
        usages.push({
          id: `${rule.id}-${match.transaction.id}`,
          transactionId: match.transaction.id,
          amount: roundMoney(amount),
          confidence: match.confidence,
          matchSource: match.source,
          explanation: match.explanation
        });
      }

      const usedAmount = roundMoney(rule.limitAmount - remaining);
      instances.push({
        id: `${account.id}-${rule.id}-${period.start}`,
        userId,
        accountId: account.id,
        cardName: account.displayName,
        benefitRuleId: rule.id,
        benefitName: rule.name,
        periodStart: period.start,
        periodEnd: period.end,
        limitAmount: rule.limitAmount,
        usedAmount,
        status: statusForUsage(usedAmount, rule.limitAmount),
        expiresSoon: daysUntil(period.end, now) <= 7,
        requiresEnrollment: rule.requiresEnrollment,
        usages
      });
    }
  }

  return instances;
}

export function matchTransaction(rule, transaction) {
  const merchant = normalize(transaction.merchantName || transaction.name);
  const category = normalize(transaction.personalFinanceCategoryPrimary || transaction.category);

  const merchantMatch = rule.merchantMatchers?.find((matcher) => merchant.includes(normalize(matcher)));
  if (merchantMatch) {
    return {
      transaction,
      confidence: 0.94,
      source: "merchant",
      explanation: `Merchant matched "${merchantMatch}".`
    };
  }

  const categoryMatch = rule.categoryMatchers?.find((matcher) => category === normalize(matcher));
  if (categoryMatch) {
    return {
      transaction,
      confidence: 0.72,
      source: "category",
      explanation: `Category matched "${categoryMatch}".`
    };
  }

  return null;
}

function periodForRule(rule, now) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  if (rule.periodType === "annual") {
    return {
      start: `${year}-01-01`,
      end: `${year}-12-31`
    };
  }

  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0));
  return {
    start: isoDate(start),
    end: isoDate(end)
  };
}

function isDateInPeriod(dateString, period) {
  return dateString >= period.start && dateString <= period.end;
}

function statusForUsage(usedAmount, limitAmount) {
  if (usedAmount <= 0) {
    return "unused";
  }
  if (usedAmount >= limitAmount) {
    return "used";
  }
  return "partially_used";
}

function daysUntil(dateString, now) {
  const end = new Date(`${dateString}T23:59:59.999Z`);
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function normalize(value = "") {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

