/**
 * Barry Pollo — data.js
 * Fuente central de datos: menú, combos, opciones, reseñas y config del negocio.
 *
 * RUTAS DE IMAGEN: sin espacios, todo en minúsculas con guiones.
 * Estructura de carpetas:
 *   /img/hero.png
 *   /img/sabores/barry-italiano.jpg
 *   /img/sabores/barry-tradicional.jpg
 *   /img/sabores/barry-coa.jpg
 *   /img/sabores/barrypotle.jpg
 *   /img/sabores/barrylantro.jpg
 *   /img/combos/combo-barrypollo.jpg
 *   /img/combos/combo-barrypack1.jpg
 *   /img/combos/combo-barrypack2.jpg
 *   /img/combos/combo-barrypack3.jpg
 */

export const MENU_SABORES = [
    {
        id:          "barryitaliano",
        nombre:      "Barry Italiano",
        precio:      185,
        descripcion: "Marinado premium en finas hierbas mediterráneas, ajo rostizado y un toque de aceite de oliva. La fusión más elegante de nuestro menú.",
        tiempo:      "25-30 min",
        tags:        ["Popular", "Sin Picante"],
        imagen:      "img/sabores/barry-italiano.png",
        mensajeWA:   "1 Barry Italiano"
    },
    {
        id:          "tradicional",
        nombre:      "El Tradicional",
        precio:      165,
        descripcion: "El clásico sabor cancunense: achiote de la casa, especias secretas y cocción lenta al carbón. El que nunca falla.",
        tiempo:      "20-25 min",
        tags:        ["Clásico", "El más pedido"],
        imagen:      "img/sabores/barry-tradicional.jpg",
        mensajeWA:   "1 Pollo Tradicional"
    },
    {
        id:          "barrycoa",
        nombre:      "El Barrycoa",
        precio:      195,
        descripcion: "Inspirado en la barbacoa: marinado en hoja de aguacate y chiles secos. Una explosión de sabor ahumado que no olvidarás.",
        tiempo:      "30-35 min",
        tags:        ["Ahumado", "Especialidad"],
        imagen:      "img/sabores/barry-coa.jpg",
        mensajeWA:   "1 Barrycoa"
    },
    {
        id:          "barrypotle",
        nombre:      "Barrypotle",
        precio:      175,
        descripcion: "Para los amantes del picante medio: crema de chipotle ahumado con un toque dulce de piloncillo. Cremoso e irresistible.",
        tiempo:      "20-25 min",
        tags:        ["Picante Medio", "Cremoso"],
        imagen:      "img/sabores/barrypotle.jpg",
        mensajeWA:   "1 Barrypotle"
    },
    {
        id:          "barrylantro",
        nombre:      "El Barrylantro",
        precio:      170,
        descripcion: "Refrescante marinado a base de cilantro fresco, limón verde y un toque de chile serrano. Perfecto para el calor de Cancún.",
        tiempo:      "20-25 min",
        tags:        ["Refrescante", "Cítrico"],
        imagen:      "img/sabores/barrylantro.jpg",
        mensajeWA:   "1 Barrylantro"
    }
];

export const COMBOS = [
    {
        id:      "barrypollo",
        nombre:  "Barry Pollo",
        precio:  245,
        incluye: "1 Pollo completo (sabor a elegir), Tortillas de maíz (15 pz) y Salsa habanera (3 oz).",
        imagen:  "img/combos/combo-barrypollo.jpg",
        config:  { guarniciones: 0, aguas: 0, salsas: 1 }
    },
    {
        id:      "barrypack1",
        nombre:  "Barry Pack 1",
        precio:  305,
        incluye: "1 Pollo completo, 1 Guarnición a elegir, 1 Litro de Agua Dawha, Tortillas y Salsa habanera.",
        imagen:  "img/combos/combo-barrypack1.jpg",
        config:  { guarniciones: 1, aguas: 1, salsas: 1 }
    },
    {
        id:      "barrypack2",
        nombre:  "Barry Pack 2",
        precio:  335,
        incluye: "1 Pollo completo, 2 Guarniciones a elegir, 1 Litro de Agua Dawha, Tortillas y Salsa habanera.",
        imagen:  "img/combos/combo-barrypack2.jpg",
        config:  { guarniciones: 2, aguas: 1, salsas: 1 }
    },
    {
        id:      "barrypack3",
        nombre:  "Barry Pack 3",
        precio:  415,
        incluye: "1 Pollo completo, 4 Guarniciones a elegir, 2 Litros de Agua Dawha, Tortillas y Salsa habanera.",
        imagen:  "img/combos/combo-barrypack3.jpg",
        config:  { guarniciones: 4, aguas: 2, salsas: 1 }
    }
];

export const OPCIONES = {
    guarniciones: [
        { id: "arroz",      nombre: "Arroz Rojo",         precioExtra: 0,  precioVenta: 35 },
        { id: "frijoles",   nombre: "Frijoles Charros",    precioExtra: 0,  precioVenta: 35 },
        { id: "espagueti",  nombre: "Espagueti Verde",     precioExtra: 15, precioVenta: 50 },
        { id: "papas",      nombre: "Papas Salteadas",     precioExtra: 20, precioVenta: 55 },
        { id: "ensalada",   nombre: "Ensalada Fresca",     precioExtra: 10, precioVenta: 45 }
    ],
    aguas: [
        { id: "jamaica",    nombre: "Jamaica",             precioExtra: 0,  precioVenta: 35 },
        { id: "horchata",   nombre: "Horchata",            precioExtra: 0,  precioVenta: 35 },
        { id: "limon",      nombre: "Limón con Chía",      precioExtra: 0,  precioVenta: 35 },
        { id: "tamarindo",  nombre: "Tamarindo",           precioExtra: 0,  precioVenta: 35 }
    ],
    salsas: [
        { id: "barrypotle", nombre: "Barrypotle (Chipotle)", precioExtra: 0,  precioVenta: 10 },
        { id: "verde",      nombre: "Verde Tatemada",        precioExtra: 0,  precioVenta: 10 },
        { id: "habanero",   nombre: "Habanero Barry (Extra Picante)", precioExtra: 5,  precioVenta: 15 },
        { id: "roja",       nombre: "Roja de la Casa",       precioExtra: 0,  precioVenta: 10 }
    ]
};

export const RESEÑAS = [
    {
        nombre:     "Carlos Méndez",
        puntuacion: 5,
        texto:      "El Barry Italiano es de otro mundo. La atención es rápida y el sabor muy premium para ser un puesto de pollos. Definitivamente el mejor de la Huayacán.",
        fecha:      "Hace 2 semanas"
    },
    {
        nombre:     "Sofía Rodríguez",
        puntuacion: 5,
        texto:      "El tradicional nunca defrauda. El pack familiar rinde muchísimo y las papas salteadas son obligatorias. Mi familia viene cada semana.",
        fecha:      "Hace 1 mes"
    },
    {
        nombre:     "Juan P. González",
        puntuacion: 5,
        texto:      "Excelente servicio en Cancún. El Barrycoa tiene ese sabor ahumado perfecto. El mejor pollo de la zona sin duda.",
        fecha:      "Hace 3 días"
    },
    {
        nombre:     "Brandon Pimentel",
        puntuacion: 5,
        texto:      "Tenía tiempo que quería probar algo diferente y de buena calidad. Me encanto la parte jugosa del pollo, que es muy suave, se desprende con facilidad y el sabor es otra cosa, probé el tradicional. Sin duda lo recomiendo. La atención excelente, con buena comunicación, fácil y rápida. Disfrute mucho esta experiencia.",
        fecha:      "Hace 7 meses"
    },
    {
        nombre:     "Camila Arzate",
        puntuacion: 5,
        texto:      "Es por mucho, el mejor pollo que me he comido en mi vida. Esta cocido a la perfección, el saborque tiene es simplemente espectacular. Las tortillas que te dan están de 10 también. Super recomendable y los precios bastante accesibles. Las personas que te atienden son muy amables también. Cuentan con servicio a domicilio sin costo.",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Jessica Beltran Wolfskill",
        puntuacion: 5,
        texto:      "Excelente opcion para llevar a casa los días que no te dan ganas o tiempo de cocinar. Nosotros pedimos el de pibil, con la salsa de habanero que es deliciosa y tortillas y cebollitas. Y en la casa servimos con frijoles bayos/ peruanos y aguacate en taquitos. Súper recomendado!",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Ruben Ferreira",
        puntuacion: 5,
        texto:      "Excelente variedad de pollos que manejan y todos muy ricos! Si no los han probado se lo están perdiendo!! 👌🏻👌🏻",
        fecha:      "Hace 1 mes"
    },
    {
        nombre:     "Mauricio Mañueco",
        puntuacion: 5,
        texto:      "Que locura de sabor!! Nunca publico nada, sin embargo esto vale la pena. Escogí el de habanero, está buenisisisimo preparado muy muy jugoso con un sabor extraordinario !",
        fecha:      "Hace 6 meses"
    },
    {
        nombre:     "Mauricio Mañueco",
        puntuacion: 5,
        texto:      "Muy rico el Barrypollo pibil 10/10 lo recomiendo…",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Nika Martz",
        puntuacion: 3,
        texto:      "Muy chiquitos los pollos. Sabor 6 de 10, les falta intensidad de sabor y más espesa la salsa porque queda muy caldoso y no se siente tanto el sabor. Las tortillas 10 de 10. El único que vale la pena probar es el chipotle y no pica.",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Sinai Sevilla",
        puntuacion: 5,
        texto:      "El pollo está deli, yo pido y las guarniciónes también, justo me gané 2 guarniciones en una dinámica que tuvieron, siempre es un excelente servicio! Todo excelente.",
        fecha:      "Hace 8 meses"
    },
    {
        nombre:     "Antonio Escalante",
        puntuacion: 5,
        texto:      "Es mi mejor opción cuando no me da tiempo de cocinar, no tienen nada de grasa y el de cilantro habanero no tiene abuela!!! 👌🏼👌🏼 100% recomendado. GRACIAS!!!",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Diego Soto",
        puntuacion: 5,
        texto:      "Los pollos están súper jugosos y suavecitos, las guarniciones, a mi parecer están excelentes, todo súper bien sazonado y con un gran sabor. Finalmente la chava que atiende es realmente súper amable y atenta 10/10",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Shantall y ludar Gonzalez",
        puntuacion: 5,
        texto:      "¡ Deliciosos ! Excelente sabor , jugosos , calidad . Súper recomendables . Buenísimos",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "CONSUELO VILLEGAS",
        puntuacion: 5,
        texto:      "Nunca había comido un pollo así, me encantó y súper rico. La verdad el sabor muy bueno, sin grasas extras y súper rendidos",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Nayeli Bielva Garcia",
        puntuacion: 5,
        texto:      "Increiblemente delicioso, me encanto el sabor tamarindo chipotle",
        fecha:      "Hace 9 meses"
    },
    {
        nombre:     "karina Aquino",
        puntuacion: 5,
        texto:      "Super deliciosos, excelente la atención y hay una gran variedad 😉 100% recomendables…",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Itzel Medina Pineda",
        puntuacion: 5,
        texto:      "Súper súper rico todos los sabores mi favorito el de habanero porque no pica nada y se puede saborear súper bien sin necesidad de enchilarse, siempre están súper atentos de lo que necesitas y súper amables los chicos",
        fecha:      "Hace 1 año"
    },
    {
        nombre:     "Claudette Cesar Ramirez",
        puntuacion: 5,
        texto:      "Muy recomendable el Barry pollo está súper suave y jugoso y de muy buen sabor y los complementos también están muy ricos, el espagueti les encantó a mis hijos .",
        fecha:      "Hace 1 año"
    }
];

export const NEGOCIO = {
    nombre:         "Barry Pollo",
    calificacion:   4.6,
    totalReseñas:   71,
    whatsapp:       "529982360704",
    instagram:      "barrypollo_cancun",
    googleMaps:     "https://maps.app.goo.gl/duVsKkPWHkPxDmGd8",
    direccion:      "Av. Huayacán, Cancún, Quintana Roo",
    horarios: {
        0: { apertura: 13, cierre: 17 }, // Domingo
        1: null,                        // Lunes (Cerrado)
        2: { apertura: 13, cierre: 17 }, // Martes
        3: { apertura: 13, cierre: 17 }, // Miércoles
        4: { apertura: 13, cierre: 17 }, // Jueves
        5: { apertura: 13, cierre: 17 }, // Viernes
        6: { apertura: 13, cierre: 17 }  // Sábado
    }
};
