/**
 * Módulo de Notificaciones y Recordatorios de Cobro
 *
 * Incluye soporte para Web Notifications API y generación de archivos
 * de calendario estándar iCalendar (.ics) para sincronización con
 * Google Calendar, Apple Calendar y Outlook.
 */

import { parseLocalDate, formatCurrency } from './calculator.js';

/**
 * Comprueba si el navegador soporta la Web Notifications API.
 * @returns {boolean}
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Obtiene el estado actual del permiso de notificaciones.
 * @returns {'granted'|'denied'|'default'|'unsupported'}
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Solicita permiso al usuario para enviar notificaciones web con contexto.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.warn('Error al solicitar permiso de notificación:', err);
    return false;
  }
}

/**
 * Emite una notificación nativa del navegador si se tienen permisos.
 * @param {string} title
 * @param {NotificationOptions} [options]
 * @returns {Notification|null}
 */
export function sendBrowserNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💰</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>',
    ...options
  };

  try {
    return new Notification(title, defaultOptions);
  } catch (err) {
    console.warn('No fue posible disparar la notificación:', err);
    return null;
  }
}

/**
 * Analiza un plan y detecta las cuotas que requieren alerta (hoy, vencidas o próximas en 3 días).
 * @param {Object} plan
 * @returns {Array<Object>} Lista de alertas clasificadas
 */
export function getUpcomingAlerts(plan) {
  if (!plan || !Array.isArray(plan.installments)) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const alerts = [];

  for (const inst of plan.installments) {
    if (inst.isPaid) continue;

    const dueDate = parseLocalDate(inst.dueDate);
    const diffMs = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      alerts.push({
        type: 'danger',
        level: 'vencida',
        title: `Cuota #${inst.number} vencida`,
        message: `Esta cuota venció hace ${Math.abs(diffDays)} día(s) (${inst.dueDate}). Monto: ${formatCurrency(inst.amount, plan.currency)}`,
        installment: inst,
        diffDays
      });
    } else if (diffDays === 0) {
      alerts.push({
        type: 'warning',
        level: 'hoy',
        title: `¡Cuota #${inst.number} para hoy!`,
        message: `Hoy debes reservar ${formatCurrency(inst.amount, plan.currency)} para tu meta "${plan.title}".`,
        installment: inst,
        diffDays: 0
      });
    } else if (diffDays <= 3) {
      alerts.push({
        type: 'info',
        level: 'proxima',
        title: `Cuota #${inst.number} próxima`,
        message: `Faltan ${diffDays} día(s) para tu pago de ${formatCurrency(inst.amount, plan.currency)} (${inst.dueDate}).`,
        installment: inst,
        diffDays
      });
    }
  }

  return alerts;
}

/**
 * Genera el contenido de un archivo de calendario iCalendar (.ics) estándar (RFC 5545).
 * Permite importar las fechas de ahorro a Google Calendar, Apple Calendar o Microsoft Outlook.
 *
 * @param {Object} plan
 * @returns {string} Texto formateado en formato .ics
 */
export function generateICalendar(plan) {
  if (!plan || !Array.isArray(plan.installments)) return '';

  const formatICSDate = (dateStr) => {
    // Convierte YYYY-MM-DD a YYYYMMDD
    return dateStr.replace(/-/g, '');
  };

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const events = plan.installments
    .filter(inst => !inst.isPaid)
    .map(inst => {
      const dtDate = formatICSDate(inst.dueDate);
      const uid = `ahorro-${plan.id}-cuota-${inst.number}@generadorahorro.local`;
      const summary = `💰 Ahorro: Cuota #${inst.number} - ${plan.title}`;
      const description = `Recordatorio de cuota programada de ahorro:\\nMeta: ${plan.title}\\nCuota: #${inst.number} de ${plan.totalInstallments}\\nMonto: ${formatCurrency(inst.amount, plan.currency)}\\nAcumulado objetivo: ${formatCurrency(inst.cumulativeTarget, plan.currency)}`;

      return [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;VALUE=DATE:${dtDate}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT9H', // Alarma a las 9:00 AM del día
        'ACTION:DISPLAY',
        `DESCRIPTION:Recordatorio de pago de ahorro: ${plan.title}`,
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');
    })
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GeneradorPlantillaAhorro//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Ahorro - ${plan.title}`,
    events,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Descarga en el navegador el archivo .ics para el plan dado.
 * @param {Object} plan
 */
export function downloadICalendarFile(plan) {
  if (typeof window === 'undefined') return;

  const icsContent = generateICalendar(plan);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const sanitizedTitle = (plan.title || 'plan_ahorro').replace(/[^a-z0-9_-]/gi, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `calendario_ahorro_${sanitizedTitle}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
