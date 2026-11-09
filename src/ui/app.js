/**
 * Controlador de Interfaz de Usuario y Eventos - GeneradorPlantillaAhorro
 *
 * Conecta los módulos centrales (cálculos, almacenamiento, notificaciones, exportación)
 * con la interfaz web accesible y reactiva.
 */

import {
  generateSavingsPlan,
  calculatePlanMetrics,
  formatCurrency,
  formatDisplayDate,
  formatISODate
} from '../core/calculator.js';

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
  getSavedTheme,
  saveTheme
} from '../core/storage.js';

import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendBrowserNotification,
  getUpcomingAlerts,
  downloadICalendarFile
} from '../core/notifications.js';

import {
  downloadPlanCSV,
  downloadPlanJSON,
  generateShareableSummary,
  printCurrentPlan
} from '../core/exporter.js';

// Elementos DOM
const dom = {
  // Accesibilidad
  srAnnouncements: document.getElementById('sr-announcements'),
  toastContainer: document.getElementById('toast-container'),

  // Tema
  btnToggleTheme: document.getElementById('btn-toggle-theme'),
  themeIcon: document.getElementById('theme-icon'),
  themeText: document.getElementById('theme-text'),

  // Selector de planes
  planSelect: document.getElementById('plan-select'),
  btnNewPlanPrompt: document.getElementById('btn-new-plan-prompt'),
  btnDuplicatePlan: document.getElementById('btn-duplicate-plan'),
  btnDeletePlan: document.getElementById('btn-delete-plan'),

  // Formulario
  savingsForm: document.getElementById('savings-form'),
  planTitle: document.getElementById('plan-title'),
  planTarget: document.getElementById('plan-target'),
  planCurrency: document.getElementById('plan-currency'),
  planTermValue: document.getElementById('plan-term-value'),
  planTermUnit: document.getElementById('plan-term-unit'),
  planFrequency: document.getElementById('plan-frequency'),
  planStartDate: document.getElementById('plan-start-date'),

  // Errores de validación
  errorTitle: document.getElementById('error-title'),
  errorTarget: document.getElementById('error-target'),
  errorTerm: document.getElementById('error-term'),
  errorDate: document.getElementById('error-date'),

  // Vistas
  emptyStateView: document.getElementById('empty-state-view'),
  activePlanView: document.getElementById('active-plan-view'),
  btnEmptyFocus: document.getElementById('btn-empty-focus'),

  // Alertas
  alertsWrapper: document.getElementById('alerts-wrapper'),
  btnRequestNotifications: document.getElementById('btn-request-notifications'),
  notificationIcon: document.getElementById('notification-icon'),
  notificationLabel: document.getElementById('notification-label'),
  btnDownloadIcs: document.getElementById('btn-download-ics'),

  // Métricas
  metricSaved: document.getElementById('metric-saved'),
  metricSavedSub: document.getElementById('metric-saved-sub'),
  metricRemaining: document.getElementById('metric-remaining'),
  metricTargetSub: document.getElementById('metric-target-sub'),
  metricNextAmount: document.getElementById('metric-next-amount'),
  metricNextDate: document.getElementById('metric-next-date'),
  metricEndDate: document.getElementById('metric-end-date'),
  metricFrequencySub: document.getElementById('metric-frequency-sub'),
  progressText: document.getElementById('progress-text'),
  progressBarFill: document.getElementById('progress-bar-fill'),

  // Acciones de tabla
  btnPayNext: document.getElementById('btn-pay-next'),
  btnMarkAllPaid: document.getElementById('btn-mark-all-paid'),
  btnMarkAllUnpaid: document.getElementById('btn-mark-all-unpaid'),
  btnExportCsv: document.getElementById('btn-export-csv'),
  btnExportJson: document.getElementById('btn-export-json'),
  btnPrint: document.getElementById('btn-print'),
  btnShareSummary: document.getElementById('btn-share-summary'),

  // Tabla y lista móvil
  installmentsTableBody: document.getElementById('installments-table-body'),
  installmentsCardsView: document.getElementById('installments-cards-view'),

  // Modal de Respaldo
  btnOpenBackup: document.getElementById('btn-open-backup'),
  backupModal: document.getElementById('backup-modal'),
  btnCloseBackup: document.getElementById('btn-close-backup'),
  btnModalDone: document.getElementById('btn-modal-done'),
  btnDownloadBackupJson: document.getElementById('btn-download-backup-json'),
  backupFileInput: document.getElementById('backup-file-input'),
  btnExecuteRestore: document.getElementById('btn-execute-restore'),
  restoreStatus: document.getElementById('restore-status')
};

/**
 * Muestra un mensaje flotante accesible (Toast).
 * @param {string} message
 * @param {'info'|'success'|'warning'|'danger'} type
 */
function showToast(message, type = 'info') {
  if (!dom.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '❌'
  };

  toast.innerHTML = `<span aria-hidden="true">${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  dom.toastContainer.appendChild(toast);

  // Anuncio para lectores de pantalla
  announceScreenReader(message);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Anuncia cambios dinámicos a lectores de pantalla usando aria-live.
 * @param {string} text
 */
function announceScreenReader(text) {
  if (dom.srAnnouncements) {
    dom.srAnnouncements.textContent = text;
  }
}

/**
 * Inicializa y aplica el tema guardado.
 */
function initTheme() {
  const saved = getSavedTheme();
  applyTheme(saved);

  dom.btnToggleTheme.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    dom.themeIcon.textContent = '☀️';
    dom.themeText.textContent = 'Modo Claro';
    dom.btnToggleTheme.setAttribute('aria-label', 'Cambiar a modo claro');
  } else {
    document.documentElement.removeAttribute('data-theme');
    dom.themeIcon.textContent = '🌙';
    dom.themeText.textContent = 'Modo Oscuro';
    dom.btnToggleTheme.setAttribute('aria-label', 'Cambiar a modo oscuro');
  }
}

/**
 * Inicializa la fecha por defecto de inicio en el formulario.
 */
function initDefaultDate() {
  const today = formatISODate(new Date());
  if (dom.planStartDate) {
    dom.planStartDate.value = today;
  }
}

/**
 * Carga la lista de planes guardados en el menú desplegable.
 */
function renderPlanSelector() {
  const plans = getAllPlans();
  const activeId = getActivePlanId();

  dom.planSelect.innerHTML = '';

  if (plans.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No hay metas guardadas';
    dom.planSelect.appendChild(opt);
    dom.btnDuplicatePlan.disabled = true;
    dom.btnDeletePlan.disabled = true;
    showEmptyState(true);
    return;
  }

  dom.btnDuplicatePlan.disabled = false;
  dom.btnDeletePlan.disabled = false;

  plans.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.title} (${formatCurrency(p.targetAmount, p.currency)})`;
    if (p.id === activeId) {
      opt.selected = true;
    }
    dom.planSelect.appendChild(opt);
  });

  const currentPlan = getPlanById(activeId) || plans[0];
  if (currentPlan) {
    if (activeId !== currentPlan.id) {
      setActivePlanId(currentPlan.id);
    }
    renderPlanDetails(currentPlan);
    showEmptyState(false);
  }
}

/**
 * Alterna entre la vista de estado vacío y el cronograma activo.
 * @param {boolean} isEmpty
 */
function showEmptyState(isEmpty) {
  if (isEmpty) {
    dom.emptyStateView.style.display = 'block';
    dom.activePlanView.style.display = 'none';
  } else {
    dom.emptyStateView.style.display = 'none';
    dom.activePlanView.style.display = 'block';
  }
}

/**
 * Renderiza todos los detalles, métricas, alertas y cronograma del plan activo.
 * @param {Object} plan
 */
function renderPlanDetails(plan) {
  if (!plan) return;

  const metrics = calculatePlanMetrics(plan);

  // Actualizar métricas
  dom.metricSaved.textContent = formatCurrency(metrics.totalSaved, plan.currency);
  dom.metricSavedSub.textContent = `${metrics.paidCount} de ${metrics.totalCount} cuotas abonadas`;

  dom.metricRemaining.textContent = formatCurrency(metrics.remainingBalance, plan.currency);
  dom.metricTargetSub.textContent = `Meta: ${formatCurrency(plan.targetAmount, plan.currency)}`;

  if (metrics.nextPayment) {
    dom.metricNextAmount.textContent = formatCurrency(metrics.nextPayment.amount, plan.currency);
    const dayLabel = metrics.nextPayment.isToday ? '¡Hoy!' : (metrics.nextPayment.diffDays > 0 ? `En ${metrics.nextPayment.diffDays} días` : `Venció hace ${Math.abs(metrics.nextPayment.diffDays)} d`);
    dom.metricNextDate.textContent = `Cuota #${metrics.nextPayment.number} (${formatDisplayDate(metrics.nextPayment.dueDate)} - ${dayLabel})`;
  } else {
    dom.metricNextAmount.textContent = '¡Completado!';
    dom.metricNextDate.textContent = 'Has alcanzado el 100% de tu meta';
  }

  dom.metricEndDate.textContent = formatDisplayDate(plan.endDate);
  dom.metricFrequencySub.textContent = `Periodicidad: ${plan.frequency.toUpperCase()}`;

  // Barra de progreso
  dom.progressText.textContent = `${metrics.progressPercentage}%`;
  dom.progressBarFill.style.width = `${metrics.progressPercentage}%`;
  dom.progressBarFill.setAttribute('aria-valuenow', metrics.progressPercentage);

  // Renderizar alertas próximas o vencidas
  renderAlerts(plan);

  // Renderizar tabla de cuotas y vista móvil
  renderInstallmentsList(plan);
}

/**
 * Muestra el banner de alertas de cuotas próximas o atrasadas.
 * @param {Object} plan
 */
function renderAlerts(plan) {
  dom.alertsWrapper.innerHTML = '';
  const alerts = getUpcomingAlerts(plan);

  if (alerts.length === 0) return;

  alerts.slice(0, 3).forEach(alert => {
    const alertEl = document.createElement('div');
    alertEl.className = `alert-item ${alert.type}`;
    alertEl.innerHTML = `
      <span class="alert-icon" aria-hidden="true">${alert.type === 'danger' ? '⚠️' : '🔔'}</span>
      <div class="alert-content">
        <strong>${alert.title}</strong>
        <span>${alert.message}</span>
      </div>
    `;
    dom.alertsWrapper.appendChild(alertEl);
  });
}

/**
 * Renderiza las filas de la tabla de cuotas y las tarjetas móviles.
 * @param {Object} plan
 */
function renderInstallmentsList(plan) {
  dom.installmentsTableBody.innerHTML = '';
  dom.installmentsCardsView.innerHTML = '';

  const todayStr = formatISODate(new Date());

  plan.installments.forEach(inst => {
    const isPaid = inst.isPaid;
    const isOverdue = !isPaid && inst.dueDate < todayStr;
    const isToday = !isPaid && inst.dueDate === todayStr;

    // --- RENDERIZADO EN TABLA ESCRITORIO ---
    const tr = document.createElement('tr');
    if (isPaid) tr.classList.add('row-paid');

    let badgeHtml = '';
    if (isPaid) {
      badgeHtml = `<span class="badge badge-paid">Abonada (${formatDisplayDate(inst.paidAt || inst.dueDate)})</span>`;
    } else if (isOverdue) {
      badgeHtml = `<span class="badge badge-overdue">Vencida</span>`;
    } else if (isToday) {
      badgeHtml = `<span class="badge badge-overdue" style="background-color: var(--color-warning-light); color: var(--color-warning);">Cobro Hoy</span>`;
    } else {
      badgeHtml = `<span class="badge badge-pending">Pendiente</span>`;
    }

    tr.innerHTML = `
      <td style="text-align: center;">
        <label class="check-custom">
          <input type="checkbox" ${isPaid ? 'checked' : ''} aria-label="Marcar cuota número ${inst.number} como abonada" data-installment="${inst.number}">
        </label>
      </td>
      <td><strong>#${inst.number}</strong></td>
      <td>${formatDisplayDate(inst.dueDate)}</td>
      <td class="col-amount" style="font-weight: 700;">${formatCurrency(inst.amount, plan.currency)}</td>
      <td>${formatCurrency(inst.cumulativeTarget, plan.currency)}</td>
      <td>${badgeHtml}</td>
      <td>
        <input type="text" class="form-control form-control-sm note-input" style="padding: 2px 6px; font-size: 0.8rem;" placeholder="Añadir nota..." value="${inst.notes ? inst.notes.replace(/"/g, '&quot;') : ''}" data-installment="${inst.number}" aria-label="Nota para cuota ${inst.number}">
      </td>
    `;

    // Eventos de checkbox y notas
    const checkbox = tr.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      handleToggleInstallment(plan.id, inst.number);
    });

    const noteInput = tr.querySelector('.note-input');
    noteInput.addEventListener('blur', (e) => {
      saveInstallmentNote(plan.id, inst.number, e.target.value);
    });
    noteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    });

    dom.installmentsTableBody.appendChild(tr);

    // --- RENDERIZADO EN VISTA MÓVIL ---
    const card = document.createElement('div');
    card.className = `installment-card-item ${isPaid ? 'paid' : ''}`;
    card.innerHTML = `
      <div class="installment-card-header">
        <strong>Cuota #${inst.number} &bull; ${formatDisplayDate(inst.dueDate)}</strong>
        ${badgeHtml}
      </div>
      <div class="installment-card-body">
        <div>
          <span style="font-size: 1.15rem; font-weight: 800;">${formatCurrency(inst.amount, plan.currency)}</span>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Acumulado: ${formatCurrency(inst.cumulativeTarget, plan.currency)}</div>
        </div>
        <button class="btn btn-sm ${isPaid ? 'btn-outline' : 'btn-primary'} mobile-toggle-btn" data-installment="${inst.number}">
          ${isPaid ? 'Desmarcar' : 'Abonar'}
        </button>
      </div>
    `;

    const mobileBtn = card.querySelector('.mobile-toggle-btn');
    mobileBtn.addEventListener('click', () => {
      handleToggleInstallment(plan.id, inst.number);
    });

    dom.installmentsCardsView.appendChild(card);
  });
}

/**
 * Alterna el estado de abono de una cuota y actualiza la vista.
 * @param {string} planId
 * @param {number} instNumber
 */
function handleToggleInstallment(planId, instNumber) {
  const updatedPlan = toggleInstallmentPaid(planId, instNumber);
  const inst = updatedPlan.installments.find(i => i.number === instNumber);

  renderPlanDetails(updatedPlan);

  const statusText = inst.isPaid ? 'abonada' : 'pendiente';
  showToast(`Cuota #${instNumber} marcada como ${statusText}.`, inst.isPaid ? 'success' : 'info');
}

/**
 * Guarda notas asociadas a una cuota.
 * @param {string} planId
 * @param {number} instNumber
 * @param {string} notes
 */
function saveInstallmentNote(planId, instNumber, notes) {
  const plan = getPlanById(planId);
  if (!plan) return;
  const inst = plan.installments.find(i => i.number === instNumber);
  if (inst && inst.notes !== notes) {
    inst.notes = notes;
    savePlan(plan);
    showToast(`Nota guardada en cuota #${instNumber}.`, 'info');
  }
}

/**
 * Validación y creación de una nueva meta de ahorro.
 */
function setupFormHandling() {
  const validateField = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add('is-invalid');
      errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      errorEl.classList.remove('visible');
      return true;
    }
  };

  // Validación al desenfocar
  dom.planTitle.addEventListener('blur', () => {
    validateField(dom.planTitle, dom.errorTitle, dom.planTitle.value.trim().length > 0);
  });

  dom.planTarget.addEventListener('blur', () => {
    const val = Number(dom.planTarget.value);
    validateField(dom.planTarget, dom.errorTarget, !isNaN(val) && val > 0);
  });

  dom.planTermValue.addEventListener('blur', () => {
    const val = Number(dom.planTermValue.value);
    validateField(dom.planTermValue, dom.errorTerm, !isNaN(val) && val > 0);
  });

  dom.planStartDate.addEventListener('blur', () => {
    validateField(dom.planStartDate, dom.errorDate, dom.planStartDate.value.trim().length > 0);
  });

  // Envío del formulario
  dom.savingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleValid = validateField(dom.planTitle, dom.errorTitle, dom.planTitle.value.trim().length > 0);
    const targetVal = Number(dom.planTarget.value);
    const targetValid = validateField(dom.planTarget, dom.errorTarget, !isNaN(targetVal) && targetVal > 0);
    const termVal = Number(dom.planTermValue.value);
    const termValid = validateField(dom.planTermValue, dom.errorTerm, !isNaN(termVal) && termVal > 0);
    const dateValid = validateField(dom.planStartDate, dom.errorDate, dom.planStartDate.value.trim().length > 0);

    if (!titleValid) { dom.planTitle.focus(); return; }
    if (!targetValid) { dom.planTarget.focus(); return; }
    if (!termValid) { dom.planTermValue.focus(); return; }
    if (!dateValid) { dom.planStartDate.focus(); return; }

    try {
      const newPlan = generateSavingsPlan({
        title: dom.planTitle.value.trim(),
        targetAmount: targetVal,
        termValue: termVal,
        termUnit: dom.planTermUnit.value,
        frequency: dom.planFrequency.value,
        startDate: dom.planStartDate.value,
        currency: dom.planCurrency.value
      });

      savePlan(newPlan);
      setActivePlanId(newPlan.id);
      renderPlanSelector();

      showToast(`¡Plan "${newPlan.title}" generado con éxito! (${newPlan.totalInstallments} cuotas)`, 'success');
      dom.savingsForm.reset();
      initDefaultDate();
    } catch (err) {
      showToast(`Error al calcular la plantilla: ${err.message}`, 'danger');
    }
  });
}

/**
 * Configuración de las barras de herramientas y acciones de tabla.
 */
function setupToolbarActions() {
  // Selector de plan
  dom.planSelect.addEventListener('change', (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      setActivePlanId(selectedId);
      const plan = getPlanById(selectedId);
      renderPlanDetails(plan);
    }
  });

  // Botón nueva meta desde la barra
  dom.btnNewPlanPrompt.addEventListener('click', () => {
    dom.planTitle.focus();
    dom.planTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Ingresa los detalles para tu nueva meta.', 'info');
  });

  // Botón de estado vacío
  if (dom.btnEmptyFocus) {
    dom.btnEmptyFocus.addEventListener('click', () => {
      dom.planTitle.focus();
    });
  }

  // Duplicar plan
  dom.btnDuplicatePlan.addEventListener('click', () => {
    const activeId = getActivePlanId();
    if (!activeId) return;
    try {
      const duplicated = duplicatePlan(activeId);
      renderPlanSelector();
      showToast(`Se ha duplicado el plan como "${duplicated.title}".`, 'success');
    } catch (err) {
      showToast(err.message, 'danger');
    }
  });

  // Eliminar plan
  dom.btnDeletePlan.addEventListener('click', () => {
    const activeId = getActivePlanId();
    if (!activeId) return;
    const plan = getPlanById(activeId);
    if (!plan) return;

    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la meta "${plan.title}"?`)) {
      deletePlan(activeId);
      renderPlanSelector();
      showToast(`La meta "${plan.title}" ha sido eliminada.`, 'info');
    }
  });

  // Pagar siguiente cuota
  dom.btnPayNext.addEventListener('click', () => {
    const activeId = getActivePlanId();
    if (!activeId) return;
    const nextPaid = payNextInstallment(activeId);
    if (nextPaid) {
      const updatedPlan = getPlanById(activeId);
      renderPlanDetails(updatedPlan);
      showToast(`¡Abono registrado para la cuota #${nextPaid.number}!`, 'success');
    } else {
      showToast('¡Felicidades! Todas las cuotas de este plan ya están pagadas.', 'info');
    }
  });

  // Marcar todas
  dom.btnMarkAllPaid.addEventListener('click', () => {
    const activeId = getActivePlanId();
    if (!activeId) return;
    const updatedPlan = markAllInstallments(activeId, true);
    renderPlanDetails(updatedPlan);
    showToast('Todas las cuotas se marcaron como abonadas.', 'success');
  });

  // Desmarcar todas
  dom.btnMarkAllUnpaid.addEventListener('click', () => {
    const activeId = getActivePlanId();
    if (!activeId) return;
    const updatedPlan = markAllInstallments(activeId, false);
    renderPlanDetails(updatedPlan);
    showToast('Se reinició el estado de todas las cuotas.', 'info');
  });

  // Exportar CSV
  dom.btnExportCsv.addEventListener('click', () => {
    const activeId = getActivePlanId();
    const plan = getPlanById(activeId);
    if (!plan) return;
    downloadPlanCSV(plan);
    showToast('Descargando archivo CSV para Excel...', 'success');
  });

  // Exportar JSON
  dom.btnExportJson.addEventListener('click', () => {
    const activeId = getActivePlanId();
    const plan = getPlanById(activeId);
    if (!plan) return;
    downloadPlanJSON(plan);
    showToast('Descargando datos del plan en JSON...', 'success');
  });

  // Imprimir / PDF
  dom.btnPrint.addEventListener('click', () => {
    printCurrentPlan();
  });

  // Compartir resumen
  dom.btnShareSummary.addEventListener('click', async () => {
    const activeId = getActivePlanId();
    const plan = getPlanById(activeId);
    if (!plan) return;
    const metrics = calculatePlanMetrics(plan);
    const summary = generateShareableSummary(plan, metrics);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        showToast('¡Resumen copiado al portapapeles listo para compartir!', 'success');
      } else {
        prompt('Copia tu resumen:', summary);
      }
    } catch (err) {
      prompt('Copia tu resumen:', summary);
    }
  });
}

/**
 * Configuración del módulo de notificaciones y calendario .ics.
 */
function setupNotifications() {
  const updatePermissionUI = () => {
    const permission = getNotificationPermission();
    if (permission === 'granted') {
      dom.notificationIcon.textContent = '🔔';
      dom.notificationLabel.textContent = 'Alertas activas en navegador';
      dom.btnRequestNotifications.classList.remove('btn-outline');
      dom.btnRequestNotifications.classList.add('btn-primary');
    } else if (permission === 'denied') {
      dom.notificationIcon.textContent = '🔕';
      dom.notificationLabel.textContent = 'Alertas bloqueadas en navegador';
      dom.btnRequestNotifications.disabled = true;
    } else {
      dom.notificationIcon.textContent = '🔔';
      dom.notificationLabel.textContent = 'Activar alertas en navegador';
    }
  };

  updatePermissionUI();

  dom.btnRequestNotifications.addEventListener('click', async () => {
    if (!isNotificationSupported()) {
      showToast('Tu navegador actual no soporta notificaciones de escritorio.', 'warning');
      return;
    }

    const granted = await requestNotificationPermission();
    updatePermissionUI();

    if (granted) {
      showToast('¡Notificaciones activadas con éxito!', 'success');
      sendBrowserNotification('Plantilla de Ahorro Programado', {
        body: 'Te recordaremos oportunamente tus próximas fechas de pago.'
      });
    } else {
      showToast('Permiso de notificaciones denegado en tu navegador.', 'warning');
    }
  });

  // Descargar calendario .ics
  dom.btnDownloadIcs.addEventListener('click', () => {
    const activeId = getActivePlanId();
    const plan = getPlanById(activeId);
    if (!plan) {
      showToast('Crea o selecciona un plan de ahorro primero.', 'warning');
      return;
    }
    downloadICalendarFile(plan);
    showToast('Archivo .ics generado. Puedes importarlo en Google Calendar o Apple Calendar.', 'success');
  });
}

/**
 * Configuración del Modal de Respaldo y Restauración JSON.
 */
function setupBackupModal() {
  const openModal = () => {
    dom.backupModal.classList.add('active');
    dom.btnModalDone.focus();
  };

  const closeModal = () => {
    dom.backupModal.classList.remove('active');
    dom.backupFileInput.value = '';
    dom.btnExecuteRestore.disabled = true;
    dom.restoreStatus.style.display = 'none';
  };

  dom.btnOpenBackup.addEventListener('click', openModal);
  dom.btnCloseBackup.addEventListener('click', closeModal);
  dom.btnModalDone.addEventListener('click', closeModal);

  // Cerrar al pulsar Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dom.backupModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Descargar respaldo completo
  dom.btnDownloadBackupJson.addEventListener('click', () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `respaldo_ahorro_${formatISODate(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Copia de respaldo completa descargada.', 'success');
  });

  // Carga de archivo para restauración
  dom.backupFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    dom.btnExecuteRestore.disabled = !file;
    dom.restoreStatus.style.display = 'none';
  });

  dom.btnExecuteRestore.addEventListener('click', () => {
    const file = dom.backupFileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const count = importDataFromJSON(event.target.result);
        dom.restoreStatus.style.display = 'block';
        dom.restoreStatus.style.color = 'var(--color-primary)';
        dom.restoreStatus.textContent = `✅ Se restauraron exitosamente ${count} plan(es) de ahorro.`;

        renderPlanSelector();
        showToast(`Restauración completada: ${count} metas cargadas.`, 'success');
        setTimeout(() => closeModal(), 1800);
      } catch (err) {
        dom.restoreStatus.style.display = 'block';
        dom.restoreStatus.style.color = 'var(--color-danger)';
        dom.restoreStatus.textContent = `❌ ${err.message}`;
      }
    };
    reader.readAsText(file);
  });
}

/**
 * Carga un plan de ejemplo inicial si el almacenamiento está vacío.
 */
function seedInitialDataIfEmpty() {
  const plans = getAllPlans();
  if (plans.length === 0) {
    const sample = generateSavingsPlan({
      title: 'Fondo de Emergencia (COP)',
      targetAmount: 1200000,
      termValue: 6,
      termUnit: 'meses',
      frequency: 'quincenal',
      startDate: formatISODate(new Date()),
      currency: '$ COP'
    });
    // Abonamos la primera cuota de cortesía para mostrar interactividad
    sample.installments[0].isPaid = true;
    sample.installments[0].paidAt = new Date().toISOString();

    savePlan(sample);
    setActivePlanId(sample.id);
  }
}


// Inicialización general de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDefaultDate();
  seedInitialDataIfEmpty();
  setupFormHandling();
  setupToolbarActions();
  setupNotifications();
  setupBackupModal();
  renderPlanSelector();
});
