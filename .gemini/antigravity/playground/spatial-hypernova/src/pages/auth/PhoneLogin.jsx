import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../../firebase';

export default function PhoneLogin() {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!phone.startsWith("+")) {
            setError("Please include the country code (e.g. +91XXXXXXXXXX)");
            return;
        }

        setLoading(true);
        setupRecaptcha();

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
            
            // Store it globally so the OTP page can access the Firebase Promise resolver
            window.confirmationResult = confirmationResult;
            
            alert('SMS OTP dispatched to your mobile phone!');
            navigate('/auth/otp-verification', { state: { phone } });
            
        } catch (err) {
            console.error("FIREBASE ERROR:", err);
            setError(`Firebase Error: ${err.message}`);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
            <div id="recaptcha-container"></div>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', fontWeight: '900' }}>
                    Phone Login
                </h2>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={handleSendOtp}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600', color: '#0f1111' }}>Mobile Number</label>
                        <input type="tel" className="input-field" placeholder="+91..." value={phone} onChange={e => setPhone(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Generating Secure OTP...' : 'Send SMS OTP'}
                    </button>
                    
                    <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#64748b', fontWeight: 'bold' }}>OR</div>
                    
                    <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                        <button type="button" className="btn-secondary" style={{ width: '100%', border: '1px solid #cbd5e1' }}>
                            Sign In with Email
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
