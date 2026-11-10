import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseLocalDate,
  formatISODate,
  calculateInstallmentDate,
  calculateInstallmentCount,
  generateSavingsPlan,
  calculatePlanMetrics,
  formatCurrency
} from '../src/core/calculator.js';

test('parseLocalDate maneja strings YYYY-MM-DD sin alteración por zona horaria', () => {
  const date = parseLocalDate('2026-05-15');
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 4); // 0-indexed: mayo = 4
  assert.equal(date.getDate(), 15);
  assert.equal(formatISODate(date), '2026-05-15');
});

test('calculateInstallmentCount calcula cuotas según meses y periodicidad', () => {
  assert.equal(calculateInstallmentCount(6, 'meses', 'mensual'), 6);
  assert.equal(calculateInstallmentCount(6, 'meses', 'quincenal'), 12);
  assert.equal(calculateInstallmentCount(12, 'meses', 'semanal'), 52);

  assert.equal(calculateInstallmentCount(8, 'semanas', 'semanal'), 8);
  assert.equal(calculateInstallmentCount(8, 'semanas', 'quincenal'), 4);
  assert.equal(calculateInstallmentCount(12, 'semanas', 'mensual'), 3);
});

test('calculateInstallmentDate ajusta días de fin de mes correctamente', () => {
  const base = parseLocalDate('2026-01-31');
  const cuota1 = calculateInstallmentDate(base, 1, 'mensual'); // Febrero 2026 (28 días)
  assert.equal(formatISODate(cuota1), '2026-02-28');

  const cuota2 = calculateInstallmentDate(base, 2, 'mensual'); // Marzo (31 días)
  assert.equal(formatISODate(cuota2), '2026-03-31');

  const cuota3 = calculateInstallmentDate(base, 3, 'mensual'); // Abril (30 días)
  assert.equal(formatISODate(cuota3), '2026-04-30');
});

test('generateSavingsPlan reparte los céntimos con exactitud matemática al 100%', () => {
  // 1000 dividido entre 3 no es exacto (333.3333...)
  const plan = generateSavingsPlan({
    title: 'Fondo de Emergencia',
    targetAmount: 1000,
    termValue: 3,
    termUnit: 'meses',
    frequency: 'mensual',
    startDate: '2026-01-01'
  });

  assert.equal(plan.totalInstallments, 3);
  assert.equal(plan.installments.length, 3);
  assert.equal(plan.installments[0].amount, 333.33);
  assert.equal(plan.installments[1].amount, 333.33);
  // La última cuota absorbe el centavo para que sume 1000.00 exactos:
  assert.equal(plan.installments[2].amount, 333.34);

  const sumTotal = plan.installments.reduce((acc, inst) => acc + inst.amount, 0);
  assert.equal(Math.round(sumTotal * 100) / 100, 1000.00);
});

test('calculatePlanMetrics refleja el progreso, saldo pendiente y próxima cuota', () => {
  const plan = generateSavingsPlan({
    title: 'Viaje',
    targetAmount: 600,
    termValue: 6,
    termUnit: 'meses',
    frequency: 'mensual',
    startDate: '2026-01-01'
  });

  let metrics = calculatePlanMetrics(plan);
  assert.equal(metrics.totalSaved, 0);
  assert.equal(metrics.remainingBalance, 600);
  assert.equal(metrics.progressPercentage, 0);
  assert.equal(metrics.isCompleted, false);
  assert.equal(metrics.nextPayment.number, 1);
  assert.equal(metrics.nextPayment.amount, 100);

  // Marcar primera cuota como pagada
  plan.installments[0].isPaid = true;
  metrics = calculatePlanMetrics(plan);
  assert.equal(metrics.totalSaved, 100);
  assert.equal(metrics.remainingBalance, 500);
  assert.equal(metrics.progressPercentage, 16.7);
  assert.equal(metrics.nextPayment.number, 2);

  // Marcar todas
  plan.installments.forEach(inst => { inst.isPaid = true; });
  metrics = calculatePlanMetrics(plan);
  assert.equal(metrics.totalSaved, 600);
  assert.equal(metrics.remainingBalance, 0);
  assert.equal(metrics.progressPercentage, 100);
  assert.equal(metrics.isCompleted, true);
  assert.equal(metrics.nextPayment, null);
});

test('formatCurrency formatea montos en formato de moneda limpio', () => {
  const formatted = formatCurrency(1250.5, '$');
  assert.match(formatted, /\$\s?1[.,]250[.,]50/);
});
