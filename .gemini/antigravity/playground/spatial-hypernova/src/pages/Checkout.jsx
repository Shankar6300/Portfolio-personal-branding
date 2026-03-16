import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, CreditCard, Smartphone, CheckCircle, Loader2, MapPin, Wallet } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function LocationMarker({ position, setPosition, setAddress }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });

            try {
                // Reverse Geocoding using OpenStreetMap Nominatim API
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                const data = await res.json();

                if (data && data.address) {
                    const addr = data.address;
                    setAddress(prev => ({
                        ...prev,
                        lat: lat,
                        lng: lng,
                        pincode: addr.postcode || prev.pincode,
                        houseNo: addr.building || addr.house_number || prev.houseNo,
                        area: addr.suburb || addr.neighbourhood || addr.road || prev.area,
                        city: addr.city || addr.town || addr.village || addr.county || prev.city,
                        state: addr.state || prev.state
                    }));
                } else {
                    setAddress(prev => ({ ...prev, lat, lng }));
                }
            } catch (err) {
                console.error("Reverse geocoding failed", err);
                setAddress(prev => ({ ...prev, lat, lng }));
            }
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function Checkout() {
    const { cart, checkout, user, updateWallet } = useContext(AppContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = Address, 2 = Payment
    const [isGatewayOpen, setIsGatewayOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('processing');


    // Map State
    const [mapPosition, setMapPosition] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi

    // Address State
    const [address, setAddress] = useState({
        fullName: user ? user.name : '',
        mobile: user && user.contact ? user.contact : '',
        pincode: '',
        houseNo: '',
        area: '',
        city: '',
        state: '',
        lat: 28.6139,
        lng: 77.2090
    });

    useEffect(() => {
        setAddress(prev => ({ ...prev, lat: mapPosition.lat, lng: mapPosition.lng }));
    }, [mapPosition]);

    // Payment Option State
    const [paymentOption, setPaymentOption] = useState('upi');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = user?.hasFarmPass ? 0 : 40;
    const finalTotal = totalPrice + deliveryFee;

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (!address.pincode || !address.houseNo || !address.city) {
            alert("Please fill all address fields.");
            return;
        }
        setStep(2);
    };

    const handlePaymentSubmit = (e) => {
        if (e) e.preventDefault();

        if (paymentOption === 'cod') {
            checkout(address, paymentOption);
            alert('Cash on Delivery Order placed successfully!');
            navigate('/orders');
        } else {
            // Trigger Mock Razorpay/Stripe Gateway
            setIsGatewayOpen(true);
            setPaymentStatus('processing');
        }
    };

    // Mock Gateway Logic
    useEffect(() => {
        if (isGatewayOpen && paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                setPaymentStatus('success');
                setTimeout(() => {
                    setIsGatewayOpen(false);
                    if (paymentOption === 'wallet') {
                        updateWallet(-finalTotal);
                    }
                    checkout(address, paymentOption);
                    navigate('/orders');
                }, 1500); // 1.5s delay after success frame
            }, 2500); // 2.5s spinner
            return () => clearTimeout(timer);
        }
    }, [isGatewayOpen, paymentStatus]);

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <>
            <div className="animate-fade" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>

                <div style={{ flex: '1 1 60%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Step 1: Address */}
                    <div className="glass-panel" style={{ padding: '2rem', border: step === 1 ? '2px solid #059669' : '1px solid var(--border-color)', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#0f1111', fontWeight: 'bold' }}>1. Delivery Address</h2>
                            {step === 2 && <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => setStep(1)}>Change</button>}
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleAddressSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="animate-slide-up">

                                <div style={{ gridColumn: 'span 2', marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        <MapPin size={18} color="#dc2626" /> Pinpoint Exact Location (Tap to move pin)
                                    </label>
                                    <div style={{ height: '250px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                        <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker position={mapPosition} setPosition={setMapPosition} setAddress={setAddress} />
                                        </MapContainer>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-mut)', marginTop: '0.5rem' }}>
                                        Lat: {mapPosition.lat.toFixed(4)}, Lng: {mapPosition.lng.toFixed(4)}
                                    </p>
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                                    <label>Full name</label>
                                    <input type="text" className="input-field" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Mobile number</label>
                                    <input type="tel" className="input-field" value={address.mobile} onChange={e => setAddress({ ...address, mobile: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Pincode</label>
                                    <input type="text" className="input-field" placeholder="6 digits" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                                    <label>Flat, House no., Building</label>
                                    <input type="text" className="input-field" value={address.houseNo} onChange={e => setAddress({ ...address, houseNo: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                                    <label>Area, Sector, Village</label>
                                    <input type="text" className="input-field" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>City</label>
                                    <input type="text" className="input-field" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>State</label>
                                    <input type="text" className="input-field" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required />
                                </div>

                                <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', background: '#ffd814', color: '#0f1111', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Save Location & Address</button>
                            </form>
                        ) : (
                            <div style={{ color: '#565959', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8f8f8', padding: '1rem', borderRadius: '8px' }}>
                                <Truck size={32} color="#007185" />
                                <div>
                                    <p style={{ fontWeight: 'bold', color: '#0f1111' }}>{address.fullName}</p>
                                    <p>{address.houseNo}, {address.area}, {address.city}, {address.state} {address.pincode}</p>
                                    <p style={{ color: '#059669', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12} /> GPS Locked ({address.lat.toFixed(2)}, {address.lng.toFixed(2)})</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment */}
                    <div className="glass-panel" style={{ padding: '2rem', border: step === 2 ? '2px solid #059669' : '1px solid var(--border-color)', opacity: step === 1 ? 0.6 : 1, transition: 'all 0.3s ease', pointerEvents: step === 1 ? 'none' : 'auto' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#0f1111', marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            2. Secure Payment Method <Lock size={20} color="#059669" />
                        </h2>

                        <form onSubmit={handlePaymentSubmit} className={step === 2 ? "animate-slide-up" : ""}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentOption === 'wallet' ? '2px solid #007185' : '1px solid var(--border-color)', borderRadius: '8px', cursor: user?.walletBalance >= finalTotal ? 'pointer' : 'not-allowed', background: paymentOption === 'wallet' ? '#f0f8ff' : 'transparent', transition: 'all 0.2s', opacity: user?.walletBalance >= finalTotal ? 1 : 0.5 }}>
                                    <input type="radio" value="wallet" checked={paymentOption === 'wallet'} onChange={() => setPaymentOption('wallet')} disabled={user?.walletBalance < finalTotal} style={{ width: '20px', height: '20px' }} />
                                    <Wallet size={24} color={paymentOption === 'wallet' ? "#007185" : "#565959"} />
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>DirectFarm Wallet</span>
                                        <p style={{ fontSize: '0.85rem', color: paymentOption === 'wallet' ? '#007185' : 'var(--text-mut)' }}>Balance: ₹{user?.walletBalance || 0}</p>
                                    </div>
                                    {user?.walletBalance < finalTotal && (
                                        <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 'bold' }}>Insufficient Balance</span>
                                    )}
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentOption === 'upi' ? '2px solid #007185' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: paymentOption === 'upi' ? '#f0f8ff' : 'transparent', transition: 'all 0.2s' }}>
                                    <input type="radio" value="upi" checked={paymentOption === 'upi'} onChange={() => setPaymentOption('upi')} style={{ width: '20px', height: '20px' }} />
                                    <Smartphone size={24} color={paymentOption === 'upi' ? "#007185" : "#565959"} />
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>UPI App (GPay, PhonePe, Paytm)</span>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Fastest and most reliable network.</p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '20px' }} />
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentOption === 'card' ? '2px solid #007185' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: paymentOption === 'card' ? '#f0f8ff' : 'transparent', transition: 'all 0.2s' }}>
                                    <input type="radio" value="card" checked={paymentOption === 'card'} onChange={() => setPaymentOption('card')} style={{ width: '20px', height: '20px' }} />
                                    <CreditCard size={24} color={paymentOption === 'card' ? "#007185" : "#565959"} />
                                    <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Credit or Debit Card</span>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Visa, Mastercard, RuPay.</p>
                                    </div>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentOption === 'cod' ? '2px solid #007185' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: paymentOption === 'cod' ? '#f0f8ff' : 'transparent', transition: 'all 0.2s' }}>
                                    <input type="radio" value="cod" checked={paymentOption === 'cod'} onChange={() => setPaymentOption('cod')} style={{ width: '20px', height: '20px' }} />
                                    <Truck size={24} color={paymentOption === 'cod' ? "#007185" : "#565959"} />
                                    <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Cash on Delivery</span>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-mut)' }}>Pay upon inspection at your doorstep.</p>
                                    </div>
                                </label>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f8f8', borderRadius: '8px', border: '1px solid #e7e7e7' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.5, marginBottom: '1rem' }}>
                                    <Lock size={16} /> <span>SSL TRUSTED SECURE TRANSACTION</span>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Order Summary Sidebar */}
                <div style={{ flex: '1 1 30%', minWidth: '320px' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px', border: '1px solid var(--border-color)' }}>
                        <button className="btn-primary" disabled={step !== 2} onClick={handlePaymentSubmit} style={{ width: '100%', padding: '1rem', background: step !== 2 ? '#e7e7e7' : '#ffd814', color: step !== 2 ? '#a6a6a6' : '#0f1111', borderRadius: '30px', border: step === 2 ? '1px solid #fcd200' : 'none', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', cursor: step === 2 ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
                            {step !== 2 ? 'Use this address' : paymentOption === 'cod' ? 'Place Order' : `Pay ₹${finalTotal.toFixed(2)}`}
                        </button>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Order Summary</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#0f1111' }}>
                            <span>Items ({totalItems}):</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#0f1111' }}>
                            <span>Delivery:</span>
                            <span>₹40.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.95rem', color: '#0f1111' }}>
                            <span>FarmPass Promotion applied:</span>
                            <span style={{ color: user?.hasFarmPass ? '#059669' : '#a1a1aa' }}>-₹{user?.hasFarmPass ? '40.00' : '0.00'}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', fontSize: '1.4rem', fontWeight: '800', color: '#b12704' }}>
                            <span>Total:</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <div style={{ background: '#f8f8f8', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', border: '1px solid #e7e7e7' }}>
                            <p style={{ fontSize: '0.85rem', color: '#007185', fontWeight: 'bold', marginBottom: '0.5rem' }}>Arrives by Tomorrow 12 PM</p>
                            <p style={{ fontSize: '0.8rem', color: '#565959' }}>If you order within the next 3 hrs and choose fastest delivery.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mock Payment Gateway Overlay */}
            {isGatewayOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white', padding: '2.5rem', borderRadius: '16px',
                        width: '90%', maxWidth: '400px', textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Lock size={32} color="#0f1111" style={{ margin: '0 auto' }} />
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f1111', marginBottom: '0.5rem' }}>
                            DirectFarm Secure Pay
                        </h2>

                        <p style={{ color: '#565959', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                            Amount to Pay: <strong style={{ color: '#007185' }}>₹{totalPrice.toFixed(2)}</strong>
                        </p>

                        <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {paymentStatus === 'processing' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Loader2 className="animate-spin" size={48} color="#007185" />
                                    <p style={{ fontWeight: 'bold', color: '#007185' }}>Awaiting Confirmation...</p>
                                    <p style={{ fontSize: '0.85rem', color: '#565959' }}>Please do not close window or hit back.</p>
                                </div>
                            ) : (
                                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#059669' }}>
                                    <CheckCircle size={56} color="#059669" />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Payment Successful!</p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.5 }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '15px' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>|</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>SECURED</span>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}} />
        </>
    );
}
