import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const OTPLogin = () => {
  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, requestOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) setError('Incorrect email or password');
      else if (err.response?.status === 403) setError('Admin setup requires strict login portal.');
      else setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await requestOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const role = await verifyOtp(email, otp);
      if (role === 'pending') {
        navigate('/select-role');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md mb-4 self-start md:self-auto hidden md:block">
         <BackButton />
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative">
        <div className="absolute top-4 left-4 md:hidden">
           <BackButton label="" />
        </div>
        <div className="text-center mb-6 mt-4 md:mt-0">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight inline-block mb-2">FinDash</h1>
          <h2 className="text-2xl font-bold text-gray-900">User Portal</h2>
          <p className="text-gray-500 mt-1">
            {mode === 'password' ? 'Sign in to your account securely.' : (step === 1 ? 'Enter your email to sign up and verify.' : 'Enter the OTP sent to your email.')}
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}
        
        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="viewer@company.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            
            <div className="flex justify-between items-center py-2">
              <button type="button" onClick={() => {setMode('otp'); setStep(1);}} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Sign Up</button>
              <Link to="/forgot-password" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 transition-all shadow-md">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          step === 1 ? (
             <form onSubmit={handleRequestOtp} className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                 <input type="email" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="viewer@company.com" />
               </div>
               <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 transition-all shadow-md">
                 {isLoading ? 'Requesting...' : 'Get OTP'}
               </button>
             </form>
          ) : (
             <form onSubmit={handleVerifyOtp} className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter OTP</label>
                 <input type="text" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg font-bold outline-none transition-all" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength={6} />
               </div>
               <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 transition-all shadow-md">
                 {isLoading ? 'Verifying...' : 'Verify & Login'}
               </button>
               <div className="text-center mt-3">
                 <button type="button" onClick={() => setMode('password')} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Already have an account? Log In</button>
               </div>
             </form>
          )
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
