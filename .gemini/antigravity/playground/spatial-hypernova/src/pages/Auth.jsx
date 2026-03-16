import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Auth() {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'

    const [role, setRole] = useState('customer');
    const [name, setName] = useState('');
    const [contact, setContact] = useState(''); // Mobile number OR Email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Firebase OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer countdown hook for Resend OTP
    React.useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const isEmail = contact.includes('@');

    const setupRecaptcha = () => {
        if (!auth) {
            alert("Firebase is missing! Please open src/firebase.js and paste your Real Firebase config.");
            return false;
        }
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contact) return;

        // ==========================================
        // EMAIL AUTHENTICATION BRANCH
        // ==========================================
        if (isEmail) {
            if (!password && authMode !== 'forgot') {
                alert("Please enter a password for your Email.");
                return;
            }
            setIsLoading(true);
            try {
                if (authMode === 'register') {
                    if (password !== confirmPassword) throw new Error("Passwords do not match!");
                    await createUserWithEmailAndPassword(auth, contact, password);
                    login(role, name, { email: contact });
                    alert('Email Account verified and safely created!');
                    navigate('/');
                } else if (authMode === 'login') {
                    await signInWithEmailAndPassword(auth, contact, password);
                    login(role, "User", { email: contact });
                    alert('Logged in securely via Email!');
                    navigate('/');
                } else if (authMode === 'forgot') {
                    await sendPasswordResetEmail(auth, contact);
                    alert('A real password reset link has been dispatched to your email address!');
                    switchMode('login');
                }
            } catch (error) {
                console.error("Firebase Email Error:", error);
                if (error.code === 'auth/email-already-in-use') {
                    alert("Notice: This email is already registered in our system!\n\nSwitching you to 'Sign In' mode to securely login.");
                    switchMode('login');
                } else if (error.code === 'auth/user-not-found') {
                    alert("This email is not registered yet. Please create an account.");
                    switchMode('register');
                } else {
                    alert(`Authentication Error: ${error.message}`);
                }
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // ==========================================
        // PHONE AUTHENTICATION BRANCH (OTP)
        // ==========================================
        if (!contact.startsWith("+")) {
            alert("Please enter mobile number with country code (e.g. +91XXXXXXXXXX) to receive REAL SMS, or use an Email address.");
            return;
        }

        if (!setupRecaptcha()) return;

        setIsLoading(true);
        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, contact, appVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
            
            if (authMode === 'forgot') {
                alert('For Mobile Numbers: You do not need to remember a password!\n\nWe have dispatched a real OTP. Enter it below for direct secure login.');
                setAuthMode('login');
            } else if (authMode === 'register') {
                alert('Verifying system records... REAL SMS OTP dispatched to verify your new mobile phone number!');
            } else {
                alert('REAL SMS OTP dispatched to your mobile phone for secure login!');
            }
            setTimer(30); // Start 30 second resend block
            
        } catch (error) {
            console.error("FIREBASE ERROR:", error);
            alert(`Firebase Error: ${error.message}\n\nDid you enable the Phone provider in Firebase? Do you have SMS limits?`);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const verifyPhoneOtpAndContinue = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);



        if (!confirmationResult) {
            setIsLoading(false);
            return;
        }

        try {
            await confirmationResult.confirm(otp);

            if (authMode === 'login') {
                login(role, contact, { phone: contact });
                alert('Logged in successfully securely via real OTP!');
                navigate(role === 'farmer' ? '/farmer' : '/customer');
            } else if (authMode === 'register') {
                login(role, name, { phone: contact });
                alert('Account safely created and verified via real OTP!');
                navigate(role === 'farmer' ? '/farmer' : '/customer');
            } else if (authMode === 'forgot') {
                alert('Password has been securely reset!');
                setAuthMode('login');
                setOtpSent(false);
                setPassword('');
            }
        } catch (error) {
            console.error(error);
            alert("Invalid OTP Code! The security code does not match. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (mode) => {
        setAuthMode(mode);
        setOtpSent(false);
        setOtp('');
    };

    const bypassMockLogin = (e) => {
        e.preventDefault();
        login(role, "Test User", { phone: contact });

        if (role === 'admin') navigate('/admin');
        else if (role === 'delivery') navigate('/delivery');
        else if (role === 'farmer') navigate('/farmer');
        else navigate('/');
    }

    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
            <div id="recaptcha-container"></div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', fontWeight: '900', letterSpacing: '-0.5px' }}>
                    {authMode === 'login' && 'Sign in'}
                    {authMode === 'register' && 'Create Account'}
                    {authMode === 'forgot' && 'Password assistance'}
                </h2>

                {!otpSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>I am a...</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                    <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} /> Customer
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                    <input type="radio" name="role" value="farmer" checked={role === 'farmer'} onChange={() => setRole('farmer')} /> Farmer
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                    <input type="radio" name="role" value="delivery" checked={role === 'delivery'} onChange={() => setRole('delivery')} /> Delivery
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                    <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} /> Admin
                                </label>
                            </div>
                        </div>

                        {authMode === 'register' && (
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Your name</label>
                                <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                        )}

                        <div className="form-group">
                            <label style={{ fontWeight: '600', color: isEmail ? '#059669' : '#0f1111' }}>
                                {isEmail ? 'Email Address' : 'Mobile number OR Email Address'}
                            </label>
                            <input type="text" className="input-field" placeholder="+91... or email@domain.com" value={contact} onChange={e => setContact(e.target.value)} required />
                        </div>

                        {isEmail && authMode !== 'forgot' && (
                            <div className="form-group animate-slide-up">
                                <label style={{ fontWeight: '600' }}>Password</label>
                                <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required={isEmail} />
                            </div>
                        )}

                        {isEmail && authMode === 'register' && (
                            <div className="form-group animate-slide-up">
                                <label style={{ fontWeight: '600' }}>Re-enter Password</label>
                                <input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={isEmail} />
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                            {isLoading ? 'Processing...' : (isEmail ? 'Sign In / Secure Email' : 'Send SMS OTP / Continue')}
                        </button>



                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#475569' }}>
                            {authMode === 'login' && (
                                <>
                                    <p style={{ marginBottom: '0.75rem' }}>New here? <span style={{ color: '#10b981', cursor: 'pointer', fontWeight: '800' }} onClick={() => switchMode('register')}>Create account</span></p>
                                    <p>Forgot password? <span style={{ color: '#10b981', cursor: 'pointer', fontWeight: '800' }} onClick={() => switchMode('forgot')}>Reset it</span></p>
                                </>
                            )}
                            {(authMode === 'register' || authMode === 'forgot') && (
                                <p>Already having an account? <span style={{ color: '#10b981', cursor: 'pointer', fontWeight: '800' }} onClick={() => switchMode('login')}>Sign inside</span></p>
                            )}
                        </div>
                    </form>
                ) : (
                    <form onSubmit={verifyPhoneOtpAndContinue}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#0f1111' }}>
                            A real SMS text code has been deployed to {contact}! Enter it below.
                        </p>

                        <div className="form-group animate-slide-up">
                            <label style={{ fontWeight: '700' }}>Enter 6-Digit SMS OTP</label>
                            <input type="text" className="input-field" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
                        </div>

                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            {isLoading ? 'Verifying...' : 'Verify Securely and Continue'}
                        </button>

                        <button 
                            type="button" 
                            disabled={timer > 0 || isLoading}
                            onClick={handleSubmit} 
                            style={{ 
                                width: '100%', 
                                marginTop: '1rem', 
                                padding: '12px', 
                                background: 'transparent',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                color: timer > 0 ? '#94a3b8' : '#10b981',
                                fontWeight: '600',
                                cursor: timer > 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend SMS OTP'}
                        </button>

                        <button type="button" onClick={() => setOtpSent(false)} className="btn-secondary" style={{ width: '100%', marginTop: '1rem', border: 'none', background: '#f1f5f9' }}>
                            Change Phone Number
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
