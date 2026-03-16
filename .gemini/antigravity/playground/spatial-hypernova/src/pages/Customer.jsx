import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Star, MapPin, Calendar, Truck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Customer() {
    const { products, addToCart, user, login, searchQuery, setSearchQuery, cart } = useContext(AppContext);
    const [quantities, setQuantities] = useState({});
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortOption, setSortOption] = useState('nearest');
    const [volumeFilter, setVolumeFilter] = useState('all');
    const navigate = useNavigate();

    const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains'];

    const handleQtyChange = (id, val) => {
        setQuantities({ ...quantities, [id]: Number(val) || 0 });
    };

    const handleOrder = (product) => {
        const minQ = product.minQuantity || 1;
        const maxQ = product.maxQuantity || product.quantity;
        const qty = quantities[product.id] || minQ;

        // Current cart deduction check
        const cartItem = cart?.find(c => c.productId === product.id);
        const alreadyInCartQty = cartItem ? cartItem.quantity : 0;
        const remainingStock = product.quantity - alreadyInCartQty;
        
        const availableMax = maxQ - alreadyInCartQty;

        if (qty > remainingStock || qty <= 0 || qty > availableMax) {
            alert(`Sorry, you cannot add ${qty} more. The rest is either in your cart, out of stock, or exceeds the limit per order.`);
            return;
        }
        if (qty < minQ) {
            alert(`You must buy at least ${minQ} ${product.unit} of ${product.name}.`);
            return;
        }
        if (qty > maxQ) {
            alert(`You can only buy up to ${maxQ} ${product.unit} of ${product.name} per order.`);
            return;
        }

        addToCart(product, qty);
        setQuantities({ ...quantities, [product.id]: minQ }); // reset to min
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.farmer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesVolume = volumeFilter === 'all' 
            ? true 
            : volumeFilter === 'retail' 
                ? ((p.minQuantity || 1) <= 10) 
                : ((p.minQuantity || 1) > 10); // wholesale defines requiring large minimum buys
                
        return matchesSearch && matchesCategory && matchesVolume;
    }).sort((a, b) => {
        if (sortOption === 'price_asc') return a.price - b.price;
        if (sortOption === 'price_desc') return b.price - a.price;
        if (sortOption === 'harvest_date') return new Date(b.harvestDate) - new Date(a.harvestDate); // Newest harvested first
        
        // Nearest is distanceKm ascending
        if (sortOption === 'nearest') {
            if (a.distanceKm == null) return 1;
            if (b.distanceKm == null) return -1;
            return a.distanceKm - b.distanceKm;
        }
        return 0;
    });

    return (
        <div className="animate-fade">
            <div className="header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2.2rem', fontWeight: '800' }}>Fresh Deals of the Day</h1>
                    <p className="subtitle" style={{ color: '#007185', fontSize: '1.2rem' }}>Direct farm rates. Highest quality.</p>
                </div>
            </div>

            {/* Advanced Filters and Sort Row */}
            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', padding: '1.25rem 2rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '30px',
                                border: 'none',
                                background: activeCategory === cat ? 'linear-gradient(135deg, #10b981, #065f46)' : 'rgba(255,255,255,0.5)',
                                color: activeCategory === cat ? 'white' : 'var(--text-main)',
                                fontWeight: '700',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: activeCategory === cat ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: activeCategory === cat ? '0 10px 15px -3px rgba(16, 185, 129, 0.4)' : '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Scale:</span>
                        <select 
                            className="input-field" 
                            style={{ width: 'auto', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: 0 }}
                            value={volumeFilter}
                            onChange={(e) => setVolumeFilter(e.target.value)}
                        >
                            <option value="all">Mixed (All Sizes)</option>
                            <option value="retail">Retail (Small Qty)</option>
                            <option value="wholesale">Wholesale B2B (Bulk Qty)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Sort by:</span>
                        <select 
                            className="input-field" 
                            style={{ width: 'auto', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: 0 }}
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="nearest">Distance: Nearest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="harvest_date">Freshness: Newest Harvest</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 && (
                <div className="glass-panel" style={{ textAlign: 'center', margin: '4rem 0', padding: '4rem 2rem', border: '1px dashed var(--border-color)' }}>
                    <Search size={56} color="#94a3b8" style={{ margin: '0 auto 1.5rem' }} />
                    <p style={{ color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>No products found</p>
                    <p style={{ color: 'var(--text-mut)', fontSize: '1rem' }}>Try adjusting your category filters or search query.</p>
                    {activeCategory !== 'All' && (
                        <button className="btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveCategory('All')}>Clear Filters</button>
                    )}
                </div>
            )}

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                {filteredProducts.map(product => {
                    const isLowStock = product.quantity > 0 && product.quantity <= 10;
                    const isSoldOut = product.quantity === 0;

                    return (
                        <div key={product.id} className="glass-panel product-card-hover" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px', transition: 'all 0.3s' }}>
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                <img src={product.imgUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="product-image" />
                                {isLowStock && (
                                    <span className="badge-pulse" style={{ position: 'absolute', top: '10px', left: '10px', background: '#dc2626', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        Only {product.quantity} left
                                    </span>
                                )}
                                {isSoldOut && (
                                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: '800', marginBottom: '0', letterSpacing: '-0.5px' }}>{product.name}</h3>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#065f46' }}>₹{product.price.toFixed(2)}<span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}><br />/{product.unit}</span></span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', display: 'inline-flex', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', width: 'fit-content' }}>
                                    <ShieldCheck size={16} color="#10b981" />
                                    <span style={{ color: '#065f46', fontSize: '0.85rem', fontWeight: '600' }}>Direct from {product.farmer}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', marginBottom: '1rem' }}>
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    <Star size={16} fill="#fbbf24" stroke="none" />
                                    <Star size={16} fill="#e2e8f0" stroke="none" />
                                    <span style={{ color: '#007185', fontSize: '0.85rem', marginLeft: '0.5rem' }}>1,244 ratings</span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Calendar size={16} color="#10b981" />
                                        <span><strong>Harvested:</strong> {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'Fresh this week'}</span>
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: product.etaMinutes ? '#d97706' : '#0f172a' }}>
                                        <Truck size={16} color={product.etaMinutes ? "#d97706" : "#0f172a"} />
                                        <span>
                                            {product.etaMinutes 
                                                ? <strong>⚡ ETA: ~{product.etaMinutes} mins</strong> 
                                                : <strong>FREE Delivery</strong>}
                                            {product.distanceKm ? ` (${product.distanceKm} km away)` : ' Tomorrow by 12 PM'}
                                        </span>
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                                        <MapPin size={16} />
                                        <span>Delivering to registered coordinates</span>
                                    </p>
                                </div>

                                {!isSoldOut ? (
                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <p style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '600', marginBottom: 0 }}>
                                            In stock • {product.minQuantity > 1 ? `Min buy: ${product.minQuantity} ${product.unit}` : 'Ready to ship'}
                                            {product.maxQuantity ? ` • Max: ${product.maxQuantity} ${product.unit}` : ''}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
                                            <select
                                                style={{ padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', fontWeight: 'bold', appearance: 'none', WebkitAppearance: 'none' }}
                                                value={quantities[product.id] || product.minQuantity || 1}
                                                onChange={(e) => handleQtyChange(product.id, e.target.value)}
                                            >
                                                {(() => {
                                                    const minQ = product.minQuantity || 1;
                                                    let maxQ = product.maxQuantity || product.quantity;
                                                    if (maxQ > product.quantity) maxQ = product.quantity;
                                                    if (maxQ > 50) maxQ = 50; // Cap dropdown at 50 for UI sanity
                                                    
                                                    // Deduct what is already in cart so they can't over-select
                                                    const currentCartItem = cart?.find(c => c.productId === product.id);
                                                    const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                    const availableDropdownMax = maxQ - alreadyInCart;

                                                    const options = [];
                                                    for (let i = minQ; i <= availableDropdownMax && i <= product.quantity; i++) {
                                                        options.push(<option key={i} value={i}>Qty: {i}</option>);
                                                    }
                                                    if (options.length === 0) {
                                                        options.push(<option key="max" value="0">Cart Full</option>);
                                                    }
                                                    return options;
                                                })()}
                                            </select>
                                            <button
                                                className="btn-primary"
                                                disabled={
                                                    (() => {
                                                        let maxQ = product.maxQuantity || product.quantity;
                                                        if (maxQ > product.quantity) maxQ = product.quantity;
                                                        const currentCartItem = cart?.find(c => c.productId === product.id);
                                                        const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                        return (maxQ - alreadyInCart) <= 0;
                                                    })()
                                                }
                                                style={{ 
                                                    flex: 1, 
                                                    padding: '0.75rem', 
                                                    background: (() => {
                                                        let maxQ = product.maxQuantity || product.quantity;
                                                        if (maxQ > product.quantity) maxQ = product.quantity;
                                                        const currentCartItem = cart?.find(c => c.productId === product.id);
                                                        const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                        return (maxQ - alreadyInCart) <= 0 ? '#f1f5f9' : '#f59e0b';
                                                    })(), 
                                                    color: (() => {
                                                        let maxQ = product.maxQuantity || product.quantity;
                                                        if (maxQ > product.quantity) maxQ = product.quantity;
                                                        const currentCartItem = cart?.find(c => c.productId === product.id);
                                                        const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                        return (maxQ - alreadyInCart) <= 0 ? '#94a3b8' : '#0f1111';
                                                    })(), 
                                                    border: 'none', 
                                                    borderRadius: '30px', 
                                                    fontSize: '1rem', 
                                                    cursor: (() => {
                                                        let maxQ = product.maxQuantity || product.quantity;
                                                        if (maxQ > product.quantity) maxQ = product.quantity;
                                                        const currentCartItem = cart?.find(c => c.productId === product.id);
                                                        const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                        return (maxQ - alreadyInCart) <= 0 ? 'not-allowed' : 'pointer';
                                                    })(), 
                                                    fontWeight: 'bold', 
                                                    boxShadow: (() => {
                                                        let maxQ = product.maxQuantity || product.quantity;
                                                        if (maxQ > product.quantity) maxQ = product.quantity;
                                                        const currentCartItem = cart?.find(c => c.productId === product.id);
                                                        const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                        return (maxQ - alreadyInCart) <= 0 ? 'none' : '0 4px 6px -1px rgba(245, 158, 11, 0.4)';
                                                    })(), 
                                                    transition: 'all 0.2s' 
                                                }}
                                                onClick={() => handleOrder(product)}
                                                onMouseOver={(e) => {
                                                    let maxQ = product.maxQuantity || product.quantity;
                                                    if (maxQ > product.quantity) maxQ = product.quantity;
                                                    const currentCartItem = cart?.find(c => c.productId === product.id);
                                                    const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                    if ((maxQ - alreadyInCart) > 0) e.currentTarget.style.transform = 'translateY(-2px)'
                                                }}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                {(() => {
                                                    let maxQ = product.maxQuantity || product.quantity;
                                                    if (maxQ > product.quantity) maxQ = product.quantity;
                                                    const currentCartItem = cart?.find(c => c.productId === product.id);
                                                    const alreadyInCart = currentCartItem ? currentCartItem.quantity : 0;
                                                    return (maxQ - alreadyInCart) <= 0 ? 'Cart Full' : 'Add to Cart';
                                                })()}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: 'auto' }}>
                                        <button className="btn-secondary" disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '30px', fontSize: '1rem', cursor: 'not-allowed', background: '#f1f5f9', color: '#94a3b8', border: 'none', fontWeight: 'bold' }}>
                                            Out of Stock
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .product-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border-color: #059669;
                }
                .product-card-hover:hover .product-image {
                    transform: scale(1.05);
                }
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
                }
                .badge-pulse {
                    animation: pulse-red 2s infinite;
                }
            `}} />
        </div>
    );
}
