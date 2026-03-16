import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tractor, Leaf, Clock, TrendingUp, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function Home() {
    return (
        <div className="hero animate-slide-up" style={{ padding: '2rem 0 6rem' }}>
            {/* Super premium top badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52, 211, 153, 0.15)', padding: '0.5rem 1rem', borderRadius: '50px', color: '#059669', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2rem', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <Star size={16} fill="#10b981" /> India's #1 Direct-to-Consumer Agri-Tech Platform
            </div>

            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', lineHeight: '1',  letterSpacing: '-2px', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Direct Farm to Table.<br />
                <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No Middlemen.</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: 'var(--text-mut)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.7', fontWeight: '500' }}>
                FarmConnect bridges the gap between hardworking farmers and honest customers. Secure the freshest produce directly from the source with a blazing-fast <strong>12-hour delivery guarantee.</strong>
            </p>

            <div className="hero-buttons" style={{ marginBottom: '5rem' }}>
                <Link to="/customer" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        <ShoppingBag size={22} />
                        Shop Fresh Produce
                        <ArrowRight size={20} />
                    </button>
                </Link>
                <Link to="/farmer" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
                        <Tractor size={22} color="#059669" />
                        Farmer Access
                    </button>
                </Link>
            </div>

            <div className="grid-cards" style={{ marginTop: '2rem', textAlign: 'left', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', borderTop: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '16px', color: '#059669' }}>
                            <Leaf size={28} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>100% Organic</h3>
                    </div>
                    <p className="subtitle" style={{ color: '#475569', lineHeight: '1.6' }}>Get guaranteed fresh and organic items straight from local farms, delivered directly to your doorstep without delay.</p>
                </div>
                
                <div className="glass-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', borderTop: '4px solid #3b82f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '16px', color: '#2563eb' }}>
                            <Clock size={28} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>12 Hour Delivery</h3>
                    </div>
                    <p className="subtitle" style={{ color: '#475569', lineHeight: '1.6' }}>Our robust logistics network operates around the clock to ensure your goods are picked up and delivered within half a day!</p>
                </div>
                
                <div className="glass-panel" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)', borderTop: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '16px', color: '#d97706' }}>
                            <TrendingUp size={28} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Fair Pricing</h3>
                    </div>
                    <p className="subtitle" style={{ color: '#475569', lineHeight: '1.6' }}>By eliminating unnecessary mediators, customers enjoy fair pricing while maximizing profits directly for the farmers.</p>
                </div>
            </div>
            
            <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                <ShieldCheck size={20} />
                <span style={{ fontWeight: '500' }}>Bank-grade 256-bit secure payments and data protection.</span>
            </div>
        </div>
    );
}
