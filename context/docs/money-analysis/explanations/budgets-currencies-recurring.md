# Presupuestos, monedas y gastos recurrentes

Además de clasificar transacciones con categorías, la aplicación debe soportar agrupaciones operativas distintas. Un presupuesto agrupa transacciones para medir consumo contra un objetivo; no reemplaza ni depende conceptualmente de una categoría. Una misma transacción puede pertenecer a categorías jerárquicas y también contribuir a uno o más presupuestos, según la decisión futura de asignación.

La moneda es una propiedad de la transacción. El sistema debe conservar el importe y la moneda originales y ofrecer una representación equivalente en ARS y USD usando una cotización aproximada del dólar MEP del día. La conversión es una preocupación de presentación: el valor puede mostrarse en la moneda preferida sin modificar el registro original.

Un gasto recurrente mensual es distinto de una transacción histórica: representa una obligación esperada para un período. Debe poder verse como pendiente, asociarse a una fecha prevista de pago y luego relacionarse con la transacción que efectivamente lo pagó. Inicialmente la advertencia será visual, no una notificación externa.
