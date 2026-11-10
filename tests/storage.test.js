import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllPlans,
  savePlan,
  getPlanById,
  deletePlan,
  duplicatePlan,
  getActivePlanId,
  setActivePlanId,
  toggleInstallmentPaid,
  payNextInstallment,
  markAllInstallments,
  exportAllDataAsJSON,
  importDataFromJSON,
  clearAllStorage
} from '../src/core/storage.js';
import { generateSavingsPlan } from '../src/core/calculator.js';

test.beforeEach(() => {
  clearAllStorage();
});

test('savePlan guarda y recupera planes correctamente', () => {
  const plan = generateSavingsPlan({
    title: 'Viaje a Tokio',
    targetAmount: 3000,
    termValue: 6,
    termUnit: 'meses',
    frequency: 'mensual'
  });

  savePlan(plan);
  const all = getAllPlans();
  assert.equal(all.length, 1);
  assert.equal(all[0].title, 'Viaje a Tokio');
  assert.equal(getActivePlanId(), plan.id);

  const retrieved = getPlanById(plan.id);
  assert.notEqual(retrieved, null);
  assert.equal(retrieved.targetAmount, 3000);
});

test('toggleInstallmentPaid y payNextInstallment actualizan los abonos', () => {
  const plan = generateSavingsPlan({
    title: 'Nueva Moto',
    targetAmount: 1200,
    termValue: 4,
    termUnit: 'meses',
    frequency: 'mensual'
  });
  savePlan(plan);

  // Pagar siguiente cuota
  const nextPaid = payNextInstallment(plan.id);
  assert.equal(nextPaid.number, 1);
  assert.equal(nextPaid.isPaid, true);

  const updatedPlan = getPlanById(plan.id);
  assert.equal(updatedPlan.installments[0].isPaid, true);
  assert.equal(updatedPlan.installments[1].isPaid, false);

  // Toggle de la cuota 1
  toggleInstallmentPaid(plan.id, 1);
  const toggled = getPlanById(plan.id);
  assert.equal(toggled.installments[0].isPaid, false);
});

test('markAllInstallments marca todas las cuotas', () => {
  const plan = generateSavingsPlan({
    title: 'Fondo Salud',
    targetAmount: 500,
    termValue: 5,
    termUnit: 'meses',
    frequency: 'mensual'
  });
  savePlan(plan);

  markAllInstallments(plan.id, true);
  let current = getPlanById(plan.id);
  assert.ok(current.installments.every(i => i.isPaid));

  markAllInstallments(plan.id, false);
  current = getPlanById(plan.id);
  assert.ok(current.installments.every(i => !i.isPaid));
});

test('duplicatePlan crea una copia limpia con estado reseteado', () => {
  const plan = generateSavingsPlan({
    title: 'Ahorro Navideño',
    targetAmount: 800,
    termValue: 4,
    termUnit: 'meses',
    frequency: 'mensual'
  });
  savePlan(plan);
  toggleInstallmentPaid(plan.id, 1);

  const copy = duplicatePlan(plan.id);
  assert.equal(copy.title, 'Ahorro Navideño (Copia)');
  assert.notEqual(copy.id, plan.id);
  assert.ok(copy.installments.every(i => !i.isPaid));
  assert.equal(getAllPlans().length, 2);
});

test('deletePlan elimina el plan y ajusta el plan activo', () => {
  const plan1 = generateSavingsPlan({ title: 'Plan 1', targetAmount: 100, termValue: 1, termUnit: 'meses', frequency: 'mensual' });
  const plan2 = generateSavingsPlan({ title: 'Plan 2', targetAmount: 200, termValue: 1, termUnit: 'meses', frequency: 'mensual' });

  savePlan(plan1);
  savePlan(plan2);
  setActivePlanId(plan1.id);

  assert.equal(deletePlan(plan1.id), true);
  assert.equal(getAllPlans().length, 1);
  assert.equal(getActivePlanId(), plan2.id);
});

test('exportAllDataAsJSON y importDataFromJSON realizan copias de seguridad fidedignas', () => {
  const plan = generateSavingsPlan({
    title: 'Curso de Idiomas',
    targetAmount: 450,
    termValue: 3,
    termUnit: 'meses',
    frequency: 'mensual'
  });
  savePlan(plan);

  const jsonBackup = exportAllDataAsJSON();
  clearAllStorage();
  assert.equal(getAllPlans().length, 0);

  const count = importDataFromJSON(jsonBackup);
  assert.equal(count, 1);
  assert.equal(getAllPlans().length, 1);
  assert.equal(getAllPlans()[0].title, 'Curso de Idiomas');
});
