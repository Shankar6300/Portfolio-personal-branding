import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cart, removeFromCart, checkout, user } = useContext(AppContext);
    const navigate = useNavigate();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!user) {
            alert('Please log in to continue checkout.');
            navigate('/auth');
            return;
        }
        navigate('/checkout'); // Route to multi-step checkout
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div className="header-row" style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', marginBottom: '2.5rem', paddingBottom: '1rem' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>Shopping Cart</h1>
                    <p style={{ color: '#065f46', fontWeight: '700', fontSize: '1.1rem' }}>{totalItems} items selected</p>
                </div>
                <p className="subtitle" style={{ color: '#475569', fontWeight: '600' }}>Price</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                            <ShoppingCart size={48} color="var(--text-mut)" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                            <button className="btn-primary" onClick={() => navigate('/customer')}>
                                Explore Fresh Produce
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="glass-panel" style={{ display: 'flex', gap: '2rem', padding: '2rem', alignItems: 'center' }}>
                                <img src={item.imgUrl} alt={item.productName} style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{item.productName}</h3>
                                    <p style={{ color: '#10b981', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: '800' }}>In Stock • Ready to Ship</p>
                                    <div style={{ display: 'flex', gap: '0.2rem', color: '#475569', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Sold directly by: <span style={{ color: '#0284c7', cursor: 'pointer', fontWeight: '700' }}>{item.farmer}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.8)', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', border: '1px solid var(--border-color)', color: '#0f172a' }}>
                                            Qty: {item.quantity}
                                        </span>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700', transition: 'color 0.2s' }}>
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>₹{item.price.toFixed(2)} / unit</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ flex: '1 1 30%', minWidth: '340px' }}>
                        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#10b981', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                                <ShieldCheck size={24} />
                                <p style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>100% Purchase Protection</p>
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#0f172a' }}>Subtotal ({totalItems} items): <br/><span style={{ fontWeight: '900', fontSize: '2rem', color: '#065f46' }}>₹{totalPrice.toFixed(2)}</span></h3>

                            <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
                                Proceed to Secure Checkout
                            </button>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#475569', marginTop: '1.5rem' }}>
                                <Truck size={20} color="#10b981" />
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', fontWeight: '500' }}><strong>12-Hour Fresh Guarantee:</strong> Order drops from the farm to your doorstep securely.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
