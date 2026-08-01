

# Awesome Financial Freedom 🕊️

[Español](./README.md) | [简体中文](./README.zh-CN.md)

> Responde 5 preguntas → conoce tu etapa FIRE → obtén una herramienta específica para tu etapa → rastrea tu progreso mensual → envíalo a la IA para un análisis profundo.
> Creado para principiantes que no saben por dónde empezar, no solo para desarrolladores que saben leer JSON.

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/Discussions-Open-blue.svg)](https://github.com/adashuai5/awesome-financial-freedom/discussions)

**Creado**: 2026-04-12 · **Última actualización**: 2026-04-26

![Stage diagnosis → 6 tools → monthly tracking → AI analysis](assets/hero-demo.svg)

## 🧭 Navegación rápida

- **Demo**: [`https://adashuai5.github.io/awesome-financial-freedom/demo/`](https://adashuai5.github.io/awesome-financial-freedom/demo/) (en vivo, sin instalación)
- **Playbooks** (guías + tutoriales): [`playbooks/guides/`](playbooks/guides)
- **Nodos de conocimiento**: [`knowledge/nodes/`](knowledge/nodes)
- **Flujos de trabajo**: [`workflows/`](workflows)
- **Prompts & Agents**: [`prompts/`](prompts) · [`agents/`](agents)
- **Habilidades & Herramientas**: [`skills/`](skills) · [`tools/`](tools)
- **Resúmenes de libros**: [`playbooks/book-summaries/`](playbooks/book-summaries)

## 🤔 ¿Qué es esto?

**Awesome Financial Freedom** es un sistema de planificación FIRE de código abierto y nativo para IA, diseñado para inversores chinos. Combina conocimiento estructurado, calculadoras deterministas y una experiencia de usuario basada en etapas, para que un principiante financiero sepa exactamente qué hacer hoy, no solo lo que la matemática dice dentro de 20 años.

Componentes principales:

- 🎯 **Diagnóstico de etapa con 5 preguntas** — detecta tu etapa actual de FIRE (fase de deuda → fondo de emergencia → inversión → aceleración → optimización → meta final) en menos de 30 segundos
- 🛠️ **6 herramientas específicas por etapa** — calculadora de avalancha/bola de nieve para deudas, barra de progreso del fondo de emergencia, simulador DCA, tabla de sensibilidad de la tasa de ahorro, lista de verificación para rebalanceo, calculadora Coast FIRE
- 📊 **Calculadora FIRE extendida** — simulación de crecimiento de ingresos, escenarios de ingresos adicionales, comparación de estilos de vida en el retiro (ciudad grande / ciudad pequeña / arbitraje en el sudeste asiático / mínimo), verificación Coast FIRE
- 🏦 **Específico para China** — 综合所得税档 + 专项附加扣除 → "tasa de ahorro real después de impuestos"; 个人养老金 (deducción fiscal de ¥12,000/año); optimización de 公积金; códigos ETF de acciones A/QDII/Oro (510300/513500/518880)
- 📊 **Comparador multiescenario** — guarda de 2 a 4 escenarios (p. ej. "Situación actual / Aumento del 10% / Trabajo adicional 3k / Mudanza a Chiang Mai") y observa la diferencia en la edad FIRE lado a lado
- 💾 **Seguimiento de instantáneas mensuales** — instantáneas en localStorage, gráfico sparkline, flechas de tendencia, **exportación CSV / JSON**, sin backend
- 🤖 **Análisis de IA con un clic (BYOK)** — pega tu propia clave de API de Anthropic (almacenada localmente), transmite el análisis de Claude directamente en el navegador; o copia un prompt estructurado de 8 secciones para cualquier LLM
- 🧠 **28 nodos de conocimiento en JSON** — tarjeta de conocimiento visible en la interfaz, estructurada para un consumo preciso por parte de la IA
- 🤖 **Informe de IA con un clic** — prompt estructurado de 8 secciones para Claude/ChatGPT, cubre todos los nuevos campos

## 🎯 Público objetivo

- Personas que buscan una ruta directa hacia la libertad financiera con pasos accionables
- Profesionales jóvenes que quieren ahorrar pero no saben por dónde empezar
- Personas que han escuchado sobre FIRE pero no saben cómo se calcula
- Personas que quieren usar IA para ayudar a planificar sus finanzas
- Personas que desean convertir la estrategia financiera en acción práctica

## ✨ ¿Por qué existe esto?

Internet está lleno de blogs de finanzas personales, cursos de pago y consejos dispersos. Pero no existe **un sistema de ejecución de libertad financiera de código abierto, estructurado y listo para IA** dedicado a ayudar a las personas a convertir los planes en acción.

Este proyecto llena ese vacío proporcionando un **sistema de planificación con IA impulsado por la comunidad, transparente y ejecutable**. Su innovación principal radica en combinar flujos de trabajo estructurados, plantillas de prompts y lógica de calculadoras en un motor de ejecución utilizable.

## 📚 Fuentes de conocimiento

- Matemáticas FIRE: regla del 4%, Estudio Trinity ([Wikipedia](https://en.wikipedia.org/wiki/Trinity_study))
- Asignación de activos de doble rueda (沪深300 + S&P 500 + Oro + Bonos)
- Reglas de la pensión de tercer pilar en China (个人养老金)
- Investigación de la comunidad FIRE sobre tasa de ahorro, Coast FIRE y arbitraje geográfico
- Fuentes adicionales en [`playbooks/book-summaries/`](playbooks/book-summaries/)

## 🚀 Cómo usarlo

### 1️⃣ Prueba la demostración (sin necesidad de instalación)

Abre **`https://adashuai5.github.io/awesome-financial-freedom/demo/`**

Lo primero que verás: 5 preguntas de sí/no que detectan tu etapa FIRE en menos de 30 segundos. Luego, una herramienta específica para tu etapa se carga automáticamente: no necesitas leer toda la calculadora.

### 2️⃣ Introduce tus cifras (opcional pero recomendado)

El formulario principal toma: edad, ingresos, gastos, activos (banco / 公积金 / acciones / bienes raíces), deuda y perfil de riesgo. Nuevos campos: contribución a 个人养老金, tasa de crecimiento de ingresos, ingresos adicionales, edad objetivo de retiro y preferencia de estilo de vida en el retiro.

### 3️⃣ Explora en profundidad

Una vez que tengas un resultado, adéntrate en el sistema:

| Si quieres… | Ve a |
|----------------|-------|
| Ejecutar localmente + asistente IA | [`playbooks/tutorials/getting-started.md`](playbooks/tutorials/getting-started.md) |
| Entender el diseño del sistema | [`playbooks/guides/money-os-architecture.md`](playbooks/guides/money-os-architecture.md) |
| Ejecutar vía CLI | `node tools/run-workflow.js workflows/fire_planning.yaml` (Node.js ≥18) |
| Explorar todos los flujos de trabajo | [`workflows/`](workflows) |

## 📖 Estructura del conocimiento

Siete etapas progresivas desde la mentalidad hasta la independencia financiera:

| Etapa | Directorio | Lo que aprenderás |
|-------|-----------|-------------------|
| 01 — Mentalidad | [`knowledge/nodes/01-mindset/`](knowledge/nodes/01-mindset) | Qué significa realmente la libertad financiera; el dinero como una herramienta, no como un fin |
| 02 — Fundamentos | [`knowledge/nodes/02-foundation/`](knowledge/nodes/02-foundation) | Fondos de emergencia, seguros, eliminación de deudas de alto interés |
| 03 — Acumulación | [`knowledge/nodes/03-accumulation/`](knowledge/nodes/03-accumulation) | Aumentar la tasa de ahorro; ingresos adicionales; conceptos básicos de interés compuesto |
| 04 — Asignación | [`knowledge/nodes/04-allocation/`](knowledge/nodes/04-allocation) | Asignación de activos, diversificación, fondos indexados, rebalanceo |
| 05 — Automatización | [`knowledge/nodes/05-automation/`](knowledge/nodes/05-automation) | Automatizar ahorros e inversiones para que la disciplina sea automática |
| 06 — Libertad | [`knowledge/nodes/06-freedom/`](knowledge/nodes/06-freedom) | Matemáticas FIRE, tasa de retiro segura, Coast FIRE, Barista FIRE |
| 07 — Ruta de aprendizaje | [`knowledge/nodes/07-learning-path/`](knowledge/nodes/07-learning-path) | Hoja de ruta basada en etapas; qué nodo leer a continuación |

## 🤝 Contribuciones

¡Contribuciones bienvenidas! Por favor, lee [`CONTRIBUTING.md`](CONTRIBUTING.md) para:
- Cómo reportar problemas o sugerir nuevos nodos de conocimiento
- Flujo de trabajo de pull requests y estilo de código
- Cómo agregar prompts, flujos de trabajo o contenido de playbooks

## 📄 Licencia

- **Contenido de conocimiento**: Licenciado bajo Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) - consulta el archivo [LICENSE](LICENSE) para más detalles.
- **Código y herramientas**: Licenciado bajo MIT - consulta el archivo [LICENSE-CODE.md](LICENSE-CODE.md) para más detalles.
