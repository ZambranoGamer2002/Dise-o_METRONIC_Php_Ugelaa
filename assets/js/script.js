/**
 * FUT Registro — Mesa de Partes Virtual
 * Script principal · UGEL Alto Amazonas
 * ─────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════════════════
       Toggle Persona Natural / Jurídica
       Patrón basado en la referencia del Ing.
       ══════════════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════════════
       File upload feedback
       ══════════════════════════════════════════════════════════ */
    const fileInput = document.getElementById('archivos');
    const fileLabel = document.getElementById('upload-label');

    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', () => {
            fileLabel.textContent = fileInput.files.length
                ? `${fileInput.files.length} archivo(s) seleccionado(s)`
                : 'Arrastre o haga clic para adjuntar archivos';
        });
    }

    /* ══════════════════════════════════════════════════════════
       Stepper — Click navigation
       ══════════════════════════════════════════════════════════ */
    const items = document.querySelectorAll('.stepper__item');

    items.forEach(item => item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
    }));

    /* ══════════════════════════════════════════════════════════
       IntersectionObserver — Scroll Reveal Animations
       ══════════════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════════════
       IntersectionObserver — Auto-update Stepper on scroll
       ══════════════════════════════════════════════════════════ */
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

});
