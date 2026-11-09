/**
 * Motor Financiero y de Fechas para GeneradorPlantillaAhorro
 *
 * Funciones puras para cálculo de cuotas, distribución de céntimos,
 * proyección de fechas sin desajustes por zona horaria y métricas de avance.
 */

/**
 * Parsea una fecha en formato YYYY-MM-DD en componentes locales (año, mes, día)
 * evitando desajustes de zona horaria por parseo UTC.
 * @param {string|Date} dateInput
 * @returns {Date}
 */
export function parseLocalDate(dateInput) {
  if (dateInput instanceof Date) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }

  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }

  const d = new Date(dateInput);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Formatea una fecha local a string YYYY-MM-DD.
 * @param {Date} date
 * @returns {string}
 */
export function formatISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha para visualización en español (ej: "15 de mayo de 2026")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDisplayDate(dateInput) {
  const d = parseLocalDate(dateInput);
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Calcula la siguiente fecha según la frecuencia seleccionada.
 * @param {Date} baseDate - Fecha de inicio o de cuota previa
 * @param {number} installmentIndex - Índice de la cuota (0-indexed)
 * @param {'semanal'|'quincenal'|'mensual'} frequency
 * @returns {Date}
 */
export function calculateInstallmentDate(baseDate, installmentIndex, frequency) {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

  switch (frequency) {
    case 'semanal': {
      d.setDate(d.getDate() + (installmentIndex * 7));
      return d;
    }
    case 'quincenal': {
      // Periodicidad quincenal: saltos de 14 o 15 días.
      // 14 días asegura mantener el mismo día de la semana (ej: siempre viernes).
      d.setDate(d.getDate() + (installmentIndex * 14));
      return d;
    }
    case 'mensual': {
      const originalDay = baseDate.getDate();
      const targetMonth = baseDate.getMonth() + installmentIndex;
      const targetYear = baseDate.getFullYear() + Math.floor(targetMonth / 12);
      const normalizedMonth = ((targetMonth % 12) + 12) % 12;

      // Obtener el último día del mes destino
      const daysInTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
      const clampedDay = Math.min(originalDay, daysInTargetMonth);

      return new Date(targetYear, normalizedMonth, clampedDay);
    }
    default:
      throw new Error(`Frecuencia no soportada: ${frequency}`);
  }
}

/**
 * Calcula el número de cuotas a partir del plazo y la unidad de plazo.
 * @param {number} termValue - Valor numérico del plazo (ej: 6)
 * @param {'meses'|'semanas'} termUnit - Unidad del plazo
 * @param {'semanal'|'quincenal'|'mensual'} frequency - Frecuencia de pago
 * @returns {number}
 */
export function calculateInstallmentCount(termValue, termUnit, frequency) {
  if (!termValue || termValue <= 0) return 0;

  if (termUnit === 'meses') {
    switch (frequency) {
      case 'mensual':
        return Math.round(termValue);
      case 'quincenal':
        return Math.round(termValue * 2);
      case 'semanal':
        // Aprox 4.33 semanas por mes
        return Math.round(termValue * (52 / 12));
      default:
        return Math.round(termValue);
    }
  } else if (termUnit === 'semanas') {
    switch (frequency) {
      case 'semanal':
        return Math.round(termValue);
      case 'quincenal':
        return Math.max(1, Math.round(termValue / 2));
      case 'mensual':
        return Math.max(1, Math.round(termValue / 4.3333));
      default:
        return Math.round(termValue);
    }
  }

  return Math.round(termValue);
}

/**
 * Genera el plan completo de ahorro con ajuste de céntimos en la última cuota.
 *
 * @param {Object} params
 * @param {string} params.title - Título o meta de ahorro (ej: "Vacaciones 2026")
 * @param {number} params.targetAmount - Monto total a ahorrar (debe ser > 0)
 * @param {number} params.termValue - Duración (ej: 6)
 * @param {'meses'|'semanas'} params.termUnit - Unidad ('meses' o 'semanas')
 * @param {'semanal'|'quincenal'|'mensual'} params.frequency - Frecuencia de ahorro
 * @param {string|Date} params.startDate - Fecha de inicio (YYYY-MM-DD o Date)
 * @param {string} [params.currency='USD'] - Símbolo o código de moneda
 * @returns {Object} Plan detallado generado
 */
export function generateSavingsPlan({
  title = 'Mi meta de ahorro',
  targetAmount,
  termValue,
  termUnit = 'meses',
  frequency = 'mensual',
  startDate = new Date(),
  currency = '$ COP'
}) {
  const numericTarget = Number(targetAmount);
  if (!numericTarget || numericTarget <= 0 || isNaN(numericTarget)) {
    throw new Error('El monto objetivo debe ser un número positivo mayor a 0 en pesos colombianos.');
  }

  const numericTerm = Number(termValue);
  if (!numericTerm || numericTerm <= 0 || isNaN(numericTerm)) {
    throw new Error('El plazo debe ser un número positivo mayor a 0.');
  }

  const totalInstallments = calculateInstallmentCount(numericTerm, termUnit, frequency);
  if (totalInstallments < 1) {
    throw new Error('El cálculo resultó en menos de 1 cuota. Verifica el plazo y la periodicidad.');
  }

  const baseDate = parseLocalDate(startDate);

  // Cálculo de montos con 2 decimales
  const rawPerInstallment = numericTarget / totalInstallments;
  const standardAmount = Math.floor(rawPerInstallment * 100) / 100;

  // Calculamos el monto acumulado estándar de las primeras (N - 1) cuotas
  const sumFirstInstallments = standardAmount * (totalInstallments - 1);

  // La última cuota absorbe la diferencia exacta para cuadrar al centavo
  const lastInstallmentAmount = Math.round((numericTarget - sumFirstInstallments) * 100) / 100;

  const installments = [];
  let cumulative = 0;

  for (let i = 0; i < totalInstallments; i++) {
    const isLast = (i === totalInstallments - 1);
    const amount = isLast ? lastInstallmentAmount : standardAmount;
    cumulative = Math.round((cumulative + amount) * 100) / 100;

    const dueDateObj = calculateInstallmentDate(baseDate, i, frequency);
    const dueDate = formatISODate(dueDateObj);

    installments.push({
      number: i + 1,
      amount: amount,
      dueDate: dueDate,
      isPaid: false,
      paidAt: null,
      cumulativeTarget: cumulative,
      notes: ''
    });
  }

  const endDate = installments[installments.length - 1].dueDate;

  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || 'Mi meta de ahorro (COP)',
    targetAmount: Math.round(numericTarget * 100) / 100,
    termValue: numericTerm,
    termUnit,
    frequency,
    startDate: formatISODate(baseDate),
    endDate,
    currency,
    totalInstallments,
    standardAmount,
    lastInstallmentAmount,
    installments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Calcula las métricas de avance y resumen financiero para un plan de ahorro.
 * @param {Object} plan - Objeto de plan de ahorro
 * @returns {Object} Métricas calculadas
 */
export function calculatePlanMetrics(plan) {
  if (!plan || !Array.isArray(plan.installments)) {
    return {
      totalTarget: 0,
      totalSaved: 0,
      remainingBalance: 0,
      progressPercentage: 0,
      paidCount: 0,
      totalCount: 0,
      nextPayment: null,
      isCompleted: false
    };
  }

  const totalTarget = plan.targetAmount;
  let totalSaved = 0;
  let paidCount = 0;
  let nextPayment = null;

  const todayStr = formatISODate(new Date());

  for (const inst of plan.installments) {
    if (inst.isPaid) {
      totalSaved += inst.amount;
      paidCount++;
    } else if (!nextPayment) {
      // Primera cuota pendiente
      const dueDate = inst.dueDate;
      const dToday = parseLocalDate(todayStr);
      const dDue = parseLocalDate(dueDate);
      const diffTime = dDue.getTime() - dToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      nextPayment = {
        number: inst.number,
        amount: inst.amount,
        dueDate: inst.dueDate,
        diffDays: diffDays,
        isOverdue: diffDays < 0,
        isToday: diffDays === 0
      };
    }
  }

  totalSaved = Math.round(totalSaved * 100) / 100;
  const remainingBalance = Math.max(0, Math.round((totalTarget - totalSaved) * 100) / 100);
  const progressPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 1000) / 10) : 0;
  const isCompleted = paidCount === plan.installments.length;

  return {
    totalTarget,
    totalSaved,
    remainingBalance,
    progressPercentage,
    paidCount,
    totalCount: plan.installments.length,
    nextPayment,
    isCompleted
  };
}

/**
 * Formatea un número como Pesos Colombianos (COP).
 * Usa punto para miles y coma para centavos si existen.
 * @param {number} amount
 * @param {string} [currency='$ COP']
 * @returns {string}
 */
export function formatCurrency(amount, currency = '$ COP') {
  const num = Number(amount) || 0;
  const hasDecimals = (num % 1) !== 0;
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (hasDecimals) {
    return `${currency} ${intPart},${parts[1]}`;
  }
  return `${currency} ${intPart}`;
}

