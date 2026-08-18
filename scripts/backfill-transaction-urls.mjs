import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const classifyImported = item => {
  const text = normalize([item.counterparty, item.description, item.reason, item.operation, item.activity_type].join(" "));
  if (/netflix|youtube|google|apple\.com|spotify|disney|hbo|suscripcion|membresia|meli\+/.test(text)) return "Suscripción";
  if (/carrefour|supermercado|coto|dia supermercado|jumbo|disco/.test(text)) return "Supermercado";
  if (/pedidosya|rappi|delivery|milanga|comida/.test(text)) return "Comida";
  if (/edesur|edenor|luz|electricidad/.test(text)) return "Servicio de luz";
  if (/telecentro|internet|fibertel|movistar|personal/.test(text)) return "Internet";
  if (/osde|farmacia|farmamix|salud|medico|medica|obra social/.test(text)) return "Salud";
  if (/verisure|seguro|chubb/.test(text)) return "Seguro";
  if (/prune|arredo|cheky|smookies|ropa|zara|nike|adidas/.test(text)) return "Compra";
  if (/transferencia|dinero retirado|dinero recibido|ingreso|jubilacion/.test(text)) return "Transferencia";
  if (/mercadolibre|mercado libre|merpago|compra|purchase/.test(text)) return "Compra";
  return null;
};
const imported = JSON.parse(await fs.readFile("transactions.json", "utf8"));
const { data: transactions, error: readError } = await supabase.from("transactions").select("id,title,date,amount,currency,direction");

if (readError) throw readError;

const buckets = new Map();
for (const transaction of transactions || []) {
  const key = `${transaction.date}|${Math.abs(Number(transaction.amount)).toFixed(2)}|${transaction.currency}|${transaction.direction}`;
  const candidates = buckets.get(key) || [];
  candidates.push(transaction);
  buckets.set(key, candidates);
}

const matches = [];
const unmatched = [];
for (const item of imported) {
  const direction = item.direction === "credit" ? "income" : "expense";
  const key = `${item.date}|${Math.abs(Number(item.amount)).toFixed(2)}|${item.currency || "ARS"}|${direction}`;
  const candidates = buckets.get(key) || [];
  const label = classifyImported(item);
  const originalTitle = label ? `${item.counterparty || "Transacción importada"} — ${label}` : item.counterparty || "Transacción importada";
  const candidateIndex = candidates.findIndex(transaction => transaction.title === originalTitle || (item.counterparty === "Mercado Libre" && transaction.title === item.description));
  if (candidateIndex === -1 || !item.source_url) {
    unmatched.push(item.id);
    continue;
  }
  const [transaction] = candidates.splice(candidateIndex, 1);
  matches.push({ id: transaction.id, url: item.source_url });
}

const results = await Promise.all(matches.map(transaction => supabase.from("transactions").update({ url: transaction.url }).eq("id", transaction.id)));
const failed = results.find(result => result.error);

if (failed?.error) throw failed.error;

console.log(JSON.stringify({ imported: imported.length, matched: matches.length, unmatched: unmatched.length, databaseTransactions: transactions?.length || 0 }, null, 2));
