/**
 * Barry Pollo — notifications.js
 * Sistema de notificaciones (Toasts) premium.
 * Maneja avisos, errores y mensajes de éxito con estética Barry Pollo.
 */

import { CrearElemento } from './utils.js';

let container = null;

/**
 * Crea el contenedor de notificaciones si no existe.
 */
const ensureContainer = () => {
    if (container) return container;
    
    container = CrearElemento('div', {
        className: 'toast-container',
        id: 'toast-container'
    });
    
    document.body.appendChild(container);
    return container;
};

/**
 * Muestra una notificación tipo Toast.
 * @param {string} title - Título del aviso.
 * @param {string} message - Mensaje detallado.
 * @param {string} type - 'warning', 'error', 'success', 'info'.
 * @param {number} duration - Tiempo en ms antes de desaparecer.
 */
export const showToast = (title, message, type = 'info', duration = 4000) => {
    const parent = ensureContainer();
    
    /* Configuración por tipo */
    const icons = {
        warning: 'iconoir-warning-triangle',
        error:   'iconoir-cancel',
        success: 'iconoir-check-circle',
        info:    'iconoir-info-empty'
    };
    
    const iconClass = icons[type] || icons.info;
    
    /* Crear Elemento Toast */
    const toast = CrearElemento('div', {
        classList: ['toast', `is-${type}`],
        children: [
            CrearElemento('div', {
                classList: 'toast-icon',
                children: [CrearElemento('i', { classList: iconClass })]
            }),
            CrearElemento('div', {
                classList: 'toast-content',
                children: [
                    CrearElemento('div', { classList: 'toast-title', textContent: title }),
                    CrearElemento('div', { classList: 'toast-message', textContent: message })
                ]
            }),
            CrearElemento('button', {
                classList: 'toast-close',
                children: [CrearElemento('i', { classList: 'iconoir-xmark' })],
                events: {
                    click: () => removeToast(toast)
                }
            })
        ]
    });
    
    parent.appendChild(toast);
    
    /* Animación de entrada con GSAP */
    gsap.fromTo(toast, 
        { x: 50, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
    
    /* Auto-remover */
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    /* Guardar timeout en el elemento para cancelarlo si se cierra manual */
    toast.dataset.timeout = timeout;
};

const removeToast = (toast) => {
    if (toast.dataset.removing) return;
    toast.dataset.removing = 'true';
    
    clearTimeout(toast.dataset.timeout);
    
    gsap.to(toast, {
        x: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
            toast.remove();
            /* Si el contenedor está vacío, podríamos removerlo, pero mejor dejarlo */
        }
    });
};
