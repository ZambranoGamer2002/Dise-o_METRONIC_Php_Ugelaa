/**
 * FUT Registro — Mesa de Partes Virtual
 * Script principal · UGEL Alto Amazonas
 * ─────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
    const tipo_solicitante = document.querySelector(".soli_TipoT");

    if (tipo_solicitante) {
        tipo_solicitante.addEventListener("change", (e) => {
            const secNatural = document.querySelector("#persona-natural");
            const secJuridica = document.querySelector("#persona-juridico");

            if (e.target.value == "NATURAL") {
                secNatural.classList.remove("hidden");
                secJuridica.classList.add("hidden");

                // Limpiar campos de jurídica al cambiar
                const inputs = secJuridica.querySelectorAll("input");
                inputs.forEach((input) => {
                    input.value = "";
                });
            } else {
                secNatural.classList.add("hidden");
                secJuridica.classList.remove("hidden");

                // Limpiar campos de natural al cambiar
                const inputs = secNatural.querySelectorAll("input, select");
                inputs.forEach((input) => {
                    input.value = "";
                });
            }
        });
    }

    const fileInput = document.getElementById('archivos');
    const fileLabel = document.getElementById('upload-label');

    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', () => {
            fileLabel.textContent = fileInput.files.length
                ? `${fileInput.files.length} archivo(s) seleccionado(s)`
                : 'Arrastre o haga clic para adjuntar archivos';
        });
    }

    const items = document.querySelectorAll('.stepper__item');

    items.forEach(item => item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
    }));

    const sections = document.querySelectorAll('.section[data-animate]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    sections.forEach(section => revealObserver.observe(section));

    const sectionIds = ['s1', 's2', 's3', 's4', 's5', 's6'];
    const sectionElements = sectionIds.map(id => document.getElementById(id));

    const stepperObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                items.forEach(item => {
                    item.classList.toggle('is-active',
                        item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '-100px 0px -40% 0px'
    });

    sectionElements.forEach(el => {
        if (el) stepperObserver.observe(el);
    });


    /* ═══════════════════════════════════════════════════════════
       TRÁMITE EXTERNO — Funcionalidad del panel
       ═══════════════════════════════════════════════════════════ */

    // Solo ejecutar si estamos en la página de tramite-externo
    if (!document.body.classList.contains('te-body')) return;

    // ─── Sidebar Mobile Toggle ───
    const sidebar = document.getElementById('teSidebar');
    const sidebarOverlay = document.getElementById('teSidebarOverlay');
    const toggleBtn = document.getElementById('teToggleSidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // ─── Fullscreen Toggle ───
    const fullscreenBtn = document.getElementById('teFullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });
    }

    // ─── Search / Keyboard shortcut (Ctrl+K) ───
    const searchInput = document.getElementById('teSearchInput');
    if (searchInput) {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.blur();
            }
        });

        // Live table search
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#teTramiteBody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });

            // Update counter
            const visibleRows = document.querySelectorAll('#teTramiteBody tr:not([style*="display: none"])');
            const info = document.querySelector('.te-pagination__info');
            if (info) {
                if (query) {
                    info.textContent = `${visibleRows.length} resultado(s) encontrado(s)`;
                } else {
                    info.textContent = `Mostrando 1 - 8 de 148 registros`;
                }
            }
        });
    }

    // ─── Modal: Redactar Trámite ───
    const modalOverlay = document.getElementById('teModalOverlay');
    const redactarBtn = document.getElementById('teRedactarBtn');
    const modalClose = document.getElementById('teModalClose');
    const modalCancel = document.getElementById('teModalCancel');
    const modalSave = document.getElementById('teModalSave');

    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Clear form fields
            modalOverlay.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;
                } else {
                    el.value = '';
                }
            });
        }
    }

    if (redactarBtn) redactarBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);

    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Close modal with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
            closeModal();
        }
    });

    // Save action
    if (modalSave) {
        modalSave.addEventListener('click', () => {
            closeModal();
            showToast('success', 'Trámite registrado', 'El documento fue creado exitosamente.');
        });
    }

    // ─── Toast Notifications ───
    function showToast(type, title, message) {
        const container = document.getElementById('teToastContainer');
        if (!container) return;

        const iconMap = {
            success: `<svg class="te-toast__icon" style="color:var(--color-success)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            error: `<svg class="te-toast__icon" style="color:var(--color-danger)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
            info: `<svg class="te-toast__icon" style="color:var(--color-primary)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
            warning: `<svg class="te-toast__icon" style="color:var(--color-warning)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        };

        const toast = document.createElement('div');
        toast.className = 'te-toast';
        toast.innerHTML = `
            ${iconMap[type] || iconMap.info}
            <div class="te-toast__content">
                <div class="te-toast__title">${title}</div>
                <div class="te-toast__message">${message}</div>
            </div>
            <button class="te-toast__close" aria-label="Cerrar notificación">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;

        container.appendChild(toast);

        // Close button
        toast.querySelector('.te-toast__close').addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto-remove after 4 seconds
        setTimeout(() => removeToast(toast), 4000);
    }

    function removeToast(toast) {
        toast.classList.add('te-toast--out');
        setTimeout(() => toast.remove(), 300);
    }

    // ─── Export Button ───
    const exportBtn = document.getElementById('teExportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showToast('info', 'Exportación', 'Preparando archivo para descarga...');
        });
    }

    // ─── Filters ───
    const applyFiltersBtn = document.getElementById('teApplyFilters');
    const clearFiltersBtn = document.getElementById('teClearFilters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            showToast('success', 'Filtros aplicados', 'La tabla se actualizó con los filtros seleccionados.');
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Reset all selects
            document.querySelectorAll('.te-filters .te-select').forEach(select => {
                select.selectedIndex = 0;
            });
            // Check all checkboxes
            document.querySelectorAll('.te-filters input[type="checkbox"]').forEach(cb => {
                cb.checked = true;
            });
            showToast('info', 'Filtros limpiados', 'Se restauraron los filtros por defecto.');
        });
    }

    // ─── Pagination ───
    const paginationBtns = document.querySelectorAll('.te-pagination__btn:not(:disabled)');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paginationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ─── Table row actions ───
    document.querySelectorAll('.te-table__action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('title');
            const row = btn.closest('tr');
            const docCode = row?.querySelector('.te-table__doc-code')?.textContent || '';

            if (action === 'Ver detalle') {
                showToast('info', 'Detalle', `Abriendo detalle de ${docCode}...`);
            } else if (action === 'Editar') {
                showToast('info', 'Edición', `Editando documento ${docCode}...`);
            } else if (action === 'Eliminar') {
                showToast('warning', 'Eliminar', `¿Desea eliminar ${docCode}? Esta acción no se puede deshacer.`);
            }
        });
    });

    // ─── Animated Counter (stats) ───
    function animateCounters() {
        document.querySelectorAll('.te-stat__value').forEach(el => {
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;

            let current = 0;
            const duration = 1200;
            const step = Math.ceil(target / (duration / 16));
            el.textContent = '0';

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                el.textContent = current.toLocaleString();
            }, 16);
        });
    }

    // Run counter animation once elements are visible
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.te-stats');
    if (statsSection) statObserver.observe(statsSection);

});
