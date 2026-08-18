import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const [{ data: budgets, error: budgetsError }, { data: transactions, error: transactionsError }, { data: methods, error: methodsError }] = await Promise.all([
  supabase.from("budgets").select("id,name"),
  supabase.from("transactions").select("id,title,description,payment_method_id,budget_id"),
  supabase.from("payment_methods").select("id,name"),
]);
if (budgetsError || transactionsError || methodsError) throw budgetsError || transactionsError || methodsError;

const budgetByName = new Map(budgets.map(budget => [budget.name, budget.id]));
const methodById = new Map(methods.map(method => [method.id, method.name]));
const cardNames = new Set(["Visa Galicia", "Mastercard Galicia", "Visa Santander", "Visa Hipotecario"]);
const rules = [
  { budget: "Suscripciones y membresías", test: text => /meli\+|merpago\*meli|apple\.com|google|youtube|netflix|pedidosya\*plus|max|nicolas guthmann|quilmes atletico/i.test(text) },
  { budget: "Seguros y coberturas", test: text => /verisure|seguro de vivienda|assist/i.test(text) },
  { budget: "Salud y cuidado personal", test: text => /osde|farmamix/i.test(text) },
  { budget: "Servicios", test: text => /telecentro/i.test(text) },
  { budget: "Supermercado y día a día", test: text => /carrefour|pedidosya|milanga|propina/i.test(text) },
  { budget: "Ropa", test: text => /prune|rouge liniers/i.test(text) },
  { budget: "Casa (muebles, refacciones)", test: text => /arredo|tublanco|extractor|anafe|horno empotrable|acolchado|placard|colchon|colchón|juego de sabanas|mesa auxiliar|electrodomestico|electrodoméstico|aire acondicionado|devolución/i.test(text) },
];

let updated = 0;
const counts = {};
for (const transaction of transactions) {
  if (transaction.budget_id || !cardNames.has(methodById.get(transaction.payment_method_id))) continue;
  const text = `${transaction.title} ${transaction.description || ""}`;
  const rule = rules.find(candidate => candidate.test(text));
  if (!rule) continue;
  const budgetId = budgetByName.get(rule.budget);
  if (!budgetId) throw new Error(`Budget not found: ${rule.budget}`);
  const result = await supabase.from("transactions").update({ budget_id: budgetId }).eq("id", transaction.id);
  if (result.error) throw result.error;
  updated += 1;
  counts[rule.budget] = (counts[rule.budget] || 0) + 1;
}

console.log(JSON.stringify({ updated, counts }, null, 2));
