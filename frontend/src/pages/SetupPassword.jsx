import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const SetupPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setupUserPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await setupUserPassword(newPassword);
      setSuccess('Password set successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to setup password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-2">Secure Your Account</h1>
          <p className="text-gray-500 mt-1">Set a password to use Quick Login instead of waiting for an OTP next time.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{success}</div>}

        <form onSubmit={handleSetup} className="space-y-6">
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            {isLoading ? 'Saving...' : 'Set Password'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">Skip for now</Link>
        </div>
      </div>
    </div>
  );
};

export default SetupPassword;
