import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">FinDash</h1>
            <div className="hidden md:flex space-x-2">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              {user && user.role !== 'viewer' && (
                <Link to="/records" className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200">
                  <FileText className="w-4 h-4 mr-2" />
                  Records
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link to="/users" className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 capitalize mt-0.5">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
