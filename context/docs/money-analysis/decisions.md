# Decisiones confirmadas

## Producto

- La aplicación será de uso exclusivo de una persona inicialmente.
- Inicialmente no tendrá autenticación; el acceso será sin login.
- La importación automática del `transactions.json` existente queda fuera de la primera etapa y se tratará más adelante.
- La aplicación tendrá, como mínimo, páginas para cargar transacciones, crear categorías, crear métodos de pago y visualizar tarjetas de crédito.

## Tecnología

- La aplicación se construirá con Next.js y Supabase.
- Inicialmente se ejecutará sólo de forma local; no se prioriza un despliegue online.
- La interfaz debe ser responsive y usable desde escritorio y celular.
- Aunque la aplicación se ejecute localmente, la base de datos de Supabase estará alojada en la nube.
- Se deberá crear un proyecto nuevo de Supabase para la aplicación.
- La fuente del dólar MEP debe ser pública y gratuita; la integración debe quedar reemplazable si cambia o deja de estar disponible.
- Para el primer período de una tarjeta se ingresará manualmente la fecha de inicio; los períodos posteriores calcularán su inicio como el día posterior al cierre anterior.
- Si se modifican las fechas de un período, se recalculará automáticamente la asignación de la primera cuota y las proyecciones.
- Las correcciones manuales de asignación de una compra no son permanentes frente a cambios posteriores en las fechas; el sistema vuelve a calcular las asignaciones.
- Una compra asignada al período `mayo YYYY` pertenece al período global de mayo, aunque la fecha de cierre y vencimiento que la determinaron sean específicas de su tarjeta.
- Las transacciones, presupuestos y configuraciones de ciclos de tarjetas pertenecen a un período global mensual.
- Los períodos globales se crearán automáticamente como meses calendario.
- Una compra con tarjeta puede guardarse aunque no haya un período configurado para su fecha; queda pendiente de asignación y aparece en la bandeja de pendientes.

## Tarjetas de crédito

- Una tarjeta de crédito es un método de pago especializado de tipo `Tarjeta de crédito`.
- Una tarjeta debe representar consumos en cuotas y pagos diferidos.
- La visualización debe permitir proyectar cuánto impactará en meses futuros.
- Las fechas de cierre y vencimiento se actualizan mensualmente y deben formar parte del modelo, no ser texto libre aislado.
- Un período es globalmente un mes de la aplicación. Las tarjetas no crean períodos independientes: cada tarjeta tiene su configuración de fechas para asignar transacciones al período mensual global correspondiente.
- Para la configuración de una tarjeta, la fecha de inicio de su ciclo se calculará automáticamente como el día posterior al cierre del ciclo anterior.
- La fecha de la transacción se usa para determinar automáticamente el período donde impacta la primera cuota, con posibilidad de corregir manualmente el período en excepciones.
- Una compra realizada el mismo día del cierre pertenece al período que está cerrando.
- Los períodos se cargarán manualmente por ahora; no habrá generación masiva automática.
- Cada período se nombrará con el mes y año que tenga más días dentro de sus fechas. Por ejemplo, del 20 de abril al 24 de mayo se llama `mayo YYYY`.
- Los períodos mensuales globales no deben quedar repetidos. Si se detecta un duplicado, la aplicación debe pedir una corrección manual.
- Se espera un período mensual global; para cada tarjeta el usuario completará manualmente las fechas de cierre y vencimiento a medida que las conozca.
- La aplicación bloqueará el guardado de la configuración de una tarjeta si sus ciclos tienen huecos o solapamientos.
- Una transacción puede tener varias categorías.
- Las categorías pueden organizarse jerárquicamente.

## Métodos de pago

- Los métodos iniciales serán: `Efectivo`, `Transferencia Mercado Pago`, `Transferencia Wallbit`, `Visa Galicia`, `Visa Mastercard`, `Mastercard Santander` y `Visa Hipotecario`.
- Las tarjetas de crédito son métodos de pago especializados de tipo `Tarjeta de crédito`.
- Las tarjetas podrán guardar nombre, banco/emisor, últimos cuatro dígitos y límite de crédito, además de sus períodos.
- La moneda del límite de crédito será configurable por tarjeta.
- Los límites de crédito deben conservar histórico por período/fecha, no sólo el valor actual.

## Presupuestos

- La aplicación tendrá presupuestos. Un presupuesto no es una categoría: agrupa varias transacciones y permite seguir cuánto del presupuesto ya fue consumido.
- Cada presupuesto puede elegir independientemente su moneda base.
- La visualización de un presupuesto podrá cambiarse a la moneda de visualización elegida para la aplicación, usando conversión sin modificar la moneda base.
- La aplicación tendrá un selector global de moneda de visualización ARS/USD que afectará toda la app.
- Cuando una compra en cuotas pertenece a un presupuesto, cada período consume sólo el importe de la cuota correspondiente, no el total de la compra.
- Las transacciones tendrán un título y una descripción opcional; no se separará comercio en un campo obligatorio en la primera etapa.
- Al cargar una transacción se elegirá explícitamente si es un ingreso o un gasto; el usuario no ingresará signos manualmente.
- La hora de la transacción será opcional.
- Las cuotas iguales se redondearán distribuyendo la diferencia mínima entre ellas para que la suma coincida exactamente con el total.
- Los presupuestos contabilizarán gastos por ahora; no ingresos.
- Las transacciones podrán editarse y eliminarse libremente; no se requiere un estado de anulación en la primera etapa.
- Cada presupuesto se evalúa dentro de un período específico.
- Un presupuesto tiene una asignación base mensual reutilizable.
- La asignación puede sobrescribirse para un período concreto o modificarse de forma general para los períodos futuros/por defecto.
- Cada presupuesto puede tener reglas para sugerir o asignar automáticamente transacciones según sus datos.
- La asignación automática debe poder modificarse manualmente por transacción.
- Una transacción puede pertenecer como máximo a un presupuesto.
- Las reglas generan sugerencias de presupuesto al cargar o editar una transacción. El usuario puede elegir una sugerencia o seleccionar manualmente otro presupuesto; la regla no debe imponer una asignación irreversible.
- Inicialmente las reglas de presupuesto usarán categoría, método de pago, moneda y rango de importe como condiciones.
- Las reglas no analizarán comercio o descripción mediante AI en la primera etapa; esa posibilidad queda para más adelante.
- Las transacciones pueden quedar sin categoría o presupuesto y deben aparecer en una bandeja visible de pendientes para asignación rápida posterior.
- La carga rápida de transacciones y la clasificación posterior eficiente son prioridades del flujo.

## Monedas

- Las transacciones pueden estar denominadas en USD o ARS.
- Se debe poder visualizar cada valor en ambas monedas.
- Para convertir usando ARS/USD se obtendrá un valor aproximado del dólar MEP correspondiente al día de la transacción.
- La conversión debe estar separada de la lógica de negocio y poder consumirse como un componente presentacional configurable por props, capaz de mostrar el valor en una u otra moneda.
- La cotización del dólar MEP se consultará automáticamente y se persistirá como dato histórico.
- Habrá una vista tipo calendario/serie diaria para revisar y modificar manualmente las cotizaciones guardadas.
- Si falta una cotización para una fecha, se usará la última disponible como fallback y la interfaz mostrará un aviso visible para esa fecha.

## Gastos recurrentes

- Se podrán guardar gastos recurrentes mensuales, como pagos de deudas o transferencias a otra persona.
- Los gastos recurrentes se visualizarán por período.
- La aplicación debe permitir indicar una fecha prevista de pago dentro del período.
- Inicialmente el aviso será visual: los gastos pendientes deben destacarse al visualizar o iniciar un período; no habrá notificaciones externas por ahora.
- Cada gasto recurrente generará una instancia pendiente en cada período. Esa instancia se comporta como una transacción futura con estado no pagado.
- Al registrar la transacción efectiva, la instancia pendiente pasa a estado pagado y debe poder vincularse con esa transacción.
- Cada instancia copia inicialmente el importe y la moneda de la definición recurrente, pero puede modificarse para ese período.
- Las definiciones recurrentes pueden tener categoría, presupuesto y método de pago predefinidos, que se copian a sus instancias.
- Cada instancia pendiente tendrá una acción `Marcar como pago`.
- Esa acción abrirá una revisión editable de los datos antes de confirmar; al confirmar se creará/confirmará la transacción efectiva y la instancia pasará a pagada.
- Un gasto recurrente puede quedar activo indefinidamente o tener una fecha de finalización.

## Feedback de implementación

- La cantidad de cuotas sólo aplica y se muestra cuando el método de pago seleccionado es una tarjeta de crédito.
- La fecha por defecto de una transacción debe calcularse en la zona horaria local del navegador, no con una conversión UTC que pueda mover el día.
- La selección de categorías debe usar una UX de árbol con selección múltiple visible, chips y controles claros; no un `<select multiple>` nativo.

- Los presupuestos se pueden editar y eliminar desde la lista. Al eliminar uno, las transacciones y recurrentes asociadas quedan sin presupuesto en lugar de borrarse.

## Corrección de presupuestos y moneda

- La vista de presupuestos debe tener un único listado; las acciones de editar/eliminar viven en cada elemento del listado.
- El detalle de un presupuesto se abre con `budget=<id>` en la URL y tiene una acción explícita para volver al listado.
- La cotización MEP se obtiene automáticamente desde ArgentinaDatos (`/v1/cotizaciones/dolares/bolsa`), se guarda por día en Supabase y usa el último día disponible anterior como fallback.
- La vista de cotizaciones permite actualizar automáticamente todo el mes seleccionado y corregir días manualmente.

- La vista de presupuestos incluye una card de presupuesto total del período, mostrando asignado y restante en la moneda global.

## Ingresos, presupuestos y cuentas

- Los presupuestos contabilizan gastos; un ingreso no debe mostrar ni permitir asignación a presupuesto.
- El concepto de método de pago no representa bien el destino de un ingreso. Se incorporará el concepto de `Cuenta`.
- Una cuenta representa dónde se mantiene el dinero y puede asociarse a un método no crediticio: Mercado Pago ↔ Transferencia Mercado Pago, Wallbit ↔ Transferencia Wallbit, Efectivo ↔ Efectivo.
- Para ingresos, la cuenta de destino debe ser el dato principal; una tarjeta de crédito no es una cuenta válida de destino.
- En un gasto pagado con un método no crediticio, la cuenta seleccionada es la cuenta de origen y el gasto reduce su saldo.
- Las cuentas mostrarán saldo actual; no se requiere un historial de saldos separado en la primera etapa.
- En un gasto pagado con tarjeta de crédito, el consumo se refleja contra el límite de la tarjeta; no requiere descontar una cuenta de saldo en ese momento.

- El selector de categorías en la carga de transacciones es un combobox buscable con selección múltiple, chips removibles, jerarquía visual y confirmación explícita.

- El selector de categorías usa el patrón Popover + Command de shadcn/Radix: búsqueda, selección múltiple y cierre automático al hacer click afuera o escapar.
