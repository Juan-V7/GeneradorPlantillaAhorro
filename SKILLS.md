# Especificación técnica: GeneradorPlantillaAhorro

> Crear una aplicación web para planificar metas de ahorro programado a medida. Debe calcular automáticamente el número de cuotas y el monto periódico según el plazo total y la frecuencia seleccionada (semanal, quincenal o mensual). El sistema generará una tabla de seguimiento interactiva y programará notificaciones o recordatorios automáticos en las fechas de cobro.

**Alcance**

QUÉ SÍ INCLUYE:
- Formulario de entrada: monto objetivo, plazo en meses/semanas, fecha de inicio y periodicidad (semanal, quincenal, mensual).
- Motor de cálculo financiero para desglosar cuotas exactas y fechas de pago.
- Tabla interactiva de cronograma de ahorro con checklist de cuotas abonadas y saldo pendiente.
- Módulo de alertas y notificaciones locales/push o correo para avisar la fecha de cobro.
- Exportación o descarga de la plantilla de ahorro generada.

QUÉ NO INCLUYE:
- No incluye pasarelas de pago reales ni cobro bancario automático directo a cuentas.
- No incluye manejo de intereses bancarios complejos ni productos de inversión especulativa.
- No incluye integración contable empresarial multi-moneda compleja.

**Contexto general**

- Stack tecnológico: HTML5, CSS3/Bootstrap, JavaScript (ES6+), PHP/MySQL o almacenamiento local (IndexedDB/LocalStorage).
- Idioma de salida: Español (interfaz de usuario, etiquetas y mensajes de alerta).
- Audiencia: Usuarios individuales que buscan organizar finanzas personales y cumplir metas de ahorro.
- Restricciones: Código modular, responsive para móviles y escritorio, y cálculos de fechas precisos sin desajustes por zona horaria.

_Generado con SkillNeitor 1.2.0 · 2026-11-09 · 30 ítems · 14 categorías_

## Índice

1. [Producto y descubrimiento](#producto-y-descubrimiento)
2. [UX/UI y accesibilidad](#ux-ui-y-accesibilidad)
3. [Arquitectura y patrones](#arquitectura-y-patrones)
4. [Frontend web](#frontend-web)
5. [Backend y APIs](#backend-y-apis)
6. [Datos y persistencia](#datos-y-persistencia)
7. [Seguridad y privacidad](#seguridad-y-privacidad)
8. [DevOps y observabilidad](#devops-y-observabilidad)
9. [Calidad y pruebas](#calidad-y-pruebas)
10. [Rendimiento y escalabilidad](#rendimiento-y-escalabilidad)
11. [Documentación y mantenimiento](#documentacion-y-mantenimiento)
12. [Móvil y escritorio](#movil-y-escritorio)
13. [Integraciones y tiempo real](#integraciones-y-tiempo-real)
14. [Analítica y negocio](#analitica-y-negocio)

---

# Producto y descubrimiento

_Problema, alcance, usuarios, métricas y priorización._

## Definición del problema y propuesta de valor

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a antes de elegir tecnología, dejar explícito qué problema resuelve el producto, para quién y por qué merece existir. Úsala como guía: Describir el problema en una frase verificable, sin nombrar la solución. Identificar usuario primario, usuario secundario y contexto de uso. Comprueba el resultado con: Existe un documento de una página con problema, usuarios y valor.

### Propósito

Antes de elegir tecnología, dejar explícito qué problema resuelve el producto, para quién y por qué merece existir.

### Lineamientos

- Describir el problema en una frase verificable, sin nombrar la solución.
- Identificar usuario primario, usuario secundario y contexto de uso.
- Documentar alternativas actuales y el coste de no resolverlo.
- Definir una propuesta de valor que pueda contrastarse con evidencia.

### Criterios de aceptación

- [ ] Existe un documento de una página con problema, usuarios y valor.
- [ ] El equipo puede explicar el problema sin mencionar la implementación.
- [ ] Hay al menos una hipótesis falsable y una métrica asociada.

### Antipatrones

- Empezar por el stack o por una lista de pantallas.
- Confundir funcionalidades con problemas de usuario.

### Referencias

- Working Backwards (Amazon)
- Continuous Discovery Habits

## Gestión de requisitos y alcance

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a gestionar cambios de alcance con visibilidad de impacto, decisión explícita y trazabilidad. Úsala como guía: Mantener un registro de requisitos con estado y dueño. Valorar cada cambio por impacto en tiempo, riesgo y calidad. Comprueba el resultado con: Todo cambio relevante tiene decisión registrada.

### Propósito

Gestionar cambios de alcance con visibilidad de impacto, decisión explícita y trazabilidad.

### Lineamientos

- Mantener un registro de requisitos con estado y dueño.
- Valorar cada cambio por impacto en tiempo, riesgo y calidad.
- Separar alcance comprometido de ideas futuras.
- Comunicar decisiones y congelaciones de alcance.

### Criterios de aceptación

- [ ] Todo cambio relevante tiene decisión registrada.
- [ ] El alcance vigente es visible para todo el equipo.
- [ ] Los recortes no se hacen silenciosamente.

### Antipatrones

- Aceptar cambios sin ajustar tiempo o alcance.
- Documentar requisitos en conversaciones privadas.

### Referencias

- Scope creep management
- PRINCE2 principles

## Historias de usuario y criterios de aceptación

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a convertir necesidades en historias pequeñas, verificables y con criterios de aceptación claros. Úsala como guía: Formato: como [rol] quiero [capacidad] para [beneficio]. Añadir criterios de aceptación en formato dado/cuando/entonces. Comprueba el resultado con: Cada historia tiene criterios de aceptación ejecutables.

### Propósito

Convertir necesidades en historias pequeñas, verificables y con criterios de aceptación claros.

### Lineamientos

- Formato: como [rol] quiero [capacidad] para [beneficio].
- Añadir criterios de aceptación en formato dado/cuando/entonces.
- Incluir casos límite, errores y permisos, no solo el camino feliz.
- Mantener cada historia con valor observable y tamaño de iteración.

### Criterios de aceptación

- [ ] Cada historia tiene criterios de aceptación ejecutables.
- [ ] Los casos de error y permisos están cubiertos.
- [ ] Una persona ajena puede validar la historia sin preguntar al autor.

### Antipatrones

- Historias técnicas sin valor visible.
- Criterios ambiguos como "debe funcionar bien".

### Referencias

- User Stories Applied (Mike Cohn)
- Example Mapping

# UX/UI y accesibilidad

_Experiencia, sistema de diseño, responsive y WCAG._

## Diseño responsive y adaptativo

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** UX/UI, Accesibilidad

### Cómo usarlo

Esta skill de UX/UI te ayuda a adaptar la interfaz a tamaños y capacidades reales sin degradar jerarquía ni accesibilidad. Úsala como guía: Diseñar por contenido y tareas, no por dispositivos concretos. Definir breakpoints y comportamientos esperados. Comprueba el resultado con: La app es usable a 320 px, 768 px, 1024 px y zoom 200 %.

### Propósito

Adaptar la interfaz a tamaños y capacidades reales sin degradar jerarquía ni accesibilidad.

### Lineamientos

- Diseñar por contenido y tareas, no por dispositivos concretos.
- Definir breakpoints y comportamientos esperados.
- Evitar scroll horizontal no intencional y tablas inutilizables.
- Probar zoom, orientación y tamaños intermedios.

### Criterios de aceptación

- [ ] La app es usable a 320 px, 768 px, 1024 px y zoom 200 %.
- [ ] Las tablas ofrecen patrón alternativo en móvil.
- [ ] La navegación principal sigue disponible.

### Antipatrones

- Ocultar funciones esenciales en móvil.
- Diseñar solo para el portátil del desarrollador.

### Referencias

- Responsive Web Design
- Container queries

## Formularios y validación UX

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** UX/UI, Accesibilidad

### Cómo usarlo

Esta skill de UX/UI te ayuda a reducir errores y fricción con etiquetas claras, validación útil y conservación del trabajo. Úsala como guía: Etiqueta visible, ayuda contextual y campos agrupados por significado. Validar al salir del campo y al enviar; no interrumpir en cada tecla. Comprueba el resultado con: Los errores se anuncian y reciben foco.

### Propósito

Reducir errores y fricción con etiquetas claras, validación útil y conservación del trabajo.

### Lineamientos

- Etiqueta visible, ayuda contextual y campos agrupados por significado.
- Validar al salir del campo y al enviar; no interrumpir en cada tecla.
- Mensajes que expliquen cómo corregir, junto al campo.
- No perder datos ante errores; permitir deshacer cuando sea posible.

### Criterios de aceptación

- [ ] Los errores se anuncian y reciben foco.
- [ ] Los campos obligatorios se identifican antes de enviar.
- [ ] El formulario funciona con autocompletado y teclado.

### Antipatrones

- Validar solo con color.
- Borrar el formulario tras un fallo de red.

### Referencias

- GOV.UK Design System: Form patterns

## Microcopy y estados vacíos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** UX/UI, Accesibilidad

### Cómo usarlo

Esta skill de UX/UI te ayuda a usar el texto y los estados vacíos para orientar la siguiente acción y reducir la incertidumbre. Úsala como guía: Cada estado vacío explica qué es la pantalla y qué hacer. Errores con causa, impacto y siguiente paso. Comprueba el resultado con: Todo listado vacío tiene acción sugerida.

### Propósito

Usar el texto y los estados vacíos para orientar la siguiente acción y reducir la incertidumbre.

### Lineamientos

- Cada estado vacío explica qué es la pantalla y qué hacer.
- Errores con causa, impacto y siguiente paso.
- Acciones nombradas por resultado, no por mecanismo.
- Tono consistente y localizable.

### Criterios de aceptación

- [ ] Todo listado vacío tiene acción sugerida.
- [ ] Los errores incluyen recuperación.
- [ ] Los textos evitan culpar al usuario.

### Antipatrones

- "No hay datos" sin contexto.
- Botones "Aceptar" para acciones distintas.

### Referencias

- Mailchimp Content Style Guide
- UX Writing

# Arquitectura y patrones

_Estilos arquitectónicos, límites, APIs y decisiones estructurales._

## Diseño de API REST versionada

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Arquitectura, APIs

### Cómo usarlo

Esta skill de arquitectura te ayuda a diseñar recursos, errores y versiones de api que evolucionen sin romper consumidores. Úsala como guía: Recursos en plural, identificadores estables y verbos HTTP correctos. Respuestas de error con código, mensaje y traza. Comprueba el resultado con: El contrato está documentado y probado.

### Propósito

Diseñar recursos, errores y versiones de API que evolucionen sin romper consumidores.

### Lineamientos

- Recursos en plural, identificadores estables y verbos HTTP correctos.
- Respuestas de error con código, mensaje y traza.
- Paginación, filtros y ordenamiento consistentes.
- Versionado explícito y política de deprecación.

### Criterios de aceptación

- [ ] El contrato está documentado y probado.
- [ ] Los errores son predecibles y no filtran datos internos.
- [ ] Los cambios incompatibles tienen nueva versión.

### Antipatrones

- Devolver 200 con errores embebidos.
- Romper contratos sin aviso.

### Ejemplo

```bash
GET /v1/projects?limit=20&cursor=abc
200 OK
{
  "data": [],
  "nextCursor": null
}
```

### Referencias

- API Design Patterns
- Zalando RESTful API Guidelines

## Monolito modular

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Arquitectura, APIs

### Cómo usarlo

Esta skill de arquitectura te ayuda a construir una sola unidad desplegable con límites internos claros, suficiente para la mayoría de productos. Úsala como guía: Definir módulos por dominio y prohibir imports cruzados arbitrarios. Exponer contratos internos explícitos y encapsular persistencia. Comprueba el resultado con: Los módulos no acceden a tablas de otros módulos sin contrato.

### Propósito

Construir una sola unidad desplegable con límites internos claros, suficiente para la mayoría de productos.

### Lineamientos

- Definir módulos por dominio y prohibir imports cruzados arbitrarios.
- Exponer contratos internos explícitos y encapsular persistencia.
- Mantener una sola base de datos con tablas por dominio.
- Preparar extracción futura sin pagar el coste de microservicios prematuros.

### Criterios de aceptación

- [ ] Los módulos no acceden a tablas de otros módulos sin contrato.
- [ ] El despliegue sigue siendo una unidad reproducible.
- [ ] Existe una prueba que detecta dependencias prohibidas.

### Antipatrones

- Monolito con un único paquete global.
- Microservicios por moda.

### Referencias

- Modular Monolith (Kamil Grzybek)
- Shopify monolith

# Frontend web

_Rendering, estado, componentes, PWA e internacionalización._

## Componentes semánticos y accesibles

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a encapsular ui con html semántico, teclado y atributos accesibles desde el propio componente. Úsala como guía: Preferir elementos nativos antes que roles ARIA. Gestionar foco, estados y anuncios en componentes interactivos. Comprueba el resultado con: No hay divs con onClick sin alternativa de teclado.

### Propósito

Encapsular UI con HTML semántico, teclado y atributos accesibles desde el propio componente.

### Lineamientos

- Preferir elementos nativos antes que roles ARIA.
- Gestionar foco, estados y anuncios en componentes interactivos.
- Exponer props claras y evitar efectos ocultos.
- Probar cada componente con teclado y lector.

### Criterios de aceptación

- [ ] No hay divs con onClick sin alternativa de teclado.
- [ ] Los componentes tienen estados hover, focus, disabled y error.
- [ ] Los tests cubren navegación por teclado.

### Antipatrones

- Reinventar select o modal sin accesibilidad.
- Props booleanas contradictorias.

### Referencias

- WAI-ARIA Authoring Practices
- Inclusive Components

## Formularios y validación frontend

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a implementar formularios con validación consistente, accesible y alineada con el servidor. Úsala como guía: Esquema de validación compartido o replicado explícitamente. Errores por campo y error global. Comprueba el resultado con: El servidor vuelve a validar todo.

### Propósito

Implementar formularios con validación consistente, accesible y alineada con el servidor.

### Lineamientos

- Esquema de validación compartido o replicado explícitamente.
- Errores por campo y error global.
- Estados submitting, success y error.
- Evitar doble envío e hidratar valores iniciales.

### Criterios de aceptación

- [ ] El servidor vuelve a validar todo.
- [ ] Los errores son accesibles y enfocables.
- [ ] El formulario no pierde datos al fallar.

### Antipatrones

- Confiar solo en validación cliente.
- Deshabilitar el botón sin explicar por qué.

### Referencias

- HTML constraint validation
- Zod

## Gestión de estado del cliente

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a distinguir estado local, compartido y remoto para evitar fuentes de verdad duplicadas. Úsala como guía: Estado local para UI efímera; store para estado compartido. Caché de servidor con invalidación por evento. Comprueba el resultado con: Cada dato tiene una única fuente de verdad.

### Propósito

Distinguir estado local, compartido y remoto para evitar fuentes de verdad duplicadas.

### Lineamientos

- Estado local para UI efímera; store para estado compartido.
- Caché de servidor con invalidación por evento.
- Flujo unidireccional y acciones explícitas.
- Evitar derivar estado que pueda calcularse.

### Criterios de aceptación

- [ ] Cada dato tiene una única fuente de verdad.
- [ ] No hay actualizaciones impredecibles entre componentes.
- [ ] El estado se puede inspeccionar en desarrollo.

### Antipatrones

- Duplicar datos remotos en varios stores.
- Mutar estado directamente.

### Referencias

- Redux style guide
- Zustand patterns

# Backend y APIs

_Contratos, autenticación, idempotencia, colas y errores._

## Autenticación y autorización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs

### Cómo usarlo

Esta skill de backend te ayuda a separar identidad de permisos y aplicar autorización en servidor para cada recurso. Úsala como guía: Sesiones seguras, rotación y expiración. RBAC/ABAC con comprobaciones en servidor. Comprueba el resultado con: Cada endpoint valida autenticación y autorización.

### Propósito

Separar identidad de permisos y aplicar autorización en servidor para cada recurso.

### Lineamientos

- Sesiones seguras, rotación y expiración.
- RBAC/ABAC con comprobaciones en servidor.
- No confiar en roles enviados por el cliente.
- Auditar accesos sensibles y revocaciones.

### Criterios de aceptación

- [ ] Cada endpoint valida autenticación y autorización.
- [ ] Hay pruebas de acceso denegado por rol.
- [ ] Los tokens no se guardan en lugares inseguros.

### Antipatrones

- Ocultar botones como control de acceso.
- IDs predecibles sin autorización por recurso.

### Referencias

- OWASP Authentication Cheat Sheet
- OAuth 2.1

## Colas y procesamiento asíncrono

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs

### Cómo usarlo

Esta skill de backend te ayuda a mover trabajo lento o frágil a workers con reintentos, visibilidad y dead-letter queue. Úsala como guía: Definir contratos de mensaje y versionado. Idempotencia en cada consumidor. Comprueba el resultado con: Un mensaje fallido no se pierde silenciosamente.

### Propósito

Mover trabajo lento o frágil a workers con reintentos, visibilidad y dead-letter queue.

### Lineamientos

- Definir contratos de mensaje y versionado.
- Idempotencia en cada consumidor.
- Backoff, límite de reintentos y DLQ.
- Métricas de profundidad y antigüedad de cola.

### Criterios de aceptación

- [ ] Un mensaje fallido no se pierde silenciosamente.
- [ ] Los workers son escalables y observables.
- [ ] Existe replay controlado.

### Antipatrones

- Procesar pagos dentro de la petición HTTP.
- Colas sin DLQ ni alertas.

### Referencias

- Enterprise Integration Patterns
- BullMQ

## Contratos de API y OpenAPI

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs, OpenAPI

### Cómo usarlo

Esta skill de backend te ayuda a tratar el contrato como producto: documentado, versionado y verificado contra la implementación. Úsala como guía: Especificación OpenAPI como fuente de verdad. Generar clientes, mocks y validaciones desde el contrato. Comprueba el resultado con: La implementación valida contra el contrato.

### Propósito

Tratar el contrato como producto: documentado, versionado y verificado contra la implementación.

### Lineamientos

- Especificación OpenAPI como fuente de verdad.
- Generar clientes, mocks y validaciones desde el contrato.
- Definir errores, paginación y ejemplos.
- Verificar compatibilidad en CI.

### Criterios de aceptación

- [ ] La implementación valida contra el contrato.
- [ ] Los cambios incompatibles se detectan en CI.
- [ ] El contrato incluye ejemplos ejecutables.

### Antipatrones

- Documentar después y a mano.
- Permitir respuestas fuera del esquema.

### Referencias

- OpenAPI 3.1
- Spectral

# Datos y persistencia

_Modelado, migraciones, transacciones, búsqueda y backups._

## Migraciones de base de datos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** SQL, SQLite

### Cómo usarlo

Esta skill de datos te ayuda a evolucionar el esquema con migraciones versionadas, reversibles cuando sea posible y probadas. Úsala como guía: Cada migración tiene versión, autor y propósito. Probar en copia de datos reales anonimizados. Comprueba el resultado con: Una base vacía y una existente migran al mismo esquema.

### Propósito

Evolucionar el esquema con migraciones versionadas, reversibles cuando sea posible y probadas.

### Lineamientos

- Cada migración tiene versión, autor y propósito.
- Probar en copia de datos reales anonimizados.
- Separar cambios compatibles de ruptura.
- Planificar rollback o migración compensatoria.

### Criterios de aceptación

- [ ] Una base vacía y una existente migran al mismo esquema.
- [ ] El tiempo de migración está medido.
- [ ] La app tolera versiones adyacentes durante despliegue.

### Antipatrones

- Editar migraciones ya aplicadas.
- Migraciones sin backup.

### Referencias

- Zero-downtime migrations
- Flyway

## Modelo relacional y normalización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** SQL, SQLite

### Cómo usarlo

Esta skill de datos te ayuda a modelar entidades, relaciones y restricciones que representen el dominio y protejan la integridad. Úsala como guía: Claves primarias estables y foráneas explícitas. Normalizar hasta que duela; desnormalizar con motivo. Comprueba el resultado con: La base impide estados inválidos.

### Propósito

Modelar entidades, relaciones y restricciones que representen el dominio y protejan la integridad.

### Lineamientos

- Claves primarias estables y foráneas explícitas.
- Normalizar hasta que duela; desnormalizar con motivo.
- Restricciones NOT NULL, UNIQUE y CHECK.
- Documentar el modelo y sus invariantes.

### Criterios de aceptación

- [ ] La base impide estados inválidos.
- [ ] Las consultas críticas tienen índice.
- [ ] El modelo se entiende sin preguntar al autor.

### Antipatrones

- Guardar arrays en columnas de texto sin necesidad.
- Sin claves foráneas por pereza.

### Ejemplo

```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### Referencias

- SQL Antipatterns
- Use The Index, Luke

# Seguridad y privacidad

_Amenazas, secretos, saneamiento, cifrado y auditoría._

## Cifrado en tránsito y reposo

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Seguridad

### Cómo usarlo

Esta skill de seguridad te ayuda a proteger datos con tls moderno, cifrado en reposo y gestión segura de claves. Úsala como guía: TLS 1.2+ y HSTS en producción. Cifrado de backups y discos. Comprueba el resultado con: Todo tráfico externo usa TLS.

### Propósito

Proteger datos con TLS moderno, cifrado en reposo y gestión segura de claves.

### Lineamientos

- TLS 1.2+ y HSTS en producción.
- Cifrado de backups y discos.
- Claves separadas de datos y rotables.
- No inventar criptografía propia.

### Criterios de aceptación

- [ ] Todo tráfico externo usa TLS.
- [ ] Los backups están cifrados.
- [ ] Las claves tienen rotación documentada.

### Antipatrones

- Certificados autofirmados en producción.
- Cifrar con clave en el mismo repo.

### Referencias

- OWASP Cryptographic Storage
- Mozilla SSL config

## Sanitización y XSS

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Seguridad

### Cómo usarlo

Esta skill de seguridad te ayuda a escapar salidas y sanear html enriquecido con listas permitidas estrictas. Úsala como guía: Escape contextual por HTML, atributo, URL y JS. Sanear markdown renderizado con DOMPurify. Comprueba el resultado con: Los payloads XSS conocidos se bloquean.

### Propósito

Escapar salidas y sanear HTML enriquecido con listas permitidas estrictas.

### Lineamientos

- Escape contextual por HTML, atributo, URL y JS.
- Sanear markdown renderizado con DOMPurify.
- CSP estricta sin inline no confiable.
- Prohibir iframes y scripts no necesarios.

### Criterios de aceptación

- [ ] Los payloads XSS conocidos se bloquean.
- [ ] La CSP no permite scripts inline arbitrarios.
- [ ] Los enlaces externos usan rel seguro.

### Antipatrones

- innerHTML con datos de usuario.
- Sanitizar solo en cliente.

### Referencias

- OWASP XSS Prevention
- DOMPurify

## Validación de entradas y rutas

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Seguridad

### Cómo usarlo

Esta skill de seguridad te ayuda a validar forma, tipo y límites de toda entrada, y confinar rutas a directorios permitidos. Úsala como guía: Validar en servidor con esquema. Resolver rutas y verificar que quedan dentro de la raíz. Comprueba el resultado con: Los payloads ../../ se rechazan.

### Propósito

Validar forma, tipo y límites de toda entrada, y confinar rutas a directorios permitidos.

### Lineamientos

- Validar en servidor con esquema.
- Resolver rutas y verificar que quedan dentro de la raíz.
- Rechazar traversal, enlaces simbólicos y nombres reservados.
- Limitar tamaño y profundidad.

### Criterios de aceptación

- [ ] Los payloads ../../ se rechazan.
- [ ] Las entradas fuera de rango fallan con error claro.
- [ ] Los archivos extraídos no escapan del destino.

### Antipatrones

- Confiar en validación del cliente.
- Concatenar rutas sin resolver.

### Referencias

- OWASP Input Validation
- Zip Slip

# DevOps y observabilidad

_CI/CD, contenedores, entornos, telemetría y rollback._

## Contenedores y Docker

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Docker, CI/CD

### Cómo usarlo

Esta skill de DevOps te ayuda a construir imágenes pequeñas, reproducibles y sin privilegios, con salud y límites definidos. Úsala como guía: Multi-stage build y usuario no root. Pin de versiones base y lockfile. Comprueba el resultado con: La imagen arranca sin root.

### Propósito

Construir imágenes pequeñas, reproducibles y sin privilegios, con salud y límites definidos.

### Lineamientos

- Multi-stage build y usuario no root.
- Pin de versiones base y lockfile.
- Healthcheck y señales correctas.
- Volúmenes para estado y configuración.

### Criterios de aceptación

- [ ] La imagen arranca sin root.
- [ ] El tamaño y vulnerabilidades están controlados.
- [ ] Los datos persisten fuera del contenedor.

### Antipatrones

- COPY . . sin .dockerignore.
- latest en producción sin control.

### Ejemplo

```dockerfile
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
COPY --from=build /app /app
USER node
CMD ["node", "src/server/server.js"]
```

### Referencias

- Docker best practices
- OCI images

## Entornos y configuración

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Docker, CI/CD

### Cómo usarlo

Esta skill de DevOps te ayuda a mantener paridad entre desarrollo, staging y producción con configuración explícita. Úsala como guía: Mismos artefactos, distinta configuración. Datos sintéticos en entornos no productivos. Comprueba el resultado con: Staging reproduce producción en lo relevante.

### Propósito

Mantener paridad entre desarrollo, staging y producción con configuración explícita.

### Lineamientos

- Mismos artefactos, distinta configuración.
- Datos sintéticos en entornos no productivos.
- Acceso y secretos separados.
- Documentar diferencias inevitables.

### Criterios de aceptación

- [ ] Staging reproduce producción en lo relevante.
- [ ] No se usan datos reales en desarrollo.
- [ ] La configuración está versionada.

### Antipatrones

- "En mi máquina funciona".
- Cambios manuales en producción.

### Referencias

- The Twelve-Factor App
- Environment parity

# Calidad y pruebas

_Estrategia de pruebas, contratos, E2E, carga y accesibilidad._

## Pruebas de integración y contrato

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Testing

### Cómo usarlo

Esta skill de calidad te ayuda a verificar que módulos, base de datos y apis colaboran según sus contratos reales. Úsala como guía: Probar adaptadores contra infraestructura real o contenedor. Consumer-driven contracts para APIs. Comprueba el resultado con: Los contratos se verifican en CI.

### Propósito

Verificar que módulos, base de datos y APIs colaboran según sus contratos reales.

### Lineamientos

- Probar adaptadores contra infraestructura real o contenedor.
- Consumer-driven contracts para APIs.
- Semillas de datos controladas.
- Aislar y limpiar estado.

### Criterios de aceptación

- [ ] Los contratos se verifican en CI.
- [ ] Las pruebas de integración usan DB real.
- [ ] No hay dependencia entre pruebas.

### Antipatrones

- Mockear la base de datos siempre.
- Contratos solo en documentación.

### Referencias

- Pact
- Testcontainers

## Pruebas unitarias

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Testing

### Cómo usarlo

Esta skill de calidad te ayuda a probar reglas y funciones puras con casos límite, rápidos y sin infraestructura. Úsala como guía: Nombrar por comportamiento esperado. Incluir límites, errores y casos vacíos. Comprueba el resultado con: Las reglas de negocio tienen pruebas.

### Propósito

Probar reglas y funciones puras con casos límite, rápidos y sin infraestructura.

### Lineamientos

- Nombrar por comportamiento esperado.
- Incluir límites, errores y casos vacíos.
- Evitar mocks excesivos.
- Mantener ejecución por debajo de segundos.

### Criterios de aceptación

- [ ] Las reglas de negocio tienen pruebas.
- [ ] Los casos límite están cubiertos.
- [ ] Las pruebas no dependen del orden.

### Antipatrones

- Probar getters triviales.
- Mocks que replican la implementación.

### Referencias

- Test Desiderata
- xUnit patterns

# Rendimiento y escalabilidad

_Presupuestos, consultas, caché, CDN y escalado._

## Optimización de consultas y N+1

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Performance, SQL

### Cómo usarlo

Esta skill de rendimiento te ayuda a detectar consultas lentas y patrones n+1 con planes de ejecución e índices correctos. Úsala como guía: Revisar EXPLAIN de consultas críticas. Eliminar N+1 con joins o batch loading. Comprueba el resultado con: No hay N+1 en rutas críticas.

### Propósito

Detectar consultas lentas y patrones N+1 con planes de ejecución e índices correctos.

### Lineamientos

- Revisar EXPLAIN de consultas críticas.
- Eliminar N+1 con joins o batch loading.
- Índices compuestos según filtros y orden.
- Medir antes y después.

### Criterios de aceptación

- [ ] No hay N+1 en rutas críticas.
- [ ] Las consultas lentas tienen índice.
- [ ] El plan no hace full scan en tablas grandes.

### Antipatrones

- Añadir índices a todo.
- Optimizar sin medir.

### Referencias

- Use The Index, Luke
- PostgreSQL EXPLAIN

# Documentación y mantenimiento

_README, ADRs, API, runbooks y manual de usuario._

## Documentación de API

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Markdown, OpenAPI

### Cómo usarlo

Esta skill de documentación te ayuda a publicar contratos navegables, ejemplos y errores, generados desde la especificación. Úsala como guía: OpenAPI como fuente de verdad. Ejemplos de request/response y errores. Comprueba el resultado con: La documentación se genera del contrato.

### Propósito

Publicar contratos navegables, ejemplos y errores, generados desde la especificación.

### Lineamientos

- OpenAPI como fuente de verdad.
- Ejemplos de request/response y errores.
- Autenticación, paginación y límites.
- Versionado y changelog.

### Criterios de aceptación

- [ ] La documentación se genera del contrato.
- [ ] Los ejemplos se validan.
- [ ] Hay guía de migración entre versiones.

### Antipatrones

- Documentación manual desincronizada.
- Ocultar errores y límites.

### Referencias

- OpenAPI
- Redoc

## README y guía de inicio

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Markdown

### Cómo usarlo

Esta skill de documentación te ayuda a permitir que una persona nueva entienda, instale y ejecute el proyecto sin ayuda informal. Úsala como guía: Qué es, para quién y qué resuelve. Requisitos, instalación y comandos básicos. Comprueba el resultado con: Un nuevo desarrollador arranca siguiendo el README.

### Propósito

Permitir que una persona nueva entienda, instale y ejecute el proyecto sin ayuda informal.

### Lineamientos

- Qué es, para quién y qué resuelve.
- Requisitos, instalación y comandos básicos.
- Configuración, tests y troubleshooting.
- Enlaces a documentación profunda.

### Criterios de aceptación

- [ ] Un nuevo desarrollador arranca siguiendo el README.
- [ ] Los comandos están probados.
- [ ] Las variables de entorno están documentadas.

### Antipatrones

- README desactualizado.
- Suposiciones de conocimiento interno.

### Referencias

- Make a README
- Diátaxis

# Móvil y escritorio

_Apps multiplataforma, shells de escritorio, updates y sync._

## Almacenamiento local y sincronización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Mobile, SQLite

### Cómo usarlo

Esta skill de móvil y escritorio te ayuda a guardar datos localmente y sincronizar con el servidor sin perder cambios ni duplicar. Úsala como guía: Base local transaccional y migraciones. Cola de cambios y reintentos. Comprueba el resultado con: La app funciona offline.

### Propósito

Guardar datos localmente y sincronizar con el servidor sin perder cambios ni duplicar.

### Lineamientos

- Base local transaccional y migraciones.
- Cola de cambios y reintentos.
- Resolución de conflictos explícita.
- Indicadores de sincronización.

### Criterios de aceptación

- [ ] La app funciona offline.
- [ ] Los conflictos no se resuelven en silencio.
- [ ] La sincronización es idempotente.

### Antipatrones

- Sobrescribir siempre el servidor.
- Sin versión de esquema local.

### Referencias

- Local-first software
- CRDTs

## Notificaciones y permisos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Mobile

### Cómo usarlo

Esta skill de móvil y escritorio te ayuda a pedir permisos con contexto y usar notificaciones con respeto, segmentación y preferencias. Úsala como guía: Solicitar permiso solo al necesitarlo. Explicar beneficio antes del diálogo del sistema. Comprueba el resultado con: El usuario puede desactivar canales.

### Propósito

Pedir permisos con contexto y usar notificaciones con respeto, segmentación y preferencias.

### Lineamientos

- Solicitar permiso solo al necesitarlo.
- Explicar beneficio antes del diálogo del sistema.
- Preferencias por canal y frecuencia.
- Deep links y manejo de notificación en frío.

### Criterios de aceptación

- [ ] El usuario puede desactivar canales.
- [ ] La notificación abre el destino correcto.
- [ ] No se envía spam sin consentimiento.

### Antipatrones

- Pedir todos los permisos al inicio.
- Notificaciones sin deep link.

### Referencias

- Apple HIG notifications
- Android notification channels

# Integraciones y tiempo real

_WebSockets, SSE, sincronización y terceros._

## Integraciones de terceros

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Realtime

### Cómo usarlo

Esta skill de tiempo real te ayuda a integrar servicios externos con contratos, timeouts, reintentos y aislamiento de fallos. Úsala como guía: Cliente con timeout y circuit breaker. Credenciales por entorno y rotación. Comprueba el resultado con: La caída del tercero no tumba el producto.

### Propósito

Integrar servicios externos con contratos, timeouts, reintentos y aislamiento de fallos.

### Lineamientos

- Cliente con timeout y circuit breaker.
- Credenciales por entorno y rotación.
- Webhooks firmados y colas.
- Mapear errores del proveedor.

### Criterios de aceptación

- [ ] La caída del tercero no tumba el producto.
- [ ] Los reintentos son seguros.
- [ ] Los límites y costes están documentados.

### Antipatrones

- Llamadas síncronas sin timeout.
- Depender de un único proveedor sin plan.

### Referencias

- Circuit breaker
- Resilience4j

# Analítica y negocio

_Eventos, facturación, experimentación, soporte y legal._

## Analítica de producto y eventos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Analytics

### Cómo usarlo

Esta skill de negocio te ayuda a definir un esquema de eventos estable, con privacidad y trazabilidad a decisiones. Úsala como guía: Taxonomía de eventos y propiedades. Consentimiento y minimización. Comprueba el resultado con: Los eventos tienen esquema versionado.

### Propósito

Definir un esquema de eventos estable, con privacidad y trazabilidad a decisiones.

### Lineamientos

- Taxonomía de eventos y propiedades.
- Consentimiento y minimización.
- Validación de esquema en cliente/servidor.
- Dashboards ligados a objetivos.

### Criterios de aceptación

- [ ] Los eventos tienen esquema versionado.
- [ ] No se envían datos personales innecesarios.
- [ ] Las métricas se pueden reproducir.

### Antipatrones

- Eventos con nombres inconsistentes.
- Analítica sin consentimiento.

### Referencias

- Segment spec
- Analytics taxonomy
