import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    X, SparklesIcon, Bell, Send, Search, MessageSquare,
    ShoppingBag, ChevronUp, AlertCircle, Zap
} from 'lucide-react';
// Re-export Sparkles for convenience
import { Sparkles as SparklesIconRaw } from 'lucide-react';

// ═══ ANALYTICS CONTEXT ═══
const AnalyticsContext = createContext(null);
export const useAnalytics = () => useContext(AnalyticsContext);
export const AnalyticsProvider = ({ children }) => {
    const trackEvent = useCallback((eventName, data = {}) => { }, []);
    const trackProductView = useCallback((p) => trackEvent('view', { id: p.id }), [trackEvent]);
    const trackAddToCart = useCallback((p) => trackEvent('add_cart', { id: p.id }), [trackEvent]);
    return <AnalyticsContext.Provider value={{ trackEvent, trackProductView, trackAddToCart }}>{children}</AnalyticsContext.Provider>;
};

// ═══ SERVICE WORKER HOOK ═══
export const useServiceWorker = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const on = () => setIsOnline(true);
        const off = () => setIsOnline(false);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
    }, []);
    return { isOnline };
};

// ═══ ERROR BOUNDARY ═══
export class ErrorBoundaryRoot extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return (
            <div className="h-screen flex items-center justify-center bg-[#FDFCF8] text-center p-10">
                <div>
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="font-brand text-3xl mb-4">Error técnico</h2>
                    <button onClick={() => window.location.reload()} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold">Reiniciar</button>
                </div>
            </div>
        );
        return this.props.children;
    }
}

// ═══ LUXURY CURSOR ═══
export const LuxuryCursor = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    useEffect(() => {
        if (typeof window === 'undefined' || 'ontouchstart' in window) return;
        const move = (e) => {
            if (cursorRef.current) cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
            if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);
    return (
        <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
            <div ref={cursorRef} className="absolute w-10 h-10 border-2 border-[#C5A059] rounded-full mix-blend-difference transition-transform duration-100 ease-out" />
            <div ref={dotRef} className="absolute w-2 h-2 bg-[#C5A059] rounded-full mix-blend-difference transition-transform duration-75 ease-out" />
        </div>
    );
};

// ═══ AROMATIC PARTICLES ═══
export const AromaticParticles = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animId;
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * width, y: Math.random() * height,
            size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        }));
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#C5A059';
            particles.forEach(p => {
                p.x += p.speedX; p.y += p.speedY;
                if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
                ctx.globalAlpha = p.opacity;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            });
            animId = requestAnimationFrame(animate);
        };
        animate();
        const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
};

// ═══ PARALLAX ═══
export const ParallaxSection = ({ children, speed = 0.5, className = "" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
    return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

export const ParallaxBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParallaxSection speed={-0.2} className="absolute top-20 left-10"><div className="w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl" /></ParallaxSection>
        <ParallaxSection speed={0.3} className="absolute top-1/3 right-20"><div className="w-64 h-64 bg-rose-400/5 rounded-full blur-3xl" /></ParallaxSection>
    </div>
);

// ═══ ENGAGEMENT COMPONENTS ═══
export const UrgencyBanner = () => (
    <div className="bg-stone-900 text-white py-2 px-4 text-center text-[10px] font-bold tracking-widest flex justify-center items-center gap-4 relative overflow-hidden z-[60]">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
        <div className="flex items-center gap-2"><Zap size={14} className="text-[#C5A059]" /><span>ENVÍO GRATIS TERMINA EN:</span></div>
        <div className="flex gap-1 font-mono text-[#C5A059]">11:59:59</div>
    </div>
);

export const ExitIntentPopup = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const handler = (e) => { if (e.clientY <= 0 && !sessionStorage.getItem('exit_shown')) { setShow(true); sessionStorage.setItem('exit_shown', 'true'); } };
        document.addEventListener('mouseleave', handler);
        return () => document.removeEventListener('mouseleave', handler);
    }, []);
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm text-center relative overflow-hidden">
                <button onClick={() => setShow(false)} className="absolute top-4 right-4"><X /></button>
                <h3 className="font-brand text-3xl mb-2">¡Espera!</h3>
                <p className="text-stone-500 mb-6">Tenemos un regalo especial para tu primera compra.</p>
                <div className="bg-stone-900 text-[#C5A059] p-3 rounded-xl font-mono text-xl font-bold mb-6">MK-WELCOME-10</div>
                <button onClick={() => setShow(false)} className="w-full bg-[#C5A059] text-white py-3 rounded-xl font-bold uppercase tracking-wider">Usar Cupón</button>
            </motion.div>
        </div>
    );
};

export const SmartSearch = ({ products, onSelect }) => {
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(false);
    const results = useMemo(() => q ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())) : [], [q, products]);
    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="p-2"><Search className="text-stone-900" size={20} /></button>
            {open && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl p-4 border border-stone-100 z-[200]">
                    <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar fragancia..." className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm outline-none mb-3" />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {results.map(p => (
                            <div key={p.id} onClick={() => { onSelect(p); setOpen(false); setQ(''); }} className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg cursor-pointer">
                                <img src={p.image} className="w-10 h-10 object-contain" alt="" />
                                <div><p className="text-xs font-bold">{p.name}</p><p className="text-[10px] text-stone-500">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p.price)}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const RecentPurchases = () => {
    const [notif, setNotif] = useState(null);
    useEffect(() => {
        const interval = setInterval(() => {
            const items = ['Athenea Blossom', 'Intense Night', 'Luna Aura'];
            const cities = ['Madrid', 'Buenos Aires', 'Santiago'];
            setNotif({ item: items[Math.floor(Math.random() * items.length)], city: cities[Math.floor(Math.random() * cities.length)], time: Math.floor(Math.random() * 5) + 1 });
            setTimeout(() => setNotif(null), 5000);
        }, 20000);
        return () => clearInterval(interval);
    }, []);
    return (
        <AnimatePresence>
            {notif && (
                <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="fixed bottom-24 left-6 z-[1500] bg-white p-3 rounded-xl shadow-xl border border-stone-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600"><ShoppingBag size={16} /></div>
                    <div><p className="text-xs text-stone-500">Alguien en <span className="font-bold text-stone-900">{notif.city}</span></p><p className="text-xs font-bold text-[#C5A059]">Compró {notif.item}</p></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const StatusBar = () => {
    const { isOnline } = useServiceWorker();
    if (isOnline) return null;
    return <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-xs font-bold text-center py-1 z-[3000]">Sin conexión a internet</div>;
};

// ═══ CHAT WIDGET (replaces FragranceSommelier) ═══
export const ChatWidget = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('ai');
    const [messages, setMessages] = useState([{ id: 0, role: 'assistant', text: '¡Hola! Soy tu sommelier de aromas personal. ¿Buscas algo para ti o un regalo?' }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const analytics = useAnalytics();
    const bottomRef = useRef(null);

    useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(p => [...p, userMsg]);
        setInput('');
        setIsTyping(true);
        analytics?.trackEvent('chat_msg', { mode });

        if (mode === 'ai') {
            try {
                const apiKey = "";
                const prompt = `Eres un experto Sommelier de Fragancias para la marca de lujo 'MK Aromas'. Tu tono es sofisticado, cálido, profesional y exclusivo.
        Catálogo: ${JSON.stringify(products.map(p => ({ n: p.name, c: p.category, notes: p.notes, p: p.price })))}
        INSTRUCCIONES: 1. Recomienda SOLO productos del catálogo. 2. Sé breve pero descriptivo, con lenguaje sensorial. 3. No inventes precios. 4. Usa emojis elegantes con moderación.
        Usuario: ${input}`;

                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                const data = await res.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, tuve una interferencia olfativa. ¿Puedes repetir?";
                setMessages(p => [...p, { id: Date.now() + 1, role: 'assistant', text: reply }]);
            } catch (e) {
                setMessages(p => [...p, { id: Date.now() + 1, role: 'assistant', text: "Conexión débil. Intenta de nuevo." }]);
            }
        } else {
            setTimeout(() => {
                setMessages(p => [...p, { id: Date.now() + 1, role: 'agent', text: "Un asesor humano se conectará en breve..." }]);
            }, 1500);
        }
        setIsTyping(false);
    };

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-[1900] w-14 h-14 bg-gradient-to-br from-[#C5A059] to-amber-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-all">
                {isOpen ? <X /> : <MessageSquare />}
                <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-24 right-6 z-[1900] w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-100">
                        <div className="bg-stone-900 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-amber-600 flex items-center justify-center"><SparklesIconRaw size={18} fill="currentColor" /></div>
                                <div><h3 className="font-brand font-bold">MK Concierge</h3><p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full block" /> Online</p></div>
                            </div>
                            <div className="flex bg-white/10 rounded-lg p-0.5">
                                <button onClick={() => setMode('ai')} className={`px-2 py-1 text-[10px] rounded-md ${mode === 'ai' ? 'bg-white text-stone-900' : 'text-white'}`}>IA</button>
                                <button onClick={() => setMode('live')} className={`px-2 py-1 text-[10px] rounded-md ${mode === 'live' ? 'bg-white text-stone-900' : 'text-white'}`}>Humano</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-stone-900 text-white rounded-br-none' : 'bg-white border border-stone-100 text-stone-800 rounded-bl-none'}`}>{m.text}</div>
                                </div>
                            ))}
                            {isTyping && <div className="text-xs text-stone-400 pl-2">Escribiendo...</div>}
                            <div ref={bottomRef} />
                        </div>
                        <div className="p-3 border-t bg-white flex gap-2">
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Escribe aquí..." className="flex-1 bg-stone-100 rounded-xl px-3 text-sm outline-none" />
                            <button onClick={handleSend} className="p-2 bg-[#C5A059] text-white rounded-xl"><Send size={18} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
