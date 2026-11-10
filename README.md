<<<<<<< HEAD
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
└── SKILLS.md                    # Especificación técnica base
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

## 🛡️ Licencia

Distribuido bajo la Licencia MIT.
=======
# GeneradorPlantillaAhorro

>>>>>>> 5670ad635d536ea0e40a7ca073eb19aeb02ebec0
