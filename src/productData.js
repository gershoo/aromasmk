// ═══════════════════════════════════════════════════════════════════
// DATOS DE PRODUCTOS — MK AROMAS (YVES D'ORGEVAL EDITION)
// ═══════════════════════════════════════════════════════════════════

export const INITIAL_PRODUCTS = [
    // ─── FEMENINO ───
    {
        id: "f_1",
        name: "Athenea Blossom", // Insp: Olympea Flora / Blossom
        category: "perfume",
        gender: "femenino",
        price: 65000,
        image: "https://i.ibb.co/YFR35655/athenea-blossom-3d.png",
        notes: { top: "Pimienta Rosa, Grosella", heart: "Rosa, Peonía", base: "Vainilla Salada, Pachulí" },
        intensity: 4,
        family: "Chipre Floral",
        occasion: "Día/Noche",
        duration: "10h+",
        isNew: true,
        tagline: "La fusión perfecta entre flores frescas y una estela de vainilla divina."
    },
    {
        id: "f_2",
        name: "Athenea Classique", // Insp: Olympea Clásica
        category: "perfume",
        gender: "femenino",
        price: 65000,
        image: "https://i.ibb.co/ccsgYh20/athenea.png",
        notes: { top: "Mandarina Verde, Jazmín", heart: "Vainilla Salada", base: "Ámbar Gris, Sándalo" },
        intensity: 4,
        family: "Oriental Fresco",
        occasion: "Todo el día",
        duration: "12h",
        tagline: "El aroma de una diosa moderna. Vainilla salada irresistible."
    },
    {
        id: "f_3",
        name: "Cribagge Rouge 540", // Insp: Baccarat Rouge 540
        category: "perfume",
        gender: "femenino", // A veces unisex, pero suele ir en femenino
        price: 65000,
        image: "https://i.ibb.co/cXX7FJmk/Chat-GPT-Image-11-ene-2026-03-11-07-p-m.png",
        notes: { top: "Azafrán, Jazmín", heart: "Amberwood", base: "Resina de Abeto, Cedro" },
        intensity: 5,
        family: "Oriental Floral",
        occasion: "Noche Especial",
        duration: "Eterna",
        isBestseller: true,
        isImportant: true,
        tagline: "Lujo líquido. Notas de azúcar quemada y maderas que dejan huella."
    },
    {
        id: "f_4",
        name: "My Lady Way Intense", // Insp: My Way Intense
        category: "perfume",
        gender: "femenino",
        price: 68000,
        image: "https://i.ibb.co/Dq3t09G/Chat-GPT-Image-16-feb-2026-11-53-01-a-m.png",
        notes: { top: "Flor de Azahar", heart: "Tuberosa Intensa", base: "Vainilla de Madagascar, Sándalo" },
        intensity: 4,
        family: "Floral Amaderado",
        occasion: "Otoño/Invierno",
        duration: "10h",
        tagline: "Un bouquet de flores blancas con un fondo cremoso y envolvente."
    },
    {
        id: "f_5",
        name: "My Lady Way Floral", // Insp: My Way Floral
        category: "perfume",
        gender: "femenino",
        price: 72000,
        image: "https://i.ibb.co/N27wHRLt/Chat-GPT-Image-16-feb-2026-11-54-12-a-m.png",
        notes: { top: "Mandarina Verde, Petitgrain", heart: "Neroli, Tuberosa", base: "Almizcle Blanco" },
        intensity: 3,
        family: "Floral Cítrico",
        occasion: "Primavera",
        duration: "8h",
        tagline: "Luminoso y radiante, como un paseo por un jardín de naranjos."
    },
    {
        id: "f_6",
        name: "My Lady Way", // Insp: My Way Clásico
        category: "perfume",
        gender: "femenino",
        price: 68000,
        image: "https://i.ibb.co/twdvzqsn/Chat-GPT-Image-16-feb-2026-11-55-25-a-m.png",
        notes: { top: "Bergamota", heart: "Tuberosa, Jazmín", base: "Cedro, Vainilla" },
        intensity: 3,
        family: "Floral",
        occasion: "Día",
        duration: "8h",
        tagline: "Elegante y aventurera. Flores blancas brillantes para el día a día."
    },
    {
        id: "f_7",
        name: "Quantum Black Pink", // Insp: Black XS for Her
        category: "perfume",
        gender: "femenino",
        price: 65000,
        image: "https://i.ibb.co/239WpJMg/Chat-GPT-Image-13-feb-2026-11-35-17-a-m.png",
        notes: { top: "Arándano, Pimienta Rosa", heart: "Rosa, Cacao", base: "Pachulí, Vainilla" },
        intensity: 4,
        family: "Amaderado Floral",
        occasion: "Noche/Fiesta",
        duration: "8h+",
        tagline: "Rebelde y dulce. Una mezcla adictiva de cacao y rosas oscuras."
    },
    {
        id: "f_8",
        name: "Candy", // Insp: Posiblemente Scandal o Prada Candy (Por notas parece Scandal)
        category: "perfume",
        gender: "femenino",
        price: 65000,
        image: "https://i.ibb.co/7qtFZfs/Chat-GPT-Image-27-dic-2025-16-13-33.png",
        notes: { top: "Naranja Sanguina", heart: "Miel, Gardenia", base: "Pachulí, Caramelo" },
        intensity: 5,
        family: "Chipre Gourmand",
        occasion: "Noche",
        tagline: "Escandalosamente dulce. Miel y flores para no pasar desapercibida."
    },
    {
        id: "f_9",
        name: "Night Treasure", // Insp: La Nuit Tresor
        category: "perfume",
        gender: "femenino",
        price: 75000,
        image: "https://i.ibb.co/Rkm54tTR/NIGHT-TREASURE.png",
        notes: { top: "Pera, Bergamota", heart: "Orquídea de Vainilla, Rosa Negra", base: "Praliné, Incienso" },
        intensity: 5,
        family: "Oriental Vainilla",
        occasion: "Cita Romántica",
        duration: "12h+",
        isImportant: true,
        tagline: "La pócima del amor. Un gourmand afrodisíaco y nocturno."
    },
    {
        id: "f_10",
        name: "Midnight Noir", // Insp: Black Opium
        category: "perfume",
        gender: "femenino",
        price: 72000,
        image: "https://i.ibb.co/1Y8y89R9/Chat-GPT-Image-17-dic-2025-11-03-43-p-m.png",
        notes: { top: "Pera, Pimienta Rosa", heart: "Café, Jazmín", base: "Vainilla, Cedro" },
        intensity: 5,
        family: "Oriental Vainilla",
        occasion: "Salida Nocturna",
        duration: "10h",
        tagline: "Adrenalina pura. Café negro y flores blancas vibrantes."
    },
    {
        id: "f_11",
        name: "Bad Girl Prestige", // Insp: Good Girl (Carolina Herrera) Gold/Supreme?
        category: "perfume",
        gender: "femenino",
        price: 69000,
        image: "https://i.ibb.co/FbnGPMZr/Chat-GPT-Image-17-dic-2025-11-01-26-p-m.png",
        notes: { top: "Almendra", heart: "Tuberosa, Jazmín Sambac", base: "Haba Tonka, Cacao" },
        intensity: 4,
        family: "Floral Oriental",
        occasion: "Invierno/Noche",
        duration: "10h+",
        isImportant: true,
        tagline: "Es bueno ser mala. Sensualidad audaz con notas de cacao."
    },
    {
        id: "f_12",
        name: "Bad Girl Privee", // Insp: Good Girl Legere o similar
        category: "perfume",
        gender: "femenino",
        price: 70000,
        image: "https://i.ibb.co/cc3zdLWm/Chat-GPT-Image-17-dic-2025-10-59-53-p-m.png",
        notes: { top: "Ylang-Ylang", heart: "Tuberosa Imperial", base: "Dulce de Leche, Tonka" },
        intensity: 5,
        family: "Oriental Floral",
        occasion: "Formal",
        duration: "10h+",
        tagline: "Sofisticación cremosa y dulce para mujeres con carácter."
    },
    {
        id: "f_13",
        name: "Bella Soleil Diamond", // Insp: La Vie Est Belle Soleil Cristal
        category: "perfume",
        gender: "femenino",
        price: 66000,
        image: "https://i.ibb.co/QFBM7g5P/Gemini-Generated-Image-8mtr528mtr528mtr.png",
        notes: { top: "Mandarina, Pimienta Rosa", heart: "Ylang-Ylang, Coco", base: "Vainilla, Iris" },
        intensity: 3,
        family: "Chipre Floral",
        occasion: "Verano",
        duration: "8h",
        tagline: "Sonrisa de cristal. Un aura solar de coco y vainilla."
    },
    {
        id: "f_14",
        name: "Millionare Lucestra", // Insp: Lady Million
        category: "perfume",
        gender: "femenino",
        price: 68000,
        image: "https://i.ibb.co/whmVrcPw/Chat-GPT-Image-27-dic-2025-20-36-49.png",
        notes: { top: "Frambuesa, Neroli", heart: "Azahar, Jazmín", base: "Miel, Pachulí" },
        intensity: 4,
        family: "Floral Frutal",
        occasion: "Fiesta",
        tagline: "Excesiva y deslumbrante. Flores blancas bañadas en miel."
    },

    // ─── UNISEX / NICHO (YVES D'ORGEVAL) ───
    {
        id: "u_1",
        name: "Erba Pura", // Insp: Xerjoff Erba Pura
        category: "perfume",
        gender: "unisex",
        price: 65000,
        image: "https://i.ibb.co/q3f15tTH/ERBA-PURA-3-D.png",
        notes: { top: "Naranja Siciliana, Limón", heart: "Frutas del Mediterráneo", base: "Almizcle Blanco, Vainilla" },
        intensity: 5,
        family: "Frutal Ámbar",
        occasion: "Verano/Día",
        duration: "Eterna (12h+)",
        isImportant: true,
        tagline: "Una explosión frutal inmensa. Frescura y dulzura en perfecta armonía."
    },
    {
        id: "u_2",
        name: "Turin 21", // Insp: Xerjoff Torino 21
        category: "perfume",
        gender: "unisex",
        price: 65000,
        image: "https://i.ibb.co/7JZsZVC4/TURIN-21-3-D.png",
        notes: { top: "Menta, Limón, Albahaca", heart: "Romero, Lavanda", base: "Almizcle" },
        intensity: 4,
        family: "Cítrico Aromático",
        occasion: "Deporte/Calor",
        duration: "8h+",
        isImportant: true,
        tagline: "Energía verde y mentolada. Refrescante como un cóctel italiano."
    },

    // ─── MASCULINO ───
    {
        id: "m_1",
        name: "YD12 Vip", // Insp: 212 VIP Men
        category: "perfume",
        gender: "masculino",
        price: 70000,
        image: "https://i.ibb.co/G4GhYW2N/Chat-GPT-Image-17-dic-2025-10-52-39-p-m.png",
        notes: { top: "Lima, Caviar, Pimienta", heart: "Vodka, Ginebra, Menta", base: "Ámbar, Cuero" },
        intensity: 5,
        family: "Oriental Amaderado",
        occasion: "Fiesta Exclusiva",
        duration: "10h+",
        isImportant: true,
        tagline: "El alma de la fiesta. Notas de vodka y lima para no pasar desapercibido."
    },
    {
        id: "m_2",
        name: "YD12", // Insp: 212 Men NYC
        category: "perfume",
        gender: "masculino",
        price: 70000,
        image: "https://i.ibb.co/Y7NxrwXq/Chat-GPT-Image-16-feb-2026-12-00-43-p-m.png",
        notes: { top: "Hierba Cortada, Cítricos", heart: "Gardenia, Jengibre", base: "Sándalo, Incienso" },
        intensity: 3,
        family: "Almizcle Amaderado",
        occasion: "Oficina/Día",
        duration: "8h",
        tagline: "El aroma de la ciudad. Fresco, limpio y magnético."
    },
    {
        id: "m_3",
        name: "YD12 Night Club", // Insp: 212 VIP Black? O Sexy Men?
        category: "perfume",
        gender: "masculino",
        price: 70000,
        image: "https://i.ibb.co/v6h8wKm9/Chat-GPT-Image-16-feb-2026-11-58-15-a-m.png",
        notes: { top: "Absenta, Anís", heart: "Lavanda", base: "Vainilla Negra, Almizcle" },
        intensity: 5,
        family: "Aromático Fougère",
        occasion: "Noche",
        duration: "10h+",
        tagline: "Intenso y adictivo. Diseñado para conquistar la noche."
    },
    {
        id: "m_4",
        name: "Optimus Black", // Insp: Invictus Victory? O One Million Prive?
        category: "perfume",
        gender: "masculino",
        price: 72000,
        image: "https://i.ibb.co/k6sdtDPz/Chat-GPT-Image-17-dic-2025-09-52-36-p-m.png",
        notes: { top: "Limón, Pimienta Rosa", heart: "Incienso, Lavanda", base: "Haba Tonka, Vainilla" },
        intensity: 5,
        family: "Oriental",
        occasion: "Invierno",
        duration: "12h+",
        isImportant: true,
        tagline: "Victoria extrema. Un choque entre frescura y sensualidad profunda."
    },
    {
        id: "m_5",
        name: "Victorius Aqua", // Insp: Invictus Aqua
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/RGqr0rmw/Chat-GPT-Image-4-ene-2026-17-24-52.png",
        notes: { top: "Yuzu, Pomelo", heart: "Agua de Mar", base: "Madera de Guayaco" },
        intensity: 4,
        family: "Acuático Amaderado",
        occasion: "Verano/Gym",
        duration: "8h",
        tagline: "La fuerza del océano. Frescura helada para hombres activos."
    },
    {
        id: "m_6",
        name: "Grand Victorus", // Insp: Invictus Clásico
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/FL4nM61x/Chat-GPT-Image-16-feb-2026-12-12-33-p-m.png",
        notes: { top: "Notas Marinas, Pomelo", heart: "Laurel, Jazmín", base: "Madera de Guayaco, Ámbar" },
        intensity: 4,
        family: "Amaderado Acuático",
        occasion: "Todo el día",
        duration: "10h",
        tagline: "El aroma del triunfo. Fresco, vibrante y masculino."
    },
    {
        id: "m_7",
        name: "Victorius Intense", // Insp: Invictus Intense
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/yFVdmfzG/Chat-GPT-Image-16-feb-2026-12-04-27-p-m.png",
        notes: { top: "Pimienta Negra, Flor de Naranjo", heart: "Laurel, Whisky", base: "Ámbar Gris, Sal" },
        intensity: 5,
        family: "Oriental Amaderado",
        occasion: "Noche",
        duration: "10h+",
        isImportant: true,
        tagline: "Más fuerte, más sensual. Un trago de whisky con fondo salado."
    },
    {
        id: "m_8",
        name: "Black YD L'Elixir", // Insp: YSL Y Elixir o similar
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/hJYwxzY2/Chat-GPT-Image-17-dic-2025-19-18-32.png",
        notes: { top: "Lavanda", heart: "Geranio", base: "Incienso, Oud" },
        intensity: 5,
        family: "Fougère Oscuro",
        occasion: "Noche Elegante",
        duration: "10h+",
        isImportant: true,
        tagline: "Misterioso y profundo. La máxima concentración de elegancia."
    },
    {
        id: "m_9",
        name: "Millionare Prive", // Insp: 1 Million Prive / Royal
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/tj3G0MW/Chat-GPT-Image-16-feb-2026-12-19-20-p-m.png",
        notes: { top: "Mandarina, Canela", heart: "Tabaco, Mirra", base: "Haba Tonka, Pachulí" },
        intensity: 5,
        family: "Oriental Amaderado",
        occasion: "Invierno/Cita",
        duration: "12h",
        tagline: "Opulencia pura. Tabaco y especias para un hombre con clase."
    },
    {
        id: "m_10",
        name: "Adventure", // Insp: Creed Aventus
        category: "perfume",
        gender: "masculino",
        price: 67000,
        image: "https://i.ibb.co/5ggCk2RQ/Chat-GPT-Image-27-dic-2025-20-10-37.png",
        notes: { top: "Piña, Bergamota", heart: "Abedul, Pachulí", base: "Almizcle, Musgo de Roble" },
        intensity: 4,
        family: "Chipre Frutal",
        occasion: "Oficina/Líder",
        duration: "10h",
        tagline: "El rey de los perfumes. Notas ahumadas y piña para el éxito."
    },
    {
        id: "m_11",
        name: "Wildest", // Insp: Dior Sauvage
        category: "perfume",
        gender: "masculino",
        price: 66000,
        image: "https://i.ibb.co/vCrzcHFL/Chat-GPT-Image-28-dic-2025-03-51-00.png",
        notes: { top: "Bergamota de Calabria", heart: "Pimienta, Lavanda", base: "Ambroxan, Cedro" },
        intensity: 5,
        family: "Fougère Aromático",
        occasion: "Todo Terreno",
        duration: "12h+",
        tagline: "Radicalmente fresco. Crudo, noble y extremadamente popular."
    },
    {
        id: "m_12",
        name: "Pure YD", // Insp: Pure XS
        category: "perfume",
        gender: "masculino",
        price: 65000,
        image: "https://i.ibb.co/jZGzRd69/Chat-GPT-Image-27-dic-2025-20-40-33.png",
        notes: { top: "Jengibre, Acorde Verde", heart: "Vainilla, Canela", base: "Mirra, Azúcar" },
        intensity: 4,
        family: "Oriental Fresco",
        occasion: "Cita",
        duration: "8h+",
        tagline: "Frío y caliente a la vez. Un magnetismo incontrolable."
    },

    // ─── VELAS & HOME (Estos suelen ser creaciones propias, descripciones evocativas) ───
    {
        id: "h_1",
        name: "Pimienta Home",
        category: "home-deco",
        price: 42000,
        image: "https://i.ibb.co/twC78DrK/Chat-GPT-Image-2-feb-2026-12-43-38.png",
        notes: { top: "Pimienta Rosa", heart: "Madera de Guayaco", base: "Vainilla Ahumada" },
        intensity: 4,
        family: "Especiado",
        occasion: "Hogar",
        duration: "40h",
        tagline: "Personalidad para tus espacios. Un aroma vibrante y sofisticado."
    },
    {
        id: "v_2",
        name: "Golden Vanilla",
        category: "vela",
        price: 32000,
        image: "https://i.ibb.co/5W40m8b0/Chat-GPT-Image-15-ene-2026-07-37-03-a-m.png",
        notes: { top: "Vainilla Bourbon", heart: "Caramelo", base: "Haba Tonka" },
        intensity: 4,
        family: "Gourmand",
        occasion: "Relax",
        duration: "40h",
        tagline: "Como un postre francés. Calidez dulce que abraza tu hogar."
    },
    {
        id: "v_3",
        name: "Jardín de Peonías",
        category: "vela",
        price: 32000,
        image: "https://i.ibb.co/fYrzwjxs/Chat-GPT-Image-15-ene-2026-07-35-50-a-m.png",
        notes: { top: "Peonía", heart: "Rosas Blancas", base: "Almizcle" },
        intensity: 3,
        family: "Floral",
        occasion: "Primavera",
        duration: "40h",
        tagline: "Femineidad y frescura. Transforma tu ambiente en un jardín florecido."
    },
    {
        id: "v_7",
        name: "Midnight Amber",
        category: "vela",
        price: 34000,
        image: "https://i.ibb.co/Q7SKyJN5/Chat-GPT-Image-15-ene-2026-08-32-37-a-m.png",
        notes: { top: "Bergamota", heart: "Ámbar", base: "Sándalo" },
        intensity: 5,
        family: "Oriental",
        occasion: "Noche",
        duration: "40h",
        tagline: "Elegancia nocturna. Notas profundas para momentos de introspección."
    },
];