import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('customer'); // customer, farmer, delivery
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. Save user metadata to Firestore `users` collection immediately
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                id: firebaseUser.uid,
                name: name,
                email: email,
                phone: phone,
                role: role,
                createdAt: new Date().toISOString()
            });

            // 3. Send Verification Email
            await sendEmailVerification(firebaseUser);
            
            // 4. Redirect to Verify Email page
            navigate('/auth/verify-email'); 

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already registered! Please sign in.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#0f172a', fontWeight: '900' }}>
                    Create Account
                </h2>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={handleSignup}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>Register as a...</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} /> Customer
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" name="role" value="farmer" checked={role === 'farmer'} onChange={() => setRole('farmer')} /> Farmer
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" name="role" value="delivery" checked={role === 'delivery'} onChange={() => setRole('delivery')} /> Delivery Part.
                            </label>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600' }}>Full Name</label>
                        <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600' }}>Email Address</label>
                        <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600' }}>Phone Number (Optional)</label>
                        <input type="text" className="input-field" placeholder="+91..." value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600' }}>Password</label>
                        <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ fontWeight: '600' }}>Confirm Password</label>
                        <input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: '#475569' }}>
                        <p>Already have an account? <Link to="/auth/login" style={{ color: '#10b981', fontWeight: '800', textDecoration: 'none' }}>Sign in here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
