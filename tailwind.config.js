/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'], // Tu fuente elegante
                sans: ['Inter', 'system-ui', 'sans-serif'],      // Tu fuente de lectura
            },
            colors: {
                // He centralizado aquí el "Oro MK Aromas"
                gold: {
                    300: '#E5D1A1', // Para fondos suaves
                    400: '#D4B87A', // Para bordes
                    500: '#C5A059', // TU COLOR PRINCIPAL (El que usas en botones)
                    600: '#A68545', // Para efectos hover (más oscuro)
                    900: '#4A3B1F', // Para textos oscuros dorados
                },
                stone: {
                    // Aseguramos tonos neutros elegantes para el fondo
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    900: '#1c1917',
                }
            },
            boxShadow: {
                'gold': '0 4px 14px 0 rgba(197, 160, 89, 0.39)', // Sombra dorada personalizada
            }
        },
    },
    plugins: [],
}
