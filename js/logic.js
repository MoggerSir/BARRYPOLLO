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
    const day = now.getDay();
    const currentHour = now.getHours();
    const todayHours = NEGOCIO.horarios[day];
    
    if (!todayHours) {
        return { 
            isOpen: false, 
            message: `Cerrado hoy • Abrimos mañana a la 1:00 PM` 
        };
    }
    
    const { apertura, cierre } = todayHours;
    
    if (currentHour >= apertura && currentHour < cierre) {
        return { 
            isOpen: true, 
            message: `Abierto ahora • Cierra a las 5:00 PM` 
        };
    } else {
        const message = currentHour < apertura 
            ? `Cerrado • Abre hoy a la 1:00 PM`
            : `Cerrado • Abrimos mañana a la 1:00 PM`;
        return { 
            isOpen: false, 
            message: message 
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
            // Usamos precioVenta como el precio real del extra
            currentExtras.push({ 
                ...item, 
                tipo, 
                cantidad: 1,
                precioExtra: item.precioVenta || 0 // Mapeamos para compatibilidad con state.js
            });
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
    const tiposValidos = ['guarnicion_', 'agua_', 'salsa_'];
    Object.keys(p).forEach(key => {
        const esOpcion = tiposValidos.some(t => key.startsWith(t)) && !key.endsWith('Precio');
        
        if (esOpcion && p[key]) {
            const label = key.split('_')[0].charAt(0).toUpperCase() + key.split('_')[0].slice(1);
            const num   = parseInt(key.split('_')[1]) + 1;
            text += `- ${label} ${num}: ${p[key]}\n`;
        }
    });
    
    if (p.extras.length > 0) {
        text += `\n*Extras:*\n`;
        p.extras.forEach(e => {
            const subtotal = e.precioExtra * e.cantidad;
            text += `- ${e.cantidad}x ${e.nombre} (+$${subtotal})\n`;
        });
    }
    
    text += `\n*Total estimado: $${p.total}*`;
    
    if (p.direccion && p.direccion.trim().length > 0) {
        text += `\n\n*Dirección de Entrega:*\n${p.direccion.trim()}`;
    }

    text += `\n\nDirección de Barry Pollo: ${NEGOCIO.direccion}`;
    
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodedText}`;
};
