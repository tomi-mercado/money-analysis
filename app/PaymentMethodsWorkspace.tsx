"use client";

import { FormEvent, useState } from "react";
import { Pencil, X } from "lucide-react";
import { useAppData } from "./AppShell";
import type { Currency, PaymentMethod } from "../lib/types";

const emptyForm = { name: "", type: "cash" as PaymentMethod["type"], issuer: "", lastFour: "", limit: "", limitCurrency: "ARS" as Currency };

export function PaymentMethodsWorkspace() {
  const { data, setData } = useAppData();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const edit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setForm({ name: method.name, type: method.type, issuer: method.issuer || "", lastFour: method.lastFour || "", limit: method.limit === undefined ? "" : String(method.limit), limitCurrency: method.limitCurrency || "ARS" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const values: Omit<PaymentMethod, "id"> = { name: form.name.trim(), type: form.type, issuer: form.issuer.trim() || undefined, lastFour: form.type === "credit_card" ? form.lastFour || undefined : undefined, limit: form.type === "credit_card" && form.limit ? Number(form.limit) : undefined, limitCurrency: form.type === "credit_card" ? form.limitCurrency : undefined };
    setData(current => editingId ? ({ ...current, paymentMethods: current.paymentMethods.map(method => method.id === editingId ? { ...method, ...values } : method) }) : ({ ...current, paymentMethods: [...current.paymentMethods, { id: crypto.randomUUID(), ...values }] }));
    reset();
  };

  return <div className="page"><div className="page-intro"><div><p className="eyebrow" style={{ color: "var(--accent)" }}>CONFIGURACIÓN</p><h3>Métodos de pago</h3><p className="muted">Administrá tarjetas, transferencias y efectivo.</p></div></div><div className="content-layout"><section className="card"><div className="section-head compact"><div><h3>{editingId ? "Editar método" : "Nuevo método"}</h3><p className="muted">{editingId ? "Los cambios conservan las transacciones asociadas." : "Agregá un método para asignarlo a tus movimientos."}</p></div>{editingId && <button type="button" className="icon-button" onClick={reset} aria-label="Cancelar edición"><X size={16} /></button>}</div><form onSubmit={submit} className="stack"><div className="field"><label>Nombre</label><input autoFocus value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Ej. Transferencia Wallbit" /></div><div className="field"><label>Tipo</label><select value={form.type} onChange={event => setForm(current => ({ ...current, type: event.target.value as PaymentMethod["type"] }))}><option value="cash">Efectivo</option><option value="transfer">Transferencia</option><option value="credit_card">Tarjeta de crédito</option></select></div><div className="field"><label>Emisor opcional</label><input value={form.issuer} onChange={event => setForm(current => ({ ...current, issuer: event.target.value }))} placeholder="Ej. Galicia" /></div>{form.type === "credit_card" && <><div className="field"><label>Últimos cuatro dígitos</label><input maxLength={4} value={form.lastFour} onChange={event => setForm(current => ({ ...current, lastFour: event.target.value.replace(/\D/g, "") }))} placeholder="5848" /></div><div className="field"><label>Límite de crédito</label><input type="number" min="0" value={form.limit} onChange={event => setForm(current => ({ ...current, limit: event.target.value }))} placeholder="Opcional" /></div><div className="field"><label>Moneda del límite</label><select value={form.limitCurrency} onChange={event => setForm(current => ({ ...current, limitCurrency: event.target.value as Currency }))}><option value="ARS">ARS</option><option value="USD">USD</option></select></div></>}<div className="row-actions"><button className="button">{editingId ? "Guardar cambios" : "Crear método"}</button>{editingId && <button type="button" className="button secondary" onClick={reset}>Cancelar</button>}</div></form></section><section className="card"><div className="section-head compact"><div><h3>Métodos configurados</h3><p className="muted">{data.paymentMethods.length} métodos disponibles.</p></div></div><div className="list">{data.paymentMethods.slice().sort((a, b) => a.name.localeCompare(b.name)).map(method => <div className="list-row" key={method.id}><div><strong>{method.name}</strong><div className="muted">{method.type === "credit_card" ? `Tarjeta de crédito${method.issuer ? ` · ${method.issuer}` : ""}${method.lastFour ? ` · •••• ${method.lastFour}` : ""}` : method.type === "transfer" ? "Transferencia" : "Efectivo"}</div></div><button type="button" className="icon-button" onClick={() => edit(method)} aria-label={`Editar ${method.name}`}><Pencil size={15} /></button></div>)}{!data.paymentMethods.length && <div className="empty-state">Todavía no hay métodos configurados.</div>}</div></section></div></div>;
}
