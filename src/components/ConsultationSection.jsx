import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Menu,
    X,
    ChevronRight,
    Star,
    Instagram,
    Facebook,
    Mail,
    Search,
    User,
    ArrowRight,
    Sparkles,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    Check,
    MessageCircle,
    Clock,
    Award,
    Users,
    Shield,
    Phone,
    MapPin,
    Heart
} from 'lucide-react';

// ═══ COMPONENTES AUXILIARES PARA SCENT SANCTUARY ═══

// Partícula de aroma flotante
const ScentParticle = ({ index, total }) => {
    const size = Math.random() * 4 + 1;
    const startX = Math.random() * 100;
    const dur = Math.random() * 6 + 4;
    const del = (index / total) * 8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{
                opacity: [0, 0.8, 0.6, 0],
                y: [0, -150, -300, -450],
                x: [0, Math.sin(index) * 60, Math.cos(index) * 40, Math.sin(index * 2) * 80],
                scale: [0, 1.2, 0.8, 0],
            }}
            transition={{ duration: dur, repeat: Infinity, delay: del, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
                left: `${startX}%`,
                bottom: '0%',
                width: size,
                height: size,
                background: `radial-gradient(circle, rgba(197,160,89,0.9) 0%, rgba(197,160,89,0) 70%)`,
                boxShadow: `0 0 ${size * 3}px rgba(197,160,89,0.4)`,
            }}
        />
    );
};

// Anillo orbital decorativo
const OrbitalRing = ({ size, duration, delay, opacity }) => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
        className="absolute rounded-full border pointer-events-none"
        style={{
            width: size,
            height: size,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: `rgba(197,160,89,${opacity})`,
            borderWidth: '1px',
            borderStyle: 'dashed',
        }}
    />
);

// Contador animado
const AnimatedCounter = ({ end, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const duration = 2000;
                    const step = end / (duration / 16);

                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, hasAnimated]);

    return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
};

// ═══ FORMULARIO QUIZ MODAL ═══
const QuickConsultForm = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const questions = [
        {
            id: 'gender',
            question: "¿Para quién es la fragancia?",
            options: [
                { value: 'mujer', label: 'Para Ella', icon: '♀', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30' },
                { value: 'hombre', label: 'Para Él', icon: '♂', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
                { value: 'unisex', label: 'Unisex', icon: '⚤', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30' },
            ]
        },
        {
            id: 'occasion',
            question: "¿Para qué ocasión?",
            options: [
                { value: 'dia', label: 'Día a Día', icon: '☀️', color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30' },
                { value: 'noche', label: 'Noche Especial', icon: '🌙', color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30' },
                { value: 'oficina', label: 'Oficina', icon: '💼', color: 'from-stone-500/20 to-gray-500/20 border-stone-500/30' },
                { value: 'regalo', label: 'Para Regalar', icon: '🎁', color: 'from-red-500/20 to-rose-500/20 border-red-500/30' },
            ]
        },
        {
            id: 'family',
            question: "¿Qué notas te atraen más?",
            options: [
                { value: 'floral', label: 'Florales', icon: '🌸', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
                { value: 'amaderado', label: 'Amaderados', icon: '🌲', color: 'from-green-700/20 to-emerald-700/20 border-green-700/30' },
                { value: 'citrico', label: 'Cítricos', icon: '🍋', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' },
                { value: 'oriental', label: 'Orientales', icon: '✨', color: 'from-[#C5A059]/20 to-amber-600/20 border-[#C5A059]/30' },
                { value: 'fresco', label: 'Frescos', icon: '💧', color: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30' },
            ]
        },
        {
            id: 'intensity',
            question: "¿Qué intensidad preferís?",
            options: [
                { value: 'suave', label: 'Sutil y Cercana', icon: '🕊️', color: 'from-stone-400/20 to-gray-400/20 border-stone-400/30' },
                { value: 'moderada', label: 'Equilibrada', icon: '⚖️', color: 'from-blue-400/20 to-indigo-400/20 border-blue-400/30' },
                { value: 'intensa', label: 'Potente y Duradera', icon: '🔥', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30' },
            ]
        }
    ];

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    const handleSelect = (value) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simular proceso
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Construir mensaje de WhatsApp
        const message = `Hola! Busco asesoramiento personalizado:
• Para: ${answers.gender}
• Ocasión: ${answers.occasion}
• Notas preferidas: ${answers.family}
• Intensidad: ${answers.intensity}`;

        window.open(`https://wa.me/5492920674938?text=${encodeURIComponent(message)}`, '_blank');
        setIsSubmitting(false);
        setIsComplete(true);
    };

    const isLastStep = step === questions.length - 1 && answers[currentQuestion?.id];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#1a1815] w-full max-w-lg rounded-[32px] overflow-hidden border border-[#C5A059]/20 shadow-2xl shadow-[#C5A059]/10 relative"
                    onClick={e => e.stopPropagation()}
                >
                    {isComplete ? (
                        <div className="p-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                            >
                                <Check size={36} className="text-white" />
                            </motion.div>
                            <h3 className="font-brand text-3xl text-white mb-3">¡Perfecto!</h3>
                            <p className="text-stone-400 mb-6">Te redirigimos a WhatsApp para completar tu consulta.</p>
                            <button
                                onClick={onClose}
                                className="text-[#C5A059] text-sm font-bold hover:underline"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Header con progreso */}
                            <div className="px-8 pt-8 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <span className="text-[#C5A059] text-[9px] font-bold uppercase tracking-[0.3em]">
                                            Paso {step + 1} de {questions.length}
                                        </span>
                                        <h3 className="font-brand text-xl text-white mt-1">Asesoría Personalizada</h3>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-stone-500 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#C5A059] to-amber-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* Pregunta actual */}
                            <div className="px-8 py-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className="text-white text-lg font-bold mb-5">{currentQuestion.question}</h4>

                                        <div className={`grid gap-3 ${currentQuestion.options.length <= 3 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                            {currentQuestion.options.map((option, i) => {
                                                const isSelected = answers[currentQuestion.id] === option.value;
                                                return (
                                                    <motion.button
                                                        key={option.value}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.06 }}
                                                        onClick={() => handleSelect(option.value)}
                                                        className={`relative p-4 rounded-2xl border text-left transition-all duration-300 group ${isSelected
                                                                ? `bg-gradient-to-br ${option.color} border-[#C5A059]/50 shadow-lg shadow-[#C5A059]/10`
                                                                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl">{option.icon}</span>
                                                            <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-stone-300 group-hover:text-white'
                                                                }`}>
                                                                {option.label}
                                                            </span>
                                                        </div>

                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute top-3 right-3 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center"
                                                            >
                                                                <Check size={10} className="text-white" />
                                                            </motion.div>
                                                        )}
                                                    </motion.button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navegación */}
                            <div className="px-8 pb-8 flex items-center justify-between">
                                <button
                                    onClick={() => step > 0 && setStep(step - 1)}
                                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${step > 0 ? 'text-stone-400 hover:text-white' : 'text-transparent pointer-events-none'
                                        }`}
                                >
                                    ← Anterior
                                </button>

                                {isLastStep && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-gradient-to-r from-[#C5A059] to-amber-500 text-stone-900 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#C5A059]/30 hover:shadow-xl hover:shadow-[#C5A059]/40 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <>
                                                <MessageCircle size={16} />
                                                Consultar por WhatsApp
                                            </>
                                        )}
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

// ═══ SECCIÓN PRINCIPAL SCENT SANCTUARY ═══
const ConsultationSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const contactMethods = [
        {
            id: 'whatsapp',
            icon: MessageCircle,
            title: "WhatsApp",
            subtitle: "Respuesta inmediata",
            description: "Chateá directamente con nuestro equipo de asesores expertos en fragancias.",
            action: () => window.open('https://wa.me/5492920674938?text=Hola! Quiero asesoramiento sobre perfumes', '_blank'),
            badge: "Online ahora",
            badgeColor: "bg-emerald-500"
        },
        {
            id: 'asesoria',
            icon: Sparkles,
            title: "Asesoría Guiada",
            subtitle: "Experiencia personalizada",
            description: "Respondé 4 preguntas y encontrá tu fragancia ideal con inteligencia aromática.",
            action: () => setShowForm(true),
            badge: "2 min",
            badgeColor: "bg-[#C5A059]"
        },
        {
            id: 'instagram',
            icon: Instagram,
            title: "Instagram",
            subtitle: "Novedades y drops",
            description: "Seguinos para enterarte de lanzamientos exclusivos y ediciones limitadas.",
            action: () => window.open('https://instagram.com/mkaromas', '_blank'),
            badge: "Seguir",
            badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
        }
    ];

    const stats = [
        { value: 2500, suffix: '+', label: 'Clientes felices', icon: Users },
        { value: 98, suffix: '%', label: 'Satisfacción', icon: Star },
        { value: 10, suffix: 'min', label: 'Tiempo de respuesta', icon: Clock },
        { value: 50, suffix: '+', label: 'Fragancias', icon: Award },
    ];

    const testimonials = [
        { text: '"Me asesoraron perfecto. El perfume que me recomendaron es exactamente lo que buscaba."', author: 'Carolina M.', rating: 5 },
        { text: '"Increíble atención. Me respondieron al instante y me ayudaron a elegir un regalo espectacular."', author: 'Martín L.', rating: 5 },
        { text: '"La asesoría personalizada es un golazo. En 2 minutos tenía mi fragancia ideal."', author: 'Valentina R.', rating: 5 },
    ];

    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <section className="relative w-full py-32 overflow-hidden bg-[#0f0e0c]">
                {/* ═══ FONDOS AMBIENTALES ═══ */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.08)_0%,_transparent_60%)]" />
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0f0e0c] to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0f0e0c] to-transparent z-10 pointer-events-none" />

                {/* Anillos orbitales */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <OrbitalRing size={400} duration={60} delay={0} opacity={0.05} />
                    <OrbitalRing size={600} duration={80} delay={2} opacity={0.03} />
                    <OrbitalRing size={800} duration={100} delay={4} opacity={0.02} />
                </div>

                {/* Patrón de puntos */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(197,160,89,1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

                {/* Partículas de aroma */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(25)].map((_, i) => (
                        <ScentParticle key={i} index={i} total={25} />
                    ))}
                </div>

                <div className="relative z-20 container mx-auto px-4 max-w-6xl">
                    {/* ═══ HEADER ═══ */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring", damping: 15 }}
                            className="relative inline-flex items-center justify-center mb-8"
                        >
                            <div className="absolute w-24 h-24 bg-[#C5A059]/10 rounded-full blur-xl" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-[#C5A059]/20 to-amber-600/10 rounded-full flex items-center justify-center border border-[#C5A059]/20 backdrop-blur-sm">
                                <Sparkles className="text-[#C5A059]" size={24} />
                            </div>
                        </motion.div>

                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="block text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.5em] mb-6"
                        >
                            Santuario del Aroma
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="font-brand text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8"
                        >
                            Encontrá Tu{' '}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5D1A1] via-[#C5A059] to-[#E5D1A1]"
                                    style={{ backgroundSize: '200% 200%', animation: 'gradient-x 4s ease infinite' }}>
                                    Fragancia
                                </span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent origin-center"
                                />
                            </span>
                            <br />Perfecta
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-stone-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
                        >
                            Cada aroma cuenta una historia diferente. Nuestros expertos te guían
                            para descubrir la nota olfativa que <span className="text-[#C5A059]">define tu esencia</span>.
                        </motion.p>
                    </div>

                    {/* ═══ TARJETAS DE CONTACTO ═══ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {contactMethods.map((method, index) => {
                            const isHov = hoveredCard === method.id;
                            return (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                    onMouseEnter={() => setHoveredCard(method.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={method.action}
                                    className="relative group cursor-pointer"
                                >
                                    {/* Borde glow */}
                                    <div
                                        className="absolute -inset-[1px] rounded-[28px] transition-opacity duration-700"
                                        style={{
                                            background: isHov
                                                ? 'linear-gradient(135deg, rgba(197,160,89,0.3), rgba(197,160,89,0.05), rgba(197,160,89,0.3))'
                                                : 'transparent',
                                            opacity: isHov ? 1 : 0
                                        }}
                                    />

                                    <div
                                        className="relative bg-white/[0.03] backdrop-blur-sm rounded-[28px] border border-white/[0.06] p-8 h-full transition-all duration-500 overflow-hidden"
                                        style={{
                                            transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                                            borderColor: isHov ? 'rgba(197,160,89,0.2)' : 'rgba(255,255,255,0.06)',
                                            boxShadow: isHov ? '0 20px 60px -15px rgba(197,160,89,0.15)' : 'none'
                                        }}
                                    >
                                        {/* Gradiente interno */}
                                        <div
                                            className="absolute inset-0 transition-opacity duration-700 rounded-[28px]"
                                            style={{
                                                background: 'radial-gradient(circle at 30% 20%, rgba(197,160,89,0.06) 0%, transparent 60%)',
                                                opacity: isHov ? 1 : 0
                                            }}
                                        />

                                        <div className="relative flex items-center justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isHov ? 'bg-[#C5A059]/20 shadow-lg shadow-[#C5A059]/10' : 'bg-white/[0.05]'
                                                }`}>
                                                <method.icon size={24} className={`transition-all duration-500 ${isHov ? 'text-[#C5A059] scale-110' : 'text-stone-400'
                                                    }`} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white ${method.badgeColor}`}>
                                                {method.badge}
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <h3 className="text-white text-xl font-bold mb-1 group-hover:text-[#C5A059] transition-colors duration-300">
                                                {method.title}
                                            </h3>
                                            <p className="text-[#C5A059]/70 text-xs font-bold uppercase tracking-wider mb-3">
                                                {method.subtitle}
                                            </p>
                                            <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                                {method.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-stone-500 group-hover:text-[#C5A059] transition-colors">
                                                <span className="text-xs font-bold uppercase tracking-wider">
                                                    {method.id === 'asesoria' ? 'Comenzar' : method.id === 'instagram' ? 'Seguir' : 'Abrir chat'}
                                                </span>
                                                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ═══ STATS ANIMADOS ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className="text-center group"
                            >
                                <div className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/[0.05] group-hover:border-[#C5A059]/20 group-hover:bg-[#C5A059]/5 transition-all">
                                    <stat.icon size={18} className="text-stone-500 group-hover:text-[#C5A059] transition-colors" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-white mb-1 font-brand">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ═══ TESTIMONIAL ROTATIVO ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto text-center mb-20"
                    >
                        <div className="relative bg-white/[0.02] rounded-[28px] border border-white/[0.05] p-10 backdrop-blur-sm">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/20">
                                <span className="text-[#C5A059] text-lg font-brand">&ldquo;</span>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTestimonial}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex justify-center gap-1 mb-4">
                                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-[#C5A059] text-[#C5A059]" />
                                        ))}
                                    </div>
                                    <p className="text-white/80 text-lg font-light leading-relaxed mb-4 font-brand italic">
                                        {testimonials[activeTestimonial].text}
                                    </p>
                                    <p className="text-[#C5A059] text-sm font-bold">
                                        {testimonials[activeTestimonial].author}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-center gap-2 mt-6">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`transition-all duration-300 rounded-full ${activeTestimonial === index
                                                ? 'w-6 h-2 bg-[#C5A059]'
                                                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ TRUST FOOTER ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <p className="text-stone-500 text-xs mb-6 flex items-center justify-center gap-2">
                            <Shield size={12} className="text-[#C5A059]" />
                            Asesoramiento 100% gratuito · Sin compromiso · Respuesta garantizada
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-stone-500">
                            <a href="tel:+5492920674938" className="flex items-center gap-2 text-xs hover:text-[#C5A059] transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#C5A059]/30 group-hover:bg-[#C5A059]/5 transition-all">
                                    <Phone size={12} />
                                </div>
                                +54 9 2920 674938
                            </a>
                            <a href="mailto:contacto@mkaromas.com" className="flex items-center gap-2 text-xs hover:text-[#C5A059] transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#C5A059]/30 group-hover:bg-[#C5A059]/5 transition-all">
                                    <Mail size={12} />
                                </div>
                                contacto@mkaromas.com
                            </a>
                            <span className="flex items-center gap-2 text-xs">
                                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                    <MapPin size={12} />
                                </div>
                                Viedma, Río Negro
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Modal del Quiz */}
            <QuickConsultForm isOpen={showForm} onClose={() => setShowForm(false)} />

            {/* CSS para gradiente animado */}
            <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
        </>
    );
};

export default ConsultationSection;
