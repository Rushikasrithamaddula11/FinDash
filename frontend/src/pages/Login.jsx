import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
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
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 mt-1">Please enter your credentials to access the admin portal.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-100 transition-all shadow-md mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Trouble logging in? <Link to="/forgot-password" className="text-indigo-600 hover:underline font-semibold ml-1">Forgot Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
