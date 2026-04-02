import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Plus, Trash2, Edit2, Filter, Calendar, Search } from 'lucide-react';
import BackButton from '../components/BackButton';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', type: 'expense', category: '', date: '', notes: '' });
  const [editId, setEditId] = useState(null);

  // Filter States
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records/');
      setRecords(res.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount), date: new Date(formData.date).toISOString() };
      
      if (editId) {
        await api.put(`/records/${editId}`, payload);
      } else {
        await api.post('/records/', payload);
      }
      
      setShowModal(false);
      setFormData({ amount: '', type: 'expense', category: '', date: '', notes: '' });
      setEditId(null);
      fetchRecords();
    } catch (err) {
      console.error(err);
      alert('Action failed. Note: Only Admins can modify records.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/records/${id}`);
        fetchRecords();
      } catch (err) {
        console.error(err);
        alert('Delete failed. Note: Only Admins can modify records.');
      }
    }
  };

  const openEdit = (rec) => {
    setEditId(rec._id);
    setFormData({
      amount: rec.amount,
      type: rec.type,
      category: rec.category,
      date: new Date(rec.date).toISOString().split('T')[0],
      notes: rec.notes || ''
    });
    setShowModal(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64 font-medium text-gray-500 animate-pulse">Loading records...</div>;

  const isAdmin = user?.role === 'admin';

  const filteredRecords = records.filter(rec => {
    if (filterType !== 'all' && rec.type !== filterType) return false;
    if (filterCategory && !rec.category.toLowerCase().includes(filterCategory.toLowerCase())) return false;
    if (filterDate && new Date(rec.date).toISOString().split('T')[0] !== filterDate) return false;
    return true;
  });

  return (
    <div className="space-y-6 pt-2">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
          <p className="text-gray-500 mt-1">Manage and view all transaction entries</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setEditId(null); setFormData({ amount: '', type: 'expense', category: '', date: '', notes: '' }); setShowModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" /> New Record
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center"><Search className="w-3.5 h-3.5 mr-1"/> Category</label>
             <input type="text" placeholder="Search by category..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center"><Filter className="w-3.5 h-3.5 mr-1"/> Type</label>
             <select className="w-full md:w-36 px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
               <option value="all">All Types</option>
               <option value="income">Income</option>
               <option value="expense">Expense</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> Date</label>
             <input type="date" className="w-full md:w-40 px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="self-end shrink-0 hidden md:block">
            <button onClick={() => { setFilterCategory(''); setFilterType('all'); setFilterDate(''); }} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-sm">Reset</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Notes</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length > 0 ? filteredRecords.map(rec => (
                <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{rec.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${rec.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {rec.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${rec.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {rec.type === 'income' ? '+' : '-'}₹{rec.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{rec.notes || '-'}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEdit(rec)} className="text-indigo-600 hover:text-indigo-900 mr-4 bg-indigo-50 p-2 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(rec._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-400 font-medium text-lg">No records match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 lg:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{editId ? 'Edit Record' : 'Add New Record'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block font-medium outline-none"
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₹)</label>
                  <input type="number" step="0.01" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-medium text-gray-900" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <input type="text" required placeholder="Food, Salary, Rent..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-medium text-gray-900" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="date" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-medium text-gray-900" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (Optional)</label>
                <textarea rows="2" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-medium text-gray-900 resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">{editId ? 'Save Changes' : 'Create Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
