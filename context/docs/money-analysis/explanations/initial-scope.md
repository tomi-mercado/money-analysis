# Alcance y modelo inicial

Money Analysis comienza como una aplicación personal. El objetivo inicial no es importar automáticamente el historial existente, sino construir una base manual y explícita para registrar transacciones y asociarlas con categorías y métodos de pago.

El método de pago no es sólo una etiqueta: en el caso de una tarjeta de crédito contiene reglas de calendario. Una compra con tarjeta puede generar varios impactos futuros, por lo que el sistema debe distinguir el registro de la compra de la proyección de cuotas y debe conservar las fechas de cierre y vencimiento que determinan cuándo se espera cada impacto. El período es globalmente un mes de la aplicación; cada tarjeta aporta sus propias fechas para decidir en qué período mensual cae la primera cuota.

Todavía no está decidido si se almacenará una compra como una sola transacción con datos de cuotas o como una entidad de compra más una colección de cuotas. Esa decisión afecta el esquema de Supabase, la edición de transacciones y la forma de calcular la vista mensual; debe resolverse antes de implementar el modelo definitivo.
