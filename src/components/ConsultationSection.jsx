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



// ═══ SECCIÓN PRINCIPAL SCENT SANCTUARY ═══
const ConsultationSection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const contactMethods = [
        {
            id: 'whatsapp',
            icon: MessageCircle,
            title: "WhatsApp",
            subtitle: "Asesoría Real",
            description: "Chateá directo conmigo para recibir una recomendación honesta y a tu medida.",
            action: () => window.open('https://wa.me/5492920674938?text=Hola!%20Me%20gustar%C3%ADa%20que%20me%20ayuden%20a%20elegir%20un%20perfume.', '_blank'),
            badge: "En línea",
            badgeColor: "bg-emerald-500"
        },
        {
            id: 'facebook',
            icon: Facebook,
            title: "Facebook",
            subtitle: "Novedades y Opiniones",
            description: "Enterate de lo que dicen otros clientes y no te pierdas ningún lanzamiento.",
            action: () => window.open('https://www.facebook.com/profile.php?id=61580521685802', '_blank'),
            badge: "Comunidad",
            badgeColor: "bg-[#1877F2]"
        },
        {
            id: 'instagram',
            icon: Instagram,
            title: "Instagram",
            subtitle: "Inspiración",
            description: "Fotos reales de los productos, stories diarias y lanzamientos exclusivos.",
            action: () => window.open('https://www.instagram.com/aromasmk_/', '_blank'),
            badge: "Seguinos",
            badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
        }
    ];

    const stats = [
        { value: 500, suffix: '+', label: 'Clientes felices', icon: Users },
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
                            CANALES DE CONTACTO
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="font-brand text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8"
                        >
                            Conectá con <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5D1A1] via-[#C5A059] to-[#E5D1A1]">
                                Nosotros
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-stone-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
                        >
                            Estamos acá para asesorarte. Elegí tu canal favorito y sumate al mundo <br /> <span className="text-[#C5A059]">MK Aromas</span>.
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
