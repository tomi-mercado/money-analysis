import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const seedSource = await fs.readFile(new URL("./seed-account.mjs", import.meta.url), "utf8");
const rowsSource = seedSource.split("const statementRows = [", 2)[1].split("];", 1)[0];
const statementRows = Function(`return [${rowsSource.replaceAll(/\/\/[^\n]*/g, "")}]`)();

const { data: methods, error: methodsError } = await supabase.from("payment_methods").select("id,name");
if (methodsError) throw methodsError;
const methodByName = new Map(methods.map(method => [method.name, method.id]));

const { data: transactions, error: transactionsError } = await supabase.from("transactions").select("*");
if (transactionsError) throw transactionsError;

const isStatementRow = transaction => transaction.description?.startsWith("Resumen julio 2026");
const amountForStatement = ([, , installmentAmount, , installmentNumber, installments]) => installments ? Number((installmentAmount * installments).toFixed(2)) : installmentAmount;
const closeEnough = (left, right) => Math.abs(Math.abs(Number(left)) - Math.abs(Number(right))) <= 0.05;
const sourceRows = transactions.filter(transaction => !isStatementRow(transaction));
const statementRowsByKey = new Map();
for (const transaction of transactions.filter(isStatementRow)) {
  const key = `${transaction.date}|${transaction.title}|${transaction.description}`;
  statementRowsByKey.set(key, transaction);
}

let updatedOriginals = 0;
let deletedStatementRows = 0;
let updatedStatementRows = 0;
let ambiguousRows = 0;

for (const row of statementRows) {
  const [date, title, , currency, installmentNumber, installments, receipt, cardName] = row;
  const totalAmount = amountForStatement(row);
  const candidates = sourceRows.filter(transaction => transaction.date === date && transaction.currency === currency && closeEnough(transaction.amount, totalAmount));

  if (candidates.length > 1) {
    ambiguousRows += 1;
    console.warn(`Ambiguous source match for ${title} ${date} receipt ${receipt}`);
    continue;
  }

  const paymentMethodId = methodByName.get(cardName);
  if (!paymentMethodId) throw new Error(`Payment method not found: ${cardName}`);

  if (candidates.length === 1) {
    const original = candidates[0];
    const update = { payment_method_id: paymentMethodId, installments: installments || null, installment_number: installmentNumber || null };
    const result = await supabase.from("transactions").update(update).eq("id", original.id);
    if (result.error) throw result.error;
    updatedOriginals += 1;

    const duplicateRows = transactions.filter(transaction => isStatementRow(transaction) && transaction.date === date && transaction.title === title && transaction.description?.includes(`comprobante ${receipt}`));
    for (const duplicate of duplicateRows) {
      const deletion = await supabase.from("transactions").delete().eq("id", duplicate.id);
      if (deletion.error) throw deletion.error;
      deletedStatementRows += 1;
    }
    continue;
  }

  const matchingStatementRows = transactions.filter(transaction => isStatementRow(transaction) && transaction.date === date && transaction.title === title && transaction.description?.includes(`comprobante ${receipt}`));
  for (const statement of matchingStatementRows) {
    const result = await supabase.from("transactions").update({ payment_method_id: paymentMethodId, installments: installments || null, installment_number: installmentNumber || null }).eq("id", statement.id);
    if (result.error) throw result.error;
    updatedStatementRows += 1;
  }
}

console.log(JSON.stringify({ updatedOriginals, deletedStatementRows, updatedStatementRows, ambiguousRows }, null, 2));
