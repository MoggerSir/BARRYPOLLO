/**
 * Barry Pollo — main.js
 * Orquestador principal. Inicializa librerías, renderiza secciones,
 * controla la expansión de Bento Grid via panel overlay (sin manipulación de grid-template).
 *
 * NOTA: GSAP, ScrollTrigger, ScrollToPlugin y AOS se cargan como
 * variables globales desde CDN en index.html. NO usar import.
 */

import { state } from './state.js';
import { renderSaborCard, renderComboCard, renderTicket, renderReview } from './dom.js';
import { MENU_SABORES, COMBOS, RESEÑAS } from './data.js';
import { checkAvailability } from './logic.js';
import { initHeroRandomizer } from './heroRandomizer.js';

/* ── Registrar plugins GSAP ── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Variable para controlar el scroll inicial (evitar saltos al recargar) ── */
let isInitialLoad = true;

/* ── Referencia al panel de expansión activo y su cleanup ── */
let expansionCleanup = null;

/* ============================================================
   INIT
   ============================================================ */
const init = () => {
    AOS.init({
        duration: 750,
        once: true,
        offset: 40,
        easing: 'ease-out-quart',
        disable: false
    });

    renderMenu();
    renderCombos();
    renderReviews();
    updateAvailability();
    setupHeroAnimations();
    setupSmoothScroll();
    setupHeaderScroll();
    setupHamburgerMenu();
    setupBentoExpansion();
    initHeroRandomizer();

    /* Suscripción reactiva al estado del pedido */
    state.subscribe((pedido) => {
        updateTicket(pedido);
        setTimeout(() => { isInitialLoad = false; }, 500);
    });
};

/* ============================================================
   RENDERIZADO DE SECCIONES
   ============================================================ */
const renderMenu = () => {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    grid.innerHTML = '';
    MENU_SABORES.forEach((s, i) => {
        const card = renderSaborCard(s, i);
        grid.appendChild(card);

        gsap.fromTo(card,
            { opacity: 0, y: 30, scale: 0.96 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        const img = card.querySelector('.card-image-wrapper img');
        if (img) {
            gsap.to(img, {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    });
};

const renderCombos = () => {
    const grid = document.getElementById('combos-grid');
    if (!grid) return;

    grid.innerHTML = '';
    COMBOS.forEach((c, i) => {
        const card = renderComboCard(c, i);
        grid.appendChild(card);

        gsap.fromTo(card,
            { opacity: 0, y: 30, scale: 0.96 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        const img = card.querySelector('.card-image-wrapper img');
        if (img) {
            gsap.to(img, {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    });
};

const renderReviews = () => {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    grid.innerHTML = '';
    RESEÑAS.forEach((r) => {
        const card = renderReview(r);
        grid.appendChild(card);
    });

    /* 
     * Animación con GSAP ScrollTrigger en lugar de AOS.
     * AOS se rompe con grids grandes porque acumula observers y
     * los delays escalonados chocan con el scroll rápido.
     * GSAP maneja cada card de forma independiente y limpia.
     */
    const cards = grid.querySelectorAll('.review-card');
    cards.forEach((card) => {
        gsap.fromTo(card,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                    toggleActions: 'play none none none', // solo una vez, sin reverse
                }
            }
        );
    });
};

/* ============================================================
   TICKET — Toggle visibility + re-render
   ============================================================ */
const updateTicket = (pedido) => {
    const section = document.getElementById('ticket-section');
    const container = document.getElementById('ticket-container');
    if (!section || !container) return;

    /* 
     * ESTRATEGIA: Restaurar foco y posición del cursor.
     * Al ser una arquitectura reactiva (re-render total), el input se destruye y recrea.
     */
    const activeElId = document.activeElement ? document.activeElement.classList.contains('ticket-address-input') : false;
    let cursorStart = 0, cursorEnd = 0;

    if (activeElId) {
        cursorStart = document.activeElement.selectionStart;
        cursorEnd = document.activeElement.selectionEnd;
    }

    container.innerHTML = '';
    const ticketEl = renderTicket(pedido);
    container.appendChild(ticketEl);

    // Restaurar el foco si el usuario estaba escribiendo en la dirección
    if (activeElId) {
        const newInput = container.querySelector('.ticket-address-input');
        if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(cursorStart, cursorEnd);
        }
    }

    if (pedido.id) {
        if (!section.classList.contains('has-order')) {
            section.classList.add('has-order');

            if (!isInitialLoad) {
                /* Esperar 2 frames para que display:block haga layout antes de scrollear */
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    gsap.to(window, {
                        scrollTo: { y: '#ticket-section', offsetY: 80 },
                        duration: 1,
                        ease: 'power3.inOut'
                    });
                }));
            }

            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }

        animatePriceUpdate(pedido.total || 0);
    } else {
        section.classList.remove('has-order');
    }
};

const animatePriceUpdate = (newTotal) => {
    const priceEl = document.querySelector('.total-price');
    if (!priceEl) return;

    priceEl.classList.add('updating');
    setTimeout(() => priceEl.classList.remove('updating'), 500);

    const currentValue = parseInt(priceEl.textContent.replace('$', '')) || 0;
    const counter = { value: currentValue };

    gsap.to(counter, {
        value: newTotal,
        duration: 0.7,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
            if (priceEl) priceEl.textContent = `$${counter.value}`;
        }
    });
};

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
const setupHeroAnimations = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
        .from('.availability-banner', { y: -20, opacity: 0, duration: 0.6 })
        .from('.hero-title',          { y: 60,  opacity: 0, duration: 1   }, '-=0.3')
        .from('.hero-subtitle',       { y: 40,  opacity: 0, duration: 0.9 }, '-=0.6')
        .from('.hero-actions',        { y: 30,  opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-rating',         { y: 20,  opacity: 0, duration: 0.7 }, '-=0.4')
        .from('.hero-image',          { x: 60,  opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=1');

    gsap.to('.hero-image img', {
        y: 50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });
};

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            /* Si el link apunta al ticket pero no hay pedido, redirigir al menú */
            if (href === '#ticket-section' && !state.pedidoActual.id) {
                e.preventDefault();
                closeHamburger();
                gsap.to(window, { scrollTo: { y: '#menu', offsetY: 72 }, duration: 1, ease: 'power3.inOut' });
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            /* Si el target está oculto (display:none), esperar un tick para que se muestre */
            const isHidden = target.offsetParent === null && getComputedStyle(target).display === 'none';
            if (isHidden) return; /* dejar que el browser lo maneje o ignorar */

            e.preventDefault();
            closeHamburger();

            gsap.to(window, {
                scrollTo: { y: href, offsetY: 72 },
                duration: 1,
                ease: 'power3.inOut'
            });
        });
    });
};

/* ============================================================
   HEADER — Scroll effect
   ============================================================ */
const setupHeaderScroll = () => {
    const header = document.getElementById('header');
    if (!header) return;

    ScrollTrigger.create({
        start: 'top -80px',
        end: 99999,
        onUpdate: (self) => {
            header.classList.toggle('scrolled', self.isActive);
        }
    });
};

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const setupHamburgerMenu = () => {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav-links');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.contains('is-open');
        if (isOpen) {
            closeHamburger();
        } else {
            nav.classList.add('is-open');
            btn.innerHTML = '<i class="iconoir-xmark"></i>';
            btn.setAttribute('aria-expanded', 'true');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('header')) {
            closeHamburger();
        }
    });
};

const closeHamburger = () => {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav-links');
    if (!btn || !nav) return;
    nav.classList.remove('is-open');
    btn.innerHTML = '<i class="iconoir-menu"></i>';
    btn.setAttribute('aria-expanded', 'false');
};

/* ============================================================
   BENTO EXPANSION — Panel Overlay
   
   Estrategia: MOVER (no clonar) el nodo .bento-expanded original
   al panel overlay. Así todos sus event listeners (selects, steppers,
   botones) siguen funcionando exactamente igual que en el DOM original.
   Al cerrar, el nodo se devuelve al item original.
   ============================================================ */
const setupBentoExpansion = () => {
    /* Escuchar el evento disparado por los botones de pedido en dom.js */
    document.addEventListener('barry:closePanel', () => {
        const grid = document.querySelector('.bento-grid-contenedor.has-expansion');
        if (grid) closeExpansion(grid);
    });

    document.querySelectorAll('.bento-grid-contenedor').forEach(grid => {
        const items = grid.querySelectorAll('.bento-item');

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                /* Ignorar clicks en controles interactivos */
                if (e.target.closest('.btn-primary, .aesthetic-select, .stepper-btn')) return;

                const isActive = item.classList.contains('is-active-expansion');
                if (isActive) {
                    closeExpansion(grid);
                } else {
                    openExpansion(grid, item);
                }
            });
        });

        /* Cerrar al hacer click en el backdrop */
        document.addEventListener('click', (e) => {
            if (!grid.classList.contains('has-expansion')) return;
            if (e.target.classList.contains('bento-backdrop')) {
                closeExpansion(grid);
            }
        });

        /* Cerrar con Escape */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && grid.classList.contains('has-expansion')) {
                closeExpansion(grid);
            }
        });
    });
};

const openExpansion = (grid, item) => {
    /* Cerrar cualquier panel abierto primero */
    if (expansionCleanup) {
        expansionCleanup();
        expansionCleanup = null;
    }

    /* Resetear estado para un nuevo item (limpiando selecciones previas) */
    state.prepararNuevoPedido();

    /* El nodo .bento-expanded que vive dentro del item */
    const expandedNode = item.querySelector('.bento-expanded');
    if (!expandedNode) return;

    const isMobile = window.innerWidth <= 768;
    const itemRect  = item.getBoundingClientRect();
    const gridRect  = grid.getBoundingClientRect();

    /* ── Crear backdrop ── */
    const backdrop = document.createElement('div');
    backdrop.className = 'bento-backdrop';

    /* ── Crear panel ── */
    const panel = document.createElement('div');
    panel.className = 'bento-panel';

    /* Imagen de fondo decorativa */
    const cardImg = item.querySelector('.card-image-wrapper img');
    if (cardImg && cardImg.src) {
        panel.style.setProperty('--panel-bg-img', `url(${cardImg.src})`);
        panel.classList.add('has-bg-image');
    }

    /* ── MOVER el nodo original al panel (conserva todos sus listeners) ── */
    panel.appendChild(expandedNode);

    /* Hacer visible el nodo movido */
    expandedNode.style.display    = 'flex';
    expandedNode.style.position   = 'static';
    expandedNode.style.opacity    = '0';
    expandedNode.style.pointerEvents = 'auto';

    /* ── Botón cerrar ── */
    const closeBtn = document.createElement('button');
    closeBtn.className = 'bento-panel-close';
    closeBtn.innerHTML = '<i class="iconoir-xmark"></i>';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeExpansion(grid);
    });
    panel.appendChild(closeBtn);

    /* Insertar en el contenedor correcto */
    if (isMobile) {
        /* En mobile, backdrop y panel van al body (position: fixed) */
        document.body.appendChild(backdrop);
        document.body.appendChild(panel);
    } else {
        grid.appendChild(backdrop);
        grid.appendChild(panel);
    }

    /* ── Posiciones inicial (= card) y final (= grid o viewport) ── */
    const padding    = 16;
    let startLeft, startTop, startW, startH, endLeft, endTop, endW, endH;

    if (isMobile) {
        /* En mobile: parte desde el centro de la pantalla, llena el viewport */
        startLeft = itemRect.left;
        startTop  = itemRect.top;
        startW    = itemRect.width;
        startH    = itemRect.height;
        endLeft   = 12;
        endTop    = 70;
        endW      = window.innerWidth - 24;
        endH      = window.innerHeight - 82;
    } else {
        startLeft = itemRect.left - gridRect.left;
        startTop  = itemRect.top  - gridRect.top;
        startW    = itemRect.width;
        startH    = itemRect.height;
        endLeft   = padding;
        endTop    = padding;
        endW      = gridRect.width  - padding * 2;
        endH      = Math.max(gridRect.height - padding * 2, 480);
    }

    gsap.set(panel, {
        left: startLeft, top: startTop,
        width: startW,   height: startH,
        borderRadius: 20, opacity: 1
    });
    gsap.set(backdrop, { opacity: 0 });

    /* Marcar estado */
    item.classList.add('is-active-expansion');
    grid.classList.add('has-expansion');

    /* Scroll para que el grid sea visible */
    if (!isMobile) {
        const visibleMid = window.scrollY + window.innerHeight / 2;
        const gridMid    = window.scrollY + gridRect.top + gridRect.height / 2;
        if (Math.abs(visibleMid - gridMid) > 200) {
            gsap.to(window, {
                scrollTo: { y: grid, offsetY: (window.innerHeight - gridRect.height) / 2 },
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    }

    /* ── Animación de apertura ── */
    const tl = gsap.timeline();

    tl.to(backdrop, { opacity: 1, duration: 0.28, ease: 'power2.out' });

    tl.to(panel, {
        left: endLeft, top: endTop,
        width: endW,   height: endH,
        borderRadius: 20,
        duration: 0.5, ease: 'power3.inOut'
    }, '<0.04');

    tl.to(expandedNode, {
        opacity: 1, y: 0,
        duration: 0.3, ease: 'power2.out'
    }, '-=0.1');

    /* ── Cleanup: devolver el nodo a su item original ── */
    expansionCleanup = () => {
        /* Ocultar antes de mover de vuelta */
        expandedNode.style.display    = 'none';
        expandedNode.style.position   = '';
        expandedNode.style.opacity    = '';
        expandedNode.style.pointerEvents = '';
        gsap.set(expandedNode, { clearProps: 'all' });

        item.appendChild(expandedNode);   /* devolver al item */
        backdrop.remove();
        panel.remove();
        item.classList.remove('is-active-expansion');
        grid.classList.remove('has-expansion');
    };
};

const closeExpansion = (_grid) => {
    /* El panel puede estar en el grid (desktop) o en body (mobile) */
    const panel    = document.querySelector('.bento-panel');
    const backdrop = document.querySelector('.bento-backdrop');

    if (!panel || !expansionCleanup) {
        if (expansionCleanup) { expansionCleanup(); expansionCleanup = null; }
        return;
    }

    const tl = gsap.timeline({
        onComplete: () => {
            if (expansionCleanup) { expansionCleanup(); expansionCleanup = null; }
        }
    });

    tl.to(panel,    { opacity: 0, scale: 0.96, duration: 0.28, ease: 'power2.in' });
    if (backdrop) {
        tl.to(backdrop, { opacity: 0, duration: 0.22, ease: 'power2.in' }, '<');
    }
};

/* ============================================================
   AVAILABILITY STATUS
   ============================================================ */
const updateAvailability = () => {
    const banner = document.getElementById('availability-status');
    const textEl = document.getElementById('availability-text');
    if (!banner || !textEl) return;

    const { isOpen, message } = checkAvailability();
    textEl.textContent = message;
    banner.classList.add(isOpen ? 'open' : 'closed');
};

/* ============================================================
   ARRANQUE
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);
