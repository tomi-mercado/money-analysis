import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = (url.searchParams.get("dates") || new Date().toISOString().slice(0, 10)).split(",").filter(Boolean);
  try {
    const response = await fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares/bolsa", { next: { revalidate: 3600 } });
    if (!response.ok) return NextResponse.json({ error: "No se pudo consultar la fuente MEP" }, { status: 502 });
    const history = (await response.json()) as Array<{ fecha: string; venta: number }>;
    const sorted = history.filter(item => item.fecha && Number.isFinite(item.venta)).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const rates = requested.map(date => {
      const exact = sorted.find(item => item.fecha === date);
      const fallback = sorted.filter(item => item.fecha <= date).at(-1) || sorted[0];
      const item = exact || fallback;
      return item ? { date, arsPerUsd: item.venta, source: exact ? "ArgentinaDatos · MEP" : `ArgentinaDatos · MEP (${item.fecha})`, manual: false, fallback: !exact } : null;
    }).filter(Boolean);
    return NextResponse.json({ rates });
  } catch {
    return NextResponse.json({ error: "No se pudo consultar la fuente MEP" }, { status: 502 });
  }
}
