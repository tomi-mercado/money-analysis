import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Missing Supabase environment variables");
const supabase = createClient(url, key);
const uuid = () => crypto.randomUUID();
const money = value => Number(String(value).replaceAll(".", "").replace(",", "."));
const parseDate = value => { const [day, month, year] = value.split("-"); const months = {Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12",Ene:"01"}; return `20${year}-${months[month] || month}-${day.padStart(2,"0")}`; };
const periodKey = "2026-07";

const statementRows = [
  // Galicia Visa 3542
  ["2026-02-02","MERPAGO*MERCADOLIBRE",28698.22,"ARS",6,9,"064898","Visa Galicia"],["2026-02-02","MERPAGO*MERCADOLIBRE",64962.42,"ARS",6,6,"626315","Visa Galicia"],["2026-04-06","MERPAGO*LEGIONMENACE",14366.50,"ARS",4,6,"299916","Visa Galicia"],["2026-05-20","STORE 409-LINK DE PAGO",121155.06,"ARS",3,3,"072737","Visa Galicia"],["2026-05-24","MERPAGO*FAIRCOSA",133333.22,"ARS",3,9,"552764","Visa Galicia"],["2026-06-22","MERPAGO*FARMAMIX",21401.94,"ARS",2,2,"445439","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",12491.33,"ARS",2,6,"507898","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",6083.16,"ARS",2,6,"541110","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",6083.16,"ARS",3,6,"541110","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",6083.16,"ARS",4,6,"541110","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",6083.16,"ARS",5,6,"541110","Visa Galicia"],["2026-06-29","MERPAGO*MERCADOLIBRE",6083.16,"ARS",6,6,"541110","Visa Galicia"],["2026-06-29","MERPAGO*TUBLANCO",16249.16,"ARS",2,6,"043893","Visa Galicia"],["2026-07-05","DLO*PedidosYa Propina",900,"ARS",null,null,"242768","Visa Galicia"],["2026-07-05","PEDIDOSYA*MILANGA LA PL",28025,"ARS",null,null,"005428","Visa Galicia"],["2026-07-05","GOOGLE *YouTube",4.62,"USD",null,null,"983748","Visa Galicia"],["2026-07-13","MERPAGO*CHUBBTES",1889.59,"ARS",null,null,"426229","Visa Galicia"],["2026-07-13","GOOGLE *YouTube",0.68,"USD",null,null,"625981","Visa Galicia"],["2026-07-15","MERPAGO*TUGO",8500,"ARS",null,null,"399177","Visa Galicia"],["2026-07-16","MERPAGO*MELI",1466.67,"ARS",null,null,"229052","Visa Galicia"],["2026-07-19","MERPAGO*TIENDAGP",3971.38,"ARS",1,6,"755762","Visa Galicia"],["2026-07-24","TELECENTRO SA",43486,"ARS",null,null,"000001","Visa Galicia"],["2026-07-24","OSDE",236680.01,"ARS",null,null,"005749","Visa Galicia"],["2026-07-24","OSDE",236680.01,"ARS",null,null,"005749","Visa Galicia"],["2026-07-24","MERPAGO*MERCADOLIBRE devolución",-36499,"ARS",null,null,"541110","Visa Galicia"],["2026-07-24","OSDE devolución",-236680.01,"ARS",null,null,"005749","Visa Galicia"],["2026-07-26","MERPAGO*QUILMESATLETICOCL",67000,"ARS",null,null,"645837","Visa Galicia"],["2026-07-27","MERPAGO*MAX",8122.73,"ARS",null,null,"100636","Visa Galicia"],["2026-07-27","NETFLIX.COM",6.08,"USD",null,null,"014678","Visa Galicia"],["2026-07-28","MERPAGO*MELI",13990,"ARS",null,null,"520015","Visa Galicia"],
  // Galicia Mastercard Gold
  ["2026-07-06","APPLE.COM/BILL",0.99,"USD",null,null,"00752","Mastercard Galicia"],["2026-07-17","APPLE.COM/BILL",23.99,"USD",null,null,"00742","Mastercard Galicia"],["2026-07-19","GOOGLE *Google",4.99,"USD",null,null,"00741","Mastercard Galicia"],["2026-07-24","GOOGLE *YouTube",3500,"ARS",null,null,"00717","Mastercard Galicia"],["2026-07-26","GOOGLE *YouTube",2236.47,"ARS",null,null,"00741","Mastercard Galicia"],["2026-07-07","MERPAGO*GUAPO",72600,"ARS",null,null,"00207","Mastercard Galicia"],["2026-07-20","PEDIDOSYA*PLUS",6390,"ARS",null,null,"09600","Mastercard Galicia"],["2026-01-13","MERPAGO*ASSIST",20147.28,"ARS",7,12,"02439","Mastercard Galicia"],["2026-02-02","MERPAGO*MERCADOLIBRE",102527.33,"ARS",6,6,"05141","Mastercard Galicia"],["2026-03-10","MERPAGO*DISTRITOBLANC",12468.55,"ARS",5,6,"02770","Mastercard Galicia"],["2026-03-19","MERPAGO*LEGIONMENACE",57699.33,"ARS",5,6,"03953","Mastercard Galicia"],["2026-05-16","MERPAGO*MERCADOLIBRE",25448.41,"ARS",3,9,"09705","Mastercard Galicia"],["2026-05-16","MERPAGO*PEDIDO4826892",35408.33,"ARS",3,12,"09706","Mastercard Galicia"],["2026-06-17","STORE 409-LINK DE PAGO",140737.06,"ARS",2,3,"03485","Mastercard Galicia"],["2026-06-28","MERPAGO*MERCADOLIBRE",33320,"ARS",2,6,"09443","Mastercard Galicia"],["2026-07-10","DI TORO HNOS SA",110255.40,"ARS",1,6,"06926","Mastercard Galicia"],
  // Santander Visa 1411
  ["2025-10-24","Verisure alarmas",25107.39,"ARS",9,12,"411397","Visa Santander"],["2025-12-24","Rouge liniers",21327.77,"ARS",8,9,"002101","Visa Santander"],["2025-12-24","Rouge liniers",36525,"ARS",8,12,"002100","Visa Santander"],["2026-07-06","Merpago*verisure",103419.45,"ARS",null,null,"451017","Visa Santander"],["2026-07-08","Deheza 1736",79006.88,"ARS",null,null,"003176","Visa Santander"],["2026-07-09","Www.carrefour.com.ar",561175.61,"ARS",null,null,"003034","Visa Santander"],["2026-07-23","Seguro de vivienda",99103.96,"ARS",null,null,"012770","Visa Santander"],
  // Hipotecario image rows: no category/budget inferred.
  ["2026-03-12","MERPAGO*PRUNE",28166.66,"ARS",5,6,"628229","Visa Hipotecario"],["2026-03-16","MERPAGO*SMOOKIES",14051.26,"ARS",5,6,"768229","Visa Hipotecario"],["2026-03-28","MERPAGO*CHEKY",44053.33,"ARS",4,6,"630396","Visa Hipotecario"],["2026-03-28","MERPAGO*ARREDO",19744.16,"ARS",4,12,"960393","Visa Hipotecario"],["2026-04-02","MERPAGO*ARREDO",37075,"ARS",4,6,"822482","Visa Hipotecario"],["2026-04-09","MERPAGO*CHEKY",61353.33,"ARS",4,6,"495284","Visa Hipotecario"],["2026-04-09","MERPAGO*VERAPASIONADA",74666.66,"ARS",4,9,"930801","Visa Hipotecario"],
];

const categories = [
  ["Comida",null],["Supermercado","Comida"],["Delivery","Comida"],["Hogar",null],["Servicios","Hogar"],["Internet","Servicios"],["Seguros","Hogar"],["Transporte",null],["Salud",null],["Farmacia","Salud"],["Obra social","Salud"],["Suscripciones",null],["Entretenimiento",null],["Deportes",null],["Impuestos",null],["Impuestos de tarjeta","Impuestos"],["Compras",null],["Deudas",null],["Transferencias",null]
];

const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const classifyImported = item => {
  const text = normalize([item.counterparty, item.description, item.reason, item.operation, item.activity_type].join(" "));
  if (/netflix|youtube|google|apple\.com|spotify|disney|hbo|suscripcion|membresia|meli\+/.test(text)) return { category: "Suscripciones", budget: "Suscripciones y membresías", label: "Suscripción" };
  if (/carrefour|supermercado|coto|dia supermercado|jumbo|disco/.test(text)) return { category: "Supermercado", budget: "Supermercado", label: "Supermercado" };
  if (/pedidosya|rappi|delivery|milanga|comida/.test(text)) return { category: "Delivery", budget: "Supermercado", label: "Comida" };
  if (/edesur|edenor|luz|electricidad/.test(text)) return { category: "Servicios", budget: "Luz", label: "Servicio de luz" };
  if (/telecentro|internet|fibertel|movistar|personal/.test(text)) return { category: "Internet", budget: null, label: "Internet" };
  if (/osde|farmacia|farmamix|salud|medico|medica|obra social/.test(text)) return { category: "Salud", budget: "Salud", label: "Salud" };
  if (/verisure|seguro|chubb/.test(text)) return { category: "Seguros", budget: "Seguros y coberturas", label: "Seguro" };
  if (/prune|arredo|cheky|smookies|ropa|zara|nike|adidas/.test(text)) return { category: "Compras", budget: "Ropa", label: "Compra" };
  if (/transferencia|dinero retirado|dinero recibido|ingreso|jubilacion/.test(text)) return { category: "Transferencias", budget: null, label: "Transferencia" };
  if (/mercadolibre|mercado libre|merpago|compra|purchase/.test(text)) return { category: "Compras", budget: null, label: "Compra" };
  return { category: null, budget: null, label: null };
};

const { data: existingMethods, error: methodsError } = await supabase.from("payment_methods").select("id,name,type");
if (methodsError) throw methodsError;
const methodByName = new Map(existingMethods.map(method => [method.name, method]));
for (const [name, issuer, lastFour] of [["Visa Galicia","Galicia","3542"],["Mastercard Galicia","Galicia",null],["Visa Santander","Santander","1411"],["Visa Hipotecario","Hipotecario",null]]) {
  const found = methodByName.get(name);
  const payload = { name, type: "credit_card", issuer, last_four: lastFour };
  const result = found ? await supabase.from("payment_methods").update(payload).eq("id", found.id).select("*").single() : await supabase.from("payment_methods").insert(payload).select("*").single();
  if (result.error) throw result.error;
  methodByName.set(name, result.data);
}

const categoryByName = new Map();
for (const [name, parentName] of categories) {
  const parentId = parentName ? categoryByName.get(parentName)?.id || null : null;
  const existing = (await supabase.from("categories").select("id,name").eq("name", name).maybeSingle()).data;
  const result = existing ? await supabase.from("categories").update({ parent_id: parentId }).eq("id", existing.id).select("*").single() : await supabase.from("categories").insert({ name, parent_id: parentId }).select("*").single();
  if (result.error) throw result.error;
  categoryByName.set(name, result.data);
}
const { data: existingBudgets, error: budgetsError } = await supabase.from("budgets").select("id,name");
if (budgetsError) throw budgetsError;
const budgetByName = new Map(existingBudgets.map(budget => [budget.name, budget]));

const months=[]; for(let year=2025;year<=2027;year++)for(let month=1;month<=12;month++){const key=`${year}-${String(month).padStart(2,"0")}`;months.push({key,label:key,month_date:`${key}-01`})}
const periodResult=await supabase.from("periods").upsert(months).select(); if(periodResult.error)throw periodResult.error;
const cardPeriods=[
 {card:"Visa Galicia",period_key:"2026-07",start_date:"2026-07-03",closing_date:"2026-07-30",due_date:"2026-08-07"},{card:"Visa Galicia",period_key:"2026-08",start_date:"2026-07-31",closing_date:"2026-08-27",due_date:"2026-09-04"},
 {card:"Mastercard Galicia",period_key:"2026-07",start_date:"2026-07-03",closing_date:"2026-07-30",due_date:"2026-08-07"},{card:"Mastercard Galicia",period_key:"2026-08",start_date:"2026-07-31",closing_date:"2026-08-27",due_date:"2026-09-04"},
 {card:"Visa Santander",period_key:"2026-07",start_date:"2026-07-03",closing_date:"2026-07-30",due_date:"2026-08-07"},{card:"Visa Santander",period_key:"2026-08",start_date:"2026-07-31",closing_date:"2026-08-27",due_date:"2026-09-04"},
 {card:"Visa Hipotecario",period_key:"2026-08",start_date:"2026-08-01",closing_date:"2026-08-31",due_date:null},
];
for(const item of cardPeriods){const card=methodByName.get(item.card);const result=await supabase.from("card_periods").upsert({card_id:card.id,period_key:item.period_key,start_date:item.start_date,closing_date:item.closing_date,due_date:item.due_date},{onConflict:"card_id,period_key"});if(result.error)throw result.error}

const { data: existingTransactions }=await supabase.from("transactions").select("title,date,amount");
const existingKeys=new Set((existingTransactions||[]).map(t=>`${t.title}|${t.date}|${Number(t.amount).toFixed(2)}`));
const rows=[];
for(const item of statementRows){const [date,title,installmentAmount,currency,currentInstallment,totalInstallments,receipt,cardName]=item;const amount=currentInstallment&&totalInstallments?Number((installmentAmount*totalInstallments).toFixed(2)):installmentAmount;const key=`${title}|${date}|${amount.toFixed(2)}`;if(existingKeys.has(key))continue;rows.push({id:uuid(),title,description:`Resumen julio 2026 · comprobante ${receipt}${currentInstallment?` · cuota ${currentInstallment}/${totalInstallments}`:""}`,date,amount,currency,direction:"expense",payment_method_id:methodByName.get(cardName).id,period_key:periodKey,status:"paid",installments:totalInstallments||null,installment_number:currentInstallment||null,category_id:null,created_at:new Date().toISOString()});existingKeys.add(key)}
const imported=JSON.parse(await fs.readFile("transactions.json","utf8"));
 for(const item of imported){const date=item.date;const amount=Number(item.amount);const inference=classifyImported(item);const merchant=item.counterparty||"Transacción importada";const title=inference.label?`${merchant} — ${inference.label}`:merchant;const description=item.description||item.reason||item.operation||item.raw_listing||null;const key=`${title}|${date}|${amount.toFixed(2)}`;if(existingKeys.has(key))continue;rows.push({id:uuid(),title,description,date,time:item.time||null,amount:Math.abs(amount),currency:item.currency||"ARS",direction:item.direction==="credit"?"income":item.direction==="debit"?"expense":(amount<0?"expense":"income"),payment_method_id:null,period_key:date.slice(0,7),status:"paid",installments:null,installment_number:null,budget_id:inference.budget?budgetByName.get(inference.budget)?.id||null:null,category_ids:inference.category&&categoryByName.get(inference.category)?[categoryByName.get(inference.category).id]:[],created_at:new Date().toISOString()});existingKeys.add(key)}
 for(let i=0;i<rows.length;i+=100){const sourceRows=rows.slice(i,i+100);const batch=sourceRows.map(({category_ids,category_id,...row})=>row);const result=await supabase.from("transactions").insert(batch).select("id");if(result.error)throw result.error;const categoryRows=sourceRows.flatMap((row,index)=>(row.category_ids||[]).map(categoryId=>({transaction_id:result.data[index].id,category_id:categoryId})));if(categoryRows.length){const categoryResult=await supabase.from("transaction_categories").insert(categoryRows);if(categoryResult.error)throw categoryResult.error}}
console.log(JSON.stringify({cards:4,periods:cardPeriods.length,categories:categories.length,statementTransactions:statementRows.length,insertedTransactions:rows.length,budgetsChanged:false},null,2));
