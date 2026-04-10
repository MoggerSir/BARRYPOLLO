/**
 * Barry Pollo — heroRandomizer.js
 * Sistema de rotación ponderada de imágenes para el Hero.
 */

const HERO_IMAGES = [
    { src: 'img/randomicer-Hero/BarryCombo2.jpg', weight: 5, id: 'barrypack2' },
    { src: 'img/randomicer-Hero/Combo_Barrypollo.jpg', weight: 4, id: 'barrypollo' },
    { src: 'img/randomicer-Hero/Barrycombo1.jpg', weight: 3, id: 'barrypack1' },
    { src: 'img/randomicer-Hero/BarryCombo3.jpg', weight: 2, id: 'barrypack3' },
    { src: 'img/randomicer-Hero/hero.png', weight: 1, id: 'menu' }
];

let currentIndex = -1;

/**
 * Selecciona una imagen basada en pesos (prioridades)
 */
const selectWeightedRandom = () => {
    const totalWeight = HERO_IMAGES.reduce((sum, img) => sum + img.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < HERO_IMAGES.length; i++) {
        if (random < HERO_IMAGES[i].weight) {
            return { img: HERO_IMAGES[i], index: i };
        }
        random -= HERO_IMAGES[i].weight;
    }
    return { img: HERO_IMAGES[0], index: 0 };
};

/**
 * Realiza la transición de imagen con GSAP
 */
const rotateHeroImage = () => {
    const heroImageContainer = document.querySelector('.hero-image');
    const heroAnchor = heroImageContainer?.querySelector('a');
    const imgEl = heroImageContainer?.querySelector('img');
    
    if (!imgEl || !heroAnchor) return;

    const { img, index } = selectWeightedRandom();
    
    // Evitar repetir la misma imagen consecutivamente si es posible
    if (index === currentIndex && HERO_IMAGES.length > 1) {
        return rotateHeroImage();
    }
    currentIndex = index;

    // Transición suave
    gsap.to(imgEl, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        onComplete: () => {
            imgEl.src = img.src;
            heroAnchor.href = `#${img.id}`;
            
            gsap.to(imgEl, {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power2.out'
            });
        }
    });
};

/**
 * Inicializa el randomizer
 */
export const initHeroRandomizer = (intervalMs = 6000) => {
    // Primera rotación después de un tiempo para no chocar con la animación inicial del hero
    setTimeout(() => {
        setInterval(rotateHeroImage, intervalMs);
    }, 4000);
};
