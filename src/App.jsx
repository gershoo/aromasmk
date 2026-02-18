import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  ShoppingBag, X, Menu, Star, Minus, Plus, Sparkles as SparklesIcon, Heart,
  Trash2, Truck, Gift, Package, Home as HomeIcon, Droplets, Wind, Flame, Info,
  Layers, ChevronDown, Award, Shield, Zap, ChevronRight, ChevronLeft, Eye, Quote,
  Clock, Users, Flower2, Box, Tag, MessageSquare, Play, Pause, RotateCcw, Sun, Moon,
  Move3D, ChevronUp, AlertCircle, Bell, Send, Phone, Mail, MapPin, TrendingUp,
  Activity, Search, Filter, RefreshCw, RefreshCcw, Timer, Crown, CreditCard, Lock,
  Camera, Check, Copy, Loader, ArrowLeft, ArrowRight, Instagram,
  ZoomIn, ZoomOut, Maximize2, Minimize2, Share2, Download, ExternalLink, PenLine
} from 'lucide-react';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { INITIAL_PRODUCTS } from './productData';
import {
  AnalyticsProvider, useAnalytics, ErrorBoundaryRoot,
  LuxuryCursor, AromaticParticles, ParallaxSection, ParallaxBackground,
  UrgencyBanner, ExitIntentPopup, RecentPurchases,
  StatusBar
} from './eliteComponents';
import ReviewsSection from './UltraPremiumReviews';
import ProductCard from './components/ProductCard';
import ConsultationSection from './components/ConsultationSection';

// --- FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCWT-mFXHXR0DsnnsBQpI7tzdjrgN--NDg",
  authDomain: "aromas-mk-d9c23.firebaseapp.com",
  projectId: "aromas-mk-d9c23",
  storageBucket: "aromas-mk-d9c23.firebasestorage.app",
  appId: "1:272432853135:web:1a5d0b26ece0537d9180fa"
};
let firebaseApp, auth, db;
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "API_KEY") {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  } else { console.warn("Firebase config missing."); }
} catch (error) { console.warn("Firebase warning:", error); }

// ═══ UTILIDADES ═══
const formatPrice = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(num);
};

const GoldDiamond = ({ size = 8 }) => (
  <div className="rotate-45 bg-gradient-to-br from-[#C5A059] to-amber-600 shadow-sm" style={{ width: size, height: size }} />
);

const LuxuryDivider = () => (
  <div className="flex items-center gap-4 justify-center my-8">
    <div className="h-[1px] w-12 bg-[#C5A059]/30" />
    <GoldDiamond size={6} />
    <div className="h-[1px] w-12 bg-[#C5A059]/30" />
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 px-4">
    <span className="block text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">{subtitle}</span>
    <h2 className="text-4xl md:text-7xl font-brand text-stone-900 leading-tight">{title}</h2>
  </motion.div>
);

function IntensityMeter({ value, size = "md" }) {
  const height = size === "lg" ? "h-2" : "h-1.5";
  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Intensidad</span>
        <span className="text-[10px] font-black text-stone-900">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex-1 ${height} rounded-full transition-all duration-500 ${i < (value || 0)
              ? 'bg-gradient-to-r from-[#C5A059] to-amber-600'
              : 'bg-stone-200'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const check = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', check);
    return () => window.removeEventListener('scroll', check);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-32 left-8 z-[300] w-12 h-12 bg-white rounded-full shadow-2xl border border-stone-100 flex items-center justify-center text-stone-400 hover:scale-110 hover:text-[#C5A059] transition-all"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function OptimizedImage({ src, alt, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-stone-200" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain p-4 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

const PushNotificationController = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default')
      setTimeout(() => setShow(true), 5000);
  }, []);
  const enable = async () => {
    const p = await Notification.requestPermission();
    if (p === 'granted') setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-6 left-6 z-[2000] bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-stone-100"
        >
          <div className="w-10 h-10 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059]">
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">Novedades</h4>
            <p className="text-[10px] text-stone-500">Recibe alertas de lanzamientos.</p>
          </div>
          <button onClick={enable} className="text-xs font-bold bg-[#C5A059] text-white px-3 py-1.5 rounded-lg">
            Activar
          </button>
          <button onClick={() => setShow(false)}>
            <X size={16} className="text-stone-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 GALERÍA DE IMÁGENES COMPACTA
// ═══════════════════════════════════════════════════════════════════════════

const ProductImageGallery = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const images = useMemo(() => {
    const imgs = [product.image];
    if (product.imageGallery) {
      imgs.push(...product.imageGallery);
    }
    return imgs;
  }, [product]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="relative h-full">
      <motion.div
        className="relative h-full bg-stone-50 rounded-2xl overflow-hidden cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full object-contain p-6"
            style={isZoomed ? {
              transform: `scale(1.8)`,
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
            } : {}}
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-[7px] font-black px-2 py-1 rounded-full uppercase shadow-lg">
              Nuevo
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#C5A059] text-white text-[7px] font-black px-2 py-1 rounded-full uppercase shadow-lg">
              Best Seller
            </span>
          )}
        </div>

        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-[10px] flex items-center gap-1">
            <ZoomIn size={10} />
            Zoom
          </div>
        )}
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${activeImage === index ? 'bg-[#C5A059] w-4' : 'bg-stone-300'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 MINI FORMULARIO DE RESEÑA
// ═══════════════════════════════════════════════════════════════════════════

const ProductReviewMini = ({ product, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim() || !name.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      productId: product.id,
      productName: product.name,
      rating,
      comment,
      name,
      date: new Date().toISOString()
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      onClose();
      setRating(0);
      setComment('');
      setName('');
      setIsSuccess(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-stone-100 p-4 z-50"
    >
      {isSuccess ? (
        <div className="text-center py-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2"
          >
            <Check size={20} className="text-white" />
          </motion.div>
          <p className="font-bold text-stone-900 text-sm">¡Gracias!</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-stone-900 text-xs">Reseñar {product.name}</h4>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <X size={14} />
            </button>
          </div>

          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={22}
                  className={`transition-colors ${star <= (hoverRating || rating)
                    ? 'fill-[#C5A059] text-[#C5A059]'
                    : 'text-stone-300'
                    }`}
                />
              </button>
            ))}
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs mb-2 focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none"
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció?"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs mb-3 resize-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !comment.trim() || !name.trim() || isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-[#C5A059] to-amber-500 text-white rounded-lg font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send size={12} />
                Enviar
              </>
            )}
          </button>
        </>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 QUICK VIEW COMPACTO (SIN SCROLL)
// ═══════════════════════════════════════════════════════════════════════════

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, onAddToCart, toggleFavorite, favorites } = useCatalog();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!quickViewProduct) return null;
  const p = quickViewProduct;
  const isFavorite = favorites.includes(p.id);

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: `Mirá este perfume: ${p.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleReviewSubmit = (review) => {
    console.log('Nueva reseña:', review);
  };

  return (
    <div
      className="fixed inset-0 z-[1500] bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={() => setQuickViewProduct(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden relative shadow-2xl flex flex-col lg:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-50 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left Side - Image */}
        <div className="lg:w-[45%] h-64 lg:h-auto bg-stone-50 p-4">
          <ProductImageGallery product={p} />
        </div>

        {/* Right Side - Product Info */}
        <div className="lg:w-[55%] p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-widest">
                {p.category}
              </span>
              <h2 className="font-brand text-3xl text-stone-900 leading-tight">
                {p.name}
              </h2>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => toggleFavorite(p.id)}
                className={`p-2 rounded-full transition-all ${isFavorite
                  ? 'bg-red-100 text-red-500'
                  : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                  }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
              </button>
              <button
                onClick={shareProduct}
                className="p-2 rounded-full bg-stone-100 text-stone-400 hover:bg-stone-200 transition-all"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Rating - Sin reseñas inicialmente */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-stone-200" />
              ))}
            </div>
            <span className="text-[10px] text-stone-400">Sin reseñas aún</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-black text-stone-900">
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(p.oldPrice)}
              </span>
            )}
          </div>

          {/* Intensity */}
          <div className="mb-4">
            <IntensityMeter value={p.intensity || 4} size="sm" />
          </div>

          {/* Notas Compactas - Todo en una línea por nota */}
          {p.notes && (
            <div className="bg-stone-50 rounded-xl p-3 mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <SparklesIcon size={12} className="text-amber-600" />
                </div>
                <span className="text-[9px] font-bold uppercase text-amber-600 w-12">Salida</span>
                <span className="text-[11px] text-stone-600 truncate">{p.notes.top}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Heart size={12} className="text-rose-500" />
                </div>
                <span className="text-[9px] font-bold uppercase text-rose-500 w-12">Corazón</span>
                <span className="text-[11px] text-stone-600 truncate">{p.notes.heart}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <Package size={12} className="text-stone-600" />
                </div>
                <span className="text-[9px] font-bold uppercase text-stone-500 w-12">Fondo</span>
                <span className="text-[11px] text-stone-600 truncate">{p.notes.base}</span>
              </div>
            </div>
          )}

          {/* Detalles compactos */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-stone-50 rounded-lg p-2">
              <p className="text-[8px] font-bold uppercase text-stone-400">Familia</p>
              <p className="text-[10px] font-bold text-stone-900 truncate">{p.family}</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-2">
              <p className="text-[8px] font-bold uppercase text-stone-400">Duración</p>
              <p className="text-[10px] font-bold text-stone-900">{p.duration || '8-12h'}</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-2">
              <p className="text-[8px] font-bold uppercase text-stone-400">Ocasión</p>
              <p className="text-[10px] font-bold text-stone-900 truncate">{p.occasion}</p>
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="mt-auto relative">
            <AnimatePresence>
              {showReviewForm && (
                <ProductReviewMini
                  product={p}
                  isOpen={showReviewForm}
                  onClose={() => setShowReviewForm(false)}
                  onSubmit={handleReviewSubmit}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-black text-stone-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Review Button */}
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className={`p-3 rounded-xl border-2 transition-all ${showReviewForm
                  ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                  : 'border-stone-200 text-stone-400 hover:border-[#C5A059] hover:text-[#C5A059]'
                  }`}
                title="Escribir reseña"
              >
                <PenLine size={18} />
              </button>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(p);
                  }
                  setQuickViewProduct(null);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:from-[#C5A059] hover:to-amber-600 transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                Agregar
                <span className="opacity-70">
                  {formatPrice(p.price * quantity)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ═══ GIFT MODAL ═══
const GiftModal = () => {
  const { giftProduct, setGiftProduct, onAddToCart } = useCatalog();
  if (!giftProduct) return null;
  return (
    <div className="fixed inset-0 z-[1600] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setGiftProduct(null)}>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        <Gift className="mx-auto text-[#C5A059] mb-6" size={48} />
        <h2 className="font-brand text-4xl mb-4 text-stone-900">Arte de Regalar</h2>
        <p className="text-stone-500 mb-8">
          Personaliza tu envío con envoltorio premium y tarjeta manuscrita.
        </p>
        <button
          onClick={() => {
            onAddToCart({ ...giftProduct, isGift: true });
            setGiftProduct(null);
          }}
          className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#C5A059] transition-all shadow-xl"
        >
          Confirmar Regalo
        </button>
      </motion.div>
    </div>
  );
};

// ═══ CONTEXTO ═══
const CatalogContext = createContext(null);
const useCatalog = () => useContext(CatalogContext);
const CatalogProvider = ({ children, products }) => {
  const [activeSection, setActiveSection] = useState('perfumes');
  const [activeSubSection, setActiveSubSection] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [giftProduct, setGiftProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  const { trackAddToCart } = useAnalytics();

  const addToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const onAddToCart = (p) => {
    trackAddToCart(p);
    setCart(prev => {
      const exist = prev.find(i => i.id === p.id);
      if (exist) return prev.map(i => i.id === p.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    addToast(`Añadido: ${p.name}`);
    setIsCartOpen(true);
  };

  const toggleFavorite = (id) => setFavorites(p =>
    p.includes(id) ? p.filter(i => i !== id) : [...p, id]
  );

  const getFilteredProducts = useCallback((section, subSection) => {
    let res = products;
    if (section === 'perfumes') {
      res = res.filter(p => p.category === 'perfume');
      if (subSection === 'all') {
        res = res.filter(p => p.isImportant);
      } else {
        res = res.filter(p => p.gender === subSection);
      }
    } else if (section === 'velas') {

      res = res.filter(p => p.category === 'vela' && !p.id.startsWith('f_') && !p.id.startsWith('m_'));
    } else {
      res = res.filter(p => p.category === section);
    }
    return res;
  }, [products]);

  return (
    <CatalogContext.Provider value={{
      activeSection, setActiveSection,
      activeSubSection, setActiveSubSection,
      cart, setCart,
      isCartOpen, setIsCartOpen,
      onAddToCart,
      quickViewProduct, setQuickViewProduct,
      giftProduct, setGiftProduct,
      getFilteredProducts,
      favorites, setFavorites, toggleFavorite,
      toast
    }}>
      {children}
    </CatalogContext.Provider>
  );
};



// ═══════════════════════════════════════════════════════════════════════════
// 🔍 BUSCADOR INTELIGENTE (SmartSearch)
// ═══════════════════════════════════════════════════════════════════════════

const SmartSearch = ({ products, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.family && p.family.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.notes?.top && p.notes.top.toLowerCase().includes(q)) ||
      (p.notes?.heart && p.notes.heart.toLowerCase().includes(q)) ||
      (p.notes?.base && p.notes.base.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, products]);

  // Abrir con Ctrl+K o Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus automático al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Navegación con teclado
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onSelect(results[selectedIndex]);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Reset del índice seleccionado cuando cambia la query
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Botón de búsqueda */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors group"
        title="Buscar (Ctrl+K)"
      >
        <Search size={20} className="group-hover:scale-110 transition-transform" />
        <span className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
          <span>Buscar</span>
          <kbd className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-500 shadow-sm">
            ⌘K
          </kbd>
        </span>
      </button>

      {/* Modal de búsqueda fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2000] bg-stone-950/80 backdrop-blur-xl flex items-start justify-center pt-[15vh]"
            onClick={() => { setIsOpen(false); setQuery(''); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white w-full max-w-xl mx-4 rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input de búsqueda */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
                <Search size={20} className="text-stone-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar perfumes, notas, familias..."
                  className="flex-1 text-base text-stone-900 placeholder:text-stone-400 outline-none bg-transparent"
                  autoComplete="off"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => { setIsOpen(false); setQuery(''); }}
                  className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md border border-stone-200 hover:bg-stone-200 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Resultados */}
              <div className="max-h-[400px] overflow-y-auto">
                {query.trim() === '' ? (
                  /* Estado vacío - sugerencias */
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-stone-400" />
                    </div>
                    <p className="text-sm text-stone-500 mb-1">Buscá por nombre, nota o familia</p>
                    <p className="text-[10px] text-stone-400">
                      Probá: "vainilla", "cítrico", "noche"
                    </p>

                    {/* Búsquedas sugeridas */}
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {['Vainilla', 'Cítrico', 'Floral', 'Amaderado', 'Noche'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="text-[10px] font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full hover:bg-[#C5A059]/10 hover:text-[#C5A059] transition-colors border border-stone-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  /* Sin resultados */
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-stone-300" />
                    </div>
                    <p className="text-sm font-bold text-stone-900 mb-1">Sin resultados</p>
                    <p className="text-xs text-stone-400">
                      No encontramos productos para "{query}"
                    </p>
                  </div>
                ) : (
                  /* Lista de resultados */
                  <div className="py-2">
                    <p className="px-5 py-2 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                      {results.length} resultado{results.length !== 1 ? 's' : ''}
                    </p>
                    {results.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onSelect(product);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${selectedIndex === index
                          ? 'bg-[#C5A059]/10'
                          : 'hover:bg-stone-50'
                          }`}
                      >
                        {/* Imagen miniatura */}
                        <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        {/* Info del producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-brand text-base text-stone-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#C5A059]">
                              {formatPrice(product.price)}
                            </span>
                            {product.family && (
                              <span className="text-[9px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                {product.family}
                              </span>
                            )}
                            {product.category && (
                              <span className="text-[9px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full capitalize">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Indicador de selección */}
                        <div className={`flex-shrink-0 transition-opacity ${selectedIndex === index ? 'opacity-100' : 'opacity-0'
                          }`}>
                          <ChevronRight size={16} className="text-[#C5A059]" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer con atajos */}
              {results.length > 0 && (
                <div className="px-5 py-3 border-t border-stone-100 flex items-center gap-4 text-[10px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 font-mono">↑↓</kbd>
                    Navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 font-mono">↵</kbd>
                    Seleccionar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 font-mono">esc</kbd>
                    Cerrar
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ☰ MENÚ DRAWER (Hamburguesa)
// ═══════════════════════════════════════════════════════════════════════════

const MenuDrawer = ({ onNavigate, favorites, cart }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: HomeIcon, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'catalogo', label: 'Catálogo', icon: Layers, action: () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'perfumes', label: 'Perfumes', icon: Droplets, action: () => onNavigate('perfumes') },
    { id: 'velas', label: 'Velas', icon: Flame, action: () => onNavigate('velas') },
    { id: 'home-deco', label: 'Home & Difusores', icon: HomeIcon, action: () => onNavigate('home-deco') },
  ];

  const secondaryItems = [
    { id: 'favoritos', label: `Favoritos (${favorites?.length || 0})`, icon: Heart },
    { id: 'contacto', label: 'Contacto', icon: Phone },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
  ];

  return (
    <>
      {/* Botón hamburguesa / 3 puntos */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
        aria-label="Abrir menú"
      >
        {/* Línea superior */}
        <span
          className="block h-[2px] bg-stone-900 rounded-full transition-all duration-300 group-hover:bg-[#C5A059]"
          style={{ width: '20px' }}
        />
        {/* Línea media (más corta) */}
        <span
          className="block h-[2px] bg-stone-900 rounded-full transition-all duration-300 group-hover:bg-[#C5A059] group-hover:w-[20px]"
          style={{ width: '14px' }}
        />
        {/* Línea inferior */}
        <span
          className="block h-[2px] bg-stone-900 rounded-full transition-all duration-300 group-hover:bg-[#C5A059]"
          style={{ width: '20px' }}
        />
      </button>

      {/* Drawer lateral */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay oscuro */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-[3000]"
              />

              {/* Panel del menú */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-[3100] shadow-2xl flex flex-col"
              >
                {/* Header del menú */}
                <div className="flex items-center justify-between px-8 py-7 border-b border-stone-100">
                  <h2 className="font-brand text-2xl tracking-[0.15em] text-stone-900">
                    MK AROMAS
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Items principales */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="px-4">
                    <p className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">
                      Explorar
                    </p>
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => {
                          item.action?.();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left hover:bg-stone-50 transition-all group"
                      >
                        <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-all">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-bold text-stone-900 group-hover:text-[#C5A059] transition-colors">
                          {item.label}
                        </span>
                        <ChevronRight size={14} className="ml-auto text-stone-300 group-hover:text-[#C5A059] transition-colors" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Separador */}
                  <div className="my-4 mx-8">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[1px] bg-stone-100" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059]/30" />
                      <div className="flex-1 h-[1px] bg-stone-100" />
                    </div>
                  </div>

                  {/* Items secundarios */}
                  <div className="px-4">
                    <p className="px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">
                      Más
                    </p>
                    {secondaryItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (menuItems.length + index) * 0.05, duration: 0.3 }}
                        onClick={() => {
                          if (item.id === 'contacto') {
                            window.open('https://wa.me/5492920674938', '_blank');
                          } else if (item.id === 'instagram') {
                            window.open('https://instagram.com', '_blank');
                          }
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left hover:bg-stone-50 transition-all group"
                      >
                        <div className="w-9 h-9 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-all">
                          <item.icon size={16} />
                        </div>
                        <span className="text-sm text-stone-600 group-hover:text-[#C5A059] transition-colors">
                          {item.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </nav>

                {/* Footer del menú */}
                <div className="px-8 py-6 border-t border-stone-100 bg-stone-50">
                  {/* CTA de WhatsApp */}
                  <button
                    onClick={() => {
                      window.open('https://wa.me/5492920674938?text=Hola! Quiero consultar sobre sus productos', '_blank');
                      setIsOpen(false);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:from-[#C5A059] hover:to-amber-600 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <MessageSquare size={16} />
                    Contactar por WhatsApp
                  </button>

                  {/* Info de contacto */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <a href="tel:+5492920674938" className="text-stone-400 hover:text-[#C5A059] transition-colors">
                      <Phone size={14} />
                    </a>
                    <a href="mailto:contacto@mkaromas.com" className="text-stone-400 hover:text-[#C5A059] transition-colors">
                      <Mail size={14} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#C5A059] transition-colors">
                      <Instagram size={14} />
                    </a>
                  </div>

                  <p className="text-center text-[8px] text-stone-400 mt-3 tracking-widest uppercase">
                    © 2025 MK Aromas — Atelier de Fragancias
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// ═══ APP PRINCIPAL ═══
function AtelierApp() {
  const {
    activeSection, setActiveSection,
    activeSubSection, setActiveSubSection,
    getFilteredProducts,
    cart, setIsCartOpen, isCartOpen, setCart,
    setQuickViewProduct,
    onAddToCart,
    favorites, toggleFavorite,
    toast
  } = useCatalog();

  const { trackProductView } = useAnalytics();
  const products = getFilteredProducts(activeSection, activeSubSection);
  const subtotal = cart.reduce((a, c) => a + c.price * (c.qty || 1), 0);

  return (
    <div className="bg-[#FDFCF8] min-h-screen text-stone-900 font-sans cursor-none selection:bg-[#C5A059] selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600;700&display=swap');
        .font-brand { font-family: 'Italiana', serif; }
        body { font-family: 'Manrope', sans-serif; }
        .cursor-none { cursor: none; }
      `}</style>

      <LuxuryCursor />
      <AromaticParticles />
      <ScrollToTopButton />
      <StatusBar />



      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl z-[3000] flex items-center gap-3"
          >
            <Check size={16} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/20">
        {/* Lado izquierdo: Menú + Buscador */}
        <div className="flex items-center gap-3">
          <MenuDrawer
            onNavigate={(section) => {
              setActiveSection(section);
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }}
            favorites={favorites}
            cart={cart}
          />
          <SmartSearch
            products={INITIAL_PRODUCTS}
            onSelect={(p) => {
              setQuickViewProduct(p);
              trackProductView(p);
            }}
          />
        </div>

        {/* Centro: Logo */}
        <h1
          className="font-brand text-3xl tracking-[0.2em] text-stone-900 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          MK AROMAS
        </h1>

        {/* Lado derecho: Favoritos + Carrito */}
        <div className="flex items-center gap-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Heart size={24} className="text-stone-900" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative group"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="text-stone-900" size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg">
                {cart.reduce((a, c) => a + (c.qty || 1), 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="h-screen relative flex items-center justify-center bg-stone-900 overflow-hidden text-white">
        <ParallaxBackground />
        <OptimizedImage
          src="https://i.ibb.co/5XhktwJQ/Chat-GPT-Image-22-ene-2026-18-57-58.png"
          alt="Hero"
          className="absolute inset-0 opacity-60"
        />
        <div className="relative z-10 px-6 text-center">
          <LuxuryDivider />
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-brand mb-12 leading-[0.9]"
          >
            Atelier De Fragancias
          </motion.h2>
          <button
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-16 py-6 bg-white text-stone-900 rounded-sm font-black uppercase text-[12px] tracking-[0.4em] hover:bg-[#C5A059] hover:text-white transition-all shadow-2xl"
          >
            Explorar Catálogo
          </button>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalogo" className="py-32 px-6 bg-[#FDFCF8] relative z-10">
        <div className="container mx-auto max-w-7xl">
          <SectionTitle title="El Catálogo" subtitle="NUESTROS AROMAS" />

          <div className="flex justify-center gap-6 mb-16 flex-wrap">
            {[
              { id: 'perfumes', l: 'Perfumes', i: Droplets },
              { id: 'home-deco', l: 'Home & Difusores', i: HomeIcon },
              { id: 'velas', l: 'Velas', i: Flame }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveSection(f.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${activeSection === f.id
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'border-stone-200 hover:border-[#C5A059] text-stone-600'
                  }`}
              >
                <f.i size={18} />{f.l.toUpperCase()}
              </button>
            ))}
          </div>

          {activeSection === 'perfumes' && (
            <div className="flex justify-center gap-8 mb-12 border-b border-stone-200 pb-4 w-fit mx-auto">
              {['all', 'femenino', 'masculino'].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSubSection(s)}
                  className={`text-xs font-bold uppercase tracking-wider pb-4 border-b-2 transition-all ${activeSubSection === s
                    ? 'border-[#C5A059] text-stone-900'
                    : 'border-transparent text-stone-400'
                    }`}
                >
                  {s === 'all' ? 'Todos' : s}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onQuickView={(product) => {
                  trackProductView(product);
                  setQuickViewProduct(product);
                }}
                onAddToCart={onAddToCart}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <ReviewsSection />

      {/* CONSULTATION SECTION */}
      <ConsultationSection />

      {/* CART */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1100] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-brand text-3xl">Tu Bolsa</h3>
                <button onClick={() => setIsCartOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {cart.length === 0 ? (
                  <p className="text-center text-stone-400">Tu bolsa está vacía.</p>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <img
                        src={item.image}
                        className="w-20 h-20 object-contain bg-stone-50 rounded-xl"
                        alt=""
                      />
                      <div className="flex-1">
                        <h4 className="font-brand text-lg">{item.name}</h4>
                        <p className="text-[#C5A059] font-bold">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-stone-500">Cant: {item.qty || 1}</span>
                        </div>
                        <button
                          onClick={() => setCart(c => c.filter((_, ix) => ix !== i))}
                          className="text-xs text-red-400 mt-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-10 bg-stone-50 border-t rounded-[40px] mt-10">
                <div className="flex justify-between text-3xl font-brand mb-10 font-black text-stone-900">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <button
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all"
                  onClick={() => window.open(`https://wa.me/5492920674938?text=Hola! Quiero confirmar mi pedido por ${formatPrice(subtotal)}`)}
                >
                  Confirmar WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal />
      <GiftModal />
    </div>
  );
}

// ═══ ROOT EXPORT ═══
export default function App() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        if (auth) await signInAnonymously(auth);
      } catch (e) {
        console.warn("Running offline/demo mode.");
      } finally {
        setInit(true);
      }
    };
    initApp();
  }, []);

  if (!init) return (
    <div className="h-screen bg-[#FDFCF8] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <ErrorBoundaryRoot>
      <AnalyticsProvider>
        <CatalogProvider products={INITIAL_PRODUCTS}>
          <AtelierApp />
        </CatalogProvider>
      </AnalyticsProvider>
    </ErrorBoundaryRoot>
  );
}