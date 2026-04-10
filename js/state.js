/**
 * Barry Pollo - State Management
 * Implementado con patrón Pub/Sub para reactividad simple.
 */

const INITIAL_STATE = {
    id: null,
    nombre: '',
    precio: 0,
    extras: [],
    cantidad: 1,
    total: 0,
    direccion: ''
};

class StateManager {
    constructor() {
        this.pedidoActual = { ...INITIAL_STATE };
        this.listeners = [];
        
        // Cargar estado previo si existe
        const saved = sessionStorage.getItem('barry_pedido');
        if (saved) {
            try {
                this.pedidoActual = JSON.parse(saved);
            } catch (e) {
                console.error("Error cargando pedido previo", e);
            }
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this.pedidoActual);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    publish() {
        this.listeners.forEach(callback => callback(this.pedidoActual));
    }

    actualizar(cambios) {
        this.pedidoActual = { ...this.pedidoActual, ...cambios };
        this.calcularTotal();
        sessionStorage.setItem('barry_pedido', JSON.stringify(this.pedidoActual));
        this.publish();
    }

    /**
     * Prepara el estado para un nuevo item (Sabor o Combo) sin perder la dirección.
     * Purga todas las keys dinámicas de selecciones previas.
     */
    prepararNuevoPedido() {
        const direccionGuardada = this.pedidoActual.direccion || '';
        this.pedidoActual = { ...INITIAL_STATE, direccion: direccionGuardada };
        this.calcularTotal();
        this.publish();
    }

    calcularTotal() {
        let base = (this.pedidoActual.precio || 0) * (this.pedidoActual.cantidad || 1);
        let extrasTotal = (this.pedidoActual.extras || []).reduce((acc, extra) => 
            acc + ((extra.precioExtra || 0) * (extra.cantidad || 1)), 0);
        
        // Sumar todos los recargos dinámicos usando el spread de INITIAL_STATE como base limpia
        let opcionesSurcharge = 0;
        Object.keys(this.pedidoActual).forEach(key => {
            if (key.endsWith('Precio') && typeof this.pedidoActual[key] === 'number') {
                opcionesSurcharge += this.pedidoActual[key];
            }
        });

        this.pedidoActual.total = base + extrasTotal + opcionesSurcharge;
    }

    limpiar() {
        this.pedidoActual = { ...INITIAL_STATE };
        sessionStorage.removeItem('barry_pedido');
        this.publish();
    }
}

export const state = new StateManager();
