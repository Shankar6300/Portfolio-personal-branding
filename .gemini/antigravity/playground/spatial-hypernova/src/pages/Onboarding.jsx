import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Globe, ArrowRight, CheckCircle2, ShoppingBag, Truck, Tractor } from 'lucide-react';

export default function Onboarding() {
    const { setLanguage, setHasSeenTutorial } = useContext(AppContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = Language, 2 = Tutorial, 3 = Role Preview

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setStep(2);
    };

    const finishOnboarding = () => {
        setHasSeenTutorial(true);
        navigate('/auth');
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>

            {step === 1 && (
                <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                    <Globe size={48} color="#059669" style={{ margin: '0 auto 1.5rem' }} />
                    <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Choose Language</h1>
                    <p className="subtitle" style={{ marginBottom: '2rem' }}>Select your preferred language to continue.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleLanguageSelect('English')}>English</button>
                        <button className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleLanguageSelect('Hindi')}>हिंदी (Hindi)</button>
                        <button className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleLanguageSelect('Telugu')}>తెలుగు (Telugu)</button>
                        <button className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleLanguageSelect('Tamil')}>தமிழ் (Tamil)</button>
                        <button className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleLanguageSelect('Kannada')}>ಕನ್ನಡ (Kannada)</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="glass-panel animate-slide-up" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                    <Tractor size={56} color="#d97706" style={{ margin: '0 auto 1.5rem' }} />
                    <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Welcome to DirectFarm</h1>
                    <p style={{ color: 'var(--text-mut)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        We connect you directly with local farmers. No middlemen. Just fresh farm produce, fair prices, and lightning-fast delivery straight to your doorstep!
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <CheckCircle2 color="#059669" size={24} />
                            <span style={{ fontWeight: '600' }}>100% Fresh & Authentic</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <CheckCircle2 color="#059669" size={24} />
                            <span style={{ fontWeight: '600' }}>Best Prices Guaranteed</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <CheckCircle2 color="#059669" size={24} />
                            <span style={{ fontWeight: '600' }}>Support Local Farmers</span>
                        </div>
                    </div>

                    <button className="btn-primary flex-between" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => setStep(3)}>
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="glass-panel animate-slide-up" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                    <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>How will you join?</h1>
                    <p className="subtitle" style={{ marginBottom: '2rem' }}>Select your role to get started.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ShoppingBag size={32} color="#16a34a" style={{ marginBottom: '0.5rem' }} />
                            <h3 style={{ fontWeight: 'bold' }}>Customer</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Order fresh produce instantly</p>
                        </div>
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Tractor size={32} color="#d97706" style={{ marginBottom: '0.5rem' }} />
                            <h3 style={{ fontWeight: 'bold' }}>Farmer</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Sell directly & earn more</p>
                        </div>
                        <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Truck size={32} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
                            <h3 style={{ fontWeight: 'bold' }}>Delivery Partner</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Drive locally & earn daily</p>
                        </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#ffd814', color: '#0f1111' }} onClick={finishOnboarding}>
                        Get Started Now
                    </button>
                </div>
            )}

        </div>
    );
}
