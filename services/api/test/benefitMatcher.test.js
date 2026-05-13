import assert from "node:assert/strict";
import test from "node:test";
import { benefitRules } from "../src/benefits/cardBenefitRules.js";
import { buildBenefitInstances } from "../src/benefits/matcher.js";
import { buildMonthlyLedger } from "../src/ledger.js";

test("matches monthly merchant benefits and caps usage at the rule limit", () => {
  const accounts = [
    {
      id: "card-1",
      displayName: "American Express Gold",
      cardProductId: "amex-gold"
    }
  ];
  const transactions = [
    {
      id: "txn-1",
      userId: "user-1",
      accountId: "card-1",
      date: "2026-05-08",
      merchantName: "Grubhub",
      amount: 28.75,
      category: "Food & Drink",
      personalFinanceCategoryPrimary: "FOOD_AND_DRINK"
    }
  ];

  const benefits = buildBenefitInstances({
    userId: "user-1",
    accounts,
    transactions,
    benefitRules,
    now: new Date("2026-05-12T12:00:00Z")
  });

  const diningCredit = benefits.find((benefit) => benefit.benefitRuleId === "amex-gold-dining-monthly");
  assert.equal(diningCredit.usedAmount, 10);
  assert.equal(diningCredit.status, "used");
  assert.equal(diningCredit.usages[0].matchSource, "merchant");
});

test("monthly ledger includes benefit labels for matched transactions", () => {
  const accounts = [
    {
      id: "card-1",
      displayName: "American Express Gold",
      cardProductId: "amex-gold"
    }
  ];
  const transactions = [
    {
      id: "txn-1",
      userId: "user-1",
      accountId: "card-1",
      date: "2026-05-08",
      merchantName: "Uber",
      amount: 16.5,
      category: "Transport",
      personalFinanceCategoryPrimary: "TRANSPORTATION"
    }
  ];
  const benefits = buildBenefitInstances({
    userId: "user-1",
    accounts,
    transactions,
    benefitRules,
    now: new Date("2026-05-12T12:00:00Z")
  });

  const ledger = buildMonthlyLedger({
    userId: "user-1",
    month: "2026-05",
    accounts,
    transactions,
    benefitInstances: benefits
  });

  assert.equal(ledger.totalSpend, 16.5);
  assert.equal(ledger.transactions[0].benefitMatchLabel, "Uber Cash");
});

