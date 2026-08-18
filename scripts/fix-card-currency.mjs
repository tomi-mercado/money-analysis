import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const fixes = [
  { date: "2026-07-24", title: "GOOGLE *YouTube", amount: 3500, receipt: "00717", nextAmount: 2.35 },
  { date: "2026-07-26", title: "GOOGLE *YouTube", amount: 2236.47, receipt: "00741", nextAmount: 1.5 },
];

for (const fix of fixes) {
  const { data, error } = await supabase.from("transactions").select("id").eq("date", fix.date).eq("title", fix.title).eq("amount", fix.amount).eq("currency", "ARS").like("description", `%comprobante ${fix.receipt}%`);
  if (error) throw error;
  if (!data?.length) throw new Error(`Transaction not found: ${fix.title} ${fix.date} ${fix.receipt}`);
  const result = await supabase.from("transactions").update({ amount: fix.nextAmount, currency: "USD" }).in("id", data.map(row => row.id));
  if (result.error) throw result.error;
  console.log(`Updated ${fix.title} ${fix.date} receipt ${fix.receipt} to USD ${fix.nextAmount}`);
}
