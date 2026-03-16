import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Customer from './pages/Customer';
import Farmer from './pages/Farmer';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import PhoneLogin from './pages/auth/PhoneLogin';
import OtpVerification from './pages/auth/OtpVerification';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import DeliveryPartner from './pages/DeliveryPartner';
import Onboarding from './pages/Onboarding';
import { AppProvider, AppContext } from './context/AppContext';
import './index.css';

function ProtectedRoute({ children, roleRequired }) {
  const { user, userRole } = useContext(AppContext);
  if (!user) return <Navigate to="/auth" />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" />;
  return children;
}

function AppContent() {
  const { hasSeenTutorial } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasSeenTutorial && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [hasSeenTutorial, location, navigate]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ padding: '2rem 5%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/phone-login" element={<PhoneLogin />} />
          <Route path="/auth/otp-verification" element={<OtpVerification />} />
          <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
          <Route path="/farmer" element={<ProtectedRoute roleRequired="farmer"><Farmer /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><Admin /></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute roleRequired="delivery"><DeliveryPartner /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
