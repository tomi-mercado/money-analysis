import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: methods, error: methodsError } = await supabase.from("payment_methods").select("id,name");
if (methodsError) throw methodsError;
const methodByName = new Map(methods.map(method => [method.name, method.id]));

const { data: transactions, error: transactionsError } = await supabase.from("transactions").select("*");
if (transactionsError) throw transactionsError;

const { data: existingRecurring, error: recurringError } = await supabase.from("recurring_expenses").select("*");
if (recurringError) throw recurringError;

const summary = transactions.filter(transaction => transaction.description?.startsWith("Resumen julio 2026"));
const findSummary = (title, receipt) => summary.find(transaction => transaction.title === title && transaction.description?.includes(`comprobante ${receipt}`));
const createOrUpdateRecurring = async ({ title, amount, currency, paymentMethodId }) => {
  const existing = existingRecurring.find(item => item.title === title);
  const payload = { title, amount, currency, start_period: "2026-07", end_period: null, planned_day: null, payment_method_id: paymentMethodId || null, active: true };
  const result = existing ? await supabase.from("recurring_expenses").update(payload).eq("id", existing.id) : await supabase.from("recurring_expenses").insert(payload);
  if (result.error) throw result.error;
};

await createOrUpdateRecurring({ title: "Meli+", amount: 13990, currency: "ARS", paymentMethodId: methodByName.get("Visa Galicia") });
await createOrUpdateRecurring({ title: "Apple/Bill", amount: 0.99, currency: "USD", paymentMethodId: methodByName.get("Mastercard Galicia") });
await createOrUpdateRecurring({ title: "Google", amount: 4.99, currency: "USD", paymentMethodId: methodByName.get("Mastercard Galicia") });
await createOrUpdateRecurring({ title: "YouTube", amount: 9.15, currency: "USD", paymentMethodId: null });
await createOrUpdateRecurring({ title: "Seguro de vivienda", amount: 99103.96, currency: "ARS", paymentMethodId: methodByName.get("Visa Santander") });
await createOrUpdateRecurring({ title: "Telecentro", amount: 43486, currency: "ARS", paymentMethodId: methodByName.get("Visa Galicia") });
await createOrUpdateRecurring({ title: "OSDE", amount: 236680.01, currency: "ARS", paymentMethodId: methodByName.get("Visa Galicia") });
await createOrUpdateRecurring({ title: "Netflix", amount: 6.08, currency: "USD", paymentMethodId: methodByName.get("Visa Galicia") });

const meliSummary = findSummary("MERPAGO*MELI", "520015");
const meliDuplicates = transactions.filter(transaction => transaction.title === "Meli+ — Suscripción" && transaction.amount === 13990 && transaction.date === "2026-07-27");
for (const duplicate of meliDuplicates) {
  const result = await supabase.from("transactions").delete().eq("id", duplicate.id);
  if (result.error) throw result.error;
}
if (!meliSummary) throw new Error("Meli+ summary transaction not found");

const osdeRefund = findSummary("OSDE devolución", "005749");
if (osdeRefund) {
  const result = await supabase.from("transactions").delete().eq("id", osdeRefund.id);
  if (result.error) throw result.error;
}

console.log(JSON.stringify({ createdOrUpdatedRecurring: 8, removedMeliDuplicates: meliDuplicates.length, removedOsdeRefund: Boolean(osdeRefund), keptOsdeTransaction: Boolean(findSummary("OSDE", "005749")) }, null, 2));
