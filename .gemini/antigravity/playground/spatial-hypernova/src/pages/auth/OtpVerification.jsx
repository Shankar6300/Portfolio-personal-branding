import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function OtpVerification() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const location = useLocation();
    const navigate = useNavigate();
    const phone = location.state?.phone || "Unknown Number";

    useEffect(() => {
        if (!window.confirmationResult) {
            navigate('/auth/phone-login'); // Bounce back if they bypassed the flow
        }
        
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;

            // Check if this phone number exists in Firestore. If not, create a basic 'customer' profile
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    id: user.uid,
                    name: "Secure Phone User",
                    phone: phone,
                    role: 'customer',
                    createdAt: new Date().toISOString()
                });
            }

            // Global AuthState listener catches this and unlocks the dashboard
            alert('Phone verified and logged in securely!');
            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Invalid OTP Code! The security code does not match. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: '#0f172a', fontWeight: '900' }}>
                    Verify OTP
                </h2>
                
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#0f1111', textAlign: 'center' }}>
                    A secure SMS text was sent to <strong>{phone}</strong>
                </p>

                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={handleVerifyOtp}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '700' }}>Enter 6-Digit SMS OTP</label>
                        <input type="text" className="input-field" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Verifying...' : 'Verify Securely'}
                    </button>
                    
                    <Link to="/auth/phone-login" style={{ textDecoration: 'none' }}>
                        <button type="button" className="btn-secondary" style={{ width: '100%', marginTop: '1rem', border: '1px solid #cbd5e1' }}>
                            Go Back / Change Number
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
