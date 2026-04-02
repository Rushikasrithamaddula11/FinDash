import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ label = 'Back' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide back button on Landing page or Dashboard if we want them to act as absolute roots.
  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors py-1.5 pr-3 hover:bg-blue-50 rounded-lg font-medium shadow-sm border border-transparent hover:border-blue-100"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
