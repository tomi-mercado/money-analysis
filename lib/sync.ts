import { supabase } from "./supabase";
import type { AppData, PaymentMethod, Transaction, Budget, Recurring, ExchangeRate, CardPeriod } from "./types";
import { getBackgroundColor } from "./colors";

export async function loadCloudData(): Promise<Partial<AppData> | null> {
  if (!supabase) return null;
  const [methods, transactions, budgets, recurring, rates, periods] = await Promise.all([
    supabase.from("payment_methods").select("*").order("name"),
    supabase.from("transactions").select("*").order("date", { ascending: false }),
    supabase.from("budgets").select("*"),
    supabase.from("recurring_expenses").select("*"),
    supabase.from("exchange_rates").select("*").order("date", { ascending: false }),
    supabase.from("card_periods").select("*").order("start_date"),
  ]);
  if ([methods, transactions, budgets, recurring, rates, periods].some(result => result.error)) return null;
  return {
    categories: [],
    paymentMethods: (methods.data || []).map(row => ({ id: row.id, name: row.name, type: row.type, issuer: row.issuer || undefined, lastFour: row.last_four || undefined, limit: row.credit_limit || undefined, limitCurrency: row.limit_currency || undefined, backgroundColor: getBackgroundColor(row.background_color, row.id) })) as PaymentMethod[],
    transactions: (transactions.data || []).map(row => ({ id: row.id, title: row.title, description: row.description || undefined, url: row.url || undefined, date: row.date, time: row.time || undefined, amount: Number(row.amount), currency: row.currency, direction: row.direction, paymentMethodId: row.payment_method_id || undefined, budgetId: row.budget_id || undefined, status: row.status, installments: row.installments || undefined, installmentNumber: row.installment_number || undefined, sourceTransactionId: row.source_transaction_id || undefined, periodKey: row.period_key || undefined, categoryIds: [], createdAt: row.created_at })) as Transaction[],
    budgets: (budgets.data || []).map(row => ({ id: row.id, name: row.name, baseAmount: Number(row.base_amount), currency: row.currency, periodOverrides: {}, rules: [], backgroundColor: getBackgroundColor(row.background_color, row.id) })) as Budget[],
    recurring: (recurring.data || []).map(row => ({ id: row.id, title: row.title, description: row.description || undefined, amount: Number(row.amount), currency: row.currency, startPeriod: row.start_period, endPeriod: row.end_period || undefined, plannedDate: row.planned_day || undefined, paymentMethodId: row.payment_method_id || undefined, budgetId: row.budget_id || undefined, categoryIds: [], active: row.active })) as Recurring[],
    rates: (rates.data || []).map(row => ({ date: row.date, arsPerUsd: Number(row.ars_per_usd), source: row.source, manual: row.manual })) as ExchangeRate[],
    periods: (periods.data || []).map(row => ({ id: row.id, cardId: row.card_id, periodKey: row.period_key, startDate: row.start_date, closingDate: row.closing_date, dueDate: row.due_date, label: row.period_key })) as CardPeriod[],
  };
}

export async function syncCloudData(data: AppData) {
  if (!supabase) return;
  const periodKeys = new Set<string>([...data.periods.map(item => item.periodKey), ...data.transactions.map(item => item.date.slice(0, 7)), ...data.recurring.map(item => item.startPeriod)]);
  await supabase.from("periods").upsert([...periodKeys].map(key => ({ key, label: key, month_date: `${key}-01` })));
  await Promise.all([
    supabase.from("payment_methods").upsert(data.paymentMethods.map(item => ({ id: item.id, name: item.name, type: item.type, issuer: item.issuer || null, last_four: item.lastFour || null, credit_limit: item.limit || null, limit_currency: item.limitCurrency || null, background_color: getBackgroundColor(item.backgroundColor, item.id) }))),
    supabase.from("budgets").upsert(data.budgets.map(item => ({ id: item.id, name: item.name, base_amount: item.baseAmount, currency: item.currency, background_color: getBackgroundColor(item.backgroundColor, item.id) }))),
    supabase.from("transactions").upsert(data.transactions.map(item => ({ id: item.id, title: item.title, description: item.description || null, url: item.url || null, date: item.date, time: item.time || null, amount: item.amount, currency: item.currency, direction: item.direction, payment_method_id: item.paymentMethodId || null, budget_id: item.budgetId || null, status: item.status, installments: item.installments || null, installment_number: item.installmentNumber || null, source_transaction_id: item.sourceTransactionId || null, period_key: item.periodKey || null, created_at: item.createdAt }))),
    supabase.from("exchange_rates").upsert(data.rates.map(item => ({ date: item.date, ars_per_usd: item.arsPerUsd, source: item.source, manual: item.manual || false }))),
    supabase.from("recurring_expenses").upsert(data.recurring.map(item => ({ id: item.id, title: item.title, description: item.description || null, amount: item.amount, currency: item.currency, start_period: item.startPeriod, end_period: item.endPeriod || null, planned_day: item.plannedDate || null, payment_method_id: item.paymentMethodId || null, budget_id: item.budgetId || null, active: item.active }))),
    supabase.from("card_periods").upsert(data.periods.map(item => ({ id: item.id, card_id: item.cardId, period_key: item.periodKey, start_date: item.startDate, closing_date: item.closingDate, due_date: item.dueDate }))),
  ]);
}

let syncQueue = Promise.resolve();
export function queueCloudSync(data: AppData) {
  syncQueue = syncQueue.then(() => syncCloudData(data)).catch(() => undefined);
}
