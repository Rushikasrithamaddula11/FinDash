import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, TrendingUp, Cpu } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar segment */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
           <Cpu className="w-8 h-8 text-blue-600" />
           <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">FinDash</span>
        </div>
        <div className="hidden md:flex space-x-8">
           <a href="#features" className="text-gray-500 font-semibold hover:text-gray-900 transition-colors">Features</a>
           <a href="#security" className="text-gray-500 font-semibold hover:text-gray-900 transition-colors">Security</a>
        </div>
        <Link to="/otp-login" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
           Sign In / Register
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 relative overflow-hidden pt-20 pb-32">
        {/* Animated Orbs */}
        <div className="absolute top-0 left-[-10%] w-[30rem] h-[30rem] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>

        <div className="max-w-4xl w-full text-center z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-sm">
             <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
             <span>Intelligent Finance Engine 2.0 Is Live</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Master Your Cashflow with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">FinDash</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            The all-in-one financial dashboard. Seamlessly track expenses, categorize income, and scale your financial visibility.
          </p>

          <Link to="/otp-login" className="inline-flex items-center justify-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-gray-800 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-lg">
             <span>Access Your Portal</span>
             <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
             </svg>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-white py-24 relative z-10 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Why FinDash?</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Managing an organization's records manually is complex and prone to structural errors. The FinDash assignment portal provides a robust, multi-layer environment designed for seamless data processing. We focus on assigning explicit roles, visualizing instant trends with Bar/Pie chart integrations, and isolating admin routes to guarantee a military-grade cashflow architecture.
          </p>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="bg-gray-50 py-24 relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Everything You Need is Here</h2>
             <p className="text-gray-500 font-medium">Smart visual integrations designed to save you time and maximize visibility.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                   <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Monitor and engage intuitively with live charts to recognize immediate financial shifts.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                   <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expense Scaling</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Capture exact granular records for accurate balancing categorized automatically.</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                   <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Military-Grade Security</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Role assignment capabilities backed dynamically by strict server-isolated email verification workflows.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Contact Admin Section */}
      <div id="contact" className="bg-white py-20 relative z-10 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Need Support?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            If you have issues logging in, or need immediate assistance configuring your roles with Zorvyn regulations, please contact the network administrator immediately.
          </p>
          <a href="mailto:rushikasrithamaddula2005@gmail.com" className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
             <ShieldCheck className="w-5 h-5" />
             <span>Contact Administrator</span>
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <Cpu className="w-6 h-6 text-blue-400" />
               <span className="text-xl font-extrabold text-gray-900">FinDash</span>
            </div>
            <p className="text-gray-400 font-medium text-sm">© 2026 Admin Solutions Inc. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
