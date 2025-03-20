import React, { useState, useEffect } from 'react';
import { HiCurrencyRupee, HiArrowCircleLeft, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const WithdrawalPage = ({ user, onClose }) => {
  const [balance, setBalance] = useState(2500.00);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock transaction history - replace with actual API call
  const mockTransactions = [
    { id: 1, amount: 500, status: 'Completed', date: '2024-03-15', method: 'UPI' },
    { id: 2, amount: 1000, status: 'Pending', date: '2024-03-14', method: 'Bank Transfer' },
  ];

  useEffect(() => {
    // Fetch withdrawal history
    const fetchWithdrawals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/transactions/withdrawals`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(response.data.data);
      } catch (err) {
        setTransactions(mockTransactions); // Remove this line in production
        console.error("Error fetching withdrawals:", err);
      }
    };

    fetchWithdrawals();
  }, []);

  const validateForm = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (amount > balance) {
      setError('Insufficient balance');
      return false;
    }
    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actual API call would look like:
      // const token = localStorage.getItem("token");
      // await axios.post(`${API_URL}/api/v1/transactions/withdraw`, {
      //   amount: parseFloat(amount),
      //   paymentMethod
      // }, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess('Withdrawal request submitted successfully!');
      setBalance(prev => prev - parseFloat(amount));
      setAmount('');
      setTransactions(prev => [
        {
          id: Date.now(),
          amount: parseFloat(amount),
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod.toUpperCase()
        },
        ...prev
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <button
        onClick={onClose}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <HiArrowCircleLeft className="mr-2" /> Back to Wallet
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center">
                <HiCurrencyRupee className="mr-2 text-green-500" />
                Available Balance
              </h2>
              <p className="text-gray-500 text-sm">Withdrawable amount</p>
            </div>
            <div className="text-3xl font-bold">₹{balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Withdraw Funds</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <HiXCircle className="mr-2" /> {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <HiCheckCircle className="mr-2" /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter withdrawal amount"
                step="0.01"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paytm">Paytm Wallet</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Withdrawal History</h3>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No withdrawal history found</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">₹{transaction.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{transaction.method}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      transaction.status === 'Completed' ? 'text-green-600' : 
                      transaction.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {transaction.status}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;