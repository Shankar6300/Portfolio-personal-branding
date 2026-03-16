import React, { createContext, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { collection, onSnapshot, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
    // True Firebase Authentication States
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Persist Login State securely using Firebase onAuthStateChanged
    useEffect(() => {
        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUser({ id: firebaseUser.uid, ...userData });
                        setUserRole(userData.role);
                    } else {
                        // If document doesn't exist yet (during registration before setDoc) just hold the basic data
                        setUser({ id: firebaseUser.uid, email: firebaseUser.email, phone: firebaseUser.phoneNumber });
                        setUserRole('customer'); // Default safe fallback
                    }
                } catch (e) {
                    console.error("Failed to fetch user role from Firestore", e);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // Swiggy-Style Application States
    const [language, setLanguage] = useState(() => localStorage.getItem('df_language') || 'English');
    const [hasSeenTutorial, setHasSeenTutorial] = useState(() => localStorage.getItem('df_tutorial') === 'true');

    useEffect(() => {
        localStorage.setItem('df_language', language);
        localStorage.setItem('df_tutorial', hasSeenTutorial);
    }, [language, hasSeenTutorial]);

    const [searchQuery, setSearchQuery] = useState('');

    // Central Data States, cached to LocalStorage to allow cross-tab syncing without backend
    const [products, setProducts] = useState(() => {
        const p = localStorage.getItem('df_app_products');
        return p ? JSON.parse(p) : [];
    });
    const [orders, setOrders] = useState(() => {
        const o = localStorage.getItem('df_app_orders');
        return o ? JSON.parse(o) : [];
    });
    const [cart, setCart] = useState(() => {
        const c = sessionStorage.getItem('df_app_cart'); // specific to the tab's user
        return c ? JSON.parse(c) : [];
    });
    
    // Marketing Engine Promo Codes
    const [activePromos, setActivePromos] = useState(() => {
        const p = localStorage.getItem('df_app_promos');
        return p ? JSON.parse(p) : [];
    });

    // Write to storage immediately on change
    useEffect(() => { localStorage.setItem('df_app_products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('df_app_orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { sessionStorage.setItem('df_app_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('df_app_promos', JSON.stringify(activePromos)); }, [activePromos]);

    // Live Cross-Tab Synchronization Hook
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'df_app_products') {
                setProducts(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'df_app_orders') {
                setOrders(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'df_app_promos') {
                setActivePromos(e.newValue ? JSON.parse(e.newValue) : []);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    const [notifications, setNotifications] = useState([
        { id: 101, text: 'Welcome to FarmConnect! Connected securely to Backend DB.', timestamp: new Date().toISOString() }
    ]);

    // FETCH FROM FIREBASE DB ON LOAD
    useEffect(() => {
        if (!db) return;

        // Listen for live updates from 'products' collection
        const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
            localStorage.setItem('df_app_products', JSON.stringify(productsList));
        });

        // Listen for live updates from 'orders' collection
        const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
            const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersList);
            localStorage.setItem('df_app_orders', JSON.stringify(ordersList));
        });

        return () => {
            unsubscribeProducts();
            unsubscribeOrders();
        };
    }, []);

    // Secure EmailJS Trigger
    const sendEmailNotification = (to_email, to_name, subject, message) => {
        console.log(`[EMAIL DISPATCHED] To: ${to_email} | Subject: ${subject}`);
        console.log(`[BODY] Hello ${to_name}, ${message}`);

        try {
            emailjs.send(
                'service_9a72p9u', // Replace with EmailJS Service ID
                'template_up5xtrc', // Replace with EmailJS Template ID
                { to_email, to_name, subject, message },
                'ae2JJmocNvctPBj-S' // Replace with EmailJS Public Key
            ).then(res => {
                console.log('Email natively sent!', res.status);
            }).catch(err => {
                console.error("EmailJS failed to send actual email.", err);
            });
        } catch (e) {
            console.error(e)
        }
    };

    const login = () => {}; // Replaced securely by standard components triggering setDoc and Firebase auth hooks

    const logout = async () => {
        try {
            if (auth) {
                await signOut(auth);
            }
        } catch(e) {
            console.error(e);
        }
        setUser(null);
        setUserRole(null);
    };

    const launchPromo = (code, discountPercentage) => {
        const newPromo = { code: code.toUpperCase(), discount: discountPercentage, active: true };
        setActivePromos(prev => [newPromo, ...prev.filter(p => p.code !== newPromo.code)]);
    };

    const addProduct = async (product) => {
        try {
            // Optimistic Update
            const tempId = Date.now().toString();
            setProducts([{ ...product, id: tempId, farmerName: user?.name, farmerId: user?.id }, ...products]);

            if (db) {
                const newDocRef = doc(collection(db, 'products'));
                await setDoc(newDocRef, { ...product, farmerName: user?.name, farmerId: user?.id || "sync-id" });
            }
        } catch (e) {
            console.error("Failed to push product to Firestore DB", e);
        }
    };

    const addToCart = (product, qty) => {
        const existing = cart.find(item => item.productId === product.id);
        const currentCartQty = existing ? existing.quantity : 0;
        const newTotalQty = currentCartQty + qty;

        const maxAllowed = product.maxQuantity || product.quantity;

        if (newTotalQty > product.quantity) {
            alert(`Cannot add ${qty}. Only ${product.quantity - currentCartQty} left in stock.`);
            return;
        }

        if (newTotalQty > maxAllowed) {
            alert(`Cannot add ${qty}. You can only buy up to ${maxAllowed} ${product.unit} of this item per order.`);
            return;
        }

        if (existing) {
            setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: newTotalQty } : item));
        } else {
            setCart([...cart, {
                id: Date.now().toString(),
                productId: product.id,
                productName: product.name,
                farmer: product.farmerName,
                price: product.price,
                quantity: qty,
                imgUrl: product.images
            }]);
        }
        alert(`${qty} ${product.unit || 'units'} of ${product.name} added to cart!`);
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter(c => c.id !== cartId));
    };

    const checkout = async (addressInfo, paymentMethod) => {
        if (cart.length === 0) return;

        const totalAmt = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Use realistic DB persistence
        const orderTempId = Date.now().toString();
        const newOrders = cart.map((item, idx) => ({
             id: orderTempId + '-' + idx,
             productId: item.productId,
             productName: item.productName,
             farmer: item.farmer,
             quantity: item.quantity,
             totalPrice: item.price * item.quantity,
             address: addressInfo,
             customerName: user?.name || "Guest Checkout",
             status: 'pending',
             date: new Date().toISOString(),
             imgUrl: item.imgUrl,
             paymentMethod
        }));

        setOrders(prev => [...newOrders, ...prev]);

        // Reduce stock in global catalog (optimistic)
        const updatedProducts = products.map((p) => {
            const boughtItem = cart.find(c => c.productId === p.id);
            if (boughtItem) {
                return { ...p, quantity: Math.max(0, p.quantity - boughtItem.quantity) };
            }
            return p;
        });
        setProducts(updatedProducts);

        if (db) {
            try {
                // Bulk write new orders
                newOrders.forEach(async (orderObj) => {
                    await setDoc(doc(collection(db, 'orders'), orderObj.id), orderObj);
                });
                
                // Update product stock on firestore
                cart.forEach(async (cartItem) => {
                    const matchedProduct = products.find(p => p.id === cartItem.productId);
                    if (matchedProduct) {
                        const newStock = Math.max(0, matchedProduct.quantity - cartItem.quantity);
                        await updateDoc(doc(db, 'products', matchedProduct.id), { quantity: newStock });
                    }
                });
            } catch (err) {
                console.error("Error committing checkout to Firestore", err);
            }
        }

        // --- EMAIL TRIGGERS FOR ORDER CREATION ---
        const farmerNotificationsSent = [];
        cart.forEach(orderItem => {
            if (!farmerNotificationsSent.includes(orderItem.farmer)) {
                sendEmailNotification(
                    'shankarnarayanareddy196@gmail.com', 
                    orderItem.farmer || 'Farmer',
                    `🚨 NEW ORDER RECEIVED: Action Required for ${orderItem.productName}!`,
                    `Hello ${orderItem.farmer},\n\nYou have received a new order. Please log in to your Seller Central immediately to verify stock, pack the item, and dispatch it to the GPS coordinates provided.\n\nThank you,\nDirectFarm Marketplace`
                );
                farmerNotificationsSent.push(orderItem.farmer);
            }
        });

        sendEmailNotification(
            user?.email || 'shankarnarayanareddy196@gmail.com',
            user?.name || 'Customer',
            '🎉 Order Placed & Confirmed - DirectFarm',
            `Thank you for your order! The map coordinates for delivery are locked at [Lat: ${addressInfo.lat.toFixed(2)}, Lng: ${addressInfo.lng.toFixed(2)}]. You will receive an email as soon as the farmer begins packing your items!`
        );

        setCart([]);
        
        const logMsg = dbData?.logistics 
            ? `Order Placed. Dispatching ${dbData.logistics.assignedVehicle} (${dbData.logistics.assignedDriver}) for ${dbData.logistics.totalKgs}kg load.`
            : `✓ Order placed securely. Farmers notified.`;
            
        setNotifications([
            { id: Date.now() + 1, text: logMsg, timestamp: new Date().toISOString() },
            ...notifications
        ]);
        
        alert(`Order Placed Successfully!`);
    };

    const updateOrderStatus = async (orderId, status) => {
        // Optimistic Update
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: status.toLowerCase() } : o));

        const order = orders.find(o => o.id === orderId);
        
        if (db && order) {
            try {
                await updateDoc(doc(db, 'orders', orderId), { status: status.toLowerCase() });
            } catch (err) {
                console.error("Error updating order status in Firestore", err);
            }
        }

        if (order) {
            let customSubject = `📦 Order Update: ${status.toUpperCase()}`;
            let customMessage = `Good news! Your order #${orderId} has been updated to ${status.toUpperCase()}.`;

            const lat = order.address?.lat || 28.6139;
            const lng = order.address?.lng || 77.2090;
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

            if (status === 'confirmed') {
                customSubject = `✅ Order Accepted by Farm!`;
                customMessage = `The farmer has officially verified inventory and accepted your order.`;
            } else if (status === 'packing') {
                customSubject = `📦 Your order is being Packed!`;
                customMessage = `Great news! Your produce is currently being packed into secure boxes.`;
            } else if (status === 'shipped') {
                customSubject = `🚚 Order Dispatched! Live Tracking Link Inside`;
                customMessage = `Your order has left the farm! \n\n📍 DELIVERY DROPOFF LINK: ${googleMapsLink}\n\nExpect delivery shortly.`;
            } else if (status === 'out_for_delivery') {
                customSubject = `🛵 OUT FOR DELIVERY! Your Driver is nearby.`;
                customMessage = `Your driver is currently navigating to your pinned location!\n\n📍 TRACK DRIVER DESTINATION: ${googleMapsLink}\n\nPlease keep your phone nearby and be ready!`;
            } else if (status === 'delivered') {
                customSubject = `🎉 Order Delivered Successfully!`;
                customMessage = `Enjoy your fresh produce! Your order has been successfully hand-delivered.\n\nThank you for choosing DirectFarm!`;
            }

            sendEmailNotification(
                user?.email || 'shankarnarayanareddy196@gmail.com',
                order.customerName || 'Customer',
                customSubject,
                customMessage
            );

            setNotifications([
                { id: Date.now() + 2, text: `📧 Customer notified via email about order #${orderId} update to ${status.toUpperCase()}.`, timestamp: new Date().toISOString() },
                ...notifications
            ]);
        }
    };

    if (!isAuthReady) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Securely authenticating...</h2></div>;
    }

    return (
        <AppContext.Provider value={{
            user, userRole, login, logout,
            products, setProducts, addProduct,
            cart, addToCart, removeFromCart, checkout,
            orders, updateOrderStatus,
            notifications,
            searchQuery, setSearchQuery,
            language, setLanguage,
            hasSeenTutorial, setHasSeenTutorial,
            buyFarmPass, updateWallet,
            activePromos, launchPromo,
            isAuthReady
        }}>
            {children}
        </AppContext.Provider>
    );
};
