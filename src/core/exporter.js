/**
 * Módulo de Exportación Multi-formato para GeneradorPlantillaAhorro
 *
 * Exporta el cronograma de ahorro a CSV (con soporte Excel UTF-8 BOM),
 * archivo JSON estructurado, resumen para compartir e impresión directa.
 */

import { formatCurrency, formatDisplayDate } from './calculator.js';

/**
 * Convierte el plan de ahorro en una tabla formateada en CSV.
 * @param {Object} plan
 * @returns {string} Contenido CSV
 */
export function generatePlanCSV(plan) {
  if (!plan || !Array.isArray(plan.installments)) return '';

  const headers = [
    'Cuota #',
    'Fecha de Pago',
    'Monto Cuota',
    'Acumulado Esperado',
    'Estado',
    'Fecha de Abono',
    'Notas'
  ];

  const escapeCSV = (str) => {
    const text = String(str || '').replace(/"/g, '""');
    return `"${text}"`;
  };

  const rows = plan.installments.map(inst => [
    inst.number,
    inst.dueDate,
    inst.amount.toFixed(2),
    inst.cumulativeTarget.toFixed(2),
    inst.isPaid ? 'PAGADA' : 'PENDIENTE',
    inst.paidAt ? inst.paidAt.split('T')[0] : '',
    escapeCSV(inst.notes || '')
  ]);

  // Metadatos iniciales
  const metadata = [
    `"PLAN DE AHORRO PROGRAMADO: ${plan.title.replace(/"/g, '""')}"`,
    `"Monto Objetivo: ${plan.currency} ${plan.targetAmount.toFixed(2)}"`,
    `"Periodicidad: ${plan.frequency.toUpperCase()}"`,
    `"Fecha Inicio: ${plan.startDate}"`,
    `"Fecha Final Estimada: ${plan.endDate}"`,
    ''
  ];

  const allLines = [
    ...metadata,
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ];

  // Anteponemos el BOM UTF-8 para que Microsoft Excel lo abra sin problemas de codificación
  return '\uFEFF' + allLines.join('\r\n');
}

/**
 * Descarga el plan de ahorro en formato CSV.
 * @param {Object} plan
 */
export function downloadPlanCSV(plan) {
  if (typeof window === 'undefined') return;

  const csvContent = generatePlanCSV(plan);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const sanitizedTitle = (plan.title || 'plan_ahorro').replace(/[^a-z0-9_-]/gi, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `plantilla_ahorro_${sanitizedTitle}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Descarga el plan de ahorro en formato JSON.
 * @param {Object} plan
 */
export function downloadPlanJSON(plan) {
  if (typeof window === 'undefined') return;

  const jsonContent = JSON.stringify(plan, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const sanitizedTitle = (plan.title || 'plan_ahorro').replace(/[^a-z0-9_-]/gi, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `plan_ahorro_${sanitizedTitle}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Genera un texto resumen amigable optimizado para copiar al portapapeles o WhatsApp.
 * @param {Object} plan
 * @param {Object} metrics
 * @returns {string}
 */
export function generateShareableSummary(plan, metrics) {
  if (!plan) return '';

  const progressBars = Math.round((metrics.progressPercentage / 100) * 10);
  const barVisual = '🟩'.repeat(progressBars) + '⬜'.repeat(10 - progressBars);

  return [
    `🎯 *Meta de Ahorro: ${plan.title}*`,
    `💰 Monto Objetivo: ${formatCurrency(plan.targetAmount, plan.currency)}`,
    `📊 Progreso: ${metrics.progressPercentage}% (${metrics.paidCount}/${metrics.totalCount} cuotas)`,
    `[${barVisual}]`,
    `💵 Ahorrado: ${formatCurrency(metrics.totalSaved, plan.currency)}`,
    `⏳ Saldo Restante: ${formatCurrency(metrics.remainingBalance, plan.currency)}`,
    metrics.nextPayment
      ? `📅 Próxima Cuota: #${metrics.nextPayment.number} (${formatCurrency(metrics.nextPayment.amount, plan.currency)}) el ${formatDisplayDate(metrics.nextPayment.dueDate)}`
      : '🎉 ¡Meta cumplida con éxito!',
    '',
    'Creado con GeneradorPlantillaAhorro'
  ].join('\n');
}

/**
 * Dispara el cuadro de diálogo de impresión del navegador.
 */
export function printCurrentPlan() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
