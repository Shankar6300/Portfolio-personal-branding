import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, AlertTriangle, Briefcase, Activity, ShoppingCart, DollarSign, TrendingUp, ShieldAlert, Tag, Map, Megaphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function Admin() {
    const { userRole, orders, products } = useContext(AppContext);

    // MOCK DATA FOR ADMIN
    const [usersList] = useState([
        { id: 1, name: 'Green Acres Farm', role: 'farmer', status: 'verified', rating: 4.8 },
        { id: 2, name: 'Daily Fresh Ag', role: 'farmer', status: 'verified', rating: 4.5 },
        { id: 3, name: 'Sunrise Co.', role: 'farmer', status: 'verified', rating: 4.9 },
        { id: 4, name: 'Suspect Farm (AI Flag)', role: 'farmer', status: 'suspended', rating: 2.1 },
        { id: 5, name: 'John Doe', role: 'customer', status: 'active', rating: null },
    ]);

    if (userRole !== 'admin') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 className="title" style={{ color: '#dc2626' }}><ShieldAlert size={48} style={{ margin: '0 auto 1rem' }} /> Unauthorized Access</h2>
                <p className="subtitle">Only Platform Administrators can view the master control panel.</p>
            </div>
        );
    }

    const totalPlatformRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const platformCommission = totalPlatformRevenue * 0.05; // 5% platform fee

    const revenueData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 5000 },
        { name: 'Thu', revenue: 8000 },
        { name: 'Fri', revenue: 6000 },
        { name: 'Sat', revenue: 9000 },
        { name: 'Sun', revenue: totalPlatformRevenue || 12000 },
    ];

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="header-row" style={{ borderBottom: 'none' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2rem' }}>Command Center</h1>
                    <p className="subtitle">Platform Overview & AI Risk Detection</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '50%' }}>
                        <DollarSign size={24} color="#059669" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total GMV</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>₹{totalPlatformRevenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
                    <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%' }}>
                        <Briefcase size={24} color="#4f46e5" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Platform Revenue (5%)</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>₹{platformCommission.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%' }}>
                        <ShoppingCart size={24} color="#d97706" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Orders</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>{orders.length}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%' }}>
                        <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>AI Flags (Quality)</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#dc2626' }}>1</h3>
                    </div>
                </div>
            </div>

            {/* Growth & Marketing Engine (Phase 4) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid #007185' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={20} color="#007185" /> Promo Code Engine
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Generate Code</label>
                            <input type="text" className="input-field" defaultValue="FARM50" style={{ marginBottom: 0 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Discount %</label>
                            <input type="number" className="input-field" defaultValue={50} style={{ marginBottom: 0 }} />
                        </div>
                        <button className="btn-primary" style={{ background: '#007185' }} onClick={() => alert("Promo Code FARM50 is now LIVE across the consumer platform!")}>Launch</button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-mut)' }}>Create viral flash-sale coupons instantly pushed to customer apps.</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid #10b981' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Map size={20} color="#059669" /> Dynamic Routing & Geofencing
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <select className="input-field" style={{ flex: 1, marginBottom: 0, minWidth: '150px' }}>
                            <option>City Center (Active Zone)</option>
                            <option>Suburbs (Surge Pricing +20%)</option>
                            <option>Outskirts (Disabled)</option>
                        </select>
                        <button className="btn-primary" style={{ background: '#10b981' }} onClick={() => alert("Geofence restricted to 15km polygons to guarantee delivery SLAs.")}>Lock Radius</button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-mut)' }}>Instantly cut off app access to outer zones to maintain highly profitable delivery loops.</p>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={18} /> Gross Merchandise Value (Last 7 Days)
                    </h3>
                    <div style={{ flex: 1, minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip formatter={(val) => `₹${val}`} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#0f1111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} /> User Management & Approvals
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-mut)' }}>
                                    <th style={{ padding: '0.75rem 0' }}>Name</th>
                                    <th>Role</th>
                                    <th>Rating (AI)</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{u.name}</td>
                                        <td><span className={`status-badge status-${u.role === 'farmer' ? 'shipped' : 'pending'}`}>{u.role.toUpperCase()}</span></td>
                                        <td>{u.rating ? `⭐ ${u.rating}` : 'N/A'}</td>
                                        <td>
                                            <span style={{
                                                color: u.status === 'suspended' ? '#dc2626' : u.status === 'verified' ? '#059669' : '#0f1111'
                                            }}>
                                                {u.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {u.status === 'suspended' ? (
                                                <button className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fee2e2' }}>Review Flag</button>
                                            ) : (
                                                <button className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
