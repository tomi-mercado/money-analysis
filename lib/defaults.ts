import { AppData } from "./types";
export const emptyData: AppData = { categories: [], paymentMethods: [], periods: [], transactions: [], budgets: [], recurring: [], rates: [] };
export const seedData: AppData = {
  categories: [{id:"00000000-0000-4000-8000-000000000001",name:"Comida"},{id:"00000000-0000-4000-8000-000000000002",name:"Hogar"},{id:"00000000-0000-4000-8000-000000000003",name:"Transporte"},{id:"00000000-0000-4000-8000-000000000004",name:"Deudas"}],
  paymentMethods: ["Efectivo","Transferencia Mercado Pago","Transferencia Wallbit","Visa Galicia","Visa Mastercard","Mastercard Santander","Visa Hipotecario"].map((name,i)=>({id:`00000000-0000-4000-8000-00000000000${i+1}`,name,type:i>2?"credit_card":"transfer",issuer:i>2?name.split(" ").slice(-1).join(" "):undefined})),
  periods: [], transactions: [], budgets: [], recurring: [], rates: []
};
