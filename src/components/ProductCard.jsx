import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    Sparkles as SparklesIcon,
    Package,
    Clock,
    Flame,
    Award,
    Eye,
    Check,
} from 'lucide-react';

// --- HELPER: Formateo de Moneda ---
const formatPrice = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
    }).format(num);
};

const ProductCard = ({ product, index, onQuickView, onAddToCart, isFavorite, onToggleFavorite }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [showInfo, setShowInfo] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // Delay de 250ms para mostrar info (evita flicker en hover rápido)
    useEffect(() => {
        let timer;
        if (isHovered) {
            timer = setTimeout(() => setShowInfo(true), 250);
        } else {
            setShowInfo(false);
        }
        return () => clearTimeout(timer);
    }, [isHovered]);

    // Reset del estado "agregado al carrito"
    useEffect(() => {
        if (addedToCart) {
            const timer = setTimeout(() => setAddedToCart(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [addedToCart]);

    // Tracking del mouse para zoom + tilt 3D
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
    };

    const p = product;
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div
                ref={cardRef}
                className="group relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setMousePos({ x: 0.5, y: 0.5 });
                }}
                onMouseMove={handleMouseMove}
                onClick={() => onQuickView(p)}
                style={{ perspective: '800px' }}
            >
                {/* ═══ GLOW DORADO AMBIENTAL ═══ */}
                <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full transition-all duration-700 pointer-events-none"
                    style={{
                        background: isHovered
                            ? 'radial-gradient(ellipse, rgba(197,160,89,0.25) 0%, transparent 70%)'
                            : 'transparent',
                        filter: 'blur(8px)',
                    }}
                />

                {/* ═══ CARD PRINCIPAL CON TILT 3D ═══ */}
                <div
                    className="relative aspect-[3/4] bg-white rounded-[28px] overflow-hidden border border-stone-100 transition-shadow duration-500"
                    style={{
                        transform: isHovered
                            ? `rotateY(${(mousePos.x - 0.5) * 8}deg) rotateX(${(0.5 - mousePos.y) * 8}deg) translateY(-8px)`
                            : 'rotateY(0deg) rotateX(0deg) translateY(0px)',
                        transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.5s ease',
                        boxShadow: isHovered
                            ? '0 25px 60px -10px rgba(0,0,0,0.15), 0 0 40px -15px rgba(197,160,89,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.04)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* ═══ BADGES SUPERIORES ═══ */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {p.isNew && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="bg-emerald-500 text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/30"
                            >
                                ✦ Nuevo
                            </motion.span>
                        )}
                        {p.isBestseller && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                                className="bg-[#C5A059] text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#C5A059]/30"
                            >
                                ★ Best Seller
                            </motion.span>
                        )}
                        {discount > 0 && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="bg-red-500 text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/30"
                            >
                                -{discount}% OFF
                            </motion.span>
                        )}
                    </div>

                    {/* ═══ BOTÓN DE FAVORITO ═══ */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(p.id);
                        }}
                        className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite
                                ? 'bg-red-50 text-red-500 shadow-lg shadow-red-200/50 scale-110'
                                : 'bg-white/80 backdrop-blur-sm text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-50'
                            }`}
                    >
                        <Heart
                            size={15}
                            className={`transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'hover:scale-125'}`}
                        />
                    </button>

                    {/* ═══ IMAGEN CON MINI ZOOM ═══ */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="w-full h-full transition-transform duration-700 ease-out"
                            style={{
                                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                                transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
                            }}
                        >
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain p-6"
                                loading="lazy"
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* ═══ OVERLAY GRADIENTE CON INFO ═══ */}
                    <div
                        className="absolute inset-0 z-10 flex flex-col justify-end transition-opacity duration-500"
                        style={{
                            opacity: showInfo ? 1 : 0,
                            pointerEvents: showInfo ? 'auto' : 'none',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 70%, transparent 100%)',
                        }}
                    >
                        <div className="p-5 space-y-3">
                            {/* ── NOMBRE Y PRECIO ── */}
                            <div
                                className="transition-all duration-500"
                                style={{
                                    opacity: showInfo ? 1 : 0,
                                    transform: showInfo ? 'translateY(0)' : 'translateY(15px)',
                                    transitionDelay: '0s',
                                }}
                            >
                                <h4 className="font-brand text-xl text-white leading-tight mb-1">{p.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#C5A059] font-bold text-base">{formatPrice(p.price)}</span>
                                    {p.oldPrice && (
                                        <span className="text-white/40 line-through text-xs">{formatPrice(p.oldPrice)}</span>
                                    )}
                                </div>
                            </div>

                            {/* ── NOTAS OLFATIVAS ── */}
                            {p.notes && (
                                <div
                                    className="grid grid-cols-3 gap-1.5 transition-all duration-500"
                                    style={{
                                        opacity: showInfo ? 1 : 0,
                                        transform: showInfo ? 'translateY(0)' : 'translateY(12px)',
                                        transitionDelay: '0.05s',
                                    }}
                                >
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10 hover:bg-white/15 transition-colors">
                                        <div className="flex items-center gap-1 mb-1">
                                            <SparklesIcon size={8} className="text-amber-400" />
                                            <span className="text-[7px] font-bold text-amber-400 uppercase tracking-wider">Salida</span>
                                        </div>
                                        <p className="text-[8px] text-white/80 leading-tight line-clamp-2">{p.notes.top}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10 hover:bg-white/15 transition-colors">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Heart size={8} className="text-rose-400" />
                                            <span className="text-[7px] font-bold text-rose-400 uppercase tracking-wider">Corazón</span>
                                        </div>
                                        <p className="text-[8px] text-white/80 leading-tight line-clamp-2">{p.notes.heart}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10 hover:bg-white/15 transition-colors">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Package size={8} className="text-stone-300" />
                                            <span className="text-[7px] font-bold text-stone-300 uppercase tracking-wider">Fondo</span>
                                        </div>
                                        <p className="text-[8px] text-white/80 leading-tight line-clamp-2">{p.notes.base}</p>
                                    </div>
                                </div>
                            )}

                            {/* ── DETALLES RÁPIDOS ── */}
                            <div
                                className="flex items-center gap-2 flex-wrap transition-all duration-500"
                                style={{
                                    opacity: showInfo ? 1 : 0,
                                    transform: showInfo ? 'translateY(0)' : 'translateY(12px)',
                                    transitionDelay: '0.1s',
                                }}
                            >
                                {p.duration && (
                                    <span className="flex items-center gap-1 text-[8px] text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
                                        <Clock size={8} /> {p.duration}
                                    </span>
                                )}
                                {p.family && (
                                    <span className="flex items-center gap-1 text-[8px] text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
                                        <Flame size={8} /> {p.family}
                                    </span>
                                )}
                                {p.occasion && (
                                    <span className="flex items-center gap-1 text-[8px] text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
                                        <Award size={8} /> {p.occasion}
                                    </span>
                                )}
                            </div>

                            {/* ── BARRA DE INTENSIDAD ── */}
                            {p.intensity && (
                                <div
                                    className="transition-all duration-500"
                                    style={{
                                        opacity: showInfo ? 1 : 0,
                                        transform: showInfo ? 'translateY(0)' : 'translateY(12px)',
                                        transitionDelay: '0.15s',
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest">
                                            Intensidad
                                        </span>
                                        <div className="flex gap-0.5 flex-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${i < p.intensity
                                                            ? 'bg-gradient-to-r from-[#C5A059] to-amber-400 shadow-sm shadow-[#C5A059]/30'
                                                            : 'bg-white/15'
                                                        }`}
                                                    style={{ transitionDelay: `${i * 0.05}s` }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[8px] font-black text-white/70">{p.intensity}/5</span>
                                    </div>
                                </div>
                            )}

                            {/* ── BOTONES DE ACCIÓN ── */}
                            <div
                                className="flex gap-2 transition-all duration-500"
                                style={{
                                    opacity: showInfo ? 1 : 0,
                                    transform: showInfo ? 'translateY(0)' : 'translateY(12px)',
                                    transitionDelay: '0.2s',
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart(p);
                                        setAddedToCart(true);
                                    }}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${addedToCart
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-white text-stone-900 hover:bg-[#C5A059] hover:text-white hover:shadow-lg hover:shadow-[#C5A059]/30'
                                        }`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check size={12} />
                                            ¡Agregado!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={12} />
                                            Agregar
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onQuickView(p);
                                    }}
                                    className="py-2.5 px-4 bg-white/15 backdrop-blur-sm text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-white/25 transition-all flex items-center justify-center gap-1 border border-white/20"
                                >
                                    <Eye size={12} />
                                    Ver
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ═══ LÍNEA DORADA INFERIOR DECORATIVA ═══ */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20">
                        <div
                            className="h-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent transition-all duration-700"
                            style={{
                                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                                transformOrigin: 'center',
                            }}
                        />
                    </div>
                </div>

                {/* ═══ INFORMACIÓN DEBAJO DE LA CARD ═══ */}
                <div className="mt-4 text-center space-y-1.5">
                    <h3 className="font-brand text-2xl text-stone-900 leading-tight">{p.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[#C5A059] font-bold text-lg">{formatPrice(p.price)}</span>
                        {p.oldPrice && (
                            <span className="text-stone-400 line-through text-sm">{formatPrice(p.oldPrice)}</span>
                        )}
                    </div>
                    {p.gender && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
                            {p.category === 'perfume'
                                ? p.gender === 'femenino'
                                    ? '♀ Femenino'
                                    : '♂ Masculino'
                                : p.category}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
