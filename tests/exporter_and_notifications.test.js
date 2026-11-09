import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSavingsPlan } from '../src/core/calculator.js';
import { generateICalendar, getUpcomingAlerts } from '../src/core/notifications.js';
import { generatePlanCSV, generateShareableSummary } from '../src/core/exporter.js';

test('generateICalendar produce estructura válida RFC 5545', () => {
  const plan = generateSavingsPlan({
    title: 'Viaje Cusco',
    targetAmount: 500,
    termValue: 2,
    termUnit: 'meses',
    frequency: 'mensual',
    startDate: '2026-06-01'
  });

  const ics = generateICalendar(plan);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('VERSION:2.0'));
  assert.ok(ics.includes('SUMMARY:💰 Ahorro: Cuota #1 - Viaje Cusco'));
  assert.ok(ics.includes('SUMMARY:💰 Ahorro: Cuota #2 - Viaje Cusco'));
  assert.ok(ics.includes('END:VCALENDAR'));
});

test('generatePlanCSV genera cabecera con BOM UTF-8 y filas de cuotas', () => {
  const plan = generateSavingsPlan({
    title: 'Ahorro Auto',
    targetAmount: 1000,
    termValue: 2,
    termUnit: 'meses',
    frequency: 'mensual',
    startDate: '2026-01-01'
  });

  const csv = generatePlanCSV(plan);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('PLAN DE AHORRO PROGRAMADO: Ahorro Auto'));
  assert.ok(csv.includes('Cuota #;Fecha de Pago;Monto Cuota'));
  assert.ok(csv.includes('1;2026-01-01;500.00;500.00;PENDIENTE'));
  assert.ok(csv.includes('2;2026-02-01;500.00;1000.00;PENDIENTE'));
});

test('getUpcomingAlerts detecta cuotas vencidas y próximas', () => {
  const plan = generateSavingsPlan({
    title: 'Meta Test',
    targetAmount: 300,
    termValue: 3,
    termUnit: 'meses',
    frequency: 'mensual',
    startDate: '2020-01-01' // Fechas en el pasado
  });

  const alerts = getUpcomingAlerts(plan);
  assert.ok(alerts.length > 0);
  assert.equal(alerts[0].level, 'vencida');
  assert.equal(alerts[0].type, 'danger');
});

test('generateShareableSummary incluye detalles clave y barra visual', () => {
  const plan = generateSavingsPlan({
    title: 'Laptop Gamer',
    targetAmount: 1200,
    termValue: 4,
    termUnit: 'meses',
    frequency: 'mensual'
  });

  const summary = generateShareableSummary(plan, {
    progressPercentage: 50,
    paidCount: 2,
    totalCount: 4,
    totalSaved: 600,
    remainingBalance: 600,
    nextPayment: { number: 3, amount: 300, dueDate: '2026-08-01' }
  });

  assert.ok(summary.includes('Meta de Ahorro: Laptop Gamer'));
  assert.ok(summary.includes('50%'));
  assert.ok(summary.includes('🟩'));
});
