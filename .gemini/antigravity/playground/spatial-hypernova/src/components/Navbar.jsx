import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Leaf, Bell, User, Lock, Loader2, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
    const { cart, notifications, user, userRole, logout, searchQuery, setSearchQuery, buyFarmPass } = useContext(AppContext);
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('processing');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/customer'); // Send user to products page when searching
    };

    const handleBuyPass = () => {
        setIsPaymentOpen(true);
        setPaymentStatus('processing');
    };

    useEffect(() => {
        if (isPaymentOpen && paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                setPaymentStatus('success');
                setTimeout(() => {
                    buyFarmPass();
                    setIsPaymentOpen(false);
                }, 1500); 
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isPaymentOpen, paymentStatus]);

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                <NavLink to="/" className="nav-brand" style={{ color: 'white' }}>
                    <Leaf size={28} />
                    <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>DirectFarm</span>
                </NavLink>

                <form onSubmit={handleSearch} className="search-bar" style={{ display: 'flex', flex: 1, minWidth: '300px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for fresh vegetables, fruits, and grains..."
                        style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '4px 0 0 4px', border: 'none', outline: 'none', color: '#333' }}
                    />
                    <button type="submit" style={{ padding: '0 1.5rem', background: '#f59e0b', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}>
                        Search
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginLeft: '2rem' }}>
                <div id="google_translate_element" style={{ color: 'black' }}></div>

                {user && userRole === 'customer' && (
                    <div style={{ background: '#022d36', padding: '0.5rem 1rem', borderRadius: '30px', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid #007185' }}>
                        <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            ₹{user.walletBalance || 0}
                        </div>
                        {user.hasFarmPass ? (
                            <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>FarmPass</span>
                        ) : (
                            <button onClick={handleBuyPass} style={{ background: '#f59e0b', color: 'black', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Get Pass</button>
                        )}
                    </div>
                )}

                {user ? (
                    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }} onClick={logout}>
                        <span style={{ fontSize: '0.75rem', color: '#d1fae5' }}>Hello, {user.name}</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Disconnect</span>
                    </div>
                ) : (
                    <NavLink to="/auth/login" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }}>
                        <span style={{ fontSize: '0.75rem', color: '#d1fae5' }}>Sign in</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Account Connect</span>
                    </NavLink>
                )}

                {(!userRole || userRole === 'customer') && (
                    <NavLink to="/orders" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }}>
                        <span style={{ fontSize: '0.75rem', color: '#d1fae5' }}>Returns</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>& Orders</span>
                    </NavLink>
                )}

                {userRole === 'farmer' && (
                    <NavLink to="/farmer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }}>
                        <span style={{ fontSize: '0.75rem', color: '#d1fae5' }}>Manage</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Dashboard</span>
                    </NavLink>
                )}

                {userRole === 'admin' && (
                    <NavLink to="/admin" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }}>
                        <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>System</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Admin</span>
                    </NavLink>
                )}

                {userRole === 'delivery' && (
                    <NavLink to="/delivery" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', color: 'white' }}>
                        <span style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Logistics</span>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Partner</span>
                    </NavLink>
                )}

                <NavLink to="/cart" style={{ position: 'relative', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'flex-end', gap: '0.2rem', textDecoration: 'none', marginLeft: '1rem' }} className="nav-link">
                    <div style={{ position: 'relative' }}>
                        <ShoppingCart size={32} />
                        {cart?.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: '#f59e0b', color: 'black', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>{cart.length}</span>}
                    </div>
                    <span style={{ fontWeight: '700' }}>Cart</span>
                </NavLink>
            </div>

            {/* Mock Razorpay Gateway for FarmPass */}
            {isPaymentOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <Lock size={32} color="#0f1111" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f1111', marginBottom: '0.5rem' }}>FarmPass Membership</h2>
                        <p style={{ color: '#565959', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                            Amount to Pay: <strong style={{ color: '#007185' }}>₹99.00</strong>
                        </p>
                        <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {paymentStatus === 'processing' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Loader2 className="animate-spin" size={48} color="#007185" />
                                    <p style={{ fontWeight: 'bold', color: '#007185' }}>Processing Payment...</p>
                                </div>
                            ) : (
                                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#059669' }}>
                                    <CheckCircle size={56} color="#059669" />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Pass Activated Securely!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
