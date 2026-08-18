# Contexto de Money Analysis

Este directorio es la fuente de verdad del producto Money Analysis. Conserva decisiones, preguntas abiertas, modelo del dominio y contexto suficiente para que otros agentes puedan continuar el desarrollo sin reconstruir la conversación.

## Navegación

- [Documentación](docs/README.md)
- [Tema Money Analysis](docs/money-analysis/README.md)

## Reglas

- Las decisiones confirmadas van en `decisions.md`.
- Las decisiones pendientes van en `open-questions.md`; no deben resolverse implícitamente durante la implementación.
- Las explicaciones del dominio van bajo `explanations/`.
- No crear un plan de implementación hasta cerrar las decisiones que afecten contratos, persistencia o comportamiento.
- Este contexto es local y no debe commitearse salvo que el usuario lo solicite.
