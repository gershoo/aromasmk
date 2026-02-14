import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    Star, Heart, Check, ChevronDown, ChevronUp, Camera,
    Sparkles, Package, Truck, MapPin, Clock, Eye, X,
    ThumbsUp, ThumbsDown, Send, User, MessageSquare,
    Plus, Gift, Smile, PenLine, CheckCircle2
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 DATOS
// ═══════════════════════════════════════════════════════════════════════════

const PRODUCTS_LIST = [
    { id: 1, name: 'Athenea Blossom', image: 'https://i.ibb.co/YFR35655/athenea-blossom-3d.png' },
    { id: 2, name: 'Luna Aura', image: 'https://i.ibb.co/cXX7FJmk/Chat-GPT-Image-11-ene-2026-03-11-07-p-m.png' },
    { id: 3, name: 'Athenea Classique', image: 'https://i.ibb.co/ccsgYh20/athenea.png' },
    { id: 4, name: 'Intense Night', image: 'https://i.ibb.co/G4GhYW2N/Chat-GPT-Image-17-dic-2025-10-52-39-p-m.png' },
    { id: 5, name: 'Velvet Rose', image: 'https://i.ibb.co/YFR35655/athenea-blossom-3d.png' },
    { id: 6, name: 'Ocean Breeze', image: 'https://i.ibb.co/cXX7FJmk/Chat-GPT-Image-11-ene-2026-03-11-07-p-m.png' },
];

const INITIAL_REVIEWS = [
    {
        id: 1,
        user: { name: 'María Fernández', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', location: 'Buenos Aires', verified: true },
        rating: 5, date: '2025-01-18',
        title: 'Superó mis expectativas totalmente',
        content: `Compré Athenea Blossom después de leer las reseñas y no me arrepiento para nada. 

Lo primero que me sorprendió fue el packaging: llegó en una caja preciosa con papel de seda, parecía un regalo de lujo. El frasco es pesado, se siente la calidad apenas lo agarrás.

El aroma es increíble, fresco pero elegante. Lo uso para ir a trabajar y ya me preguntaron 3 veces qué perfume uso. Dura todo el día, llegué a casa después de 10 horas y todavía se sentía.

Definitivamente vuelvo a comprar, MK Aromas tiene un cliente fiel.`,
        product: 'Athenea Blossom',
        productImage: 'https://i.ibb.co/YFR35655/athenea-blossom-3d.png',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
        purchaseVerified: true, brandLiked: true,
        satisfaction: { yes: 24, no: 1 }, userVote: null
    },
    {
        id: 2,
        user: { name: 'Luciana Castro', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', location: 'Córdoba', verified: true },
        rating: 5, date: '2025-01-15',
        title: 'Calidad increíble, me encantó el envío',
        content: `Soy de Córdoba y tenía dudas de comprar online, pero la experiencia fue perfecta.

El perfume llegó en tiempo récord, super bien empaquetado. Se nota que cuidan cada detalle: el frasco venía envuelto en burbujas y la caja no tenía ni un raspón.

Luna Aura tiene un aroma espectacular, dulce pero no empalagoso. Mi novio dice que le encanta cuando lo uso.`,
        product: 'Luna Aura',
        productImage: 'https://i.ibb.co/cXX7FJmk/Chat-GPT-Image-11-ene-2026-03-11-07-p-m.png',
        images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400'],
        purchaseVerified: true, brandLiked: true,
        satisfaction: { yes: 22, no: 0 }, userVote: null
    },
    {
        id: 3,
        user: { name: 'Carolina Méndez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', location: 'Rosario', verified: true },
        rating: 5, date: '2025-01-12',
        title: 'Primera compra y quedé fascinada',
        content: `Era mi primera vez comprando perfumes por internet y MK Aromas me hizo sentir re segura desde el principio.

Me respondieron todas las dudas por WhatsApp antes de comprar, súper amables. Cuando llegó el paquete me emocioné: venía con una tarjeta escrita a mano agradeciéndome la compra.

El perfume (Athenea Classique) es hermoso, elegante, perfecto para el trabajo.`,
        product: 'Athenea Classique',
        productImage: 'https://i.ibb.co/ccsgYh20/athenea.png',
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'],
        purchaseVerified: true, brandLiked: true,
        satisfaction: { yes: 31, no: 2 }, userVote: null
    },
    {
        id: 4,
        user: { name: 'Valentina López', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', location: 'Mendoza', verified: true },
        rating: 5, date: '2025-01-08',
        title: 'Excelente relación calidad-precio',
        content: `Compré el Intense Night para regalarle a mi esposo y fue un éxito total.

El packaging es de primera, llegó en una caja preciosa que ni tuve que envolver. A él le encantó, dice que es el mejor perfume que tuvo.

La atención al cliente es otro nivel, me ayudaron a elegir la fragancia por mensaje y acertaron perfecto.`,
        product: 'Intense Night',
        productImage: 'https://i.ibb.co/G4GhYW2N/Chat-GPT-Image-17-dic-2025-10-52-39-p-m.png',
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
        purchaseVerified: true, brandLiked: true,
        satisfaction: { yes: 19, no: 0 }, userVote: null
    }
];

const STATS = {
    totalReviews: 12, averageRating: 5.0, recommendPercent: 100,
    distribution: [
        { stars: 5, count: 12, percent: 100 },
        { stars: 4, count: 0, percent: 0 },
        { stars: 3, count: 0, percent: 0 },
        { stars: 2, count: 0, percent: 0 },
        { stars: 1, count: 0, percent: 0 }
    ],
    highlights: [
        { label: 'Duración', score: 5.0 },
        { label: 'Empaque', score: 5.0 },
        { label: 'Envío', score: 5.0 },
        { label: 'Atención', score: 5.0 },
        { label: 'Calidad', score: 5.0 }
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ ESTRELLAS ANIMADAS INTERACTIVAS
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedStars = ({ rating, size = 20, interactive = false, onChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const displayRating = interactive ? (hoverRating || rating) : rating;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= displayRating;
                return (
                    <motion.button
                        key={star} type="button" disabled={!interactive}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        whileHover={interactive ? { scale: 1.2, rotate: 15 } : {}}
                        whileTap={interactive ? { scale: 0.9 } : {}}
                        className={`relative ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                        <Star size={size} className="text-stone-200" strokeWidth={1.5} />
                        <motion.div className="absolute inset-0"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: filled ? 1 : 0, rotate: filled ? 0 : -180 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: interactive ? 0 : star * 0.05 }}
                        >
                            <Star size={size} className="text-[#C5A059]" fill="currentColor" strokeWidth={0} />
                        </motion.div>
                        {filled && !interactive && (
                            <motion.div className="absolute inset-0" initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 1, delay: star * 0.1 }}>
                                <Sparkles size={size} className="text-yellow-300" strokeWidth={1} />
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📊 ESTADÍSTICAS
// ═══════════════════════════════════════════════════════════════════════════

const ReviewStats = ({ stats, onWriteReview }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-[40px] p-8 lg:p-10 text-white relative overflow-hidden"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div key={i} className="absolute w-1 h-1 bg-[#C5A059] rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
                    />
                ))}
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
                {/* Rating Principal */}
                <div className="text-center lg:border-r border-white/10 lg:pr-10">
                    <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ type: 'spring', delay: 0.2 }}>
                        <span className="text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#C5A059] to-amber-400 bg-clip-text text-transparent">
                            {stats.averageRating}
                        </span>
                    </motion.div>
                    <div className="flex justify-center my-4"><AnimatedStars rating={stats.averageRating} size={28} /></div>
                    <p className="text-white/60">Basado en <span className="text-white font-bold">{stats.totalReviews}</span> reseñas</p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
                        className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full">
                        <Check size={16} strokeWidth={3} />
                        <span className="font-bold">{stats.recommendPercent}%</span>
                        <span className="text-sm">lo recomiendan</span>
                    </motion.div>
                </div>

                {/* Distribución */}
                <div className="space-y-3">
                    <h4 className="font-bold text-white/80 mb-4">Distribución</h4>
                    {stats.distribution.map((item, i) => (
                        <motion.div key={item.stars} initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 group">
                            <span className="w-8 text-sm font-bold text-white/60 group-hover:text-white transition-colors">{item.stars}★</span>
                            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${item.percent}%` } : {}}
                                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-[#C5A059] to-amber-500 rounded-full" />
                            </div>
                            <span className="w-8 text-right text-sm text-white/60">{item.count}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Highlights */}
                <div>
                    <h4 className="font-bold text-white/80 mb-4">Aspectos destacados</h4>
                    <div className="space-y-3">
                        {stats.highlights.map((item, i) => (
                            <motion.div key={item.label} initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center justify-between">
                                <span className="text-white/70 text-sm">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${(item.score / 5) * 100}%` } : {}}
                                            transition={{ duration: 1, delay: 0.6 + i * 0.1 }} className="h-full bg-[#C5A059] rounded-full" />
                                    </div>
                                    <span className="font-bold text-[#C5A059] w-8 text-sm">{item.score}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-[#C5A059] to-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <PenLine size={28} className="text-white" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">¿Ya probaste nuestros perfumes?</h4>
                        <p className="text-white/60 text-sm mb-4">Tu opinión ayuda a otros clientes</p>
                    </motion.div>
                    <motion.button onClick={onWriteReview} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#C5A059] to-amber-500 text-stone-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#C5A059]/30">
                        <Plus size={20} />Escribir reseña
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 MODAL PARA ESCRIBIR RESEÑA
// ═══════════════════════════════════════════════════════════════════════════

const WriteReviewModal = ({ isOpen, onClose, onSubmit, products }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', location: '', email: '', rating: 0, product: null, title: '', content: '', images: [], recommend: true });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.slice(0, 3 - formData.images.length).map(file => ({ file, preview: URL.createObjectURL(file) }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!formData.name.trim()) e.name = 'Ingresá tu nombre';
            if (!formData.location.trim()) e.location = 'Ingresá tu ciudad';
            if (!formData.email.trim()) e.email = 'Ingresá tu email';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email inválido';
        }
        if (s === 2) {
            if (!formData.product) e.product = 'Seleccioná un producto';
            if (formData.rating === 0) e.rating = 'Seleccioná una calificación';
        }
        if (s === 3) {
            if (!formData.title.trim()) e.title = 'Agregá un título';
            if (!formData.content.trim()) e.content = 'Escribí tu experiencia';
            else if (formData.content.length < 20) e.content = 'Mínimo 20 caracteres';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
    const prevStep = () => { setStep(s => s - 1); setErrors({}); };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        onSubmit({
            ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0],
            user: { name: formData.name, location: formData.location, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=C5A059&color=fff&size=150`, verified: false },
            purchaseVerified: false, brandLiked: false, satisfaction: { yes: 0, no: 0 }, userVote: null, productImage: formData.product?.image
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => { onClose(); setStep(1); setFormData({ name: '', location: '', email: '', rating: 0, product: null, title: '', content: '', images: [], recommend: true }); setIsSuccess(false); }, 2000);
    };

    const resetAndClose = () => { onClose(); setStep(1); setErrors({}); setFormData({ name: '', location: '', email: '', rating: 0, product: null, title: '', content: '', images: [], recommend: true }); };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={resetAndClose}>
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()} className="bg-white rounded-[32px] w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                    {isSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-white" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-2">¡Gracias por tu reseña!</h3>
                            <p className="text-stone-600">Tu opinión es muy valiosa para nosotros y para otros clientes</p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-[#C5A059] to-amber-500 p-6 text-white">
                                <button onClick={resetAndClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><X size={18} /></button>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><PenLine size={24} /></div>
                                    <div><h2 className="text-xl font-bold">Escribir reseña</h2><p className="text-white/80 text-sm">Compartí tu experiencia</p></div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    {[1, 2, 3].map((s) => (
                                        <React.Fragment key={s}>
                                            <motion.div animate={{ scale: step === s ? 1.1 : 1, backgroundColor: step >= s ? '#fff' : 'rgba(255,255,255,0.3)' }}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ color: step >= s ? '#C5A059' : '#fff' }}>
                                                {step > s ? <Check size={16} /> : s}
                                            </motion.div>
                                            {s < 3 && <motion.div className="flex-1 h-1 rounded-full" animate={{ backgroundColor: step > s ? '#fff' : 'rgba(255,255,255,0.3)' }} />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[50vh]">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h3 className="text-lg font-bold text-stone-900 mb-4">Tus datos</h3>
                                            {[{ key: 'name', label: 'Nombre *', icon: User, placeholder: 'Ej: María García' },
                                            { key: 'location', label: 'Ciudad *', icon: MapPin, placeholder: 'Ej: Buenos Aires' },
                                            { key: 'email', label: 'Email *', icon: MessageSquare, placeholder: 'tu@email.com', type: 'email' }
                                            ].map(field => (
                                                <div key={field.key}>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">{field.label}</label>
                                                    <div className="relative">
                                                        <field.icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                                        <input type={field.type || 'text'} value={formData[field.key]}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                            placeholder={field.placeholder}
                                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors[field.key] ? 'border-red-500' : 'border-stone-200'} bg-stone-50 text-stone-900 focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all`} />
                                                    </div>
                                                    {errors[field.key] && <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>}
                                                    {field.key === 'email' && <p className="text-xs text-stone-500 mt-1">No será publicado</p>}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                    {step === 2 && (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-stone-900 mb-4">¿Qué producto compraste?</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {products.map((product) => (
                                                        <motion.button key={product.id} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                            onClick={() => setFormData(prev => ({ ...prev, product }))}
                                                            className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.product?.id === product.id ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-stone-200 hover:border-[#C5A059]/50'}`}>
                                                            <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
                                                            <span className="text-sm font-medium text-stone-900 text-left">{product.name}</span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                {errors.product && <p className="text-red-500 text-xs mt-2">{errors.product}</p>}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-stone-900 mb-4">¿Qué calificación le das?</h3>
                                                <div className="flex flex-col items-center">
                                                    <AnimatedStars rating={formData.rating} size={40} interactive onChange={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
                                                    <p className="text-stone-500 mt-2 text-sm">
                                                        {formData.rating === 5 && '¡Excelente!'}{formData.rating === 4 && 'Muy bueno'}{formData.rating === 3 && 'Bueno'}{formData.rating === 2 && 'Regular'}{formData.rating === 1 && 'Malo'}{formData.rating === 0 && 'Tocá las estrellas'}
                                                    </p>
                                                </div>
                                                {errors.rating && <p className="text-red-500 text-xs mt-2 text-center">{errors.rating}</p>}
                                            </div>
                                        </motion.div>
                                    )}
                                    {step === 3 && (
                                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <h3 className="text-lg font-bold text-stone-900 mb-4">Contanos tu experiencia</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Título de tu reseña *</label>
                                                <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Ej: Me encantó el perfume" maxLength={80}
                                                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-stone-200'} bg-stone-50 text-stone-900 focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all`} />
                                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Tu experiencia *</label>
                                                <textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                                    placeholder="¿Qué te pareció el producto? ¿Cómo fue tu experiencia de compra?" rows={5} maxLength={1000}
                                                    className={`w-full px-4 py-3 rounded-xl border ${errors.content ? 'border-red-500' : 'border-stone-200'} bg-stone-50 text-stone-900 focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all resize-none`} />
                                                <div className="flex justify-between mt-1">
                                                    {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                                                    <p className="text-xs text-stone-500 ml-auto">{formData.content.length}/1000</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-2">Fotos (opcional)</label>
                                                <div className="flex gap-3 flex-wrap">
                                                    {formData.images.map((img, i) => (
                                                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                                                            <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={12} className="text-white" /></button>
                                                        </div>
                                                    ))}
                                                    {formData.images.length < 3 && (
                                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                                            className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center hover:border-[#C5A059] transition-colors">
                                                            <Camera size={20} className="text-stone-400" /><span className="text-xs text-stone-400 mt-1">Agregar</span>
                                                        </button>
                                                    )}
                                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                                                <Smile size={24} className="text-[#C5A059]" />
                                                <span className="text-stone-700 flex-1">¿Recomendarías MK Aromas?</span>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, recommend: true }))}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.recommend ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'}`}>Sí</button>
                                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, recommend: false }))}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${!formData.recommend ? 'bg-red-500 text-white' : 'bg-stone-200 text-stone-600'}`}>No</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-stone-200 flex gap-3">
                                {step > 1 && <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 transition-colors">Atrás</button>}
                                {step < 3 ? (
                                    <button onClick={nextStep} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-amber-500 text-white font-bold hover:shadow-lg transition-all">Continuar</button>
                                ) : (
                                    <motion.button onClick={handleSubmit} disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-amber-500 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isSubmitting ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Enviando...</>) : (<><Send size={18} />Publicar reseña</>)}
                                    </motion.button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 💬 TARJETA DE RESEÑA CON VOTACIÓN "SATISFACTORIO"
// ═══════════════════════════════════════════════════════════════════════════

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
};

const ReviewCard = ({ review, index, onVote }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const shouldTruncate = review.content.length > 200;
    const displayContent = shouldTruncate && !isExpanded ? review.content.slice(0, 200) + '...' : review.content;

    return (
        <>
            <motion.article ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-100">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#C5A059]/20 ring-offset-2 ring-offset-white">
                                <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                            </div>
                            {review.user.verified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check size={10} className="text-white" strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-stone-900">{review.user.name}</h4>
                                {review.purchaseVerified && (
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10} /> Compra verificada</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                                <span className="flex items-center gap-1"><MapPin size={12} />{review.user.location}</span>
                                <span className="flex items-center gap-1"><Clock size={12} />{formatDate(review.date)}</span>
                            </div>
                            <div className="mt-2"><AnimatedStars rating={review.rating} size={16} /></div>
                        </div>
                        {review.productImage && (
                            <div className="flex-shrink-0 hidden sm:block">
                                <div className="w-16 h-16 bg-stone-100 rounded-xl p-2">
                                    <img src={review.productImage} alt={review.product} className="w-full h-full object-contain" />
                                </div>
                            </div>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mb-2">{review.title}</h3>
                    <p className="text-stone-600 leading-relaxed whitespace-pre-line">{displayContent}</p>
                    {shouldTruncate && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#C5A059] font-medium text-sm mt-2 hover:underline flex items-center gap-1">
                            {isExpanded ? <>Ver menos <ChevronUp size={14} /></> : <>Leer más <ChevronDown size={14} /></>}
                        </button>
                    )}

                    {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {review.images.map((img, idx) => (
                                <motion.button key={idx} whileHover={{ scale: 1.05 }} onClick={() => setActiveImage(img)} className="w-20 h-20 rounded-xl overflow-hidden">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {/* Footer: Satisfactorio */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
                        <span className="text-sm text-stone-500">¿Te resultó satisfactoria esta reseña?</span>
                        <div className="flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onVote(review.id, 'yes')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${review.userVote === 'yes' ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-600 hover:bg-emerald-50'}`}>
                                <ThumbsUp size={14} /><span>{review.satisfaction.yes}</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onVote(review.id, 'no')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${review.userVote === 'no' ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600 hover:bg-red-50'}`}>
                                <ThumbsDown size={14} /><span>{review.satisfaction.no}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.article>

            {/* Lightbox */}
            <AnimatePresence>
                {activeImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setActiveImage(null)}>
                        <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={activeImage} alt="" className="max-w-full max-h-[90vh] rounded-2xl" />
                        <button onClick={() => setActiveImage(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"><X size={24} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};



// ═══════════════════════════════════════════════════════════════════════════
// 🏆 COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

const ReviewsSection = () => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const handleVote = useCallback((reviewId, vote) => {
        setReviews(prev => prev.map(review => {
            if (review.id !== reviewId) return review;
            const currentVote = review.userVote;
            let s = { ...review.satisfaction };
            if (currentVote === vote) { s[vote]--; return { ...review, satisfaction: s, userVote: null }; }
            else { if (currentVote) s[currentVote]--; s[vote]++; return { ...review, satisfaction: s, userVote: vote }; }
        }));
    }, []);

    const handleNewReview = useCallback((newReview) => { setReviews(prev => [newReview, ...prev]); }, []);

    const filteredReviews = useMemo(() => {
        let result = [...reviews];
        if (filter !== 'all') result = result.filter(r => r.rating === parseInt(filter));
        if (sortBy === 'recent') result.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (sortBy === 'satisfactory') result.sort((a, b) => b.satisfaction.yes - a.satisfaction.yes);
        else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
        return result;
    }, [reviews, filter, sortBy]);

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-stone-50 to-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-[#C5A059]/10 px-4 py-2 rounded-full mb-4">
                        <Sparkles className="text-[#C5A059]" size={18} />
                        <span className="text-[#C5A059] font-medium">Lo que dicen nuestros clientes</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
                        Reseñas reales de{' '}<span className="bg-gradient-to-r from-[#C5A059] to-amber-500 bg-clip-text text-transparent">clientes reales</span>
                    </h2>
                    <p className="text-stone-600 max-w-2xl mx-auto">Opiniones verificadas de personas que ya probaron nuestros perfumes. ¿Ya hiciste tu compra? ¡Dejá tu reseña!</p>
                </motion.div>

                <ReviewStats stats={STATS} onWriteReview={() => setShowWriteModal(true)} />

                {/* Filtros */}
                <div className="flex flex-wrap items-center justify-between gap-4 my-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-stone-500">Filtrar:</span>
                        {['all', '5', '4', '3', '2', '1'].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-[#C5A059] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                                {f === 'all' ? 'Todas' : `${f}★`}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-500">Ordenar:</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-sm border-none focus:ring-2 focus:ring-[#C5A059]">
                            <option value="recent">Más recientes</option>
                            <option value="satisfactory">Más satisfactorias</option>
                            <option value="rating">Mayor calificación</option>
                        </select>
                    </div>
                </div>

                {/* Reviews */}
                <div className="grid gap-6">
                    {filteredReviews.map((review, index) => (<ReviewCard key={review.id} review={review} index={index} onVote={handleVote} />))}
                </div>

                {filteredReviews.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare size={32} className="text-stone-400" /></div>
                        <p className="text-stone-500">No hay reseñas con este filtro</p>
                    </motion.div>
                )}

                {/* Banner */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-stone-900 to-stone-800 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4"><Gift className="text-[#C5A059]" size={24} /><span className="text-[#C5A059] font-medium">¡Tu opinión importa!</span></div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">¿Ya probaste nuestros perfumes?</h3>
                            <p className="text-white/70 mb-6 max-w-lg">Compartí tu experiencia y ayudá a otros clientes a elegir. Todas las reseñas son importantes para nosotros.</p>
                            <motion.button onClick={() => setShowWriteModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#C5A059] to-amber-500 text-stone-900 font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-xl shadow-[#C5A059]/30">
                                <PenLine size={20} />Escribir mi reseña
                                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                            </motion.button>
                        </div>
                        <div className="flex gap-4">
                            {[...Array(3)].map((_, i) => (
                                <motion.div key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                                    className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Star size={28} className="text-[#C5A059]" fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>


            <WriteReviewModal isOpen={showWriteModal} onClose={() => setShowWriteModal(false)} onSubmit={handleNewReview} products={PRODUCTS_LIST} />
        </section>
    );
};

export default ReviewsSection;
