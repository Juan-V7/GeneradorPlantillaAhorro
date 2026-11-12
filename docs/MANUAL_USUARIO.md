# Manual de Usuario
# GeneradorPlantillaAhorro 💰🌱

> **Guía Oficial para el Usuario Final**  
> **Versión de la Aplicación:** 1.0.0  
> **Moneda Soportada:** Pesos Colombianos (COP)  
> **Acceso Web:** [http://localhost:3000](http://localhost:3000)

---

## 1. Introducción y Bienvenida

¡Te damos la bienvenida a **GeneradorPlantillaAhorro**! Esta aplicación web está diseñada para ayudarte a materializar tus proyectos personales y financieros mediante planes de ahorro programado a tu medida.

Con esta herramienta podrás:
* **Definir metas claras:** Ahorro para emergencias, vacaciones, compra de vehículo, tecnología o proyectos personales.
* **Calcular cuotas exactas:** Saber con exactitud matemática cuánto dinero debes apartar semanal, quincenal o mensualmente.
* **Seguimiento interactivo:** Registrar tus abonos día a día, ver tu saldo pendiente y medir tu porcentaje de progreso.
* **Recordatorios automáticos:** Recibir alertas en tu navegador y sincronizar las fechas de pago con tu calendario personal (Google Calendar, Apple Calendar o Microsoft Outlook).
* **Exportar y compartir:** Llevarte tus tablas a Microsoft Excel, descargar reportes en PDF o compartir tu avance por WhatsApp con amigos y familiares.

### 🔒 Tu Privacidad es Primero (Filosofía Local-First)
En **GeneradorPlantillaAhorro**, **no necesitas registrarte con correo ni crear contraseñas**. Todos tus datos financieros se guardan de forma 100% privada en la memoria de tu propio navegador (`LocalStorage`). Ninguna información sobre tu dinero o tus metas se envía a servidores de terceros ni sale de tu dispositivo.

---

## 2. Requisitos de Acceso y Navegación

### Navegadores Compatibles
Puedes usar la aplicación en cualquier navegador web moderno:
* Google Chrome (versión 90 o superior)
* Mozilla Firefox (versión 90 o superior)
* Microsoft Edge (versión 90 o superior)
* Safari en macOS o iOS (versión 15 o superior)
* Brave, Opera o navegadores basados en Chromium

### Dispositivos Soportados
* **Computadores de Escritorio y Portátiles:** Experiencia completa con tabla de cronograma extendida.
* **Tablets y Teléfonos Inteligentes:** La interfaz se adapta automáticamente, transformando la tabla en tarjetas táctiles interactivas de fácil manejo con una sola mano.

### Modo Oscuro y Modo Claro
En la esquina superior derecha de la pantalla encontrarás el botón con el icono de luna/sol **"Modo Oscuro"** / **"Modo Claro"**. Puedes alternar entre ellos según tu preferencia o las condiciones de luz. Tu selección se recordará automáticamente en futuras visitas.

---

## 3. Descripción de la Interfaz de Usuario

La pantalla principal está organizada en áreas claramente diferenciadas para facilitar tu trabajo:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [🌱 Generador de Plantilla de Ahorro]            [🌙 Modo] [💾 Backup] │
├────────────────────────────────────────────────────────────────────────┤
│ [📂 Plan Actual: Fondo Vacaciones ▼]  [➕ Nueva] [📑 Duplicar] [🗑️ Borrar]│
├──────────────────────────┬─────────────────────────────────────────────┤
│ 🎯 DEFINIR META          │ 📊 PANEL DE SEGUIMIENTO                     │
│ • Nombre de la meta      │ 🔔 [Banner de Alertas: Cuotas de Hoy/Próx]  │
│ • Monto en COP ($)       │                                             │
│ • Plazo (meses/semanas)  │ 💵 Ahorrado | ⏳ Saldo | 📅 Próximo | 🏁 Fin │
│ • Frecuencia de cobro    │ ━━━━━━━━━━━━━━ Progreso (45%) ━━━━━━━━━━━━━ │
│ • Fecha de primer aporte │                                             │
│ [⚡ Generar Plantilla]   │ [✅ Pagar Siguiente] [📊 Excel] [📋 Resumen]│
│                          │                                             │
│ 🔔 RECORDATORIOS         │ ┌─────────────────────────────────────────┐ │
│ • Activar alertas web    │ │ TABLA DE CUOTAS / TARJETAS MÓVILES      │ │
│ • Sincronizar (.ics)     │ └─────────────────────────────────────────┘ │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### 3.1. Barra Superior (Cabecera)
* **Logotipo y Título:** Identifica el sistema configurado para Pesos Colombianos.
* **Botón de Modo Oscuro/Claro:** Cambia el contraste visual de la interfaz.
* **Botón Copias de Respaldo (💾):** Abre la ventana para descargar una copia completa de todas tus metas o restaurar un archivo guardado anteriormente.

### 3.2. Barra de Selección de Plan Activo
Ubicada justo debajo de la cabecera, te permite gestionar múltiples planes a la vez:
* **Selector Desplegable:** Muestra la meta que estás viendo actualmente y te permite cambiar rápidamente entre otras metas guardadas.
* **Botón "➕ Nueva Meta":** Limpia el formulario para crear un nuevo plan desde cero.
* **Botón "📑 Duplicar":** Crea una copia idéntica del plan actual (con los mismos montos y plazos) pero con todas las cuotas listas para empezar de nuevo.
* **Botón "🗑️ Eliminar":** Borra la meta seleccionada tras pedirte una confirmación de seguridad.

### 3.3. Panel Lateral Izquierdo: Formulario "Definir Meta"
Aquí ingresas las condiciones de tu ahorro:
1. **Nombre de la meta:** Texto descriptivo (ej. *"Comprar Computador Portátil"*, *"Fondo de Emergencia"*). Máximo 60 caracteres.
2. **Monto Objetivo en COP:** Cantidad total que deseas reunir en Pesos Colombianos (mínimo \$1.000 COP).
3. **Moneda:** Campo fijo en `$ COP`.
4. **Plazo total:** Número entero que indica la duración (ej. 6, 12, 24).
5. **Unidad del plazo:** Selecciona si el plazo está dado en **Meses** o en **Semanas**.
6. **Frecuencia de ahorro:** Determina cada cuánto tiempo vas a aportar:
   * **Mensual:** 1 abono cada mes.
   * **Quincenal:** 1 abono cada 14 días (2 abonos al mes).
   * **Semanal:** 1 abono cada 7 días.
7. **Fecha del primer aporte:** Fecha del calendario en la que harás tu primer depósito o pago.
8. **Botón "⚡ Calcular y Generar Plantilla":** Procesa la información, calcula las cuotas y genera el cronograma interactivo.

### 3.4. Panel Lateral Izquierdo: Módulo "Alertas y Recordatorios"
* **"Activar alertas en navegador":** Solicita permiso para mostrar avisos nativos en tu pantalla en las fechas de cobro.
* **"Sincronizar Calendario (.ics)":** Descarga un archivo compatible con Google Calendar, Apple Calendar o Microsoft Outlook con alarmas programadas a las 9:00 AM de cada fecha de pago.

### 3.5. Panel Derecho: Seguimiento y Métricas
* **Vista de Estado Vacío:** Se muestra cuando entras por primera vez o no tienes un plan seleccionado, invitándote a comenzar.
* **Banner de Alertas:** Caja superior que destaca si tienes pagos vencidos, cuotas para el día de hoy o pagos en los próximos 3 días.
* **Tarjetas de Métricas:**
  - **Ahorrado:** Total acumulado con el número de cuotas cubiertas.
  - **Saldo Pendiente:** Cantidad restante para alcanzar la meta total.
  - **Próximo Pago:** Monto y fecha límite de la cuota pendiente más cercana.
  - **Fecha Límite:** Fecha proyectada en la que habrás completado el 100% de la meta.
* **Barra de Progreso:** Indicador visual que se llena en color verde a medida que abonas tus cuotas.
* **Barra de Herramientas de Cuotas:**
  - `✅ Pagar Siguiente Cuota`: Marca automáticamente la cuota pendiente más antigua.
  - `Marcar Todas` / `Desmarcar Todas`: Acciones rápidas para marcar o reiniciar el plan.
  - `📊 CSV (Excel)`: Descarga la hoja de cálculo compatible con Excel.
  - `📦 JSON`: Descarga la estructura digital del plan.
  - `🖨️ Imprimir / PDF`: Abre la vista de impresión optimizada.
  - `📋 Copiar Resumen`: Copia al portapapeles un resumen con emojis listo para enviar por WhatsApp.
* **Cronograma de Cuotas:**
  - En computadores: Tabla con columnas de Abono, Número de Cuota, Fecha Límite, Monto, Acumulado Esperado, Estado y Notas.
  - En teléfonos móviles: Tarjetas interactivas con botones grandes de pago y campos de texto para notas.

---

## 4. Guía Paso a Paso: Creación de tu Plan de Ahorro

Sigue estos pasos para planificar una nueva meta:

### Paso 1: Haz clic en "➕ Nueva Meta"
Si ya tienes un plan en pantalla, pulsa el botón **"➕ Nueva Meta"** en la barra superior. Si es tu primera vez, el formulario estará listo esperándote.

### Paso 2: Dale un nombre a tu objetivo
En el campo **"Nombre de la meta"**, escribe un título significativo. Por ejemplo:  
`Ahorro Vacaciones Cancún 2027`

### Paso 3: Define cuánto dinero necesitas
En el campo **"Monto Objetivo en COP"**, escribe la cantidad sin puntos ni comas. Por ejemplo, si deseas ahorrar dos millones cuatrocientos mil pesos, escribe:  
`2400000`

### Paso 4: Establece el tiempo
* En **"Plazo total"**, ingresa el número (por ejemplo, `12`).
* En **"Unidad"**, elige `Meses` o `Semanas`.

### Paso 5: Escoge la periodicidad que mejor se adapte a tus ingresos
* Si recibes tu sueldo cada mes: Elige **Mensual**.
* Si cobras de manera quincenal: Elige **Quincenal** (cada 14 días).
* Si prefieres apartar una suma pequeña cada fin de semana: Elige **Semanal**.

### Paso 6: Elige la fecha de inicio
Selecciona la fecha exacta en la que vas a realizar tu primer abono. Por ejemplo: `15/12/2026`.

### Paso 7: Presiona "⚡ Calcular y Generar Plantilla"
En fracciones de segundo, el sistema:
1. Creará todas las cuotas cronológicas sin saltos de días.
2. Calculará el valor exacto de cada aporte.
3. Guardará el plan en tu navegador.
4. Mostrará las tarjetas de métricas y la tabla interactiva de seguimiento.

---

## 5. Reglas de Cálculo Financiero y Ajuste de Céntimos

### ¿Cómo calcula el sistema tus cuotas?
El número de cuotas se determina multiplicando el plazo por la frecuencia. Por ejemplo:
* Un plazo de **6 meses** con periodicidad **quincenal** genera exactamente **12 cuotas**.
* Un plazo de **1 año (12 meses)** con periodicidad **mensual** genera **12 cuotas**.

### ¿Qué es el "Ajuste Exacto de Céntimos"?
Cuando una cantidad no se puede dividir de manera exacta (por ejemplo, querer ahorrar \$1.000.000 en 3 cuotas mensuales, lo que daría \$333.333,333... por cuota), los sistemas comunes cometen el error de redondear hacia abajo (\$333.333 × 3 = \$999.999), perdiendo \$1 peso, o hacia arriba, cobrando de más.

**GeneradorPlantillaAhorro** resuelve esto mediante un algoritmo de absorción de residuos:
* Las primeras cuotas se fijan en el valor estándar redondeado.
* **La última cuota absorbe la diferencia exacta** para garantizar que la suma de todos tus pagos coincida exactamente al centavo con tu meta original.

### Cálculo de Fechas Inteligente
* En cuotas **quincenales**, el sistema suma exactamente 14 días entre cada abono. Esto garantiza que si empezaste un viernes, todas tus cuotas caigan siempre en viernes.
* En cuotas **mensuales**, el sistema respeta el mismo día de cada mes (por ejemplo, el día 15 o el día 30). Si tu cuota cae en un día 31 y el siguiente mes tiene solo 30 días (o febrero tiene 28/29 días), el sistema ajusta la fecha automáticamente al último día de ese mes sin desfasar el resto del año.

---

## 6. Registro de Pagos y Control Diario

A medida que pasa el tiempo y efectúas tus aportes de dinero, debes registrarlos en la aplicación:

### Opción A: Botón Rápido "Pagar Siguiente Cuota"
Es la forma más cómoda: haz clic en el botón verde **"✅ Pagar Siguiente Cuota"**. El sistema buscará la cuota pendiente más antigua, la marcará como pagada con la fecha de hoy, actualizará tu barra de progreso y recalculará tu saldo pendiente al instante.

### Opción B: Marcar Cuotas Individualmente
* **En el computador:** En la tabla de cuotas, haz clic sobre la casilla de verificación (checkbox) de la columna **"Abono"**.
* **En el celular:** Toca el botón de la cuota en su respectiva tarjeta.

### Agregar Notas a las Cuotas
En la columna **"Notas"** de cada cuota puedes escribir detalles útiles para tu control personal, tales como:
* *"Pagado mediante transferencia bancaria"*
* *"Abonado con prima navideña"*
* *"Se adelantaron $50.000 extras"*

Las notas se guardan automáticamente al presionar `Enter` o al hacer clic fuera del campo de texto.

---

## 7. Alertas y Sincronización con Calendarios

Para que nunca olvides una fecha límite de pago, la aplicación ofrece dos métodos complementarios:

### 7.1. Alertas en el Navegador Web
1. En el recuadro **"Alertas y Recordatorios"** del panel izquierdo, pulsa **"Activar alertas en navegador"**.
2. Tu navegador mostrará una ventana preguntando si deseas permitir notificaciones. Elige **"Permitir"**.
3. A partir de ese momento, la aplicación podrá enviarte avisos visuales cuando se acerque una fecha de cobro.

### 7.2. Sincronización con Google Calendar, Apple o Outlook (.ics)
Si prefieres tener los recordatorios directamente en tu teléfono móvil o en tu calendario de trabajo:
1. Haz clic en **"📅 Sincronizar Calendario (.ics)"**.
2. Se descargará un archivo llamado `calendario_ahorro_[tu_meta].ics`.
3. Abre el archivo descargado en tu celular o computador:
   * **En Google Calendar:** Ve a Configuración > Importar y exportar > Selecciona el archivo `.ics`.
   * **En iPhone / Mac (Apple Calendar):** Toca dos veces el archivo y pulsa "Añadir a Calendario".
   * **En Outlook:** Arrastra el archivo a tu sección de calendarios.
4. Cada cuota se programará como un evento con una alarma automática a las **9:00 AM** del día pactado, indicándote el monto a depositar y tu acumulado esperado.

---

## 8. Exportación e Impresión

Puedes extraer y compartir tus planes de ahorro en múltiples formatos profesionales:

| Botón | Formato | Uso Recomendado |
|---|---|---|
| **📊 CSV (Excel)** | Archivo `.csv` con cabecera BOM UTF-8 | Ideal para abrir en **Microsoft Excel**, **Google Sheets** o **LibreOffice Calc**. Mantiene los acentos y caracteres especiales intactos. |
| **📦 JSON** | Archivo estructurado `.json` | Para desarrolladores o para archivar una copia digital de tu plan. |
| **🖨️ Imprimir / PDF** | Vista de impresión `@media print` | Abre el cuadro de diálogo de tu navegador para imprimir en papel o seleccionar **"Guardar como PDF"**. El diseño se simplifica para generar un documento ejecutivo limpio sin botones ni menús. |
| **📋 Copiar Resumen** | Texto enriquecido con emojis | Copia al portapapeles un resumen visual con barra de emojis (ej. `[🟩🟩🟩⬜⬜]`) listo para pegar en **WhatsApp**, **Telegram**, notas o correo electrónico. |

---

## 9. Gestión Multi-Plan y Copias de Seguridad

### Crear Múltiples Metas de Ahorro
Puedes tener tantas metas como desees de forma simultánea (por ejemplo: *"Matrícula Universidad"*, *"Arreglos de la Casa"* y *"Fondo para Imprevistos"*). Solo selecciona la meta que deseas consultar en el menú desplegable **"Plan Actual"**.

### Duplicar una Meta
Si finalizaste un plan de ahorro de 6 meses y deseas iniciar otro ciclo exactamente con los mismos valores, haz clic en **"📑 Duplicar"**. Se creará una nueva meta idéntica pero con todas las cuotas desmarcadas y listas para comenzar.

### Copias de Seguridad (Backup Completo)
Para asegurarte de no perder tus metas si cambias de equipo o limpias los datos de tu navegador:
1. Haz clic en el botón superior **"💾 Copias de Respaldo"**.
2. En la ventana emergente, pulsa **"📥 Descargar Copia Completa (JSON)"**.
3. Se descargará un archivo que contiene todas tus metas, notas y estados de pago.
4. En otro computador o navegador, abre la misma ventana, selecciona el archivo en el botón **"Restaurar desde archivo JSON"** y haz clic en **"Restaurar Archivo"**. Tus planes se cargarán de inmediato.

---

## 10. Preguntas Frecuentes (FAQ)

### ¿Tengo que pagar algo o crear una cuenta?
No. La aplicación es completamente gratuita, de código abierto y no requiere cuentas de usuario.

### ¿Qué pasa si cierro la pestaña del navegador?
Tus datos están guardados de forma segura en el almacenamiento local de tu navegador. Cuando vuelvas a ingresar a la dirección web, tus planes y tus abonos estarán exactamente donde los dejaste.

### ¿Puedo utilizar la aplicación sin conexión a Internet?
Sí. Al ser una aplicación *Local-First* con arquitectura estática y manifiesto PWA, funciona con total normalidad aunque no tengas conexión a Internet.

### ¿Qué ocurre si borro el historial o las cookies de mi navegador?
Si realizas una "limpieza de cookies y datos de sitios web" en tu navegador, la memoria de `LocalStorage` podría borrarse. Por esta razón, te recomendamos descargar periódicamente una **Copia de Respaldo** desde el botón superior **💾**.
