import React from 'react';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
    return (
        <div className="animate-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a', fontWeight: '900' }}>
                    Check Your Inbox
                </h2>
                
                <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                    We've sent a verification link to your email address. Please open it to verify your account and activate your profile.
                </p>

                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>
                        If you don't see it, be sure to check your spam folder! Once verified, you can sign in below.
                    </p>
                </div>

                <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}>
                        I have verified my email &gt; Sign In
                    </button>
                </Link>
            </div>
        </div>
    );
}
