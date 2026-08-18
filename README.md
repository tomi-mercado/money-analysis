# Money Analysis

App local de Next.js para seguimiento de dinero. La app usa Supabase cloud cuando `.env.local` está configurado y conserva `localStorage` como fallback de desarrollo. El esquema está en `supabase/schema.sql`.

## Arranque

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

## Supabase

El proyecto `money-analysis` ya fue creado en Supabase, en la región South America (São Paulo), y el esquema ya fue ejecutado. `.env.local` ya contiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

La importación de `transactions.json` queda deliberadamente fuera de esta primera versión.

## Seed de datos

`node scripts/seed-account.mjs` carga categorías sugeridas, tarjetas y períodos de los resúmenes, las transacciones de `transactions.json` y los movimientos identificados en los resúmenes. No modifica presupuestos existentes.
