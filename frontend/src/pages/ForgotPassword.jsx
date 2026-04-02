import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { requestPasswordResetOtp, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await requestPasswordResetOtp(email);
      setStep(2);
      setSuccess('OTP sent successfully to your email.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await resetPassword(email, otp, newPassword);
      setSuccess('Password updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP or failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight inline-block mb-2">Reset Password</h1>
          <p className="text-gray-500 mt-1">
            {step === 1 ? "Enter your email to receive a password reset code." : "Enter the OTP and your new password."}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{success}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dash.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              {isLoading ? 'Requesting...' : 'Send OTP'}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-indigo-600 hover:underline font-medium">Back to Login</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter OTP</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest text-lg font-bold outline-none transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || success.includes('Redirecting')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Change Email instead
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
