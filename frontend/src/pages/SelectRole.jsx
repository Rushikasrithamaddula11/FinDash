import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SelectRole = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, selectRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Protect this route from non-pending users
  useEffect(() => {
    if (user && user.role !== 'pending') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRoleSelection = async (role) => {
    setIsLoading(true);
    setError('');
    try {
      await selectRole(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to select role');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight inline-block mb-2">Select Your Role</h1>
          <p className="text-gray-500 mt-2 text-lg">Choose how you'll be using FinDash to set up your account capabilities.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center font-medium">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => !isLoading && handleRoleSelection('viewer')}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-blue-500 hover:shadow-lg hover:bg-blue-50'}`}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Viewer</h3>
            <p className="text-gray-600 text-sm text-center">Can view dashboard data and analytics. No access to raw records or creation capabilities.</p>
          </div>

          <div 
            onClick={() => !isLoading && handleRoleSelection('analyst')}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-green-500 hover:shadow-lg hover:bg-green-50'}`}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Analyst</h3>
            <p className="text-gray-600 text-sm text-center">Can view all records and access comprehensive insights. Cannot edit or manage users.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
