import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { AppContext } from '../../context/AppContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { userRole } = useContext(AppContext);
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                setError("Please verify your email before logging in.");
                setLoading(false);
                return;
            }
            
            // AppContext's onAuthStateChanged will handle role fetching and user state
            alert('Logged in successfully!');
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', fontWeight: '900' }}>
                    Sign In
                </h2>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={handleEmailLogin}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600', color: '#0f1111' }}>Email Address</label>
                        <input type="email" className="input-field" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '600' }}>Password</label>
                        <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Authenticating...' : 'Sign In with Email'}
                    </button>
                    
                    <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#64748b', fontWeight: 'bold' }}>OR</div>
                    
                    <Link to="/auth/phone-login" style={{ textDecoration: 'none' }}>
                        <button type="button" className="btn-secondary" style={{ width: '100%', border: '1px solid #cbd5e1' }}>
                            Sign In with Phone Number (SMS OTP)
                        </button>
                    </Link>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#475569' }}>
                        <p>New here? <Link to="/auth/signup" style={{ color: '#10b981', fontWeight: '800', textDecoration: 'none' }}>Create an account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
