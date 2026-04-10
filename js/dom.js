/**
 * Barry Pollo — dom.js
 * Generación dinámica y modular del DOM.
 * Usa CrearElemento como función base para todos los componentes.
 */

import { CrearElemento } from './utils.js';
import { state }         from './state.js';
import { addExtra, removeExtra, generateWhatsAppLink } from './logic.js';
import { OPCIONES } from './data.js';
import { showToast } from './notifications.js';

/* ============================================================
   HELPERS INTERNOS
   ============================================================ */

/** Genera los íconos de estrellas como elementos span */
const renderStars = (puntuacion, max = 5) => {
    return Array.from({ length: max }, (_, i) => {
        const isFull = i < puntuacion;
        return CrearElemento('i', {
            classList: isFull ? 'iconoir-star-solid' : 'iconoir-star'
        });
    });
};

/** 
 * Select estético con label 
 * Soporta index para múltiples selecciones del mismo tipo (ej: Guarnición 1, 2, etc.)
 */
const renderOptionSelect = (tipo, label, index = 0) => {
    const options = OPCIONES[tipo] || [];

    // Keys mapeadas en el estado: guarnicion_0, agua_0, salsa_0, etc.
    const keyMap   = { guarniciones: 'guarnicion', aguas: 'agua', salsas: 'salsa' };
    const baseKey  = keyMap[tipo] || tipo;
    const stateKey = `${baseKey}_${index}`;

    return CrearElemento('div', {
        classList: 'option-group',
        children: [
            CrearElemento('label', { textContent: label }),
            CrearElemento('select', {
                classList: 'aesthetic-select',
                events: {
                    change: (e) => {
                        const selectedId = e.target.value;
                        if (!selectedId) {
                            state.actualizar({
                                [stateKey]: '',
                                [`${stateKey}Precio`]: 0
                            });
                            return;
                        }
                        const item = options.find(o => o.id === selectedId);
                        if (item) {
                            state.actualizar({
                                [stateKey]: item.nombre,
                                [`${stateKey}Precio`]: item.precioExtra || 0
                            });
                        }
                    }
                },
                children: [
                    CrearElemento('option', { value: '', textContent: `Seleccionar ${label.toLowerCase()}...` }),
                    ...options.map(o => CrearElemento('option', {
                        value:       o.id,
                        textContent: o.precioExtra > 0 
                            ? `${o.nombre} (+$${o.precioExtra})` 
                            : o.nombre
                    }))
                ]
            })
        ]
    });
};

/**
 * Verifica si hay extras seleccionados en dropdowns pero con cantidad 0 (sin pulsar +).
 * Centraliza la lógica para evitar repetición en Sabores y Combos.
 */
const validarExtrasPendientes = (container) => {
    const selects = container.querySelectorAll('.extra-select');
    for (const select of selects) {
        const id = select.value;
        if (!id) continue;

        const isAdded = state.pedidoActual.extras.some(e => e.id === id);
        if (!isAdded) {
            const itemName = select.options[select.selectedIndex].text.split('(')[0].trim();
            showToast('¡Olvidas un extra!', `Seleccionaste "${itemName}", pero falta añadirlo con el botón (+).`, 'warning');
            return false;
        }
    }
    return true;
};

/* ============================================================
   SABOR CARD — Renderiza carta de sabor individual
   ============================================================ */
export const renderSaborCard = (sabor) => {
    const container = CrearElemento('article', {
        classList: ['bento-item', 'sabor-card'],
        dataset:   { id: sabor.id, type: 'sabor' },
        children: [
            /* ── ESTADO COLAPSADO ── */
            CrearElemento('div', {
                classList: 'bento-collapsed',
                children: [
                    CrearElemento('div', {
                        classList: 'card-tags',
                        children: (sabor.tags || []).map(tag =>
                            CrearElemento('span', { classList: 'tag-badge', textContent: tag })
                        )
                    }),
                    CrearElemento('div', {
                        classList: 'card-image-wrapper',
                        children: [CrearElemento('img', { src: sabor.imagen, alt: sabor.nombre, loading: 'lazy' })]
                    }),
                    CrearElemento('div', {
                        classList: 'card-content',
                        children: [
                            CrearElemento('h3', { textContent: sabor.nombre }),
                            CrearElemento('span', { classList: 'card-price', textContent: `$${sabor.precio}` })
                        ]
                    })
                ]
            }),

            /* ── ESTADO EXPANDIDO (oculto por defecto) ── */
            CrearElemento('div', {
                classList: 'bento-expanded',
                children: [
                    CrearElemento('div', {
                        classList: 'expanded-header',
                        children: [
                            CrearElemento('h2', { textContent: sabor.nombre }),
                            CrearElemento('div', {
                                classList: 'rating-row',
                                children:  renderStars(5) // Puntuación premium fija
                            })
                        ]
                    }),

                    CrearElemento('p', { classList: 'expanded-desc', textContent: sabor.descripcion }),

                    /* Extras Section */
                    CrearElemento('div', {
                        classList: 'combo-options',
                        children: [
                            CrearElemento('h4', { textContent: '¿Algo más para acompañar?' }),
                            renderExtraRow('guarniciones', 'Guarnición extra'),
                            renderExtraRow('aguas',        'Agua fresca extra')
                        ]
                    }),

                    /* Footer: precio + botón */
                    CrearElemento('div', {
                        classList: 'expanded-footer',
                        children: [
                            CrearElemento('span', {
                                classList:   'expanded-price',
                                textContent: `$${sabor.precio}`
                            }),
                            CrearElemento('button', {
                                classList:   'btn-primary',
                                children: [
                                    CrearElemento('i', { classList: 'iconoir-cart' }),
                                    document.createTextNode(' Seleccionar Sabor')
                                ],
                                events: {
                                    click: (e) => {
                                        e.stopPropagation();

                                        /* Validación de extras pendientes */
                                        if (!validarExtrasPendientes(container)) return;

                                        state.actualizar({
                                            id:       sabor.id,
                                            nombre:   sabor.nombre,
                                            precio:   sabor.precio,
                                            cantidad: 1
                                        });
                                        showToast('¡Añadido!', `${sabor.nombre} se sumó a tu pedido.`, 'success');
                                    }
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });

    return container;
};

/* ============================================================
   COMBO CARD
   ============================================================ */
export const renderComboCard = (combo) => {
    const container = CrearElemento('article', {
        classList: ['bento-item', 'combo-card'],
        dataset:   { id: combo.id, type: 'combo' },
        children: [
            /* ── ESTADO COLAPSADO ── */
            CrearElemento('div', {
                classList: 'bento-collapsed',
                children: [
                    CrearElemento('div', {
                        classList: 'card-tags',
                        children: (combo.tags || []).map(tag =>
                            CrearElemento('span', { classList: 'tag-badge', textContent: tag })
                        )
                    }),
                    CrearElemento('div', {
                        classList: 'card-image-wrapper',
                        children: [CrearElemento('img', { src: combo.imagen, alt: combo.nombre, loading: 'lazy' })]
                    }),
                    CrearElemento('div', {
                        classList: 'card-content',
                        children: [
                            CrearElemento('h3', { textContent: combo.nombre }),
                            CrearElemento('span', { classList: 'card-price', textContent: `$${combo.precio}` })
                        ]
                    })
                ]
            }),

            /* ── ESTADO EXPANDIDO ── */
            CrearElemento('div', {
                classList: 'bento-expanded',
                children: [
                    CrearElemento('div', {
                        classList: 'expanded-header',
                        children: [
                            CrearElemento('h2', { textContent: combo.nombre }),
                            CrearElemento('span', { classList: 'expanded-id', textContent: 'PACK FAMILIAR' })
                        ]
                    }),

                    CrearElemento('p', { classList: 'expanded-desc', textContent: combo.incluye }),

                    /* Grill de Opciones Principales del Combo */
                    CrearElemento('div', {
                        classList: 'combo-options',
                        children: [
                            CrearElemento('h4', { textContent: 'Personaliza tu Combo' }),
                            /* Renderizado dinámico según configuración de la imagen */
                            ...Array.from({ length: (combo.config?.guarniciones || 0) }, (_, i) => 
                                renderOptionSelect('guarniciones', `Guarnición ${i + 1}`, i)
                            ),
                            ...Array.from({ length: (combo.config?.aguas || 0) }, (_, i) => 
                                renderOptionSelect('aguas', `Agua fresca ${i + 1}`, i)
                            ),
                            ...Array.from({ length: (combo.config?.salsas || 0) }, (_, i) => 
                                renderOptionSelect('salsas', `Salsa ${i + 1}`, i)
                            )
                        ]
                    }),

                    /* Grill de Extras Adicionales */
                    CrearElemento('div', {
                        classList: 'combo-options',
                        children: [
                            CrearElemento('div', {
                                classList: 'extras-title-row',
                                children: [
                                    CrearElemento('h4', { textContent: '¿Deseas algo extra?' }),
                                    CrearElemento('span', { classList: 'extras-badge', textContent: '+ COSTO' })
                                ]
                            }),
                            renderExtraRow('guarniciones', 'Guarnición extra'),
                            renderExtraRow('aguas',        'Agua fresca extra')
                        ]
                    }),

                    /* Footer: precio + botón */
                    CrearElemento('div', {
                        classList: 'expanded-footer',
                        children: [
                            CrearElemento('span', {
                                classList:   'expanded-price',
                                textContent: `$${combo.precio}`
                            }),
                            CrearElemento('button', {
                                classList: 'btn-primary',
                                children: [
                                    CrearElemento('i', { classList: 'iconoir-cart' }),
                                    document.createTextNode(' Agregar al Pedido')
                                ],
                                events: {
                                    click: (e) => {
                                        e.stopPropagation();

                                        /* Validación Dinámica según Configuración */
                                        const actual = state.pedidoActual;
                                        const errors = [];

                                        if (combo.config) {
                                            for(let i=0; i<combo.config.guarniciones; i++) if(!actual[`guarnicion_${i}`]) errors.push("guarnición");
                                            for(let i=0; i<combo.config.aguas; i++) if(!actual[`agua_${i}`]) errors.push("agua");
                                            for(let i=0; i<combo.config.salsas; i++) if(!actual[`salsa_${i}`]) errors.push("salsa");
                                        }

                                        if (errors.length > 0) {
                                            showToast('Pack incompleto', 'Por favor selecciona todas las opciones para tu combo.', 'warning');
                                            return;
                                        }

                                        /* Validación 2: Extras pendientes (DRY helper) */
                                        if (!validarExtrasPendientes(container)) return;

                                        state.actualizar({
                                            id:               combo.id,
                                            nombre:           combo.nombre,
                                            precio:           combo.precio,
                                            cantidad:         1
                                        });
                                        showToast('¡Añadido!', `${combo.nombre} se sumó a tu pedido.`, 'success');
                                    }
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });

    return container;
};

/* ============================================================
   EXTRA ROW — Select + Stepper para extras adicionales
   ============================================================ */
const renderExtraRow = (tipo, label) => {
    const options = OPCIONES[tipo] || [];
    let selectedId = null;

    const stepperCount = CrearElemento('span', {
        classList:   'stepper-count',
        textContent: '0'
    });

    const btnMinus = CrearElemento('button', {
        classList: ['stepper-btn', 'stepper-minus'],
        children:  [CrearElemento('i', { classList: 'iconoir-minus' })],
        events: {
            click: (e) => {
                e.stopPropagation();
                if (selectedId) removeExtra(selectedId);
            }
        }
    });

    const btnPlus = CrearElemento('button', {
        classList: ['stepper-btn', 'stepper-plus'],
        children:  [CrearElemento('i', { classList: 'iconoir-plus' })],
        events: {
            click: (e) => {
                e.stopPropagation();
                if (!selectedId) {
                    showToast('¿Qué extra vas a pedir?', `Por favor, elige primero una opción de la lista de ${label.toLowerCase()}.`, 'warning');
                    return;
                }
                addExtra(tipo, selectedId);
            }
        }
    });

    const stepper = CrearElemento('div', {
        classList: 'stepper',
        children:  [btnMinus, stepperCount, btnPlus]
    });

    /* Actualizar contador del stepper cuando cambia el estado */
    const unsub = state.subscribe((pedido) => {
        if (!selectedId) return;
        const extra    = (pedido.extras || []).find(e => e.id === selectedId);
        stepperCount.textContent = extra ? String(extra.cantidad) : '0';
    });

    const selectEl = CrearElemento('select', {
        classList: ['aesthetic-select', 'extra-select'],
        style:     { flex: '1' },
        events: {
            change: (e) => {
                selectedId = e.target.value || null;
                stepperCount.textContent = '0';
            }
        },
        children: [
            CrearElemento('option', { value: '', textContent: `+ ${label}` }),
            ...options.map(o => CrearElemento('option', {
                value:       o.id,
                textContent: o.precioVenta > 0
                    ? `${o.nombre} (+$${o.precioVenta})`
                    : o.nombre
            }))
        ]
    });

    // Aunque las cartas son estables, si se implementa filtrado dinámico 
    // este cleanup evitará duplicación de listeners.
    selectEl.dataset.unsub = unsub;

    return CrearElemento('div', {
        style: { display: 'flex', gap: '8px', alignItems: 'center' },
        children: [selectEl, stepper]
    });
};

/* ============================================================
   TICKET DIGITAL
   ============================================================ */
export const renderTicket = (pedido) => {
    /* Estado vacío */
    if (!pedido.id) {
        return CrearElemento('div', {
            classList: 'ticket-empty',
            children: [
                CrearElemento('i', { classList: 'iconoir-receipt' }),
                CrearElemento('p', { textContent: 'Selecciona un sabor o combo para armar tu pedido' })
            ]
        });
    }

    /* Número de orden aleatorio para estética de ticket */
    const orderNum = `#${Math.floor(1000 + Math.random() * 9000)}`;

    /* Filas de extras */
    const extraRows = (pedido.extras || []).map(e =>
        CrearElemento('div', {
            classList: ['ticket-row', 'is-extra'],
            children: [
                CrearElemento('span', {
                    classList:   'ticket-row-name',
                    textContent: e.nombre
                }),
                CrearElemento('div', {
                    classList: ['ticket-row-stepper', 'stepper'],
                    children: [
                        CrearElemento('button', {
                            classList: 'stepper-btn',
                            textContent: '−',
                            events: { click: (ev) => { ev.stopPropagation(); removeExtra(e.id); } }
                        }),
                        CrearElemento('span', {
                            classList:   'stepper-count',
                            textContent: String(e.cantidad)
                        }),
                        CrearElemento('button', {
                            classList: 'stepper-btn',
                            textContent: '+',
                            events: { click: (ev) => { ev.stopPropagation(); addExtra(e.tipo, e.id); } }
                        })
                    ]
                }),
                CrearElemento('span', {
                    classList:   'ticket-row-price',
                    textContent: `+$${e.precioExtra * e.cantidad}`
                })
            ]
        })
    );

    // Generar filas para opciones dinámicas del combo (guarnicion_0, etc.)
    const optionRows = Object.keys(pedido)
        .filter(key => (key.startsWith('guarnicion_') || key.startsWith('agua_') || key.startsWith('salsa_')) && !key.endsWith('Precio'))
        .filter(key => pedido[key]) 
        .map(key => {
            const precio = pedido[`${key}Precio`] || 0;
            const label  = key.split('_')[0].charAt(0).toUpperCase() + key.split('_')[0].slice(1);
            const num    = parseInt(key.split('_')[1]) + 1;

            return CrearElemento('div', {
                classList: ['ticket-row', 'is-option'],
                children: [
                    CrearElemento('span', {
                        classList:   'ticket-row-name',
                        textContent: `${label} ${num}: ${pedido[key]}`
                    }),
                    CrearElemento('span', {
                        classList:   'ticket-row-price',
                        textContent: precio > 0 ? `+$${precio}` : 'incluido'
                    })
                ]
            });
        });

    return CrearElemento('div', {
        classList: 'ticket-wrapper',
        children: [

            /* PAPEL DEL TICKET */
            CrearElemento('div', {
                classList: 'ticket-paper',
                children: [
                    CrearElemento('div', {
                        classList: 'ticket-inner',
                        children: [

                            /* Top: marca + número */
                            CrearElemento('div', {
                                classList: 'ticket-top',
                                children: [
                                    CrearElemento('div', {
                                        classList:   'ticket-brand',
                                        textContent: 'BARRY POLLO'
                                    }),
                                    CrearElemento('div', {
                                        classList:   'ticket-subtitle',
                                        textContent: 'Pedido por WhatsApp'
                                    }),
                                    CrearElemento('div', {
                                        classList:   'ticket-order-num',
                                        textContent: orderNum
                                    })
                                ]
                            }),

                            /* Body: item principal + opciones + extras */
                            CrearElemento('div', {
                                classList: 'ticket-body',
                                children: [
                                    /* Item principal */
                                    CrearElemento('div', {
                                        classList: ['ticket-row', 'is-main'],
                                        children: [
                                            CrearElemento('span', {
                                                classList:   'ticket-row-name',
                                                textContent: pedido.nombre
                                            }),
                                            CrearElemento('span', {
                                                classList:   'ticket-row-price',
                                                textContent: `$${pedido.precio}`
                                            })
                                        ]
                                    }),

                                    /* Opciones seleccionadas */
                                    ...optionRows,

                                    /* Separador si hay extras */
                                    ...(extraRows.length > 0 ? [
                                        CrearElemento('hr', { classList: 'ticket-divider' }),
                                        ...extraRows
                                    ] : []),

                                    /* Sección de Dirección */
                                    CrearElemento('div', {
                                        classList: 'ticket-address-group',
                                        children: [
                                            CrearElemento('label', { 
                                                classList: 'ticket-address-label', 
                                                textContent: 'Dirección de Envío' 
                                            }),
                                            CrearElemento('textarea', {
                                                classList: 'ticket-address-input',
                                                placeholder: 'Calle, número, colonia y alguna referencia...',
                                                value: pedido.direccion || '',
                                                events: {
                                                    input: (e) => state.actualizar({ direccion: e.target.value })
                                                }
                                            })
                                        ]
                                    }),

                                    /* Total */
                                    CrearElemento('hr', { classList: 'ticket-divider' }),
                                    CrearElemento('div', {
                                        classList: 'ticket-total-row',
                                        children: [
                                            CrearElemento('div', {
                                                children: [
                                                    CrearElemento('div', {
                                                        classList:   'ticket-total-label',
                                                        textContent: 'Total estimado'
                                                    })
                                                ]
                                            }),
                                            CrearElemento('span', {
                                                classList:   'total-price',
                                                textContent: `$${pedido.total}`
                                            })
                                        ]
                                    }),
                                    CrearElemento('p', {
                                        classList:   'ticket-note',
                                        textContent: '* El precio puede variar al confirmar el pedido'
                                    })
                                ]
                            })
                        ]
                    }),

                    /* Footer con botones */
                    CrearElemento('div', {
                        classList: 'ticket-footer',
                        children: [
                            CrearElemento('button', {
                                classList: 'btn-whatsapp-order',
                                children: [
                                    CrearElemento('i', { classList: 'bx bxl-whatsapp' }),
                                    document.createTextNode(' Confirmar y Pedir')
                                ],
                                events: {
                                    click: () => {
                                        const addr = (pedido.direccion || '').trim();
                                        if (addr.length < 8) {
                                            showToast('Dirección requerida', 'Por favor ingresa una dirección de entrega válida antes de pedir.', 'warning');
                                            
                                            // Efecto visual de error en el input
                                            const input = document.querySelector('.ticket-address-input');
                                            if (input) {
                                                input.classList.add('has-error');
                                                setTimeout(() => input.classList.remove('has-error'), 1000);
                                                input.focus();
                                            }
                                            return;
                                        }
                                        window.open(generateWhatsAppLink(), '_blank');
                                    }
                                }
                            }),
                            CrearElemento('button', {
                                classList: 'btn-clear-ticket',
                                children: [
                                    CrearElemento('i', { classList: 'iconoir-trash' }),
                                    document.createTextNode(' Limpiar')
                                ],
                                events: {
                                    click: (e) => {
                                        e.stopPropagation();
                                        state.limpiar();
                                    }
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });
};

/* ============================================================
   REVIEW CARD
   ============================================================ */
export const renderReview = (review) => {
    /* Inicial del nombre para el avatar */
    const initial = review.nombre.charAt(0).toUpperCase();

    return CrearElemento('div', {
        classList: 'review-card',
        children: [
            CrearElemento('div', {
                classList: 'review-header',
                children: [
                    CrearElemento('div', {
                        classList:   'review-avatar',
                        textContent: initial
                    }),
                    CrearElemento('div', {
                        classList: 'review-meta',
                        children: [
                            CrearElemento('div', {
                                classList:   'review-name',
                                textContent: review.nombre
                            }),
                            CrearElemento('div', {
                                classList:   'review-date',
                                textContent: review.fecha
                            })
                        ]
                    })
                ]
            }),
            CrearElemento('div', {
                classList: 'review-stars',
                children:  renderStars(review.puntuacion)
            }),
            CrearElemento('p', {
                classList:   'review-text',
                textContent: `"${review.texto}"`
            })
        ]
    });
};
