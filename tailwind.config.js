/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alias "gta" -> Complex UI (opción 2 con más contraste)
        gta: {
          black:    'rgba(16, 13, 19, 0.92)', // panel-base (fondo principal)
          graphite: '#111116',             // superficie elevada
          dark:     '#16161c',             // tono intermedio oscuro
          medium:   '#1e1f27',             // bordes/sombras suaves
          light:    '#E0E0E0',             // neutral claro (texto secundario)
          white:    '#FFFFFF',

          // Marca
          blue:     '#3C0081',             // morado principal (usamos la key 'blue' sin romper llamadas)
          green:    '#5f10c7ff',             // acento/degradados (secundario)
          gold:     '#FFD65A',             // highlight
          purple:   '#3C0081',             // refuerza identidad

          // Compatibilidad (deja de usarlos si no hacen falta)
          salmon:   '#F09E71',
          olive:    '#A0A0A0',             // neutral-dark
        }
      },
      fontFamily: {
        pricedown: ['Pricedown', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'progress': 'progress 2s ease-out',
        'float-smooth': 'floatSmooth 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        progress: { '0%': { width: '0%' }, '100%': { width: '100%' } },
        floatSmooth: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'gta-gradient': 'linear-gradient(135deg, #0a0a0c 2%, #16161c 100%)',
        'loading-gradient': 'linear-gradient(90deg, transparent, rgba(10, 4, 24, 0.84), transparent)',
      },
      boxShadow: {
        gta: '0 4px 30px rgba(0, 0, 0, 0.76)',
        'gta-hover': '0 8px 40px rgba(0, 0, 0, 0.94)',
        card: '0 2px 20px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
