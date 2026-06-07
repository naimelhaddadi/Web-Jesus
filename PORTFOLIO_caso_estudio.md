# 🦷 Sistema de captación y agendado automático multi-sede
### Caso de estudio · Clínica dental (Madrid + Valladolid)

> Diseño e implementación de un sistema completo que capta pacientes desde la web
> y gestiona todo el ciclo de la cita por WhatsApp con IA, sin intervención humana.

<!-- 📸 PORTADA: pon aquí una captura atractiva de la home de la web -->
`[IMAGEN: portada — home de la web con las 2 sedes]`

---

## ⚡ En 30 segundos

| | |
|---|---|
| **Cliente** | Clínica dental multi-sede (Madrid + Valladolid) |
| **Reto** | Captar y agendar pacientes 24/7 en 2 sedes sin duplicar sistemas |
| **Solución** | Web SEO-local + chatbot de WhatsApp con IA y agendado automático |
| **Rol** | Diseño de arquitectura, desarrollo, automatización e integración IA |
| **Stack** | Web · n8n · GPT-4o · WhatsApp API · Google (Calendar/Sheets) |
| **Resultado** | Captación automática 24/7, 0 leads perdidos, escalable a N sedes |

---

## 🎬 Demo

<!-- 📹 Sube aquí un GIF o vídeo corto: rellenar el formulario → llega el WhatsApp del bot → agenda la cita -->
`[VÍDEO/GIF: demo del flujo completo — formulario → WhatsApp → cita agendada]`

---

## 🔄 Antes vs. Después

| | ❌ Antes | ✅ Después |
|---|---|---|
| Captación | Solo en horario, por teléfono | 24/7 desde la web |
| Primer contacto | Horas o días | Segundos (WhatsApp automático) |
| Agendado | Manual, por teléfono | Automático con IA |
| Recordatorios | A mano (o ninguno) | Automáticos 24h antes |
| Reseñas | Se pedían a veces | Automáticas tras cada visita |
| Leads perdidos | Frecuentes | Ninguno (todo registrado y seguido) |
| Escalar a otra sede | Montar todo de nuevo | ~15 min de configuración |

---

## 🎯 El reto

Una clínica dental con sede en Madrid iba a abrir una segunda sede en Valladolid.
Necesitaba:

- Una **presencia web** que posicionara cada sede por separado en Google (SEO local).
- **Captar pacientes 24/7** sin depender de que alguien cogiera el teléfono.
- **Agendar citas automáticamente**, con la complejidad de que cada sede tiene
  reglas de horario distintas.
- Hacerlo **sin duplicar sistemas**: un solo chatbot, una sola base de datos,
  una sola IA — pero que se comportara correctamente según la sede.

El problema clásico de un negocio multi-sede: cómo escalar sin multiplicar el
trabajo ni el mantenimiento.

---

## 💡 La solución

Diseñé una **arquitectura "una marca, dos personalidades"**: un único sistema
que detecta dinámicamente la sede y adapta todo su comportamiento
(direcciones, horarios, calendario, mensajes y reseñas) en consecuencia.

```
  Paciente → Web (elige sede) → Automatización con IA → Cita agendada
                                        │
              ┌─────────────────────────┴─────────────────────────┐
           MADRID                                            VALLADOLID
   (agenda por días puntuales)                        (horario fijo L-V)
```

---

## ✨ Qué hace el sistema (flujo completo)

1. El paciente entra en la web y **elige su sede** (Madrid o Valladolid).
2. Rellena un formulario simple (nombre, teléfono, email).
3. **Al instante** recibe un WhatsApp de bienvenida del asistente.
4. Conversa con una **IA** que le propone días reales según la disponibilidad
   de esa sede y le **agenda la cita** en el calendario correspondiente.
5. Recibe **confirmación**, un **recordatorio 24h antes** y, tras la visita,
   una **petición de reseña**.
6. Si no responde, el sistema hace **seguimientos automáticos** (48h y 7 días).
7. Gestiona también **cancelaciones y re-agendas** por WhatsApp.

Todo automático. Cero trabajo manual para la clínica.

---

## 📊 Resultados / impacto

- **Captación 24/7**: los pacientes agendan a cualquier hora, sin recepcionista.
- **Respuesta inmediata**: primer contacto en segundos (vs. horas o días).
- **0 leads perdidos**: cada formulario queda registrado y seguido automáticamente.
- **Escalable**: añadir una 3ª sede son ~15 minutos de configuración, sin
  reescribir el sistema.
- **Segmentación**: cada lead/cita queda etiquetado por sede para analítica.

<!-- 📈 MÉTRICAS REALES: rellena estos números cuando el sistema lleve unas semanas en producción -->
**Métricas (primer periodo en producción):**
| Métrica | Valor |
|---|---|
| Pacientes captados | `[rellenar]` |
| Citas agendadas automáticamente | `[rellenar]` |
| Tiempo medio de primer contacto | `[rellenar]` |
| Tasa de respuesta a la bienvenida | `[rellenar]` |
| Reseñas generadas | `[rellenar]` |

---

## 📸 Capturas del sistema

<!-- Inserta cada captura debajo de su título -->

**Web — Home con selector de sede**
`[IMAGEN: home con las tarjetas Madrid / Valladolid]`

**Web — Landing de sede (SEO local + formulario)**
`[IMAGEN: landing de Valladolid con mapa y formulario]`

**Automatización — Workflow completo en n8n**
`[IMAGEN: vista general del workflow de ~100 nodos]`

**Chatbot — Conversación real de agendado por WhatsApp**
`[IMAGEN: chat de WhatsApp del bot agendando una cita]`

**Gestión — Citas en Google Calendar / base de datos**
`[IMAGEN: calendario con citas y/o la hoja de pacientes]`

---

## 🏗️ Arquitectura técnica

**Frontend / Web**
- Arquitectura "Landing por Sede": una home enrutadora + una landing optimizada
  por cada ciudad (mejor SEO local que una web genérica).
- Mobile-first, diseño limpio orientado a conversión (CRO).
- SEO local: Schema.org (Dentist) por sede, geo-meta, Open Graph, FAQ con
  datos estructurados, sitemap.
- Cumplimiento RGPD: política de privacidad + consentimiento explícito.
- Desplegado en Vercel con CI desde GitHub (cada merge publica).

**Automatización / Backend**
- Motor de workflows (n8n) orquestando ~100 nodos.
- **Resolución dinámica de sede**: un nodo central lee la sede y carga la
  configuración correspondiente desde un mapa centralizado. Para escalar a una
  nueva sede solo se añade un bloque de configuración.
- **Persistencia del contexto**: cuando el paciente responde por WhatsApp días
  después (sin contexto de sede), el sistema recupera su sede desde la base de
  datos por su teléfono.
- Base de datos en Google Sheets con segmentación por sede.

**IA conversacional**
- Agente con GPT-4o que gestiona la conversación de agendado.
- El prompt recibe el contexto de la sede (dirección, horario, reglas) de forma
  **dinámica**, no fijada en el código: el mismo agente atiende ambas clínicas
  dando siempre los datos correctos.

**Mensajería**
- WhatsApp Business Cloud API (Meta).
- Plantillas de mensaje aprobadas, categorizadas correctamente
  (transaccionales vs. marketing) para garantizar entrega.
- Variables dinámicas por sede en cada plantilla (una plantilla sirve para todas
  las sedes).

**Integraciones**
- Google Calendar (un calendario por sede, lógica de disponibilidad distinta).
- Google Sheets (base de datos / CRM ligero).
- Gmail API (emails transaccionales).
- Google Business Profile (reseñas: Doctoralia / Google según sede).

**Fiabilidad**
- Sistema de alertas: ante cualquier fallo del workflow, notificación
  automática por email para intervención inmediata.
- Validación de datos en origen (formato de teléfono, email, consentimiento).

---

## 🧠 Decisiones de diseño destacadas

- **No duplicar el flujo**: en lugar de clonar el sistema por sede (lo fácil
  pero insostenible), centralicé la lógica y parametricé la sede. Resultado:
  mantenimiento mínimo y escalabilidad real.
- **Dos lógicas de disponibilidad** en un mismo motor: Madrid agenda solo en
  días que el doctor marca manualmente; Valladolid genera huecos automáticos
  sobre un horario fijo. El sistema elige la lógica según la sede.
- **Persistencia de contexto entre canales**: resolví el problema de que
  WhatsApp no "recuerda" de qué sede vino el paciente, enlazándolo con la base
  de datos por teléfono.
- **Categorización correcta de plantillas**: los mensajes de cita van como
  "utilidad" (llegan siempre), evitando que un opt-out de marketing deje a un
  paciente sin su recordatorio.

---

## 🛠️ Stack

`HTML/CSS/JS` · `Vercel` · `GitHub CI` · `n8n` · `GPT-4o` ·
`WhatsApp Business Cloud API` · `Google Calendar / Sheets / Gmail API` ·
`SEO local / Schema.org` · `RGPD`

---

## 📌 Alcance del trabajo

Diseño de la arquitectura · Desarrollo web (3 landings + legal) · SEO local ·
Diseño e implementación del workflow de automatización · Integración de IA ·
Configuración de WhatsApp Business API y plantillas · Integraciones Google ·
Sistema de alertas · Documentación y manual de uso.

---

## 💬 Testimonio del cliente

<!-- Cuando Jesús esté contento con el resultado, pídele una frase y ponla aquí -->
> `[Frase del cliente sobre el resultado del proyecto]`
> — Dr. Jesús Rodríguez, Instituto Dental

---

## 🔗 Enlaces

- 🌐 Web en vivo: `[institutodentalvalladolid.com]`
- 💻 Código (si procede): `[enlace al repositorio]`
- 📩 Contacto: `[tu email / LinkedIn]`

---

*Proyecto real en producción. Datos sensibles omitidos por privacidad del cliente.*
