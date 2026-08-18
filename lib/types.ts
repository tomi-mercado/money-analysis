export type Currency = "ARS" | "USD";
export type Direction = "income" | "expense";
export type PaymentType = "cash" | "transfer" | "credit_card";
export type TransactionStatus = "paid" | "pending";

export type Category = { id: string; name: string; parentId?: string; backgroundColor?: string };
export type PaymentMethod = { id: string; name: string; type: PaymentType; issuer?: string; lastFour?: string; limit?: number; limitCurrency?: Currency; backgroundColor?: string };
export type CardPeriod = { id: string; cardId: string; periodKey: string; startDate: string; closingDate: string; dueDate?: string; label: string };
export type Transaction = { id: string; title: string; description?: string; url?: string; time?: string; date: string; amount: number; currency: Currency; direction: Direction; paymentMethodId?: string; budgetId?: string; status: TransactionStatus; installments?: number; installmentNumber?: number; sourceTransactionId?: string; periodKey?: string; createdAt: string; categoryIds?: string[] };
export type BudgetRule = { id: string; categoryId?: string; paymentMethodId?: string; currency?: Currency; minAmount?: number; maxAmount?: number };
export type Budget = { id: string; name: string; baseAmount: number; currency: Currency; periodOverrides: Record<string, number>; rules: BudgetRule[]; backgroundColor?: string };
export type Recurring = { id: string; title: string; description?: string; amount: number; currency: Currency; startPeriod: string; endPeriod?: string; plannedDate?: number; paymentMethodId?: string; budgetId?: string; active: boolean; categoryIds?: string[] };
export type ExchangeRate = { date: string; arsPerUsd: number; source: string; manual?: boolean };
export type AppData = { categories: Category[]; paymentMethods: PaymentMethod[]; periods: CardPeriod[]; transactions: Transaction[]; budgets: Budget[]; recurring: Recurring[]; rates: ExchangeRate[] };
