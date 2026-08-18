import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const [{ data: methods, error: methodsError }, { data: budgets, error: budgetsError }, { data: transactions, error: transactionsError }] = await Promise.all([
  supabase.from("payment_methods").select("id,name"),
  supabase.from("budgets").select("id,name"),
  supabase.from("transactions").select("id,title,description,payment_method_id,budget_id"),
]);
if (methodsError || budgetsError || transactionsError) throw methodsError || budgetsError || transactionsError;

const methodByName = new Map(methods.map(method => [method.name, method.id]));
const budgetByName = new Map(budgets.map(budget => [budget.name, budget.id]));
const nonOwnerCardId = methodByName.get("Visa Hipotecario");
const nonOwnerTransactions = transactions.filter(transaction => transaction.payment_method_id === nonOwnerCardId && transaction.description?.startsWith("Resumen julio 2026"));
for (const transaction of nonOwnerTransactions) {
  const result = await supabase.from("transactions").delete().eq("id", transaction.id);
  if (result.error) throw result.error;
}

const assignments = [
  { budget: "Ropa", test: text => /legionmenace|legion menace/i.test(text) },
  { budget: "Casa (muebles, refacciones)", test: text => /store 409|di toro/i.test(text) },
  { budget: "Auto", test: text => /deheza/i.test(text) },
];
let assigned = 0;
for (const transaction of transactions.filter(item => item.payment_method_id !== nonOwnerCardId && !item.budget_id)) {
  const text = `${transaction.title} ${transaction.description || ""}`;
  const rule = assignments.find(candidate => candidate.test(text));
  if (!rule) continue;
  const budgetId = budgetByName.get(rule.budget);
  if (!budgetId) throw new Error(`Budget not found: ${rule.budget}`);
  const result = await supabase.from("transactions").update({ budget_id: budgetId }).eq("id", transaction.id);
  if (result.error) throw result.error;
  assigned += 1;
}

console.log(JSON.stringify({ removedNonOwnerTransactions: nonOwnerTransactions.length, assignedKnownBudgets: assigned }, null, 2));
