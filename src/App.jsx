import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag, X, Menu, ArrowRight, ArrowLeft, Star, MapPin,
  Minus, Plus, Sparkles, Send, Edit3, Save, RotateCcw,
  Image as ImageIcon, Trash2, Check, Loader, Truck, CreditCard,
  User, ShieldCheck, Heart, Search, Filter, Share2, ChevronUp,
  Instagram, Facebook, Mail, Phone, Clock, Gift, Package,
  Home, Droplets, Wind, Flame, CheckCircle, AlertCircle, Info,
  Layers, ChevronDown, ExternalLink, Award, Leaf, Shield, MessageCircle, Percent, Quote, Eye
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyCWT-mFXHXR0DsnnsBQpI7tzdjrgN--NDg",
  authDomain: "aromas-mk-d9c23.firebaseapp.com",
  projectId: "aromas-mk-d9c23",
  storageBucket: "aromas-mk-d9c23.firebasestorage.app",
  messagingSenderId: "272432853135",
  appId: "1:272432853135:web:1a5d0b26ece0537d9180fa",
  measurementId: "G-HNPQQXZE58"
};

let app, analytics, db;
try {
  app = initializeApp(firebaseConfig);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

const formatPrice = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(num);
};

const generateOrderId = () => {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MK-${timestamp}-${random}`;
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9+\-\s()]{8,20}$/.test(phone);

const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    try { logEvent(analytics, eventName, params); } catch (e) { }
  }
};

const PROMO_CODES = {
  "BIENVENIDO10": { discount: 0.10, type: "percentage", minPurchase: 0 },
  "ENVIOGRATIS": { discount: 0, type: "freeShipping", minPurchase: 50000 },
  "MK20OFF": { discount: 0.20, type: "percentage", minPurchase: 100000 }
};

// ═══════════════════════════════════════════════════════════════════════════
// 📦 DATOS INICIALES
// ═══════════════════════════════════════════════════════════════════════════

const INITIAL_IMAGES = {
  hero: "https://i.ibb.co/5XhktwJQ/Chat-GPT-Image-22-ene-2026-18-57-58.png",
  texture: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
  p1: "https://i.ibb.co/twC78DrK/Chat-GPT-Image-2-feb-2026-12-43-38.png",
  p2: "https://i.ibb.co/8DtzSRpm/Chat-GPT-Image-2-feb-2026-12-36-22.png",
  p3: "https://i.ibb.co/3y181mxv/Chat-GPT-Image-2-feb-2026-12-06-46.png",
  p4: "https://i.ibb.co/sdVHMgp2/Chat-GPT-Image-2-feb-2026-11-54-42.png",
  p5: "https://i.ibb.co/rGyGhbXW/Chat-GPT-Image-15-ene-2026-04-48-26-a-m.png",
  p6: "https://i.ibb.co/5XXmmBRM/Chat-GPT-Image-15-ene-2026-04-46-23-a-m.png",
  p7: "https://i.ibb.co/F4VVQVGy/Chat-GPT-Image-15-ene-2026-02-46-15-a-m.png",
  p8: "https://i.ibb.co/Xrc370rK/Chat-GPT-Image-14-ene-2026-11-50-55-a-m.png",
  workshop: "https://i.ibb.co/Xrc370rK/Chat-GPT-Image-14-ene-2026-11-50-55-a-m.png",
};

const INITIAL_BRAND = {
  name: "MK AROMAS",
  tagline: "Perfumería independiente. Sin fórmulas prestadas.",
  phone: "5492920674938",
  email: "contacto@mkaromas.com",
  instagramUrl: "https://www.instagram.com/aromasmk_/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61580521685802",
  location: "Viedma, Patagonia",
  workingHours: "Lun - Vie: 10hs a 18hs",
  heroTitle: "Perfumería de autor, desde la Patagonia.",
  heroSubtitle: "Desarrollamos fragancias para el hogar y la piel con materias primas seleccionadas, producción limitada y control total del proceso.",
  heroTagline: "Patagonian Atelier",
  philosophyTitle: "Sobre",
  philosophySubtitle: "Nosotros",
  philosophyText1: "MK Aromas es una casa de fragancias independiente con base en la Patagonia argentina. Desde nuestro taller familiar, desarrollamos y producimos cada fórmula de manera íntegra.",
  philosophyText2: "Trabajamos con aceites esenciales de grado cosmético y bases vegetales de origen certificado. No tercerizamos. No replicamos. Creamos fragancias originales para espacios y para la piel."
};

const INITIAL_PRODUCTS = [
  { id: "prod_1", name: "Pimienta Rosa & Cuero", category: "home-spray", price: 42000, originalPrice: 48000, shortDesc: "Misterio nocturno.", longDesc: "Una versión ambiental de nuestro clásico. Captura la elegancia del silencio, combinando maderas profundas con un toque especiado.", notes: { top: "Pimienta Rosa", heart: "Cuero Negro", base: "Sándalo" }, image: INITIAL_IMAGES.p1, vibe: "Intenso • Nocturno", inStock: true, isNew: false, isFeatured: true, rating: 4.9, reviewCount: 47, size: "250ml", ingredients: ["Alcohol vegetal", "Esencias", "Agua destilada"], tags: ["intenso", "nocturno", "cuero"] },
  { id: "prod_2", name: "Bergamota & Vainilla", category: "home-spray", price: 42000, shortDesc: "Calidez dorada.", longDesc: "Un aroma solar que evoca los atardeceres eternos del sur. Notas resinosas ideales para rociar sobre cortinas y sillones.", notes: { top: "Bergamota", heart: "Ámbar Gris", base: "Vainilla" }, image: INITIAL_IMAGES.p2, vibe: "Cálido • Sensual", inStock: true, isNew: true, rating: 4.8, reviewCount: 32, size: "250ml", tags: ["calido", "vainilla"] },
  { id: "prod_3", name: "Limón, Naranja y Jengibre", category: "home-spray", price: 42000, shortDesc: "Frescura cristalina.", longDesc: "Transforma tu hogar con la pureza de los cítricos y la chispa del jengibre. Claridad mental inmediata.", notes: { top: "Limón", heart: "Jengibre", base: "Naranja" }, image: INITIAL_IMAGES.p3, vibe: "Fresco • Vital", inStock: true, rating: 4.7, reviewCount: 28, size: "250ml", tags: ["fresco", "citrico"] },
  { id: "prod_4", name: "Cedro & Pino Ahumado", category: "home-spray", price: 42000, shortDesc: "Aroma de cabaña.", longDesc: "El crepitar de la madera y el humo dulce crean el refugio perfecto contra el viento exterior.", notes: { top: "Pino", heart: "Cedro", base: "Humo Dulce" }, image: INITIAL_IMAGES.p4, vibe: "Acogedor • Nostálgico", inStock: true, isFeatured: true, rating: 4.9, reviewCount: 56, size: "250ml", tags: ["amaderado", "invierno"] },
  { id: "prod_7", name: "Sándalo & Cardamomo", category: "home-spray", price: 42000, shortDesc: "Firma olfativa.", longDesc: "La cremosidad del sándalo se encuentra con la aridez de la tierra. Un aroma con carácter y presencia para recibir visitas.", notes: { top: "Cardamomo", heart: "Violeta", base: "Sándalo" }, image: INITIAL_IMAGES.p7, vibe: "Iconico • Sofisticado", inStock: false, rating: 5.0, reviewCount: 89, size: "250ml", tags: ["oriental", "especiado"] },
  { id: "perf_1", name: "Sheik", category: "perfume", price: 68000, shortDesc: "Opulencia oriental.", longDesc: "Una fragancia que impone presencia. Notas ricas y envolventes que evocan la realeza del desierto con un giro contemporáneo.", notes: { top: "Oud", heart: "Rosa Damascena", base: "Ámbar" }, image: "https://i.ibb.co/DPqBp5zK/SHEIK-3D.png", vibe: "Majestuoso • Intenso", inStock: true, isFeatured: true, rating: 4.9, reviewCount: 67, size: "50ml EDP", tags: ["oud", "lujo"] },
  { id: "perf_2", name: "Amira", category: "perfume", price: 65000, shortDesc: "Princesa de flores.", longDesc: "Delicada pero persistente. Un bouquet floral blanco con toques frutales que iluminan cualquier estancia.", notes: { top: "Jazmín", heart: "Durazno", base: "Almizcle" }, image: "https://i.ibb.co/PzvpcKMH/amira-3d.png", vibe: "Femenino • Radiante", inStock: true, isNew: true, rating: 4.8, reviewCount: 45, size: "50ml EDP", tags: ["floral", "femenino"] },
  { id: "perf_3", name: "The Night's Beast", category: "perfume", price: 72000, shortDesc: "Instinto salvaje.", longDesc: "Para quienes no temen destacar. Un aroma animalíco y cuero que domina la noche con su estela inolvidable.", notes: { top: "Pimienta Negra", heart: "Cuero Ruso", base: "Vetiver" }, image: "https://i.ibb.co/5WXbsRh8/the-nights-beast-3d.png", vibe: "Salvaje • Oscuro", inStock: true, isFeatured: true, rating: 4.9, reviewCount: 78, size: "50ml EDP", tags: ["cuero", "noche"] },
  { id: "perf_4", name: "Gold Out", category: "perfume", price: 68000, shortDesc: "Brillo de oro.", longDesc: "Lujoso y extravagante. Una composición que brilla con notas cítricas y metálicas sobre un fondo cálido.", notes: { top: "Azafrán", heart: "Naranja Sanguina", base: "Maderas Doradas" }, image: "https://i.ibb.co/WWykzLsk/GOLD-OUT-3-D.png", vibe: "Lujoso • Brillante", inStock: true, rating: 4.7, reviewCount: 34, size: "50ml EDP", tags: ["citrico", "brillante"] },
  { id: "perf_7", name: "Imperial Oud", category: "perfume", price: 75000, shortDesc: "Madera de reyes.", longDesc: "Profundo, ahumado y eterno. El Oud en su máxima expresión, acompañado de especias exóticas.", notes: { top: "Incienso", heart: "Oud Camboyano", base: "Pachulí" }, image: "https://i.ibb.co/VYDYtqTT/Chat-GPT-Image-28-dic-2025-03-51-00.png", vibe: "Solemne • Místico", inStock: true, rating: 5.0, reviewCount: 92, size: "50ml EDP", tags: ["oud", "mistico"] },
  { id: "perf_50", name: "Bosque Austral", category: "perfume", price: 65000, shortDesc: "Eau de Parfum", longDesc: "Una composición amaderada de carácter contemplativo. Evoca el interior de un bosque nativo después de la lluvia.", notes: { top: "Bergamota", heart: "Ciprés de la Patagonia", base: "Cedro atlas" }, image: "https://i.ibb.co/S76v80Dz/Gemini-Generated-Image-zhtmodzhtmodzhtm.png", vibe: "Contemplativo • Nativo", inStock: true, isNew: true, rating: 4.8, reviewCount: 15, size: "50ml EDP", tags: ["bosque", "nativo"] }
];

const DEFAULT_BEST_SELLERS_IDS = ["prod_1", "prod_2", "prod_4", "perf_3", "perf_1", "perf_7"];

const TESTIMONIALS_DATA = [
  { id: 1, name: "Valentina Ricci", location: "Bariloche, Río Negro", text: "El aroma de 'Bosque Austral' me transporta inmediatamente a mis caminatas por el Llao Llao. Una calidad impresionante.", rating: 5, product: "Bosque Austral" },
  { id: 2, name: "Martín Echeverría", location: "Recoleta, CABA", text: "Buscaba algo sofisticado para mi oficina y el difusor de 'Tabaco & Maderas' superó mis expectativas. El packaging es un 10.", rating: 5, product: "Home Spray Tabaco" },
  { id: 3, name: "Sofía M.", location: "Viedma, Río Negro", text: "Orgullosa de que tengamos este nivel de perfumería en nuestra ciudad. 'Sheik' es intenso y dura todo el día.", rating: 5, product: "Sheik" },
  { id: 4, name: "Camila O.", location: "Las Grutas, Río Negro", text: "La frescura de 'Limón & Jengibre' cambió la energía de mi casa. Llega rapidísimo y la presentación es hermosa.", rating: 5, product: "Home Spray Limón" },
  { id: 5, name: "Lucas F.", location: "Neuquén Capital", text: "Imperial Oud es una joya. No tiene nada que envidiarle a marcas importadas. Excelente atención.", rating: 5, product: "Imperial Oud" },
  { id: 6, name: "Ana Laura G.", location: "Cipolletti, Río Negro", text: "Compré el set de velas para regalar y quedé súper bien. El aroma se siente incluso apagada.", rating: 5, product: "Vela Santal" },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 CONTEXT PROVIDERS
// ═══════════════════════════════════════════════════════════════════════════

const ToastContext = createContext();
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, duration);
  }, []);
  const removeToast = useCallback((id) => { setToasts(prev => prev.filter(t => t.id !== id)); }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div key={toast.id} layout initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }} className={`pointer-events-auto p-4 rounded-lg shadow-xl flex items-start gap-3 ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : toast.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-white border border-stone-200'}`}>
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
              <p className="text-sm text-stone-800 flex-1 font-medium">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-stone-400 hover:text-stone-600"><X className="w-4 h-4" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => useContext(ToastContext);

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const GlowButton = React.memo(({ children, onClick, className = '', disabled = false, loading = false }) => (
  <button onClick={onClick} disabled={disabled || loading} className={`relative px-8 py-4 bg-[#0A0A0A] text-white uppercase tracking-[0.2em] text-[11px] font-bold overflow-hidden group transition-all hover:bg-[#C5A059] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
    {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : <span className="relative z-10 flex items-center justify-center gap-3">{children}</span>}
    <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors" />
  </button>
));

const MagneticButton = ({ children, onClick, variant = 'primary', className = '' }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 ${variant === 'outline' ? 'border border-stone-300 text-stone-900 hover:border-[#0A0A0A]' : 'bg-[#0A0A0A] text-white hover:bg-[#C5A059]'} ${className}`}>
    <span className="flex items-center gap-2">{children}</span>
  </button>
);

const GoldDiamond = ({ size = 8, className = '' }) => (
  <div className={`rotate-45 bg-[#C5A059] ${className}`} style={{ width: size, height: size }} />
);

const LuxuryDivider = ({ variant = 'center' }) => (
  <div className={`flex items-center gap-4 my-8 ${variant === 'center' ? 'justify-center' : ''}`}>
    <div className="h-[1px] w-12 bg-[#C5A059]/30" />
    <GoldDiamond size={6} />
    <div className="h-[1px] w-12 bg-[#C5A059]/30" />
  </div>
);

const EditableText = ({ value, onSave, className, tag = 'div', isEditing }) => {
  const [tempValue, setTempValue] = useState(value);
  useEffect(() => setTempValue(value), [value]);
  // Blindaje contra objetos
  if (typeof value === 'object' && value !== null) return null;
  if (!isEditing) { const Tag = tag; return <Tag className={className}>{value}</Tag>; }
  return <input value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => onSave(tempValue)} className={`${className} border-b-2 border-[#C5A059] bg-yellow-50/50 outline-none min-w-[50px]`} />;
};

const EditableImage = ({ src, onSave, alt, className, isEditing }) => {
  const handleEdit = (e) => { e.stopPropagation(); const newUrl = prompt("URL:", src); if (newUrl) onSave(newUrl); };
  return (
    <div className={`relative ${className} group`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      {isEditing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-20" onClick={handleEdit}><ImageIcon className="w-6 h-6 text-stone-900" /></div>}
    </div>
  );
};

const EditableArea = ({ value, onSave, className, isEditing }) => {
  const [tempValue, setTempValue] = useState(value);
  useEffect(() => setTempValue(value), [value]);
  // Blindaje contra objetos
  if (typeof value === 'object' && value !== null) return null;
  if (!isEditing) return <p className={className}>{value}</p>;
  return <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} onBlur={() => onSave(tempValue)} className={`${className} border-2 border-[#C5A059] bg-yellow-50/50 outline-none w-full min-h-[100px] p-2 rounded`} autoFocus />;
};

const Badge = ({ children, variant = 'default' }) => {
  const variants = { default: 'bg-stone-100 text-stone-600', new: 'bg-[#C5A059] text-white', featured: 'bg-[#0A0A0A] text-white', outOfStock: 'bg-stone-200 text-stone-500' };
  return <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-widest px-3 py-1 ${variants[variant]}`}>{children}</span>;
};

const RatingStars = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex text-[#C5A059]">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'fill-current' : 'text-stone-200'}`} />)}</div>
    {count && <span className="text-[10px] text-stone-400">({count})</span>}
  </div>
);

const NoiseOverlay = () => <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03] mix-blend-overlay"><svg className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#noise)" /></svg></div>;

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-[#C5A059] origin-left z-50" style={{ scaleX: scrollYProgress }} />;
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 left-6 z-40 p-3 bg-white/80 backdrop-blur border border-stone-200 rounded-full shadow-lg hover:bg-[#C5A059] hover:text-white transition-colors">
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Marquee = () => (
  <div className="w-full bg-stone-100 py-4 overflow-hidden border-t border-b border-stone-200">
    <motion.div className="flex whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-12 mx-6 opacity-40">
          {["Hecho a mano en Viedma", "Ingredientes Naturales", "Cruelty Free", "Envíos a todo el país", "Producción Limitada"].map((text, j) => (
            <React.Fragment key={j}>
              <span className="text-xs uppercase tracking-[0.3em] font-medium font-body">{text}</span>
              <span className="w-1 h-1 bg-stone-900 rounded-full" />
            </React.Fragment>
          ))}
        </div>
      ))}
    </motion.div>
  </div>
);

const SectionTitle = ({ title, subtitle, align = 'center', isEditing, onSaveTitle, onSaveSubtitle, light = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className={`mb-16 md:mb-24 ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'}`}
  >
    {subtitle && (
      <span className={`block text-[#C5A059] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 md:mb-6 font-body`}>
        <EditableText value={subtitle} onSave={onSaveSubtitle} isEditing={isEditing} tag="span" />
      </span>
    )}
    <h2 className={`text-4xl md:text-7xl font-brand ${light ? 'text-white' : 'text-stone-900'} tracking-wide leading-tight`}>
      <EditableText value={title} onSave={onSaveTitle} isEditing={isEditing} tag="span" />
    </h2>
  </motion.div>
);

const LoadingScreen = ({ onComplete, brandName }) => {
  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex items-center justify-center flex-col" initial={{ opacity: 1 }} animate={{ opacity: 0, pointerEvents: "none" }} transition={{ delay: 2.5, duration: 1.5, ease: "easeInOut" }} onAnimationComplete={onComplete}>
      <div className="overflow-hidden relative">
        <motion.h1 className="text-5xl md:text-8xl font-brand text-stone-900 tracking-widest" initial={{ y: 150 }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>{brandName}</motion.h1>
      </div>
      <div className="mt-8 overflow-hidden w-64 h-[1px] bg-stone-200 relative"><motion.div className="absolute top-0 left-0 h-full bg-stone-900" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }} /></div>
      <motion.p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-stone-500 font-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>Viedma • Patagonia</motion.p>
    </motion.div>
  );
};

const Button = React.memo(({ children, onClick, variant = 'primary', className = '', disabled = false, type = "button" }) => {
  const baseStyle = "px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-500 ease-out flex items-center justify-center gap-3 relative overflow-hidden group font-body disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-stone-900 text-stone-50 border border-stone-900 hover:bg-[#C5A059] hover:border-[#C5A059]",
    outline: "bg-transparent text-stone-900 border border-stone-900 hover:text-stone-50 hover:bg-stone-900",
    ghost: "text-stone-600 hover:text-stone-900 bg-transparent"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// 💳 LUXURY CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

const LuxuryCheckoutStep = ({ number, title, isActive, isCompleted, onClick }) => (
  <button onClick={onClick} disabled={!isCompleted && !isActive} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-70 hover:opacity-100' : 'opacity-30'}`}>
    <motion.div className={`relative w-12 h-12 flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-[#C5A059] border-[#C5A059] text-white' : isActive ? 'border-[#C5A059] text-[#C5A059]' : 'border-stone-300 text-stone-400'}`} animate={isActive ? { boxShadow: ['0 0 0 0 rgba(197,160,89,0)', '0 0 0 10px rgba(197,160,89,0.1)', '0 0 0 0 rgba(197,160,89,0)'] } : {}} transition={{ duration: 2, repeat: Infinity }}>
      {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-brand text-lg">{number}</span>}
    </motion.div>
    <div className="text-left hidden sm:block"><span className={`text-[10px] uppercase tracking-widest block ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`}>Paso {number}</span><span className={`font-medium ${isActive ? 'text-[#0A0A0A]' : 'text-stone-500'}`}>{title}</span></div>
  </button>
);

const LuxuryInput = ({ label, name, type = 'text', value, onChange, error, placeholder, icon: Icon, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">{label} {required && <span className="text-[#C5A059]">*</span>}</label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isFocused ? 'text-[#C5A059]' : 'text-stone-400'}`} />}
        <input type={type} name={name} value={value} onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={placeholder} className={`w-full px-5 py-4 bg-white border-2 text-[#0A0A0A] outline-none transition-all ${Icon ? 'pl-12' : ''} ${error ? 'border-red-300 bg-red-50/50' : isFocused ? 'border-[#C5A059]' : 'border-stone-200'}`} />
      </div>
      {error && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</span>}
    </div>
  );
};

const LuxuryRadioCard = ({ name, value, checked, onChange, icon: Icon, title, description, price }) => (
  <label className={`relative flex items-start gap-4 p-5 cursor-pointer border-2 transition-all ${checked ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-stone-200 hover:border-stone-300 bg-white'}`}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <div className={`relative w-6 h-6 rounded-full border-2 flex-shrink-0 ${checked ? 'border-[#C5A059]' : 'border-stone-300'}`}><div className={`absolute inset-1 rounded-full bg-[#C5A059] transform transition-transform ${checked ? 'scale-100' : 'scale-0'}`} /></div>
    <div className={`w-12 h-12 flex items-center justify-center transition-colors ${checked ? 'bg-[#C5A059] text-white' : 'bg-stone-100 text-stone-500'}`}><Icon className="w-6 h-6" /></div>
    <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className={`font-medium ${checked ? 'text-[#0A0A0A]' : 'text-stone-700'}`}>{title}</span>{price !== undefined && <span className={`font-price text-lg ${checked ? 'text-[#C5A059]' : 'text-stone-500'}`}>{price === 0 ? 'Gratis' : formatPrice(price)}</span>}</div><span className="text-xs text-stone-500 mt-1 block">{description}</span></div>
  </label>
);

const LuxuryOrderSummary = ({ items, subtotal, discount, shipping, total, promoCode }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-stone-50 border border-stone-200 sticky top-24">
      <div className="p-6 border-b border-stone-100"><button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between"><div className="flex items-center gap-3"><ShoppingBag className="w-5 h-5 text-[#C5A059]" /><span className="font-brand text-xl">Tu Pedido</span><span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-full">{items.reduce((a, i) => a + i.qty, 0)}</span></div><ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${expanded ? 'rotate-180' : ''}`} /></button></div>
      <AnimatePresence>{expanded && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">{items.map((item) => (<div key={item.id} className="flex gap-4"><div className="relative w-16 h-20 bg-stone-100 flex-shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /><span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center rounded-full">{item.qty}</span></div><div className="flex-1 min-w-0"><h4 className="font-medium text-sm text-[#0A0A0A] truncate">{item.name}</h4><p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">{item.category}</p><span className="font-price text-base mt-2 block">{formatPrice(item.price * item.qty)}</span></div></div>))}</div></motion.div>}</AnimatePresence>
      <div className="p-6 border-t border-stone-100 space-y-3"><div className="flex justify-between text-sm"><span className="text-stone-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-sm text-green-600"><span className="flex items-center gap-2"><Percent className="w-4 h-4" /> Descuento</span><span>-{formatPrice(discount)}</span></div>}<div className="flex justify-between text-sm"><span className="text-stone-500">Envío</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Gratis' : shipping === null ? 'A calcular' : formatPrice(shipping)}</span></div><div className="pt-4 border-t border-stone-200"><div className="flex justify-between items-end"><span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Total</span><div className="text-right"><span className="font-price text-3xl text-[#0A0A0A] block">{formatPrice(total)}</span></div></div></div></div>
      <div className="px-6 pb-6"><div className="p-4 bg-white border border-stone-100 flex items-center gap-4"><ShieldCheck className="w-8 h-8 text-[#C5A059]" /><div><span className="text-xs font-bold text-[#0A0A0A] block">Compra 100% Segura</span><span className="text-[10px] text-stone-500">Datos encriptados</span></div></div></div>
    </div>
  );
};

const LuxuryCheckout = ({ isOpen, onClose, cartItems, subtotal, discount = 0, promoCode, brandPhone, onSuccess }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', city: '', zip: '', province: '', shipping: 'andreani', payment: 'transferencia', notes: '', gift: false });

  const shippingOptions = [{ id: 'standard', title: 'Envío Estándar', description: '5-7 días • Andreani', price: subtotal >= 100000 ? 0 : 8500, icon: Truck }, { id: 'pickup', title: 'Retiro en Atelier', description: 'Viedma', price: 0, icon: Home }];
  const paymentOptions = [{ id: 'transfer', title: 'Transferencia', description: '5% OFF adicional', icon: CreditCard }, { id: 'cash', title: 'Efectivo', description: 'Contra entrega', icon: Package }];

  const getShippingPrice = () => shippingOptions.find(o => o.id === formData.shipping)?.price || 0;
  const total = subtotal - discount + getShippingPrice();

  const validate = (s) => {
    const errs = {};
    if (s === 1) { if (!formData.email) errs.email = 'Requerido'; if (!formData.phone) errs.phone = 'Requerido'; }
    if (s === 2) { if (!formData.firstName) errs.firstName = 'Requerido'; if (!formData.address) errs.address = 'Requerido'; if (!formData.city) errs.city = 'Requerido'; if (!formData.zipCode) errs.zipCode = 'Requerido'; }
    setErrors(errs); return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate(step)) { setStep(p => Math.min(p + 1, 3)); } };
  const handleSubmit = async () => {
    if (!validate(3)) return;
    setIsSubmitting(true);
    try {
      const orderId = `MK-${Date.now().toString().slice(-6)}`;
      // Build WhatsApp msg
      const itemsList = cartItems.map(i => `• (${i.qty}) ${i.name}`).join('\n');
      let msg = `*PEDIDO #${orderId}* 🛍️\n\n*Cliente:* ${formData.name}\n*Envío:* ${formData.address}, ${formData.city}\n\n*Items:*\n${itemsList}\n\n*Total: ${formatPrice(total)}*`;
      window.open(`https://wa.me/${brandPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      onSuccess(); onClose();
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-[80]" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-4 md:inset-8 lg:inset-12 z-[90] overflow-hidden bg-[#FDFCF8] flex flex-col lg:flex-row shadow-2xl">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
            <div className="flex gap-4 items-center"><button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full"><ArrowLeft size={20} /></button><h1 className="font-brand text-2xl">Checkout</h1></div>
            <div className="flex gap-8">
              {[1, 2, 3].map(n => <LuxuryCheckoutStep key={n} number={n} title={n === 1 ? 'Contacto' : n === 2 ? 'Envío' : 'Pago'} isActive={step === n} isCompleted={step > n} onClick={() => step > n && setStep(n)} />)}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl">Contacto</h2>
                <LuxuryInput label="Email" name="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} error={errors.email} icon={Mail} required />
                <LuxuryInput label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} error={errors.phone} icon={Phone} required />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl">Envío</h2>
                <div className="grid grid-cols-2 gap-4"><LuxuryInput label="Nombre" name="firstName" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} error={errors.firstName} required /><LuxuryInput label="Apellido" name="lastName" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} error={errors.lastName} required /></div>
                <LuxuryInput label="Dirección" name="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} error={errors.address} icon={MapPin} required />
                <div className="grid grid-cols-2 gap-4"><LuxuryInput label="Ciudad" name="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} error={errors.city} required /><LuxuryInput label="CP" name="zip" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} required /></div>
                <LuxuryDivider />
                <h3 className="font-display text-xl">Método</h3>
                <div className="space-y-3">{shippingOptions.map(opt => <LuxuryRadioCard key={opt.id} name="shipping" value={opt.id} checked={formData.shipping === opt.id} onChange={e => setFormData({ ...formData, shipping: e.target.value })} icon={opt.icon} title={opt.title} description={opt.description} price={opt.price} />)}</div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl">Pago</h2>
                <div className="space-y-3">{paymentOptions.map(opt => <LuxuryRadioCard key={opt.id} name="payment" value={opt.id} checked={formData.payment === opt.id} onChange={e => setFormData({ ...formData, payment: e.target.value })} icon={opt.icon} title={opt.title} description={opt.description} />)}</div>
                <LuxuryInput label="Notas (Opcional)" name="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            )}
          </div>
          <div className="p-6 border-t border-stone-100 bg-white flex justify-end gap-4">
            {step < 3 ? <GlowButton onClick={handleNext}>Continuar <ArrowRight size={16} /></GlowButton> : <GlowButton onClick={handleSubmit} className="!bg-[#25D366]">{isSubmitting ? <Loader className="animate-spin" /> : 'Confirmar Pedido'}</GlowButton>}
          </div>
        </div>
        <div className="hidden lg:block w-[400px] border-l border-stone-200 overflow-y-auto bg-stone-50">
          <LuxuryOrderSummary items={cartItems} subtotal={subtotal} discount={discount} shipping={getShippingPrice()} total={total} promoCode={promoCode} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ LUXURY TESTIMONIALS & REVIEWS
// ═══════════════════════════════════════════════════════════════════════════

const LuxuryTestimonials = () => {
  // Data duplicada para loop infinito suave
  const reviews = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

  return (
    <section className="py-32 bg-[#0A0A0A] relative overflow-hidden" id="testimonios">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10 mb-20">
        <SectionTitle title="Voces del Atelier" subtitle="Experiencias Reales" align="center" isEditing={false} light={true} />
      </div>

      {/* Moving Track */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-20 pointer-events-none" />

        <div className="flex gap-8 w-max animate-scroll hover:pause-scroll">
          {reviews.map((t, i) => (
            <div key={`${t.id}-${i}`} className="w-[400px] flex-shrink-0 group">
              <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-sm hover:bg-white/10 transition-all duration-500 hover:border-[#C5A059]/50 relative h-full flex flex-col justify-between">
                <Quote className="absolute -top-4 -right-4 w-12 h-12 text-[#C5A059]/20 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} className={`fill-[#C5A059] text-[#C5A059] ${j >= t.rating ? 'opacity-30' : ''}`} />
                        ))}
                      </div>
                      <h4 className="text-white font-display text-lg">{t.name}</h4>
                      <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                        <MapPin size={10} className="text-[#C5A059]" /> {t.location}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center text-white font-serif italic border border-white/10">
                      {t.name.charAt(0)}
                    </div>
                  </div>

                  <p className="text-white/80 font-light leading-relaxed mb-6 italic min-h-[80px]">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1"><CheckCircle size={10} /> Compra Verificada</span>
                  <span className="text-xs text-white/50">{t.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                }
                .hover\\:pause-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

      <div className="text-center mt-20">
        <p className="text-white/40 text-sm mb-6 uppercase tracking-widest">Únete a más de 500 clientes satisfechos</p>
      </div>
    </section>
  );
};

const LuxuryInstagramFeed = () => {
  const posts = [1, 2, 3, 4, 5, 6].map(i => `https://images.unsplash.com/photo-${1550000000000 + i}?w=400&h=400&fit=crop`);
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center"><Instagram className="text-white" size={32} /></div>
          <h2 className="font-brand text-4xl text-white mb-4">Síguenos en Instagram</h2>
          <a href="https://instagram.com/mkaromas" target="_blank" className="text-[#C5A059] hover:underline flex items-center justify-center gap-2">@mkaromas <ExternalLink size={14} /></a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {posts.map((src, i) => (
            <motion.div key={i} className="aspect-square relative group overflow-hidden cursor-pointer" whileHover={{ scale: 1.05, zIndex: 10 }}>
              <img src={src} className="w-full h-full object-cover" alt="Instagram" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4"><Heart size={20} /><MessageCircle size={20} /></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 SEARCH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SearchModal = ({ isOpen, onClose, products, onSelectProduct }) => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (term.length < 2) { setResults([]); return; }
    const lower = term.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.includes(lower) ||
      p.tags?.some(t => t.includes(lower))
    );
    setResults(filtered.slice(0, 5));
  }, [term, products]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-0 left-0 right-0 z-[100] p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="relative border-b border-stone-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input ref={inputRef} value={term} onChange={e => setTerm(e.target.value)} placeholder="Buscar aromas, notas, productos..." className="w-full pl-12 pr-12 py-5 text-lg outline-none" />
            <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-5 h-5 text-stone-400" /></button>
          </div>
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map(p => (
                <button key={p.id} onClick={() => { onSelectProduct(p); onClose(); }} className="w-full flex items-center gap-4 p-4 hover:bg-stone-50 text-left border-b border-stone-50 last:border-0">
                  <img src={p.image} className="w-12 h-12 object-cover rounded bg-stone-100" alt="" />
                  <div>
                    <h4 className="font-display text-stone-900">{p.name}</h4>
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{p.category}</span>
                  </div>
                  <span className="ml-auto font-price text-stone-600">{formatPrice(p.price)}</span>
                </button>
              ))}
            </div>
          )}
          {term.length > 1 && results.length === 0 && <div className="p-8 text-center text-stone-400">No encontramos coincidencias</div>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 💬 CONCIERGE CHAT
// ═══════════════════════════════════════════════════════════════════════════

const simulateConciergeResponse = async (userMessage) => {
  await new Promise(r => setTimeout(r, 1200));
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('precio')) return "Nuestros Home Sprays están a $42.000 y los Perfumes varían entre $65.000 y $75.000. Tenemos cuotas sin interés.";
  if (lowerMsg.includes('envío') || lowerMsg.includes('envio')) return "Hacemos envíos a todo el país. Es GRATIS si tu compra supera los $50.000.";
  if (lowerMsg.includes('fresco') || lowerMsg.includes('verano')) return "Para notas frescas, te recomiendo 'Limón, Naranja y Jengibre' (Home) o 'Turin 21' (Perfume).";
  if (lowerMsg.includes('intenso') || lowerMsg.includes('noche')) return "'Sheik' y 'The Night's Beast' son nuestras fragancias más intensas y duraderas.";
  if (lowerMsg.includes('hola')) return "¡Hola! Bienvenido al Atelier MK. ¿Buscas algo para regalar o para ti?";

  return "Entiendo. En MK Aromas nos enfocamos en experiencias olfativas únicas. ¿Prefieres notas amaderadas, florales o cítricas?";
};

const ConciergeChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([{ role: 'system', text: 'Bienvenido al Concierge Digital de MK Aromas. ¿Buscas algo fresco para el día o intenso para la noche?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async (txt = input) => {
    if (!txt.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    setLoading(true);
    const response = await simulateConciergeResponse(txt);
    setMessages(prev => [...prev, { role: 'system', text: response }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="fixed bottom-24 right-4 md:right-10 w-[calc(100vw-2rem)] md:w-96 h-[500px] bg-white shadow-2xl z-50 border border-stone-200 flex flex-col rounded-lg overflow-hidden">
      <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center"><Sparkles size={14} /></div>
          <div><span className="text-sm font-bold uppercase tracking-widest block">MK Concierge</span><span className="text-[10px] text-stone-400">En línea</span></div>
        </div>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFCF8]" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 text-sm rounded-lg ${m.role === 'user' ? 'bg-stone-800 text-white rounded-br-sm' : 'bg-white border border-stone-100 shadow-sm text-stone-700 rounded-bl-sm'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="flex gap-1 p-2"><span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" /> <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-100" /> <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-200" /></div>}
      </div>
      <div className="p-2 flex gap-2 overflow-x-auto bg-stone-50 border-t border-stone-100">
        {['Precios', 'Envíos', 'Fragancias Frescas'].map(tag => (
          <button key={tag} onClick={() => handleSend(tag)} className="flex-shrink-0 px-3 py-1 bg-white border border-stone-200 rounded-full text-[10px] uppercase tracking-wider hover:border-[#C5A059] transition-colors">{tag}</button>
        ))}
      </div>
      <div className="p-3 border-t border-stone-100 flex gap-2 bg-white">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Escribe tu consulta..." className="flex-1 text-sm bg-stone-50 p-2 outline-none border border-stone-200 focus:border-[#C5A059] rounded" />
        <button onClick={() => handleSend()} disabled={!input.trim()} className="bg-stone-900 text-white p-2 hover:bg-[#C5A059] rounded disabled:opacity-50"><Send size={16} /></button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🛒 CART ITEM & PROMO
// ═══════════════════════════════════════════════════════════════════════════

const CartItem = React.memo(React.forwardRef(({ item, onUpdateQty, onRemove }, ref) => (
  <motion.div ref={ref} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 group border-b border-stone-100 pb-4 mb-4">
    <div className="w-20 h-24 bg-stone-100 flex-shrink-0 overflow-hidden relative rounded-sm">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 flex flex-col justify-between py-1">
      <div>
        <div className="flex justify-between items-start">
          <h4 className="font-display text-sm leading-tight text-stone-900 line-clamp-1">{item.name}</h4>
          <button onClick={onRemove} className="text-stone-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">{item.category} • {item.size}</p>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex items-center border border-stone-200 rounded-sm">
          <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:bg-stone-100" disabled={item.qty <= 1}><Minus size={12} /></button>
          <span className="px-2 text-xs font-medium w-6 text-center">{item.qty}</span>
          <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:bg-stone-100"><Plus size={12} /></button>
        </div>
        <span className="font-price text-lg italic text-stone-800">{formatPrice(item.price * item.qty)}</span>
      </div>
    </div>
  </motion.div>
)));

const PromoCodeInput = ({ onApply, appliedCode }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const promo = PROMO_CODES[code.toUpperCase()];
    if (promo) {
      onApply(code.toUpperCase(), promo);
      setCode('');
      setMsg({ type: 'success', text: 'Código aplicado' });
    } else {
      setMsg({ type: 'error', text: 'Código inválido' });
    }
    setLoading(false);
  };

  if (appliedCode) return (
    <div className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-100 mb-4">
      <span className="text-xs text-green-700 font-medium flex items-center gap-2"><CheckCircle size={12} /> {appliedCode}</span>
      <button onClick={() => onApply(null, null)} className="text-[10px] text-red-500 hover:underline">Quitar</button>
    </div>
  );

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Código de descuento" className="flex-1 text-xs p-2 bg-stone-50 border border-stone-200 rounded focus:border-[#C5A059] outline-none" />
        <button onClick={handleApply} disabled={loading || !code} className="px-3 py-2 bg-stone-200 text-stone-600 text-[10px] font-bold uppercase rounded hover:bg-stone-300 disabled:opacity-50">
          {loading ? <Loader size={12} className="animate-spin" /> : 'Aplicar'}
        </button>
      </div>
      {msg && <p className={`text-[10px] mt-1 ${msg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{msg.text}</p>}
    </div>
  );
};

const CheckoutForm = ({ cartItems, total, onClose, brandPhone, promoCode, promoData }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', city: '', zip: '', province: '', shipping: 'andreani', payment: 'transferencia', notes: '', gift: false });

  const discountAmount = promoData ? (promoData.type === 'percentage' ? total * promoData.discount : 0) : 0;
  const finalTotal = total - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setIsSubmitting(true);
    try {
      const orderId = generateOrderId();
      await addDoc(collection(db, "orders"), {
        orderId, items: cartItems, subtotal: total, discount: discountAmount, total: finalTotal,
        customer: formData, createdAt: serverTimestamp(), status: 'pending'
      });

      const itemsList = cartItems.map(item => `• (${item.qty}) ${item.name}`).join('\n');
      let message = `*PEDIDO WEB #${orderId}* 🛍️\n\n*Cliente:*\n👤 ${formData.name}\n📱 ${formData.phone}\n📍 ${formData.address}, ${formData.city} (${formData.province})\n\n*Pedido:*\n${itemsList}\n\n`;
      if (discountAmount > 0) message += `Subtotal: ${formatPrice(total)}\nDescuento (${promoCode}): -${formatPrice(discountAmount)}\n`;
      message += `*TOTAL: ${formatPrice(finalTotal)}*\n\n*Entrega:* ${formData.shipping.toUpperCase()}\n*Pago:* ${formData.payment.toUpperCase()}\n`;
      if (formData.gift) message += `🎁 *PARA REGALO*\n`;
      if (formData.notes) message += `📝 Nota: ${formData.notes}`;

      const whatsappUrl = `https://wa.me/${brandPhone}?text=${encodeURIComponent(message)}`;
      localStorage.setItem('mk_user_data', JSON.stringify(formData));

      window.open(whatsappUrl, '_blank');
      addToast('Pedido generado con éxito', 'success');
      onClose(true);
    } catch (error) {
      console.error(error);
      addToast('Error al procesar el pedido', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('mk_user_data');
    if (saved) setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-stone-100 bg-stone-50">
        <h3 className="font-brand text-2xl text-stone-900">Checkout</h3>
        <div className="flex gap-2 mt-4"><div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-[#C5A059]' : 'bg-stone-200'}`} /><div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-[#C5A059]' : 'bg-stone-200'}`} /></div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {step === 1 ? (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold text-stone-500 flex items-center gap-2"><User size={14} /> Datos</h4>
            <input required name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre Completo" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" />
            <div className="grid grid-cols-2 gap-3"><input required name="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="WhatsApp" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" /><input name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" /></div>

            <h4 className="text-xs uppercase font-bold text-stone-500 mt-6 flex items-center gap-2"><MapPin size={14} /> Envío</h4>
            <input required name="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Dirección" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" />
            <div className="grid grid-cols-3 gap-3"><input required name="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Ciudad" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" /><input required name="province" value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} placeholder="Provincia" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" /><input required name="zip" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} placeholder="CP" className="w-full p-3 border border-stone-200 rounded text-sm outline-none focus:border-[#C5A059]" /></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-stone-50 p-4 rounded text-sm text-stone-600 border border-stone-100"><strong>Enviar a:</strong> {formData.name}, {formData.address}, {formData.city}</div>
            <div>
              <h4 className="text-xs uppercase font-bold text-stone-500 mb-3 flex items-center gap-2"><Truck size={14} /> Método</h4>
              {['andreani', 'retiro'].map(m => (
                <label key={m} className={`flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer ${formData.shipping === m ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-stone-200'}`}>
                  <input type="radio" name="shipping" value={m} checked={formData.shipping === m} onChange={e => setFormData({ ...formData, shipping: e.target.value })} className="accent-[#C5A059]" />
                  <span className="text-sm font-medium uppercase">{m}</span>
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold text-stone-500 mb-3 flex items-center gap-2"><CreditCard size={14} /> Pago</h4>
              {['transferencia', 'efectivo'].map(m => (
                <label key={m} className={`flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer ${formData.payment === m ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-stone-200'}`}>
                  <input type="radio" name="payment" value={m} checked={formData.payment === m} onChange={e => setFormData({ ...formData, payment: e.target.value })} className="accent-[#C5A059]" />
                  <span className="text-sm font-medium uppercase">{m}</span>
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-stone-50 p-3 rounded"><input type="checkbox" checked={formData.gift} onChange={e => setFormData({ ...formData, gift: e.target.checked })} className="accent-[#C5A059]" /> <span className="text-sm flex items-center gap-2"><Gift size={14} /> Es para regalo</span></label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Notas adicionales..." className="w-full p-3 border border-stone-200 rounded text-sm h-20 resize-none outline-none focus:border-[#C5A059]" />
          </div>
        )}

        <div className="pt-4 mt-auto">
          <div className="flex justify-between items-center mb-2 text-sm text-stone-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
          {discountAmount > 0 && <div className="flex justify-between items-center mb-4 text-sm text-green-600"><span>Descuento</span><span>-{formatPrice(discountAmount)}</span></div>}
          <div className="flex justify-between items-center mb-6 text-lg font-bold text-stone-900"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>

          <div className="flex gap-3">
            {step === 2 && <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Volver</Button>}
            <Button type="submit" disabled={isSubmitting} className="flex-1 w-full bg-[#25D366] border-[#25D366] hover:bg-[#128C7E] hover:border-[#128C7E] text-white">
              {isSubmitting ? <Loader className="animate-spin w-4 h-4" /> : (step === 1 ? 'Continuar' : 'Finalizar en WhatsApp')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onClearCart, brandPhone }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [promoData, setPromoData] = useState(null);

  const total = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const discount = promoData ? (promoData.type === 'percentage' ? total * promoData.discount : 0) : 0;

  useEffect(() => { if (!isOpen) setShowCheckout(false); }, [isOpen]);

  const handleCheckoutSuccess = (success) => {
    if (success) { onClearCart(); setPromoCode(null); setPromoData(null); }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FDFCF8] z-[70] shadow-2xl flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            {showCheckout ? (
              <CheckoutForm cartItems={cartItems} total={total} onClose={handleCheckoutSuccess} brandPhone={brandPhone} promoCode={promoCode} promoData={promoData} />
            ) : (
              <>
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
                  <h3 className="font-brand text-2xl text-stone-900">Tu Bolsa ({cartItems.reduce((a, c) => a + c.qty, 0)})</h3>
                  <button onClick={onClose}><X className="w-6 h-6 text-stone-500 hover:text-stone-900" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 pb-20">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-10" />
                      <p className="text-sm font-bold uppercase tracking-wider mb-2">Bolsa vacía</p>
                      <Button variant="outline" onClick={onClose}>Ir a la Tienda</Button>
                    </div>
                  ) : (
                    cartItems.map((item) => <CartItem key={item.id} item={item} onUpdateQty={onUpdateQty} onRemove={() => onRemove(item.id)} />)
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-stone-100 bg-stone-50">
                    <PromoCodeInput onApply={(code, data) => { setPromoCode(code); setPromoData(data); }} appliedCode={promoCode} />
                    <div className="flex justify-between items-end mb-2 text-sm text-stone-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                    {discount > 0 && <div className="flex justify-between items-end mb-4 text-sm text-green-600"><span>Descuento</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between items-end mb-6 font-bold text-xl text-stone-900"><span>Total</span><span>{formatPrice(total - discount)}</span></div>
                    <Button onClick={() => setShowCheckout(true)} className="w-full">Iniciar Compra</Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧭 COMPONENTES DE PAGINA (LAYOUT)
// ═══════════════════════════════════════════════════════════════════════════

const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
  const links = [{ l: 'Inicio', v: 'top' }, { l: 'Perfumes', v: 'perfume' }, { l: 'Home Spray', v: 'home-spray' }, { l: 'Velas', v: 'vela' }, { l: 'Nosotros', v: 'nosotros' }];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="fixed inset-0 z-[80] bg-[#FDFCF8] flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <span className="font-brand text-2xl">MK AROMAS</span>
            <button onClick={onClose}><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-6">
            {links.map(link => (
              <button key={link.l} onClick={() => { onNavigate(link.v); onClose(); }} className="text-3xl font-display text-left text-stone-800 hover:text-[#C5A059] transition-colors">{link.l}</button>
            ))}
          </div>
          <div className="mt-auto pt-8 border-t border-stone-200 text-sm text-stone-500 flex flex-col gap-4">
            <span className="flex items-center gap-2"><MapPin size={16} /> Viedma, Patagonia</span>
            <span className="flex items-center gap-2"><Clock size={16} /> Lun-Vie 10-18hs</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ brand, isEditing, onUpdateBrand, cartCount, onOpenCart, onOpenSearch, wishlistCount, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ease-[0.16,1,0.3,1] ${scrolled ? 'bg-[#FDFCF8]/90 backdrop-blur-xl py-3 border-b border-stone-200/50' : 'bg-transparent py-6'}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenu(true)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><Menu className="w-5 h-5 text-stone-900" /></button>
            <button onClick={onOpenSearch} className="p-2 hover:bg-stone-100 rounded-full transition-colors hidden md:block"><Search className="w-5 h-5 text-stone-900" /></button>
          </div>
          <div className="text-center absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => onNavigate('top')}>
            <h1 className={`font-brand tracking-[0.1em] text-stone-900 transition-all duration-700 ${scrolled ? 'text-xl' : 'text-3xl'}`}>
              <EditableText value={brand.name} onSave={(val) => onUpdateBrand('name', val)} isEditing={isEditing} tag="span" />
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onOpenSearch} className="md:hidden p-2"><Search className="w-5 h-5" /></button>
            <button className="relative p-2 hover:bg-stone-100 rounded-full transition-colors hidden md:block">
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-900'}`} />
            </button>
            <button onClick={onOpenCart} className="relative p-2 group">
              <ShoppingBag className="w-5 h-5 text-stone-900 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-in zoom-in">{cartCount}</span>}
            </button>
          </div>
        </div>
      </motion.nav>
      <MobileMenu isOpen={mobileMenu} onClose={() => setMobileMenu(false)} onNavigate={onNavigate} />
    </>
  );
};

const Hero = ({ onNavigate, brand, images, isEditing, onUpdateBrand, onUpdateImage }) => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yText = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative h-[95vh] w-full overflow-hidden flex items-center justify-center bg-[#FDFCF8]">
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-stone-900/30 z-10 pointer-events-none" />
        <img src={images.hero} className="w-full h-full object-cover" alt="Hero" loading="eager" />
      </motion.div>
      <motion.div style={{ y: yText }} className="relative z-20 text-center px-6 max-w-5xl mx-auto text-white">
        <motion.span initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="block text-xs md:text-sm tracking-[0.5em] uppercase font-bold text-stone-200 mb-6">
          <EditableText value={brand.heroTagline} onSave={(val) => onUpdateBrand('heroTagline', val)} isEditing={isEditing} tag="span" />
        </motion.span>
        <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="text-5xl md:text-7xl lg:text-8xl font-brand tracking-tight font-medium leading-tight mix-blend-overlay mb-8">
          <EditableText value={brand.heroTitle} onSave={(val) => onUpdateBrand('heroTitle', val)} isEditing={isEditing} tag="span" />
        </motion.h1>
        <motion.p initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="text-sm md:text-lg tracking-widest max-w-xl mx-auto leading-relaxed font-light text-stone-100 font-body mb-10">
          <EditableText value={brand.heroSubtitle} onSave={(val) => onUpdateBrand('heroSubtitle', val)} isEditing={isEditing} tag="span" />
        </motion.p>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex justify-center gap-4">
          <button onClick={() => onNavigate('all')} className="group relative inline-flex items-center gap-3 overflow-hidden px-8 py-3 bg-white text-stone-900 hover:bg-stone-100 transition-colors">
            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.25em]">Ver Colección</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const ProductCard = React.forwardRef(({ product, onClick, index, isEditing, onUpdateProduct, onAddToCart, onMoveProduct, onToggleWishlist, isInWishlist }, ref) => {
  return (
    <motion.div ref={ref} layoutId={`card-${product.id}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ delay: index * 0.05 }} className="group relative cursor-pointer flex flex-col h-full" onClick={!isEditing ? onClick : undefined}>
      <div className="relative overflow-hidden aspect-[3/4] w-full bg-[#f4f2ed] mb-4 group-hover:shadow-xl transition-all duration-500">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        {!isEditing && (
          <>
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {product.isFeatured && <Badge variant="featured">Destacado</Badge>}
              {!product.inStock && <Badge variant="outOfStock">Agotado</Badge>}
            </div>
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className="bg-white p-2 rounded-full shadow hover:text-red-500 transition-colors"><Heart size={16} className={isInWishlist ? "fill-red-500 text-red-500" : ""} /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
              <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} disabled={!product.inStock} className="bg-white text-stone-900 px-6 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors disabled:opacity-50">
                {product.inStock ? 'Agregar rápido' : 'Sin Stock'}
              </button>
            </div>
          </>
        )}
        {isEditing && <EditableImage src={product.image} onSave={val => onUpdateProduct(product.id, 'image', val)} isEditing={true} className="absolute inset-0 z-30" />}
      </div>
      <div>
        <h4 className="font-brand text-xl text-stone-900 mb-1 group-hover:text-[#C5A059] transition-colors"><EditableText value={product.name} onSave={val => onUpdateProduct(product.id, 'name', val)} isEditing={isEditing} tag="span" /></h4>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">{product.category.replace('-', ' ')}</span>
          <div className="flex flex-col items-end">
            {product.originalPrice && <span className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>}
            <span className="font-price text-lg text-stone-800 font-medium"><EditableText value={product.price} onSave={val => onUpdateProduct(product.id, 'price', val)} isEditing={isEditing} tag="span" /></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const PyramidLevel = ({ label, notes, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex items-start gap-4 group">
    <div className="w-16 pt-1 text-right flex-shrink-0"><span className="text-[9px] uppercase tracking-widest text-stone-400 group-hover:text-[#C5A059] transition-colors font-body">{label}</span></div>
    <div className="flex-1 pb-3 border-l-2 border-stone-200 group-hover:border-[#C5A059] pl-4 relative transition-colors"><div className="absolute left-[-5px] top-[6px] w-2 h-2 rounded-full bg-stone-300 group-hover:bg-[#C5A059] transition-colors" /><span className="text-sm font-medium text-stone-800 font-body">{notes}</span></div>
  </motion.div>
);

const Accordion = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left group">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 group-hover:text-[#C5A059] transition-colors font-body flex items-center gap-2">{Icon && <Icon className="w-4 h-4" />}{title}</span>
        <Plus className={`w-4 h-4 text-stone-400 transition-transform duration-500 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
      </button>
      <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden"><div className="pb-6 text-stone-600 font-light leading-relaxed text-sm font-body">{children}</div></motion.div>}</AnimatePresence>
    </div>
  );
};

const ProductModal = ({ product, isOpen, onClose, onAddToCart, allProducts, wishlist, onToggleWishlist }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; setQty(1); setActiveTab('description'); } else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => { for (let i = 0; i < qty; i++) onAddToCart(product); addToast(`${product.name} agregado`, 'success'); onClose(); };
  const isInWishlist = wishlist.includes(product.id);
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-[90]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="fixed inset-0 z-[95] flex items-center justify-center p-0 md:p-6" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
            <div className="bg-[#FDFCF8] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
              <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-[#0A0A0A] hover:text-white transition-all shadow-sm"><X size={20} /></button>

              <div className="w-full md:w-1/2 relative bg-[#E8E6E1] overflow-hidden group h-[40vh] md:h-auto">
                <motion.img src={product.image} alt={product.name} className="w-full h-full object-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} />
                <div className="absolute bottom-8 left-8 right-8 text-white z-10"><div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-[0.2em]">{product.vibe}</div></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="w-full md:w-1/2 flex flex-col h-[60vh] md:h-auto bg-[#FDFCF8]">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 lg:p-16">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4"><span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em]">{product.category.replace('-', ' ')}</span><button onClick={() => onToggleWishlist(product.id)}><Heart size={22} className={`transition-colors ${isInWishlist ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'}`} /></button></div>
                    <h2 className="font-brand text-4xl md:text-6xl text-[#0A0A0A] leading-[0.9] mb-6">{product.name}</h2>
                    <div className="flex items-baseline gap-4 mb-8 border-b border-[#C5A059]/20 pb-8"><span className="font-price text-3xl md:text-4xl text-[#0A0A0A]">{formatPrice(product.price)}</span>{product.originalPrice && <span className="font-price text-xl text-stone-400 line-through decoration-[#C5A059]">{formatPrice(product.originalPrice)}</span>}</div>

                    <div className="flex gap-8 mb-6 border-b border-stone-100">{[{ id: 'description', l: 'Historia' }, { id: 'notes', l: 'Notas' }, { id: 'details', l: 'Detalles' }].map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`text-xs uppercase tracking-widest pb-3 transition-all relative ${activeTab === t.id ? 'text-[#0A0A0A] font-bold border-b-2 border-[#C5A059]' : 'text-stone-400'}`}>{t.l}</button>))}</div>

                    <div className="min-h-[100px] mb-8">
                      {activeTab === 'description' && <p className="text-stone-600 font-light leading-relaxed text-lg">{product.longDesc}</p>}
                      {activeTab === 'notes' && <div className="space-y-4"><PyramidLevel label="Salida" notes={product.notes.top} /><PyramidLevel label="Corazón" notes={product.notes.heart} /><PyramidLevel label="Fondo" notes={product.notes.base} /></div>}
                      {activeTab === 'details' && <div className="grid grid-cols-2 gap-4 text-sm"><div className="p-4 bg-stone-50"><span className="block text-[10px] uppercase text-stone-400">Tamaño</span><span className="font-medium">{product.size || '250ml'}</span></div><div className="p-4 bg-stone-50"><span className="block text-[10px] uppercase text-stone-400">Origen</span><span className="font-medium">Patagonia</span></div></div>}
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-stone-100"><Accordion title="Envíos" icon={Truck}>Envío gratis +$100.000. Andreani a todo el país.</Accordion><Accordion title="Devoluciones" icon={RotateCcw}>30 días de garantía de satisfacción.</Accordion></div>
                </div>

                <div className="p-6 md:p-8 border-t border-stone-100 bg-white z-20">
                  <div className="flex gap-4">
                    <div className="flex items-center border border-stone-200 h-14 px-4 gap-4 w-32 justify-between"><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button><span className="font-display text-xl">{qty}</span><button onClick={() => setQty(qty + 1)}><Plus size={16} /></button></div>
                    <button onClick={handleAdd} disabled={!product.inStock} className="flex-1 bg-[#0A0A0A] text-white h-14 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#C5A059] transition-colors disabled:opacity-50 flex items-center justify-center gap-3">{product.inStock ? 'Agregar al Carrito' : 'Agotado'}{product.inStock && <ArrowRight size={16} />}</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Catalog = ({ onSelectProduct, activeFilter, onFilterChange, products, isEditing, onUpdateProduct, onAddToCart, onMoveProduct, wishlist, onToggleWishlist }) => {
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = activeFilter === 'all' ? products.filter(p => p.isBestSeller) : products.filter(p => p.category === activeFilter);
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeFilter, sortBy]);

  const categories = [{ id: 'all', l: 'Destacados', i: Star }, { id: 'perfume', l: 'Perfumes', i: Droplets }, { id: 'home-spray', l: 'Home', i: Wind }, { id: 'vela', l: 'Velas', i: Flame }];

  return (
    <section className="py-32 px-4 md:px-12 bg-[#FDFCF8] relative z-20" id="coleccion">
      <SectionTitle title={activeFilter === 'all' ? "Selección del Atelier" : "Nuestra Colección"} subtitle="Esencias del Fin del Mundo" isEditing={false} />

      <div className="sticky top-20 z-30 mb-16 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="bg-white/90 backdrop-blur border border-stone-200 p-1 rounded-full shadow-sm flex gap-1 overflow-x-auto max-w-full">
          {categories.map(c => (
            <button key={c.id} onClick={() => onFilterChange(c.id)} className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeFilter === c.id ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}>
              <c.i size={12} /> {c.l}
            </button>
          ))}
        </div>
        <div className="relative group">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-white border border-stone-200 rounded-full px-4 py-2 pr-8 text-xs uppercase font-bold tracking-wider cursor-pointer focus:border-[#C5A059] outline-none">
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
          <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 max-w-[95rem] mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onClick={() => onSelectProduct(product)} isEditing={isEditing} onUpdateProduct={onUpdateProduct} onAddToCart={onAddToCart} onMoveProduct={onMoveProduct} onToggleWishlist={onToggleWishlist} isInWishlist={wishlist.includes(product.id)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredProducts.length === 0 && <div className="text-center py-20 text-stone-400 italic">No hay productos en esta categoría.</div>}
    </section>
  );
};

const Philosophy = ({ brand, images, isEditing, onUpdateBrand, onUpdateImage }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-[#0c0c0c] text-[#eceae4] relative overflow-hidden" id="nosotros">
      <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay"><img src={images.texture} className="w-full h-full object-cover grayscale contrast-125" alt="" /></div>
      <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <motion.div style={{ y }} className="relative aspect-[4/5] bg-stone-900 shadow-2xl">
          <EditableImage src={images.workshop} onSave={(val) => onUpdateImage('workshop', val)} alt="Atelier" className="w-full h-full object-cover opacity-90" isEditing={isEditing} />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C5A059] p-4 flex flex-col justify-center items-center text-stone-900 z-20">
            <span className="text-3xl font-brand font-bold">100%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Artesanal</span>
          </div>
        </motion.div>
        <div>
          <span className="text-[#C5A059] text-xs tracking-[0.4em] uppercase font-bold block mb-6">Filosofía</span>
          <h2 className="text-5xl md:text-7xl font-brand mb-8 leading-none"><EditableText value={brand.philosophyTitle} onSave={val => onUpdateBrand('philosophyTitle', val)} isEditing={isEditing} tag="span" /> <span className="text-stone-600 italic block"><EditableText value={brand.philosophySubtitle} onSave={val => onUpdateBrand('philosophySubtitle', val)} isEditing={isEditing} tag="span" /></span></h2>
          <div className="text-stone-400 font-light text-lg leading-relaxed space-y-6">
            <EditableArea value={brand.philosophyText1} onSave={val => onUpdateBrand('philosophyText1', val)} isEditing={isEditing} />
            <EditableArea value={brand.philosophyText2} onSave={val => onUpdateBrand('philosophyText2', val)} isEditing={isEditing} />
          </div>
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1000));
    setStatus('success');
    setEmail('');
  };
  return (
    <section className="py-24 px-6 bg-stone-100 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 mix-blend-multiply"><img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="" /></div>
      <div className="relative z-10 max-w-xl mx-auto">
        <Mail size={32} className="mx-auto text-[#C5A059] mb-6" />
        <h3 className="font-brand text-4xl mb-4 text-stone-900">Únete al Atelier</h3>
        <p className="text-stone-600 mb-8 font-light">Suscríbete para recibir novedades exclusivas y un 10% OFF en tu primera compra.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="flex-1 p-4 bg-white border border-stone-200 outline-none text-sm focus:border-[#C5A059]" />
          <button disabled={status !== 'idle'} className="bg-stone-900 text-white px-8 uppercase text-xs font-bold tracking-widest hover:bg-[#C5A059] transition-colors">
            {status === 'loading' ? <Loader className="animate-spin w-4 h-4" /> : status === 'success' ? <Check className="w-4 h-4" /> : 'Suscribirse'}
          </button>
        </form>
      </div>
    </section>
  );
};

const Footer = ({ brand, onNavigate }) => (
  <footer className="bg-[#FDFCF8] pt-32 pb-10 border-t border-stone-200">
    <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
      <div className="md:col-span-1">
        <h3 className="font-brand text-3xl mb-6">{brand.name}</h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-6">{brand.tagline}</p>
        <div className="flex gap-4">
          <a href={brand.instagramUrl} target="_blank" className="text-stone-400 hover:text-stone-900 cursor-pointer"><Instagram size={20} /></a>
          <a href={brand.facebookUrl} target="_blank" className="text-stone-400 hover:text-stone-900 cursor-pointer"><Facebook size={20} /></a>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Tienda</h4>
        <ul className="space-y-3 text-sm text-stone-500">
          <li><button onClick={() => onNavigate('all')} className="hover:text-[#C5A059]">Colección</button></li>
          <li><button onClick={() => onNavigate('perfume')} className="hover:text-[#C5A059]">Perfumes</button></li>
          <li><button onClick={() => onNavigate('home-spray')} className="hover:text-[#C5A059]">Home</button></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Cliente</h4>
        <ul className="space-y-3 text-sm text-stone-500">
          <li>Envíos y Devoluciones</li>
          <li>Preguntas Frecuentes</li>
          <li>Términos y Condiciones</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Contacto</h4>
        <ul className="space-y-3 text-sm text-stone-500">
          <li className="flex items-center gap-2"><MapPin size={14} /> {brand.location}</li>
          <li className="flex items-center gap-2"><Mail size={14} /> {brand.email}</li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 pt-8 border-t border-stone-100 text-center text-[10px] uppercase tracking-widest text-stone-400 flex justify-between">
      <p>© 2026 MK Aromas</p>
      <p>Hecho en Patagonia</p>
    </div>
  </footer>
);

const AdminToggle = ({ isEditing, setIsEditing, onReset, onManualSave }) => {
  const [status, setStatus] = useState('idle');
  const handleSave = async () => {
    setStatus('saving');
    await new Promise(r => setTimeout(r, 800));
    onManualSave();
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };
  return (
    <div className="fixed bottom-8 left-8 z-50 flex gap-2">
      <button onClick={() => setIsEditing(!isEditing)} className={`p-4 rounded-full shadow-xl transition-colors border ${isEditing ? 'bg-[#C5A059] text-white border-[#C5A059]' : 'bg-white text-stone-900 border-stone-200'}`}><Edit3 size={20} /></button>
      {isEditing && (
        <>
          <button onClick={handleSave} className="p-4 bg-white text-green-600 rounded-full shadow-xl border border-green-200 hover:bg-green-50">
            {status === 'saving' ? <Loader className="animate-spin" size={20} /> : status === 'success' ? <Check size={20} /> : <Save size={20} />}
          </button>
          <button onClick={() => { if (confirm('¿Resetear?')) onReset(); }} className="p-4 bg-white text-red-500 rounded-full shadow-xl border border-red-200 hover:bg-red-50"><RotateCcw size={20} /></button>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('mk_cart') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('mk_wishlist') || '[]'));
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS.map(p => ({ ...p, isBestSeller: DEFAULT_BEST_SELLERS_IDS.includes(p.id) }));
  });
  const [images, setImages] = useState(() => JSON.parse(localStorage.getItem('mk_images')) || INITIAL_IMAGES);
  const [brand, setBrand] = useState(() => JSON.parse(localStorage.getItem('mk_brand')) || INITIAL_BRAND);

  useEffect(() => { localStorage.setItem('mk_cart', JSON.stringify(cart)) }, [cart]);
  useEffect(() => { localStorage.setItem('mk_wishlist', JSON.stringify(wishlist)) }, [wishlist]);
  useEffect(() => { localStorage.setItem('mk_products', JSON.stringify(products)) }, [products]);
  useEffect(() => { localStorage.setItem('mk_images', JSON.stringify(images)) }, [images]);
  useEffect(() => { localStorage.setItem('mk_brand', JSON.stringify(brand)) }, [brand]);

  const addToCart = (p) => { setCart(prev => { const ex = prev.find(i => i.id === p.id); if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...p, qty: 1 }]; }); setIsCartOpen(true); trackEvent('add_to_cart', { item_id: p.id }); };
  const updateQty = (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleUpdateProduct = (id, field, value) => setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleUpdateBrand = (field, value) => setBrand(prev => ({ ...prev, [field]: value }));
  const handleUpdateImage = (key, value) => setImages(prev => ({ ...prev, [key]: value }));
  const handleMoveProduct = (p, dir) => { const list = activeCategory === 'all' ? products.filter(i => i.isBestSeller) : products.filter(i => i.category === activeCategory); const idx = list.findIndex(i => i.id === p.id); const target = list[idx + dir]; if (!target) return; const r1 = products.findIndex(i => i.id === p.id); const r2 = products.findIndex(i => i.id === target.id); const copy = [...products];[copy[r1], copy[r2]] = [copy[r2], copy[r1]]; setProducts(copy); };

  const handleNavigation = (cat) => { if (cat === 'top') window.scrollTo({ top: 0, behavior: 'smooth' }); else if (cat === 'nosotros') document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }); else { setActiveCategory(cat); document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' }); } };

  return (
    <ToastProvider>
      <div className="bg-[#FDFCF8] min-h-screen text-stone-900 font-sans selection:bg-[#C5A059] selection:text-white overflow-x-hidden">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=Manrope:wght@300;400;500;600;700&display=swap'); .font-brand { font-family: 'Italiana', serif; } .font-price { font-family: 'Cormorant Garamond', serif; } .font-display { font-family: 'Bodoni Moda', serif; } .font-body { font-family: 'Manrope', sans-serif; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #E7E5E4; border-radius: 4px; }`}</style>
        <NoiseOverlay />
        <ScrollProgress />
        <LoadingScreen onComplete={() => setIsLoading(false)} brandName={brand.name} />
        {!isLoading && (
          <>
            <Navbar brand={brand} isEditing={isEditing} onUpdateBrand={handleUpdateBrand} cartCount={cart.reduce((a, c) => a + c.qty, 0)} onOpenCart={() => setIsCartOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} wishlistCount={wishlist.length} onNavigate={handleNavigation} />
            <main>
              <Hero onNavigate={handleNavigation} brand={brand} images={images} isEditing={isEditing} onUpdateBrand={handleUpdateBrand} onUpdateImage={handleUpdateImage} />
              <div className="relative z-10 bg-[#FDFCF8] shadow-[0_-50px_100px_rgba(253,252,248,1)]">
                <Marquee />
                <div className="h-24 bg-gradient-to-b from-[#FDFCF8] to-transparent"></div>
                <Catalog onSelectProduct={setSelectedProduct} activeFilter={activeCategory} onFilterChange={setActiveCategory} products={products} isEditing={isEditing} onUpdateProduct={handleUpdateProduct} onAddToCart={addToCart} onMoveProduct={handleMoveProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                <Philosophy brand={brand} images={images} isEditing={isEditing} onUpdateBrand={handleUpdateBrand} onUpdateImage={handleUpdateImage} />
                <LuxuryTestimonials />
                <LuxuryInstagramFeed />
                <Newsletter />
                <Footer brand={brand} onNavigate={handleNavigation} />
              </div>
            </main>
            <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} allProducts={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />

            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cart}
              onUpdateQty={updateQty}
              onRemove={removeFromCart}
              onClearCart={clearCart}
              brandPhone={brand.phone}
            />

            <LuxuryCheckout
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
              cartItems={cart}
              subtotal={cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)}
              brandPhone={brand.phone}
              onSuccess={clearCart}
            />

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} onSelectProduct={p => { setIsSearchOpen(false); setSelectedProduct(p); }} />
            <ConciergeChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} products={products} />

            <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3 items-end">
              <motion.button onClick={() => setIsChatOpen(true)} className="bg-white text-stone-900 p-4 rounded-full shadow-lg border border-stone-200 group flex items-center gap-2 hover:gap-3 transition-all" whileHover={{ scale: 1.05 }}>
                <Sparkles size={20} className="text-[#C5A059]" /> <span className="w-0 overflow-hidden group-hover:w-auto text-xs font-bold uppercase tracking-widest whitespace-nowrap">Concierge</span>
              </motion.button>
              <motion.button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="bg-stone-900 text-white p-5 rounded-full shadow-2xl hover:bg-[#C5A059] transition-colors relative" whileHover={{ scale: 1.05 }}>
                <ShoppingBag size={24} />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">{cart.reduce((a, c) => a + c.qty, 0)}</span>}
              </motion.button>
            </div>
            <BackToTop />
            <AdminToggle isEditing={isEditing} setIsEditing={setIsEditing} onReset={() => { localStorage.clear(); window.location.reload(); }} onManualSave={() => { }} />
          </>
        )}
      </div>
    </ToastProvider>
  );
}