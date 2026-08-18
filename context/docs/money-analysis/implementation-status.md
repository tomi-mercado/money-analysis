# Estado de implementación

## Primera versión creada

- App Next.js 15 con App Router y TypeScript.
- Navegación responsive para resumen, transacciones, presupuestos, tarjetas, recurrentes, categorías, métodos de pago y cotizaciones MEP.
- Persistencia local en `localStorage` para poder usar la interfaz inmediatamente.
- Esquema inicial de Supabase en `supabase/schema.sql`, incluyendo tablas para períodos, tarjetas, transacciones, cuotas, presupuestos, reglas, recurrentes, cotizaciones e histórico de límites.
- `.env.example` preparado para URL y anon key de Supabase.

## Limitaciones actuales

- `localStorage` sigue disponible como fallback de desarrollo, pero Supabase ya está configurado como fuente cloud cuando hay conexión.
- La integración automática con una fuente gratuita de dólar MEP todavía no está conectada.
- La importación de `transactions.json` sigue fuera de alcance.
- La generación mensual de instancias recurrentes y el vínculo con una transacción efectiva están representados en la UI inicial, pero necesitan persistencia cloud y validación completa.

## UX refactor

- El shell global ahora expone el período seleccionado y lo persiste en `?period=YYYY-MM` para que la navegación sea reproducible y compartible.
- La moneda ARS/USD es global y se usa para presentar consumos y totales; los importes originales se conservan.
- Presupuestos ahora muestran resumen del período, totales, consumido/asignado/restante, gastos sin presupuesto y detalle seleccionable.
- Tarjetas ahora tienen alta/edición/eliminación en un panel lateral, selección por URL (`?card=`), detalle de tarjeta, calendario y proyección en el mismo contexto.

- La fuente MEP automática está implementada mediante `/api/exchange-rates`, con histórico diario, fallback y persistencia en Supabase.
- Presupuestos ya no duplican el listado: las acciones viven en cada tarjeta y el detalle se navega mediante `?budget=<id>` con regreso explícito.
