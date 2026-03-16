import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Truck, CheckCircle2, Box, TrendingUp, Package, PlusCircle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

export default function Farmer() {
    const { products, addProduct, orders, updateOrderStatus, user, userRole } = useContext(AppContext);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', minQuantity: '1', maxQuantity: '', unit: '', harvestDate: '', imgUrl: '', category: 'Vegetables' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const navigate = useNavigate();

    if (userRole !== 'farmer') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 className="title">Access Denied</h2>
                <p className="subtitle">Only registered farmers can access the dashboard. Please log in as a farmer.</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/auth')}>Go to Login</button>
            </div>
        );
    }

    // Filter orders aimed at this specific farmer
    const farmerOrders = orders.filter(o => o.farmer === user?.name);

    // Aggregations for Stats & Charts
    const totalRevenue = farmerOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalActive = farmerOrders.filter(o => o.status !== 'shipped').length;

    // Bar Chart Data (Revenue by Product)
    const revenueByProduct = farmerOrders.reduce((acc, order) => {
        acc[order.productName] = (acc[order.productName] || 0) + order.totalPrice;
        return acc;
    }, {});
    const barData = Object.keys(revenueByProduct).map(key => ({
        name: key,
        revenue: revenueByProduct[key]
    }));

    // Pie Chart Data (Orders by Status)
    const statusCounts = farmerOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: statusCounts[key]
    }));
    const PIE_COLORS = ['#f59e0b', '#0ea5e9', '#10b981', '#6b7280'];

    // AI Forecast Mock Engine Data
    const demandForecastData = [
        { day: 'Mon', 'Organic Spinach': 120, 'Onions': 900, 'Potatoes': 400 },
        { day: 'Tue', 'Organic Spinach': 200, 'Onions': 850, 'Potatoes': 420 },
        { day: 'Wed', 'Organic Spinach': 350, 'Onions': 800, 'Potatoes': 450 },
        { day: 'Thu', 'Organic Spinach': 500, 'Onions': 400, 'Potatoes': 410 },
        { day: 'Fri', 'Organic Spinach': 800, 'Onions': 300, 'Potatoes': 480 }, // Massive spike
        { day: 'Sat', 'Organic Spinach': 1200, 'Onions': 200, 'Potatoes': 500 },
        { day: 'Sun', 'Organic Spinach': 1400, 'Onions': 100, 'Potatoes': 550 },
    ];

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price || !newProduct.quantity || !newProduct.unit || !newProduct.harvestDate || !newProduct.minQuantity) return;

        let finalImgUrl = newProduct.imgUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
        
        if (imageFile) {
            try {
                setUploadingImage(true);
                const fileRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
                await uploadBytes(fileRef, imageFile);
                finalImgUrl = await getStorageDownloadURL(fileRef);
            } catch (err) {
                console.error("Image upload failed", err);
                alert("Image upload failed. Using placeholder instead.");
            } finally {
                setUploadingImage(false);
            }
        }

        addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price),
            quantity: parseInt(newProduct.quantity),
            minQuantity: parseInt(newProduct.minQuantity),
            maxQuantity: newProduct.maxQuantity ? parseInt(newProduct.maxQuantity) : null,
            farmer: user.name,
            imgUrl: finalImgUrl
        });
        setNewProduct({ name: '', price: '', quantity: '', minQuantity: '1', maxQuantity: '', unit: '', harvestDate: '', imgUrl: '', category: 'Vegetables' });
        setImageFile(null);
        setShowAddForm(false);
        alert('Product successfully listed on the marketplace!');
    };

    const handleStatusChange = (orderId, status) => {
        updateOrderStatus(orderId, status);
    };

    return (
        <div className="animate-fade">

            {/* Dashboard Header */}
            <div className="header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2rem' }}>Seller Central</h1>
                    <p className="subtitle" style={{ fontSize: '1rem' }}>Welcome back, <strong style={{ color: '#0f1111' }}>{user?.name}</strong>. Here is your operational overview.</p>
                </div>
                <button className="btn-primary" style={{ background: '#f59e0b', color: 'black', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }} onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle size={20} />
                    {showAddForm ? 'Close Form' : 'Add New Inventory'}
                </button>
            </div>

            {/* KPI Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '50%' }}>
                        <TrendingUp size={24} color="#d97706" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Lifetime Revenue</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>₹{totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
                    <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '50%' }}>
                        <Package size={24} color="#0284c7" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Orders</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>{farmerOrders.length}</h3>
                    </div>
                </div>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '50%' }}>
                        <Truck size={24} color="#059669" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Active Queued</p>
                        <h3 style={{ fontSize: '1.5rem', color: '#0f1111' }}>{totalActive}</h3>
                    </div>
                </div>
            </div>

            {/* AI Demand Forecasting Panel */}
            <div className="glass-panel" style={{ marginBottom: '2.5rem', borderLeft: '4px solid #f59e0b', background: '#fffbeb', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ background: '#fde68a', padding: '0.75rem', borderRadius: '50%' }}>
                        <Lightbulb size={28} color="#d97706" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#b45309', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Market Demand Forecast Engine</h3>
                        <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                            Based on real-time app search queries, our AI detects a massive incoming spike for <strong>Organic Spinach</strong> this weekend. Onions are declining. Plant and prepare accordingly to capture maximum local revenue.
                        </p>
                    </div>
                </div>

                <div style={{ height: '300px', width: '100%', background: 'white', borderRadius: '8px', padding: '1rem', border: '1px solid #fde68a' }}>
                    <ResponsiveContainer>
                        <LineChart data={demandForecastData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="Organic Spinach" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Onions" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Potatoes" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Add Inventory Dropdown Block */}
            {showAddForm && (
                <div className="glass-panel animate-slide-up" style={{ marginBottom: '2.5rem', border: '2px dashed var(--primary-green)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Add New Product to Store</h2>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <label>Product Name</label>
                            <input type="text" className="input-field" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Fresh Potatoes" required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <label>Price (₹)</label>
                            <input type="number" step="0.1" className="input-field" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0.00" required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <label>Category</label>
                            <select className="input-field" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '8px' }}>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Grains">Grains</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <label>Unit type</label>
                            <input type="text" className="input-field" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} placeholder="kg, dozens" required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <label>Stock Qty</label>
                            <input type="number" className="input-field" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} placeholder="100" required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <label>Min Buy Qty</label>
                            <input type="number" className="input-field" value={newProduct.minQuantity} onChange={e => setNewProduct({ ...newProduct, minQuantity: e.target.value })} placeholder="1" required />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <label>Max Buy Qty</label>
                            <input type="number" className="input-field" value={newProduct.maxQuantity} onChange={e => setNewProduct({ ...newProduct, maxQuantity: e.target.value })} placeholder="Optional limit" />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <label>Harvest Date</label>
                            <input type="date" className="input-field" value={newProduct.harvestDate} onChange={e => setNewProduct({ ...newProduct, harvestDate: e.target.value })} required title="Customers deeply care about freshness. Pick a recent date." />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <label>Product Image</label>
                            <input type="file" accept="image/*" className="input-field" onChange={e => setImageFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
                            <small style={{ color: 'var(--text-mut)' }}>Upload a real photo (or leave empty for placeholder)</small>
                        </div>
                        <button type="submit" className="btn-primary" disabled={uploadingImage} style={{ padding: '0.85rem 2rem', background: uploadingImage ? '#9ca3af' : '#059669', color: 'white' }}>
                            {uploadingImage ? 'Uploading...' : 'Publish'}
                        </button>
                    </form>
                </div>
            )}

            {/* Analytics Charts Row */}
            {farmerOrders.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '2.5rem', marginBottom: '2.5rem' }}>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f1111' }}>Gross Revenue per Product</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip cursor={{ fill: '#f0f2f2' }} formatter={(value) => `₹${value}`} />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f1111', textAlign: 'center' }}>Orders by Status</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" cx="50%" cy="50%" label>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}

            {/* Orders Management Section */}
            <div>
                <div className="header-row" style={{ marginTop: '0', borderBottom: 'none', marginBottom: '1rem' }}>
                    <h2 className="title" style={{ fontSize: '1.5rem', color: '#0f1111' }}>Fulfillment Center Pipeline</h2>
                </div>

                <div className="orders-container">
                    {farmerOrders.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <Package size={48} color="var(--border-color)" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
                            <p className="subtitle" style={{ fontSize: '1.2rem' }}>You haven't received any orders yet.</p>
                            <p>Add fresh inventory to start earning!</p>
                        </div>
                    ) : (
                        farmerOrders.slice().reverse().map(order => (
                            <div key={order.id} className="notification-item flex-between" style={{ flexWrap: 'wrap', gap: '1rem', borderLeft: order.status === 'delivered' ? '4px solid #10b981' : order.status === 'pending' ? '4px solid #f59e0b' : '4px solid #0ea5e9', opacity: order.status === 'delivered' ? 0.7 : 1 }}>
                                <div style={{ minWidth: '300px' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <img src={order.imgUrl} alt={order.productName} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.1rem', fontWeight: '800' }}>{order.quantity} x {order.productName}</h4>
                                            <p style={{ color: 'var(--text-mut)', fontSize: '0.85rem' }}>Customer: <strong style={{ color: '#0284c7' }}>{order.customerName}</strong></p>
                                            {order.address && (
                                                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#f8fafc', borderLeft: '2px solid #0f1111', fontSize: '0.85rem', borderRadius: '4px' }}>
                                                    <p><strong>Deliver To:</strong> {order.address.fullName}, 📞 {order.address.mobile}</p>
                                                    <p>{order.address.houseNo}, {order.address.area}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                                    {order.address.lat && order.address.lng && (
                                                        <p style={{ marginTop: '0.5rem', color: '#dc2626', fontWeight: 'bold' }}>
                                                            📍 GPS Pinpoint: ({order.address.lat.toFixed(4)}, {order.address.lng.toFixed(4)})
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <p style={{ color: 'var(--text-mut)', fontSize: '0.9rem' }}>Status: <span className={`status-badge status-${order.status}`} style={{
                                            background: order.status === 'delivered' ? '#d1fae5' : order.status === 'out_for_delivery' ? '#fef08a' : '#e0f2fe',
                                            color: order.status === 'delivered' ? '#059669' : order.status === 'out_for_delivery' ? '#ca8a04' : '#0284c7'
                                        }}>{order.status.replace(/_/g, ' ').toUpperCase()}</span></p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#b12704' }}>₹{order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="timestamp" style={{ marginTop: '0.5rem' }}>Ordered: {new Date(order.date).toLocaleString()}</div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', flex: 1, minWidth: '200px' }}>
                                    {order.status === 'pending' && (
                                        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', background: '#f59e0b', color: 'black', fontWeight: 'bold' }} onClick={() => handleStatusChange(order.id, 'confirmed')}>
                                            <CheckCircle2 size={16} /> Accept Order
                                        </button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <button className="btn-secondary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', fontWeight: 'bold' }} onClick={() => handleStatusChange(order.id, 'packing')}>
                                            <Box size={16} /> Mark Packing
                                        </button>
                                    )}
                                    {order.status === 'packing' && (
                                        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', background: '#0ea5e9', fontWeight: 'bold' }} onClick={() => handleStatusChange(order.id, 'shipped')}>
                                            <Truck size={16} /> Dispatch Order
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', background: '#ec4899', fontWeight: 'bold' }} onClick={() => handleStatusChange(order.id, 'out_for_delivery')}>
                                            <Truck size={16} /> Out for Delivery
                                        </button>
                                    )}
                                    {order.status === 'out_for_delivery' && (
                                        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', background: '#10b981', fontWeight: 'bold' }} onClick={() => handleStatusChange(order.id, 'delivered')}>
                                            <CheckCircle2 size={16} /> Mark Delivered
                                        </button>
                                    )}
                                    {order.status === 'delivered' && (
                                        <p style={{ color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #d1fae5' }}>
                                            <CheckCircle2 size={16} /> Order Completed
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
