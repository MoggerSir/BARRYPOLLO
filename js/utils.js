/**
 * Crea un elemento del DOM de forma dinámica y eficiente.
 * @param {string} etiqueta - El nombre de la etiqueta HTML.
 * @param {Object} propiedades - Las propiedades, clases, datasets y eventos.
 * @returns {HTMLElement}
 */
export const CrearElemento = (etiqueta, propiedades = {}) => {
    const creador = document.createElement(etiqueta);
    
    if (propiedades) {
        Object.entries(propiedades).forEach(([prop, valor]) => {
        if (prop === 'classList') {
            const clases = (Array.isArray(valor) ? valor : [valor])
                .flatMap(c => typeof c === 'string' ? c.trim().split(/\s+/) : c)
                .filter(Boolean);
            creador.classList.add(...clases);
        }
        else if (prop === 'dataset') {
            Object.assign(creador.dataset, valor);
        }
        else if (prop === 'children') {
            valor.forEach(hijo => {
                if (hijo) creador.appendChild(hijo);
            });
        }
        else if (prop === 'events') {
            Object.entries(valor).forEach(([evt, handler]) => {
                creador.addEventListener(evt, handler);
            });
        }
        else if (prop === 'style' && typeof valor === 'object') {
            Object.assign(creador.style, valor);
        }
        else {
            creador[prop] = valor;
        }
        });
    }
    
    return creador;
};
