# Barry Pollo - Landing Page Premium

## Descripcion del Negocio
Barry Pollo es una rosticeria de pollos asados al carbon de alta calidad ubicada en la Av. Huayacán en Cancún, Quintana Roo. Con una tradicion que se remonta a 1968, el negocio se distingue por su tecnica de coccion unica que incluye una capa de barro durante el proceso de ahumado, garantizando una jugosidad y sabor incomparables. Ofrece una variedad de marinados premium como el Barry Italiano, Barrycoa y Barrypotle, enfocandose en ingredientes frescos y procesos artesanales.

## El Proyecto: Landing Page
Este proyecto es una landing page de alto impacto diseñada para presentar la oferta gastronómica de Barry Pollo y facilitar la conversion directa a ventas. No es simplemente un sitio informativo, sino una herramienta de venta interactiva que permite a los usuarios configurar su pedido en tiempo real y enviarlo directamente al establecimiento a traves de WhatsApp.

### Caracteristicas Principales
- Menu Interactivo: Los usuarios pueden explorar sabores y packs familiares con detalles precisos.
- Ticket Digital Dinamico: Sistema de carrito de compras que genera un resumen visual del pedido (ticket) antes de la confirmacion.
- Integracion con WhatsApp: Generacion automatica de mensajes formateados con el detalle del pedido, extras y total estimado.
- Verificacion de Disponibilidad: Sistema que detecta la hora local para informar al usuario si el local se encuentra abierto o cerrado.
- Experiencia de Usuario (UX): Animaciones fluidas, diseño responsivo y una estetica visual detallada que refleja la calidad premium del producto.

## Stack Tecnologico
El proyecto se ha desarrollado buscando el maximo rendimiento y control sobre el diseño, evitando Frameworks pesados en favor de una arquitectura liviana y escalable.

- Herramienta de Construccion: Vite.
- Lenguajes: HTML5, CSS3 (Vanilla) y JavaScript (ES6+).
- Animaciones: GSAP (GreenSock Animation Platform) para interacciones complejas y AOS (Animate On Scroll) para revelaciones de secciones.
- Iconografia: Iconoir y Boxicons.
- Tipografia: Google Fonts (Inter).

## Arquitectura del Software
La aplicacion sigue un enfoque funcional y modular, separando claramente las responsabilidades en diferentes archivos de JavaScript:

### Estado de la Aplicacion (state.js)
Implementa un patron de diseño Observador (Observer Pattern) simplificado. El estado centraliza la informacion del pedido actual y el inventario, notificando automaticamente a los componentes de la interfaz cuando ocurre un cambio, asegurando que el Ticket Digital este siempre sincronizado.

### Capa de Datos (data.js)
Funciona como la unica fuente de verdad (Single Source of Truth). Contiene los objetos de configuracion para el menu, los combos, los precios de los extras y la informacion de contacto del negocio. Esto permite realizar cambios en el menu sin tocar la logica de la aplicacion.

### Logica de Negocio (logic.js)
Manejador de los calculos matematicos, validacion de horarios comerciales y la construccion recursiva de los strings para la API de WhatsApp.

### Renderizado del DOM (dom.js)
Modulo encargado de la generacion dinamica de elementos HTML. Utiliza una arquitectura basada en componentes funcionales que reciben datos y devuelven nodos del DOM listos para ser inyectados, manteniendo el archivo index.html limpio y facil de mantener.

## Instalacion y Uso
Para ejecutar este proyecto en un entorno local, asegurese de tener instalado Node.js.

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Para generar la version de produccion:
   ```bash
   npm run build
   ```

## Creditos
Desarrollado para Barry Pollo Cancun. Todos los derechos reservados.
