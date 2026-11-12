# GeneradorPlantillaAhorro 💰🌱

> Aplicación web moderna, accesible y local-first para planificar metas de ahorro programado a medida, desglosar cuotas exactas, dar seguimiento visual interactivo y programar recordatorios de cobro.

Construido cumpliendo las directrices técnicas y de calidad de [SKILLS.md](SKILLS.md).

---

## 🌟 Características Principales

- **Cálculo Financiero Preciso**:
  - Desglose automático de cuotas y fechas según monto, plazo (meses o semanas) y periodicidad (**semanal**, **quincenal** o **mensual**).
  - **Ajuste exacto de céntimos**: Si la división produce decimales periódicos, la última cuota absorbe la diferencia para garantizar que la suma total coincida al centavo con el objetivo.
  - **Manejo de fechas robusto**: Sin saltos ni desajustes por conversiones de huso horario o desfases UTC.
- **Seguimiento Interactivo en Tiempo Real**:
  - Checklist interactivo de cuotas abonadas y pendientes.
  - Métricas vivas: Total ahorrado, saldo pendiente, porcentaje de avance con barra de progreso animada y fecha de cumplimiento.
  - Botón de acción rápida: *"Pagar siguiente cuota"* y notas personalizadas por cuota.
- **Alertas y Notificaciones**:
  - Integración con la **Web Notifications API** del navegador solicitada con consentimiento contextual.
  - Generación y descarga de archivo de calendario **iCalendar (.ics)** estándar (RFC 5545) compatible con Google Calendar, Apple Calendar y Microsoft Outlook.
  - Detección automática y banner de cuotas vencidas, cuotas de hoy y pagos en los próximos 3 días.
- **Exportación Multi-formato**:
  - **CSV para Excel**: Con cabecera BOM UTF-8 para apertura inmediata sin problemas de tildes o caracteres especiales en Microsoft Excel.
  - **JSON**: Descarga de planes individuales y copias de seguridad completas.
  - **Impresión / PDF**: Hoja de estilos `@media print` optimizada para generar reportes ejecutivos limpios.
  - **Compartir Resumen**: Formateado con emojis y barra visual para copiar a WhatsApp o notas.
- **Privacidad y Local-First**:
  - Funciona 100% offline. Los datos se guardan de forma privada en el almacenamiento local del navegador (`LocalStorage`).
  - Capacidad multi-plan (crear varias metas, duplicar y alternar entre ellas).
  - Respaldo y restauración completa mediante importación/exportación de archivos JSON.
- **Accesibilidad y UX (WCAG 2.1 AA)**:
  - Diseño responsive adaptativo: utilizable desde pantallas de 320 px hasta monitores ultra-wide.
  - Vista adaptada para móviles con tarjetas táctiles y tabla completa para escritorio.
  - Navegación por teclado completa, salto directo al contenido principal (`.skip-link`) y anuncios con `aria-live` para lectores de pantalla.
  - Modo Oscuro y Modo Claro con detección y persistencia.

---

## 🏗️ Arquitectura del Proyecto

Arquitectura modular limpia y desacoplada (ES6 Modules):

```
GeneradorPlantillaAhorro/
├── index.html                   # Interfaz semántica accesible y responsive
├── manifest.json                # Configuración PWA
├── css/
│   └── styles.css               # Sistema de diseño, temas claro/oscuro e impresión
├── src/
│   ├── core/
│   │   ├── calculator.js        # Motor financiero de cuotas, redondeo y fechas
│   │   ├── storage.js           # Persistencia Local-First con soporte multi-plan
│   │   ├── notifications.js     # Notificaciones Web API y calendario RFC 5545 (.ics)
│   │   └── exporter.js          # Exportadores a CSV (Excel), JSON y texto
│   └── ui/
│       └── app.js               # Controlador de interfaz, eventos y reactividad
├── tests/
│   ├── calculator.test.js       # Pruebas unitarias de cálculo financiero
│   ├── storage.test.js          # Pruebas de persistencia y copias de seguridad
│   ├── exporter_and_notifications.test.js # Pruebas de CSV, ICS y alertas
│   └── server.test.js           # Pruebas de integración HTTP y /health
├── server.js                    # Servidor Node.js ligero sin dependencias externas
├── openapi.yaml                 # Contratos de API y modelos de datos OpenAPI 3.1
├── Dockerfile                   # Imagen multi-stage sin privilegios (node) con healthcheck
├── .dockerignore                # Optimización de contexto Docker
├── package.json                 # Scripts de prueba y arranque
├── SKILLS.md                    # Especificación técnica base generada con SkillNeitor
├── RELACION_SKILLNEITOR_GITNEITOR.md # Documentación técnica del flujo SkillNeitor y GitNeitor
└── docs/
    ├── MANUAL_TECNICO.md        # Arquitectura, APIs, persistencia y lógica
    ├── MANUAL_USUARIO.md        # Guía de uso para usuario final y exportación
    └── MANUAL_DESPLIEGUE.md     # Instalación, Docker y versión portable Windows
```

---

## 🚀 Requisitos e Instalación

### Requisitos previos
- **Node.js** v20 o superior (incluye ejecutor de pruebas nativo `node:test`).
- Opcional: **Docker** para despliegue en contenedores.

### Ejecución Local

1. Clona o ingresa al directorio del proyecto:
   ```bash
   cd GeneradorPlantillaAhorro
   ```

2. Ejecutar la suite de pruebas automatizadas:
   ```bash
   npm test
   ```

3. Iniciar el servidor web:
   ```bash
   npm start
   ```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000).

> **Nota:** La aplicación es una solución Local-First con módulos ES nativos. También puedes abrir directamente `index.html` en cualquier navegador moderno o servirla con cualquier servidor estático (como Nginx, Caddy o Live Server).

---

## 🐳 Ejecución con Docker

El proyecto incluye un `Dockerfile` multi-stage que compila las pruebas en la primera etapa y levanta un contenedor seguro sin permisos root:

```bash
# Construir la imagen
docker build -t generador-plantilla-ahorro .

# Ejecutar el contenedor
docker run -d -p 3000:3000 --name ahorro-app generador-plantilla-ahorro

# Verificar estado y healthcheck
docker ps
curl http://localhost:3000/health
```

---

## 🧪 Pruebas Automatizadas

El proyecto utiliza el ejecutor de pruebas nativo de Node.js (`node:test` y `node:assert/strict`):

```bash
npm test
```

### Casos de prueba cubiertos:
- Reparto exacto de céntimos en cuotas no divisibles (ej: 1000 en 3 cuotas).
- Cálculo cronológico por semana, quincena y mes.
- Ajuste de días en meses con 28, 30 y 31 días.
- Formateo de moneda y parseo local de fechas libre de desfases de huso horario.
- Generación de archivo iCalendar (.ics) conforme a la RFC 5545.
- Generación de CSV con BOM UTF-8 para Excel.
- Persistencia, copias de seguridad e importación de archivos JSON.
- Endpoint de salud `/health` y servicio estático del servidor HTTP.

---

## 📄 Contrato de Datos (OpenAPI)

El archivo [`openapi.yaml`](openapi.yaml) define el esquema de los planes de ahorro (`SavingsPlan`), cuotas (`Installment`), métricas y los endpoints de verificación del servidor.

---

## 📖 Manuales del Sistema

El proyecto cuenta con documentación técnica y operativa exhaustiva estructurada en tres manuales independientes disponibles en el directorio [`docs/`](./docs/):

* 🛠️ **[Manual Técnico](./docs/MANUAL_TECNICO.md)**: Arquitectura del sistema (Monolito Modular ES6 y Local-First), stack tecnológico, especificación de endpoints y contratos OpenAPI 3.1.0 (`/health`, `/api/v1/info`), modelos de datos normalizados, estrategia de almacenamiento y algoritmos de cómputo financiero.
* 👤 **[Manual de Usuario](./docs/MANUAL_USUARIO.md)**: Guía completa paso a paso para el usuario final, descripción de campos y vistas interactivas (modo claro/oscuro), validaciones, lógica de cuotas y ajuste de céntimos, registro diario de abonos, alertas de cobro, sincronización con calendarios (.ics) y exportación a Excel, PDF y WhatsApp.
* 🚀 **[Manual de Despliegue](./docs/MANUAL_DESPLIEGUE.md)**: Requisitos del sistema, verificación de dependencias nativas en `package.json`, ejecución local con Node.js (`server.js`), despliegue con Docker multi-stage (usuario no-root y healthcheck), Docker Compose y compilación de versión portable para Windows (binario `.exe` y paquete portable `.bat`).

---

## 📚 Documentación del Proceso

Para consultar el análisis técnico detallado sobre cómo se estructuró, construyó y versionó este proyecto mediante la integración de **SkillNeitor** y **GitNeitor**, consulta:
👉 **[Documentación Técnica: Relación entre SkillNeitor y GitNeitor](./RELACION_SKILLNEITOR_GITNEITOR.md)**

### Resumen del Flujo de Trabajo:
- **SkillNeitor**: Suministró la especificación formal en [`SKILLS.md`](./SKILLS.md), a partir de la cual se implementaron **16 parámetros técnicos reales** que cubren:
  - **UX**: Validación contextual de formularios sin pérdida de datos, microcopys y estados vacíos asistidos, gestión respetuosa de notificaciones (Web API e iCalendar RFC 5545) y criterios de precisión financiera.
  - **UI y Accesibilidad**: Cumplimiento WCAG 2.1 AA, compatibilidad responsive desde 320 px (tarjetas móviles vs. tabla de escritorio), componentes semánticos con anuncios `aria-live` y gestión de estado con flujo unidireccional.
  - **Persistencia y Datos**: Arquitectura *Local-First* con `LocalStorage`, tolerancia offline al 100%, modelo de datos normalizado (OpenAPI 3.1), versionado de esquemas (`*_v1`) y copias de seguridad JSON completas.
  - **Compilación y DevOps**: Monolito modular desacoplado en ES Modules, compilación y validación en contenedor Docker multi-stage (`node:24-bookworm-slim` con usuario no-root `node`), servidor HTTP nativo sin dependencias y protección contra ataques XSS y *Path Traversal*.
- **GitNeitor**: Estandarizó y gestionó el control de versiones y la seguridad del repositorio:
  - **Escaneo de Secretos (*Secret Scanning*)**: Auditoría preventiva de claves, tokens y archivos no autorizados previo a cualquier commit.
  - **Commits Semánticos (*Conventional Commits*)**: Trazabilidad granular mediante mensajes tipificados (`feat`, `fix`, `test`, `chore`, `docs`).
  - **Sincronización con GitHub**: Gobernanza de ramas (`main`) y enlace sincronizado con el repositorio remoto oficial [`Juan-V7/GeneradorPlantillaAhorro`](https://github.com/Juan-V7/GeneradorPlantillaAhorro).

---

## 🛡️ Licencia

Distribuido bajo la Licencia MIT.
