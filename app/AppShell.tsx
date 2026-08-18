"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, CreditCard, Gauge, LayoutDashboard, Menu, Repeat2, WalletCards, X } from "lucide-react";
import { emptyData } from "../lib/defaults";
import { loadCloudData, queueCloudSync } from "../lib/sync";
import { supabase } from "../lib/supabase";
import type { AppData, Currency } from "../lib/types";

type AppContextValue = { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; currency: Currency; setCurrency: (c: Currency) => void; selectedPeriod: string; setSelectedPeriod: (period: string) => void };
const AppContext = createContext<AppContextValue | null>(null);
export function useAppData(){ const value=useContext(AppContext); if(!value) throw new Error("useAppData must be used inside AppShell"); return value; }
const nav=[
  {href:"/",label:"Resumen",icon:LayoutDashboard}, {href:"/transactions",label:"Transacciones",icon:WalletCards}, {href:"/budgets",label:"Presupuestos",icon:Gauge}, {href:"/cards",label:"Tarjetas",icon:CreditCard}, {href:"/recurring",label:"Recurrentes",icon:Repeat2},
  {href:"/payment-methods",label:"Métodos de pago",icon:WalletCards}, {href:"/exchange-rates",label:"Cotizaciones MEP",icon:BarChart3},
];
const currentMonth=()=>{const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`};
const shiftMonth=(period:string,amount:number)=>{const date=new Date(`${period}-01T12:00:00`);date.setMonth(date.getMonth()+amount);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`};
const monthLabel=(period:string)=>new Intl.DateTimeFormat("es-AR",{month:"long",year:"numeric"}).format(new Date(`${period}-01T12:00:00`));
export function AppShell({children}:{children:React.ReactNode}){
  const pathname=usePathname(); const [open,setOpen]=useState(false); const [data,setData]=useState<AppData>(emptyData); const [currency,setCurrencyState]=useState<Currency>("ARS"); const [hydrated,setHydrated]=useState(false); const [cloudReady,setCloudReady]=useState(false); const [selectedPeriod,setSelectedPeriodState]=useState(currentMonth());
  useEffect(()=>{let active=true; (async()=>{try{const cloud=await loadCloudData(); if(!active)return; const initialData:AppData=cloud?{...emptyData,...cloud} as AppData:emptyData; setData(initialData); setCloudReady(Boolean(cloud)); const transactionDates=initialData.transactions.map(item=>item.date); if(transactionDates.length){try{const ratesResponse=await fetch(`/api/exchange-rates?dates=${[...new Set(transactionDates)].join(",")}`);const ratesPayload=await ratesResponse.json();if(active&&Array.isArray(ratesPayload.rates))setData(current=>({...current,rates:[...current.rates,...ratesPayload.rates.filter((rate:{date:string})=>!current.rates.some(existing=>existing.date===rate.date))]}))}catch{}} const queryPeriod=new URLSearchParams(window.location.search).get("period"); if(queryPeriod&&/^\d{4}-\d{2}$/.test(queryPeriod))setSelectedPeriodState(queryPeriod);}catch{setData(emptyData);setCloudReady(false)}finally{if(active)setHydrated(true)}})(); return()=>{active=false}},[]);
  useEffect(()=>{if(hydrated&&cloudReady&&supabase)queueCloudSync(data);},[data,hydrated,cloudReady]);
  const setCurrency=(c:Currency)=>{setCurrencyState(c)};
 const setSelectedPeriod=(period:string)=>{setSelectedPeriodState(period);const url=new URL(window.location.href);url.searchParams.set("period",period);window.history.pushState({},"",url);window.dispatchEvent(new PopStateEvent("popstate"))};
  const title=pathname.startsWith("/transactions")?"Transacciones":nav.find(item=>item.href===pathname)?.label || "Resumen";
 const value=useMemo(()=>({data,setData,currency,setCurrency,selectedPeriod,setSelectedPeriod}),[data,currency,selectedPeriod]);
 const periodHref=(href:string)=>`${href}?period=${selectedPeriod}`;
 return <AppContext.Provider value={value}><div className="shell"><aside className={`sidebar ${open?"open":""}`}><div className="brand">money<span>/</span>analysis</div><div className="nav-label">NAVEGAR</div>{nav.map(item=>{const Icon=item.icon;return <Link onClick={()=>setOpen(false)} className={`nav-link ${pathname===item.href?"active":""}`} href={periodHref(item.href)} key={item.href}><Icon size={17}/>{item.label}</Link>})}<div className="nav-label">ESTADO</div><p className="muted" style={{padding:"0 12px",color:"#9ba7bd",lineHeight:1.5}}>{supabase?"Supabase conectado · datos sincronizados":"Modo local · configurá Supabase para sincronizar"}</p></aside><main className="main"><div className="topbar"><button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Menú móvil">{open?<X size={18}/>:<Menu size={18}/>}</button><div><h2>{title}</h2><p className="topbar-context">Todo lo que ves corresponde a este período.</p></div><div className="topbar-tools"><div className="period-switcher"><button onClick={()=>setSelectedPeriod(shiftMonth(selectedPeriod,-1))} aria-label="Período anterior"><ArrowLeft size={15}/></button><strong>{monthLabel(selectedPeriod)}</strong><button onClick={()=>setSelectedPeriod(shiftMonth(selectedPeriod,1))} aria-label="Período siguiente"><ArrowRight size={15}/></button></div><div className="currency-toggle"><button className={currency==="ARS"?"active":""} onClick={()=>setCurrency("ARS")}>ARS</button><button className={currency==="USD"?"active":""} onClick={()=>setCurrency("USD")}>USD</button></div></div></div>{children}</main></div></AppContext.Provider>
}
