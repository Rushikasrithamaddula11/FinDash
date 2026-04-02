import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';
import Navbar from './components/Navbar';

import OTPLogin from './pages/OTPLogin';
import SelectRole from './pages/SelectRole';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import SetupPassword from './pages/SetupPassword';
import ChatAssistant from './components/ChatAssistant';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/otp-login" />;
  
  if (user.role === 'pending') {
    return <Navigate to="/select-role" />;
  }
  
  if (roles) {
    const rolesHierarchy = { viewer: 1, analyst: 2, admin: 3 };
    if (rolesHierarchy[user.role] < rolesHierarchy[roles]) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {user && user.role !== 'pending' && <Navbar />}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/otp-login" element={!user ? <OTPLogin /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
            <Route path="/select-role" element={user && user.role === 'pending' ? <SelectRole /> : <Navigate to="/dashboard" />} />
            <Route path="/setup-password" element={user ? <SetupPassword /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/records" element={<ProtectedRoute roles="analyst"><Records /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles="admin"><Users /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={user ? (user.role === 'pending' ? "/select-role" : "/dashboard") : "/otp-login"} />} />
          </Routes>
        </main>
        <ChatAssistant />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
