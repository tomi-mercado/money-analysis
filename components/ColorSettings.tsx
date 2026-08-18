"use client";

import { useEffect } from "react";
import { useAppData } from "../app/AppShell";
import { getBackgroundColor, getTextColor, randomColor } from "../lib/colors";
import type { Budget, PaymentMethod } from "../lib/types";

type ColorEntity = Budget | PaymentMethod;
type EntityKind = "budgets" | "paymentMethods";

const labels: Record<EntityKind, string> = { budgets: "Presupuestos", paymentMethods: "Métodos de pago" };

export function ColorSettings({ kind }: { kind: EntityKind }) {
  const { data, setData } = useAppData();
  const entities = data[kind] as ColorEntity[];
  useEffect(() => {
    const missingIds = entities.filter(entity => !entity.backgroundColor).map(entity => entity.id);
    if (!missingIds.length) {
      return;
    }

    setData(current => ({ ...current, [kind]: (current[kind] as ColorEntity[]).map(entity => missingIds.includes(entity.id) ? { ...entity, backgroundColor: randomColor() } : entity) }));
  }, [entities, kind, setData]);
  const updateColor = (id: string, backgroundColor: string) => {
    setData(current => ({ ...current, [kind]: (current[kind] as ColorEntity[]).map(entity => entity.id === id ? { ...entity, backgroundColor } : entity) }));
  };

  return <section className="card color-settings"><div className="section-head compact"><div><h3>Colores de {labels[kind].toLowerCase()}</h3><p className="muted">Elegí el fondo. El color del texto se calcula automáticamente para mantener contraste.</p></div></div><div className="color-settings-list">{entities.slice().sort((a, b) => a.name.localeCompare(b.name)).map(entity => { const backgroundColor = getBackgroundColor(entity.backgroundColor, entity.id); return <label className="color-setting-row" key={entity.id}><span className="color-setting-preview" style={{ backgroundColor, color: getTextColor(backgroundColor) }}>{entity.name}</span><input type="color" value={backgroundColor} onChange={event => updateColor(entity.id, event.target.value)} aria-label={`Color de ${entity.name}`} /><code>{backgroundColor}</code></label>; })}{!entities.length && <p className="muted">Todavía no hay elementos para configurar.</p>}</div></section>;
}
