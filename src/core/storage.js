/**
 * Módulo de Persistencia Local-First para GeneradorPlantillaAhorro
 *
 * Administra el almacenamiento seguro en LocalStorage con soporte para
 * múltiples planes de ahorro, versionado de esquema, respaldo JSON
 * y fallback en memoria para entornos de testing (Node.js).
 */

const STORAGE_KEYS = {
  PLANS: 'generador_ahorro_plans_v1',
  ACTIVE_PLAN_ID: 'generador_ahorro_active_id_v1',
  APP_THEME: 'generador_ahorro_theme_v1'
};

// Fallback en memoria para Node.js o entornos sin LocalStorage
const memoryStore = new Map();

/**
 * Obtiene el adaptador de almacenamiento disponible (LocalStorage o memoria)
 */
function getStorageAdapter() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, val) => window.localStorage.setItem(key, val),
      removeItem: (key) => window.localStorage.removeItem(key),
      clear: () => window.localStorage.clear()
    };
  }
  return {
    getItem: (key) => memoryStore.get(key) || null,
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
  };
}

/**
 * Recupera todos los planes de ahorro guardados.
 * @returns {Array<Object>}
 */
export function getAllPlans() {
  const adapter = getStorageAdapter();
  try {
    const raw = adapter.getItem(STORAGE_KEYS.PLANS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error al recuperar planes de ahorro:', err);
    return [];
  }
}

/**
 * Guarda o actualiza un plan de ahorro en el almacenamiento.
 * @param {Object} plan
 * @returns {Object} El plan guardado
 */
export function savePlan(plan) {
  if (!plan || !plan.id) {
    throw new Error('El plan debe poseer un id único válido.');
  }

  const adapter = getStorageAdapter();
  const plans = getAllPlans();
  const existingIndex = plans.findIndex(p => p.id === plan.id);

  const updatedPlan = {
    ...plan,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    plans[existingIndex] = updatedPlan;
  } else {
    plans.unshift(updatedPlan);
  }

  adapter.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));

  // Si no hay plan activo, se establece este
  if (!getActivePlanId()) {
    setActivePlanId(plan.id);
  }

  return updatedPlan;
}

/**
 * Obtiene un plan por su ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getPlanById(id) {
  if (!id) return null;
  const plans = getAllPlans();
  return plans.find(p => p.id === id) || null;
}

/**
 * Elimina un plan por su ID.
 * @param {string} id
 * @returns {boolean}
 */
export function deletePlan(id) {
  const adapter = getStorageAdapter();
  const plans = getAllPlans();
  const filtered = plans.filter(p => p.id !== id);

  if (filtered.length === plans.length) {
    return false;
  }

  adapter.setItem(STORAGE_KEYS.PLANS, JSON.stringify(filtered));

  if (getActivePlanId() === id) {
    adapter.removeItem(STORAGE_KEYS.ACTIVE_PLAN_ID);
    if (filtered.length > 0) {
      setActivePlanId(filtered[0].id);
    }
  }

  return true;
}

/**
 * Duplica un plan existente reseteando el estado de cuotas pagadas.
 * @param {string} id
 * @returns {Object}
 */
export function duplicatePlan(id) {
  const original = getPlanById(id);
  if (!original) throw new Error('No se encontró el plan a duplicar.');

  const duplicated = JSON.parse(JSON.stringify(original));
  duplicated.id = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  duplicated.title = `${original.title} (Copia)`;
  duplicated.createdAt = new Date().toISOString();
  duplicated.updatedAt = new Date().toISOString();

  // Resetear pagos
  duplicated.installments = duplicated.installments.map(inst => ({
    ...inst,
    isPaid: false,
    paidAt: null
  }));

  savePlan(duplicated);
  setActivePlanId(duplicated.id);
  return duplicated;
}

/**
 * Obtiene el ID del plan activo.
 * @returns {string|null}
 */
export function getActivePlanId() {
  const adapter = getStorageAdapter();
  return adapter.getItem(STORAGE_KEYS.ACTIVE_PLAN_ID) || null;
}

/**
 * Establece el ID del plan activo.
 * @param {string} id
 */
export function setActivePlanId(id) {
  const adapter = getStorageAdapter();
  adapter.setItem(STORAGE_KEYS.ACTIVE_PLAN_ID, id);
}

/**
 * Alterna el estado de pago de una cuota específica.
 * @param {string} planId
 * @param {number} installmentNumber
 * @param {string} [notes]
 * @returns {Object} Plan actualizado
 */
export function toggleInstallmentPaid(planId, installmentNumber, notes) {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Plan no encontrado.');

  const installment = plan.installments.find(i => i.number === installmentNumber);
  if (!installment) throw new Error(`Cuota #${installmentNumber} no encontrada.`);

  installment.isPaid = !installment.isPaid;
  installment.paidAt = installment.isPaid ? new Date().toISOString() : null;
  if (notes !== undefined) {
    installment.notes = notes;
  }

  return savePlan(plan);
}

/**
 * Marca la siguiente cuota pendiente como pagada.
 * @param {string} planId
 * @returns {Object|null} La cuota abonada o null si ya estaba todo pagado
 */
export function payNextInstallment(planId) {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Plan no encontrado.');

  const nextUnpaid = plan.installments.find(i => !i.isPaid);
  if (!nextUnpaid) return null;

  nextUnpaid.isPaid = true;
  nextUnpaid.paidAt = new Date().toISOString();
  savePlan(plan);
  return nextUnpaid;
}

/**
 * Marca todas las cuotas como pagadas o pendientes.
 * @param {string} planId
 * @param {boolean} isPaid
 * @returns {Object} Plan actualizado
 */
export function markAllInstallments(planId, isPaid) {
  const plan = getPlanById(planId);
  if (!plan) throw new Error('Plan no encontrado.');

  const nowIso = new Date().toISOString();
  plan.installments.forEach(inst => {
    inst.isPaid = isPaid;
    inst.paidAt = isPaid ? (inst.paidAt || nowIso) : null;
  });

  return savePlan(plan);
}

/**
 * Exporta todos los datos del sistema en formato JSON para copia de seguridad.
 * @returns {string} Cadena JSON
 */
export function exportAllDataAsJSON() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    plans: getAllPlans(),
    activePlanId: getActivePlanId()
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Importa datos desde una cadena JSON validando la estructura.
 * @param {string} jsonString
 * @returns {number} Cantidad de planes importados
 */
export function importDataFromJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('El archivo no contiene un formato JSON válido.');
  }

  const incomingPlans = Array.isArray(parsed.plans) ? parsed.plans : (Array.isArray(parsed) ? parsed : null);
  if (!incomingPlans) {
    throw new Error('La estructura de la copia de seguridad no contiene una lista de planes válida.');
  }

  let count = 0;
  for (const plan of incomingPlans) {
    if (plan.id && plan.targetAmount && Array.isArray(plan.installments)) {
      savePlan(plan);
      count++;
    }
  }

  if (parsed.activePlanId && getPlanById(parsed.activePlanId)) {
    setActivePlanId(parsed.activePlanId);
  }

  return count;
}

/**
 * Gestión del tema de la interfaz (claro/oscuro)
 */
export function getSavedTheme() {
  const adapter = getStorageAdapter();
  return adapter.getItem(STORAGE_KEYS.APP_THEME) || 'light';
}

export function saveTheme(theme) {
  const adapter = getStorageAdapter();
  adapter.setItem(STORAGE_KEYS.APP_THEME, theme);
}

/**
 * Reinicia el almacén (útil para pruebas)
 */
export function clearAllStorage() {
  const adapter = getStorageAdapter();
  adapter.clear();
}
