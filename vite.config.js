import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * IMPORTANTE:
   * - Si despliegas en la URL de GitHub (https://MoggerSir.github.io/BARRYPOLLO/), usa: base: '/BARRYPOLLO/'
   * - Si despliegas en un DOMINIO PROPIO (ej: www.barrypollo.com), usa: base: '/'
   */
  base: '/BARRYPOLLO/',
  build: {
    outDir: 'dist',
  },
});
