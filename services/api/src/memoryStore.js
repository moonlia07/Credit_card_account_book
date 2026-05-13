import { benefitRules } from "./benefits/cardBenefitRules.js";
import { buildBenefitInstances } from "./benefits/matcher.js";
import { buildMonthlyLedger } from "./ledger.js";

export class MemoryStore {
  constructor() {
    this.users = new Map();
  }

  ensureUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        id: userId,
        plaidItems: [],
        accounts: [],
        transactions: [],
        benefitInstances: []
      });
    }
    return this.users.get(userId);
  }

  connectMockItem(userId) {
    const user = this.ensureUser(userId);
    if (user.accounts.length > 0) {
      return user;
    }

    const item = {
      id: "mock-item-amex-chase",
      plaidItemId: "mock-plaid-item",
      institutionName: "Mock Financial",
      accessToken: "mock-access-token",
      status: "healthy"
    };

    const accounts = [
      {
        id: "mock-card-amex-gold",
        itemId: item.id,
        plaidAccountId: "mock-account-amex-gold",
        displayName: "American Express Gold",
        issuer: "American Express",
        mask: "1001",
        type: "credit",
        subtype: "credit card",
        cardProductId: "amex-gold",
        currentBalance: 830.12,
        creditLimit: null,
        nextPaymentDueDate: "2026-05-28",
        connectionStatus: "healthy"
      },
      {
        id: "mock-card-sapphire-preferred",
        itemId: item.id,
        plaidAccountId: "mock-account-sapphire",
        displayName: "Chase Sapphire Preferred",
        issuer: "Chase",
        mask: "4242",
        type: "credit",
        subtype: "credit card",
        cardProductId: "chase-sapphire-preferred",
        currentBalance: 544.2,
        creditLimit: 18000,
        nextPaymentDueDate: "2026-06-01",
        connectionStatus: "healthy"
      }
    ];

    const transactions = [
      transaction("mock-txn-1", userId, accounts[0].id, "2026-05-02", "Grubhub", 28.4, "Food & Drink", "FOOD_AND_DRINK"),
      transaction("mock-txn-2", userId, accounts[1].id, "2026-05-06", "Delta", 428.9, "Travel", "TRAVEL"),
      transaction("mock-txn-3", userId, accounts[0].id, "2026-05-10", "Uber", 18.2, "Transport", "TRANSPORTATION"),
      transaction("mock-txn-4", userId, accounts[0].id, "2026-05-12", "Whole Foods", 96.17, "Groceries", "FOOD_AND_DRINK"),
      transaction("mock-txn-5", userId, accounts[1].id, "2026-05-15", "Apple", 12.99, "Subscriptions", "ENTERTAINMENT")
    ];

    user.plaidItems.push(item);
    user.accounts.push(...accounts);
    user.transactions.push(...transactions);
    user.benefitInstances = buildBenefitInstances({
      userId,
      accounts: user.accounts,
      transactions: user.transactions,
      benefitRules,
      now: new Date("2026-05-20T12:00:00Z")
    });

    return user;
  }

  addPlaidItem({ userId, itemId, accessToken, institutionName, accounts = [] }) {
    const user = this.ensureUser(userId);
    const item = {
      id: itemId,
      plaidItemId: itemId,
      institutionName,
      accessToken,
      status: "healthy"
    };

    user.plaidItems.push(item);
    user.accounts.push(...accounts);
    return item;
  }

  getCards(userId) {
    const user = this.ensureUser(userId);
    return user.accounts.map((account) => ({
      id: account.id,
      displayName: account.displayName,
      issuer: account.issuer,
      mask: account.mask,
      currentBalance: account.currentBalance || 0,
      creditLimit: account.creditLimit || null,
      nextPaymentDueDate: account.nextPaymentDueDate || null,
      connectionStatus: account.connectionStatus || "healthy"
    }));
  }

  getLedger(userId, month) {
    const user = this.ensureUser(userId);
    return buildMonthlyLedger({
      userId,
      month,
      accounts: user.accounts,
      transactions: user.transactions,
      benefitInstances: user.benefitInstances
    });
  }

  getCurrentBenefits(userId) {
    const user = this.ensureUser(userId);
    return user.benefitInstances.map((benefit) => ({
      id: benefit.id,
      benefitName: benefit.benefitName,
      cardName: benefit.cardName,
      periodEnd: benefit.periodEnd,
      limitAmount: benefit.limitAmount,
      usedAmount: benefit.usedAmount,
      status: benefit.status,
      expiresSoon: benefit.expiresSoon
    }));
  }

  updateTransactionCategory({ userId, transactionId, category }) {
    const user = this.ensureUser(userId);
    const transaction = user.transactions.find((entry) => entry.id === transactionId);
    if (!transaction) {
      return null;
    }
    transaction.category = category;
    return transaction;
  }

  addManualBenefitUsage({ userId, benefitInstanceId, amount, note }) {
    const user = this.ensureUser(userId);
    const benefit = user.benefitInstances.find((entry) => entry.id === benefitInstanceId);
    if (!benefit) {
      return null;
    }

    benefit.usedAmount = Math.min(benefit.limitAmount, Math.round((benefit.usedAmount + amount) * 100) / 100);
    benefit.status = benefit.usedAmount >= benefit.limitAmount ? "used" : "partially_used";
    benefit.usages.push({
      id: `${benefit.id}-manual-${benefit.usages.length + 1}`,
      transactionId: null,
      amount,
      confidence: 1,
      matchSource: "manual",
      explanation: note || "Manually marked by user."
    });
    return benefit;
  }

  removeItem({ userId, itemId }) {
    const user = this.ensureUser(userId);
    const item = user.plaidItems.find((entry) => entry.id === itemId);
    if (!item) {
      return null;
    }

    user.plaidItems = user.plaidItems.filter((entry) => entry.id !== itemId);
    const accountIds = new Set(
      user.accounts
        .filter((account) => account.itemId === itemId)
        .map((account) => account.id)
    );
    user.accounts = user.accounts.filter((account) => account.itemId !== itemId);
    user.transactions = user.transactions.filter((entry) => !accountIds.has(entry.accountId));
    user.benefitInstances = [];
    return item;
  }
}

function transaction(id, userId, accountId, date, merchantName, amount, category, personalFinanceCategoryPrimary) {
  return {
    id,
    userId,
    accountId,
    date,
    merchantName,
    name: merchantName,
    amount,
    category,
    personalFinanceCategoryPrimary,
    removedAt: null
  };
}
