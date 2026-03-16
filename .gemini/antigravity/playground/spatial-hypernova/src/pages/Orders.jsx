import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Truck, CheckCircle2, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const { orders, userRole } = useContext(AppContext);
    const navigate = useNavigate();

    if (userRole === 'farmer') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 className="title">Farmers belong in the dashboard!</h2>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/farmer')}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="animate-fade">
            <div className="header-row">
                <div>
                    <h1 className="title">Your Orders</h1>
                    <p className="subtitle">Track your fast deliveries.</p>
                </div>
            </div>

            <div className="orders-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {orders.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                        <Box size={48} color="var(--text-mut)" style={{ marginBottom: '1rem' }} />
                        <p className="subtitle" style={{ fontSize: '1.25rem' }}>No orders placed yet.</p>
                        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/customer')}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="notification-item flex-between" style={{ padding: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <img src={order.imgUrl} alt={order.productName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f1111' }}>{order.productName}</h4>
                                    <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem' }}>Qty: {order.quantity} • Sold by: {order.farmer}</p>
                                    <p style={{ fontWeight: '700', marginTop: '0.5rem', fontSize: '1.1rem' }}>₹{order.totalPrice.toFixed(2)}</p>
                                    {order.address && (
                                        <p style={{ color: '#565959', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                            Deliver to: {order.address.houseNo}, {order.address.pincode} • Pay via: {order.paymentMethod?.toUpperCase()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                <span className={`status-badge status-${order.status}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
                                    {order.status}
                                </span>

                                {order.status === 'pending' && <p style={{ color: 'var(--text-mut)', fontSize: '0.85rem' }}>Waiting for seller</p>}
                                {order.status === 'confirmed' && <p style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: 'bold' }}><CheckCircle2 size={12} /> Accepted & Packing</p>}
                                {order.status === 'shipped' && (
                                    <p style={{ color: 'var(--primary-green)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                                        <Truck size={14} /> Out for Delivery
                                    </p>
                                )}

                                <div className="timestamp" style={{ marginTop: '1rem' }}>Ordered: {new Date(order.date).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
