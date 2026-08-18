"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { useAppData } from "../../AppShell";
import { convertAmount } from "../../../lib/money";
import type { Currency, Transaction } from "../../../lib/types";

const money = (amount: number, currency: Currency) => new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
const monthKey = (date: string) => date.slice(0, 7);
const monthLabel = (key: string) => new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(new Date(`${key}-01T12:00:00`));

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="detail-field"><span className="muted">{label}</span><strong>{children}</strong></div>;
}

export default function TransactionDetailPage() {
  const { data, currency, selectedPeriod } = useAppData();
  const params = useParams<{ id: string }>();
  const transaction = data.transactions.find(item => item.id === params.id) as Transaction | undefined;

  if (!transaction) {
    return <div className="page"><section className="card"><h3>Transacción no encontrada</h3><p className="muted">La transacción ya no existe o el enlace no es válido.</p><Link className="button secondary" href={`/transactions?period=${selectedPeriod}`}><ArrowLeft size={16} /> Volver a transacciones</Link></section></div>;
  }

  const paymentMethod = data.paymentMethods.find(item => item.id === transaction.paymentMethodId);
  const budget = data.budgets.find(item => item.id === transaction.budgetId);
  const recurring = data.recurring.find(item => item.id === transaction.sourceTransactionId);
  const converted = convertAmount(transaction.amount, transaction.currency, currency, transaction.date, data.rates);
  const period = monthKey(transaction.date);

  return <div className="page"><div className="page-intro"><div><Link className="back-link" href={`/transactions?period=${selectedPeriod}`}><ArrowLeft size={15} /> Transacciones</Link><p className="eyebrow" style={{ color: "var(--accent)" }}>DETALLE DE TRANSACCIÓN</p><h3>{transaction.title}</h3><p className="muted">Movimiento registrado el {transaction.date}.</p></div><Link className="button secondary" href={`/transactions?period=${period}`}><ExternalLink size={16} /> Ver en transacciones</Link></div><section className="card transaction-detail-card"><div className="transaction-detail-hero"><div><span className={`pill ${transaction.direction === "expense" ? "warn" : "good"}`}>{transaction.direction === "expense" ? "Gasto" : "Ingreso"}</span><h2>{converted === null ? money(transaction.amount, transaction.currency) : money(converted, currency)}</h2>{transaction.currency !== currency && <p className="muted">Importe original: {money(transaction.amount, transaction.currency)}</p>}</div><span className={`pill ${transaction.status === "paid" ? "good" : "warn"}`}>{transaction.status === "paid" ? "Pagado" : "Pendiente"}</span></div><div className="detail-fields"><DetailField label="Título">{transaction.title}</DetailField><DetailField label="Descripción">{transaction.description || "Sin descripción"}</DetailField><DetailField label="URL">{transaction.url ? <a href={transaction.url} target="_blank" rel="noreferrer">{transaction.url}</a> : "Sin URL"}</DetailField><DetailField label="Fecha">{transaction.date}</DetailField><DetailField label="Período de registro">{monthLabel(period)}</DetailField><DetailField label="Método de pago">{paymentMethod?.name || "Sin asignar"}</DetailField><DetailField label="Presupuesto">{budget ? <Link href={`/budgets?period=${selectedPeriod}&budget=${budget.id}`}>{budget.name}</Link> : "Sin asignar"}</DetailField>{transaction.installments && transaction.installments > 1 && <DetailField label="Plan de cuotas">Cuota {transaction.installmentNumber || 1} de {transaction.installments}</DetailField>}{recurring && <DetailField label="Recurrente asociado">{recurring.title}</DetailField>}</div></section><div className="page-actions"><Link className="button secondary" href={`/transactions?period=${selectedPeriod}`}><ArrowLeft size={16} /> Volver a transacciones</Link>{budget && <Link className="button" href={`/budgets?period=${selectedPeriod}&budget=${budget.id}`}>Ver presupuesto</Link>}</div></div>;
}
