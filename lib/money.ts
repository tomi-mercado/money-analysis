import type { Currency, ExchangeRate } from "./types";
export function rateFor(date:string,rates:ExchangeRate[]){return rates.filter(rate=>rate.date<=date).sort((a,b)=>b.date.localeCompare(a.date))[0]||rates.slice().sort((a,b)=>a.date.localeCompare(b.date))[0];}
export function convertAmount(amount:number,from:Currency,to:Currency,date:string,rates:ExchangeRate[]){if(from===to)return amount;const rate=rateFor(date,rates);if(!rate)return null;return from==="USD"?amount*rate.arsPerUsd:amount/rate.arsPerUsd;}
