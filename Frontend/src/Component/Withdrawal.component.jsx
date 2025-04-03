import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {  FiDollarSign, FiCreditCard, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi';
import { 
  FaWallet, 
  FaMoneyBillWave, 
  FaCoins, 
  FaChartLine,
  FaMoneyCheckAlt
} from 'react-icons/fa';

const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [current_user_ids,setCurrent_User_Id] = useState("");
  const [error, setError] = useState(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    phone: '',
    accountNumber: '',
    ifscCode: ''
  });


  useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
  
          const response = await axios.get(
            `${API_URL}/api/v1/users/current-user`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // setUser(response.data.data);
          // Set balance from API response (adjust according to your API structure)
          console.log("response.data.data._id",response.data.data._id);
          setCurrent_User_Id(response.data.data._id);
          setBalance(response.data.data.balance || 0);
          // setBankAccounts(data.bankAccounts);

          // Set bank accounts with proper formatting
      if(response.data.data.bankAccounts) {
        setBankAccounts(response.data.data.bankAccounts.map(account => ({
          fundAccountId: account.fundAccountId,
          last4: account.last4,
          bankName: account.bankName,
          addedOn: new Date(account.addedOn).toLocaleDateString()
        })));
      }

          
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
  }, []);

  
  // Handle withdrawal submission
  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/v1/users/withdraw`, {
        userId: 'current_user_id', // Replace with actual user ID from auth
        amount: parseFloat(amount),
        fundAccountId: selectedAccount,
      });

      console.log("user2",userId2);
      console.log("current_user_ids",current_user_ids);

      
      if (response.data.success) {
        toast.success('Withdrawal initiated successfully!');
        setBalance(prev => prev - parseFloat(amount));
        setAmount('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }


  };

  // Handle new bank account submission
  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newAccount.email)) {
        return toast.error('Invalid email address');
      }
      if (!/^[6-9]\d{9}$/.test(newAccount.phone)) {
        return toast.error('Invalid Indian phone number');
      }
      const response = await axios.post(`${API_URL}/api/v1/users/fund-account`, {
        userId: current_user_ids,
        ...newAccount
      });

      if (response.data.success) {
        toast.success('Bank account added successfully!');
        setBankAccounts([...bankAccounts, {
          fundAccountId: response.data.fundAccountId,
          last4: newAccount.accountNumber.slice(-4),
          bankName: 'Bank Name' // You might want to fetch actual bank name from IFSC
        }]);
        setNewAccount({ name: '',phone:'', email:'', accountNumber: '', ifscCode: '' });
      }
    } catch (error) {

      if(error.response?.status === 500) {
        setError('Invalid IFSC Code in Bank Account.');
        return;
      }
      toast.error(error.response?.data?.message || 'Failed to add account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl transform transition hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-indigo-100 mb-2 flex items-center gap-2">
                <FaChartLine className="w-5 h-5" /> Available Balance
              </h2>
              <div className="text-4xl font-bold text-white">
                ₹{balance ? balance.toFixed(2) : "0.00"}
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiArrowUpRight className="w-6 h-6 text-green-600" /> Withdraw Funds
            </h3>
            <form onSubmit={handleWithdrawal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-gray-500" /> Amount (INR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    required
                  />
                  <span className="absolute left-3 top-3 text-gray-400">
                    ₹
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <FiCreditCard className="w-4 h-4 text-gray-500" /> Select Bank Account
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  required
                >
                  <option value="">Choose an account</option>
                  {bankAccounts?.map((account) => (
                    <option key={account.fundAccountId} value={account.fundAccountId}>
                      {account.bankName} ****{account.last4}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedAccount || !amount}
              >
                Initiate Withdrawal
              </button>
            </form>
          </div>

          {/* Add Bank Account Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiCreditCard className="w-6 h-6 text-blue-600" /> Add Bank Account
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Account Holder Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    required
                  />
                </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={newAccount.email}
              onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
              required
            />
          </div>


 {/* Phone Field */}
 <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={newAccount.phone}
              onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
              pattern="[6-9]{1}[0-9]{9}"
              title="10-digit Indian phone number"
              required
            />
          </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Account Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">IFSC Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.ifscCode}
                    onChange={(e) => setNewAccount({...newAccount, ifscCode: e.target.value})}
                    required
                  />

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Save Bank Account
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiCheckCircle className="w-6 h-6 text-purple-600" /> Transaction History
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions?.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{transaction.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {transaction.transactionId}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <FiCreditCard className="w-12 h-12 text-gray-300 mb-4" />
                        No transactions found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;