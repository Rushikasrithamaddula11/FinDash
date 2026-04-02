import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reports/summary');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-500 font-medium animate-pulse">Loading dashboard...</div>;


  if (!data) return null;

  const pieData = Object.keys(data.category_totals).map((key) => ({
    name: key,
    value: data.category_totals[key]
  }));

  const dateMap = {};
  [...data.recent_records].reverse().forEach(r => {
    const d = new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!dateMap[d]) dateMap[d] = { name: d, Income: 0, Expense: 0 };
    if (r.type === 'income') dateMap[d].Income += r.amount;
    else dateMap[d].Expense += r.amount;
  });
  const barData = Object.values(dateMap).slice(-7); // Last 7 grouped dates

  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-500 mt-1">Here's your business summary</p>
        </div>
        {(user?.role !== 'admin') && (
        <Link to="/setup-password" className="text-sm border border-indigo-200 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors shadow-sm hidden sm:block">
          Set Login Password 🔒
        </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Income</h3>
            <div className="p-2.5 bg-green-50 rounded-xl"><TrendingUp className="w-5 h-5 text-green-600" /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">₹{data.total_income.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</h3>
            <div className="p-2.5 bg-red-50 rounded-xl"><TrendingDown className="w-5 h-5 text-red-600" /></div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">₹{data.total_expenses.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Net Balance</h3>
            <div className="p-2.5 bg-blue-50 rounded-xl"><DollarSign className="w-5 h-5 text-blue-600" /></div>
          </div>
          <p className={`text-4xl font-extrabold relative z-10 ${data.net_balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{data.net_balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-indigo-500"/> Volume by Category</h3>
          <div className="h-80">
            {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `₹${value}`} cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-blue-500"/> Cashflow Trend</h3>
          <div className="h-80">
             {barData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} tickFormatter={(value) => `₹${value}`} />
                 <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} formatter={(value) => `₹${value}`} />
                 <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                 <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                 <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
             ) : (
               <div className="flex items-center justify-center h-full text-gray-400">No trend data available</div>
             )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Clock className="w-5 h-5 mr-2 text-indigo-500"/> Recent Activity</h3>
          <div className="space-y-3">
            {data.recent_records.length > 0 ? data.recent_records.map(record => (
              <div key={record._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors gap-3">
                <div>
                  <p className="font-bold text-gray-900 capitalize">{record.category}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase mt-0.5">{new Date(record.date).toLocaleDateString()} • {record.notes || 'No description'}</p>
                </div>
                <div className={`font-extrabold text-lg bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm self-start sm:self-auto ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString('en-IN')}
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 mt-16 font-medium">No recent records to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
