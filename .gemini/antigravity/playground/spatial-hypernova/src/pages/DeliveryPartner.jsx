import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, Navigation, PackageCheck, Motorbike, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DeliveryPartner() {
    const { userRole, orders, updateOrderStatus, user } = useContext(AppContext);
    const navigate = useNavigate();

    // Swiggy-Style Driver State
    const [isOnline, setIsOnline] = useState(false);
    const [vehicleType, setVehicleType] = useState('Scooter');
    const [filterStatus, setFilterStatus] = useState('all_active');
    const [sortOption, setSortOption] = useState('nearest_drop');

    if (userRole !== 'delivery') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 className="title" style={{ color: '#dc2626' }}><ShieldAlert size={48} style={{ margin: '0 auto 1rem' }} /> Unauthorized Access</h2>
                <p className="subtitle">Only registered Logistics Partners can view the delivery fleet assignments.</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/auth')}>Login as Driver</button>
            </div>
        );
    }

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    };

    // Filter orders ready for local delivery (shipped or out_for_delivery)
    let activeTasks = orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery');
    
    // Apply local filters/sorts
    if (filterStatus !== 'all_active') {
        activeTasks = activeTasks.filter(o => o.status === filterStatus);
    }
    
    activeTasks.sort((a, b) => {
        if (sortOption === 'highest_value') {
            return b.totalPrice - a.totalPrice;
        } else if (sortOption === 'nearest_drop') {
            // Assume driver's current lat/lng is somewhat close to their address 
            const distA = getDistanceFromLatLonInKm(user?.addressLat || 17.3850, user?.addressLng || 78.4867, a.address?.lat, a.address?.lng);
            const distB = getDistanceFromLatLonInKm(user?.addressLat || 17.3850, user?.addressLng || 78.4867, b.address?.lat, b.address?.lng);
            if (distA === null) return 1;
            if (distB === null) return -1;
            return distA - distB;
        }
        return 0; // oldest_first fallback
    });

    // Earnings Simulation
    const totalEarnings = activeTasks.filter(o => o.status === 'delivered').length * 40; // ₹40 per delivery slot

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="header-row" style={{ borderBottom: 'none' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2rem' }}>Driver Route Manager</h1>
                    <p className="subtitle">Welcome back, <strong style={{ color: '#0f1111' }}>{user?.name}</strong>. Here are nearby farm-to-door assignments.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: `4px solid ${isOnline ? '#10b981' : '#dc2626'}` }}>
                    <div style={{ background: isOnline ? '#d1fae5' : '#fee2e2', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setIsOnline(!isOnline)}>
                        {isOnline ? <Wifi size={24} color="#059669" /> : <WifiOff size={24} color="#dc2626" />}
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Driver Status</p>
                        <h3 style={{ fontSize: '1.2rem', color: isOnline ? '#059669' : '#dc2626' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '50%' }}>
                        <Motorbike size={24} color="#2563eb" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Vehicle Type</p>
                        <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }}
                        >
                            <option value="Bike">Bike (Light)</option>
                            <option value="Scooter">Scooter (Medium)</option>
                            <option value="Mini Truck">Mini Truck (Heavy)</option>
                        </select>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%' }}>
                        <MapPin size={24} color="#d97706" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Earnings & Slots</p>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f1111' }}>{activeTasks.length} Slots | ₹{totalEarnings}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <h2 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Live Routing Queue</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Filter:</span>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option value="all_active">All Active Routes</option>
                            <option value="shipped">Pending Pickup</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Sort:</span>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option value="nearest_drop">Nearest Dropoff</option>
                            <option value="highest_value">Highest Value</option>
                            <option value="oldest_first">Oldest Dispatched</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="orders-container">
                {!isOnline ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <WifiOff size={48} color="#dc2626" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>You are currently Offline</h3>
                        <p className="subtitle" style={{ fontSize: '1.1rem' }}>Toggle your status to Online to start receiving Swiggy-style farm dispatch routes.</p>
                        <button className="btn-primary" style={{ marginTop: '1rem', padding: '0.8rem 1.5rem' }} onClick={() => setIsOnline(true)}>Go Online Now</button>
                    </div>
                ) : activeTasks.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <Motorbike size={48} color="var(--border-color)" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
                        <p className="subtitle" style={{ fontSize: '1.2rem' }}>No orders currently dispatched by farmers in your radius.</p>
                    </div>
                ) : (
                    activeTasks.slice().reverse().map(order => (
                        <div key={order.id} className="notification-item flex-between" style={{ flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #0ea5e9' }}>
                            <div style={{ minWidth: '300px' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#e0f2fe', borderRadius: '8px' }}>
                                        <Motorbike size={32} color="#0284c7" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.1rem', fontWeight: 'bold' }}>Pickup: Farm Location ({order.farmer})</h4>
                                        <p style={{ color: 'var(--text-mut)', fontSize: '0.85rem' }}>Dropoff: <strong style={{ color: '#0284c7' }}>{order.customerName}</strong></p>
                                        {order.address && (
                                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderLeft: '2px solid #0f1111', fontSize: '0.85rem', borderRadius: '4px' }}>
                                                <p><strong>Deliver To:</strong> {order.address.houseNo}, {order.address.area}, {order.address.city}, {order.address.pincode}</p>
                                                {order.address.lat && order.address.lng && (
                                                    <p style={{ marginTop: '0.5rem', color: '#dc2626', fontWeight: 'bold' }}>
                                                        📍 Drop GPS: ({order.address.lat.toFixed(4)}, {order.address.lng.toFixed(4)})
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', flex: 1, minWidth: '200px' }}>
                                {order.status === 'shipped' && (
                                    <button className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: '#f59e0b', color: 'black', fontWeight: 'bold' }} onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}>
                                        <Navigation size={18} /> Start Navigation
                                    </button>
                                )}
                                {order.status === 'out_for_delivery' && (
                                    <button className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: '#10b981', fontWeight: 'bold' }} onClick={() => {
                                        // Simulate real SMS API dispatch like Twilio/Fast2SMS
                                        const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
                                        alert(`[SYSTEM MOCK: Twilio SMS SENT to Customer +91 ${order.address?.mobile || 'XXXXX'}]\n\n"DirectFarm: Your OTP to receive your order is ${generatedOTP}. Share this only when the driver is at your door."`);
                                        
                                        const otp = prompt(`Ask the customer for the 4-digit OTP sent to their phone.\n(Hint for demo: OTP is ${generatedOTP})`);
                                        if (otp === generatedOTP) {
                                            updateOrderStatus(order.id, 'delivered');
                                        } else if (otp !== null) {
                                            alert("❌ Invalid OTP! Delivery Handover failed. Do not hand over the package.");
                                        }
                                    }}>
                                        <PackageCheck size={18} /> Confirm Handover (OTP)
                                    </button>
                                )}
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${order.address?.lat || 28.61},${order.address?.lng || 77.20}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary"
                                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <MapPin size={18} /> Open Maps
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}
