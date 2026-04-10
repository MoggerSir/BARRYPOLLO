/**
 * Barry Pollo - Business Logic
 * Maneja la lógica de pedidos, validación de horarios y formateo de mensajes.
 */

import { NEGOCIO, OPCIONES } from './data.js';
import { state } from './state.js';

/**
 * Verifica si el negocio está abierto basado en la hora local.
 * @returns {Object} { isOpen: boolean, message: string }
 */
export const checkAvailability = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const { apertura, cierre } = NEGOCIO.horarios;
    
    if (currentHour >= apertura && currentHour < cierre) {
        return { 
            isOpen: true, 
            message: `Abierto ahora • Cierra a las ${cierre}:00 PM` 
        };
    } else {
        return { 
            isOpen: false, 
            message: `Cerrado • Abrimos a las ${apertura}:00 PM` 
        };
    }
};

/**
 * Agrega un extra al pedido actual.
 * @param {string} tipo - 'guarnicion', 'salsa', 'agua'
 * @param {string} id - Id del extra
 */
export const addExtra = (tipo, id) => {
    const list = OPCIONES[tipo];
    const item = list.find(i => i.id === id);
    
    if (item) {
        const currentExtras = [...state.pedidoActual.extras];
        const existing = currentExtras.find(e => e.id === id);
        
        if (existing) {
            existing.cantidad += 1;
        } else {
            currentExtras.push({ ...item, tipo, cantidad: 1 });
        }
        
        state.actualizar({ extras: currentExtras });
    }
};

/**
 * Remueve o decrementa un extra.
 */
export const removeExtra = (id) => {
    let currentExtras = [...state.pedidoActual.extras];
    const index = currentExtras.findIndex(e => e.id === id);
    
    if (index !== -1) {
        if (currentExtras[index].cantidad > 1) {
            currentExtras[index].cantidad -= 1;
        } else {
            currentExtras.splice(index, 1);
        }
        state.actualizar({ extras: currentExtras });
    }
};

/**
 * Formatea el pedido actual para enviar por WhatsApp.
 * @returns {string} URL de WhatsApp wa.me
 */
export const generateWhatsAppLink = () => {
    const p = state.pedidoActual;
    let text = `¡Hola! Me gustaría hacer un pedido:\n\n`;
    text += `*${p.nombre}* - $${p.precio}\n`;
    
    // Opciones dinámicas del combo
    Object.keys(p).forEach(key => {
        if ((key.startsWith('guarnicion_') || key.startsWith('agua_') || key.startsWith('salsa_')) && !key.endsWith('Precio')) {
            if (p[key]) {
                const label = key.split('_')[0].charAt(0).toUpperCase() + key.split('_')[0].slice(1);
                const num   = parseInt(key.split('_')[1]) + 1;
                text += `- ${label} ${num}: ${p[key]}\n`;
            }
        }
    });
    
    if (p.extras.length > 0) {
        text += `\n*Extras:*\n`;
        p.extras.forEach(e => {
            text += `- ${e.cantidad}x ${e.nombre} (+$${e.precioExtra * e.cantidad})\n`;
        });
    }
    
    text += `\n*Total estimado: $${p.total}*\n`;
    text += `\nDirección de Barry Pollo: ${NEGOCIO.direccion}`;
    
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodedText}`;
};
