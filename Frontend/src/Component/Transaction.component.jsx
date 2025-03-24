import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCreditCard, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_URL =
  import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        // Get current user
        const userResponse = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
          { headers: { Authorization: `Bearer ${token}` }, signal }
        );
        
        const userId = userResponse.data.data._id;
        setCurrentUserId(userId);

        // Fetch transactions
        const response = await axios.get(
          `${API_URL}/api/v1/users/transactions-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: currentPage,
              limit: 10
            },
            signal
          }
        );

        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        if (!axios.isCancel(error)) {
          const message = error.response?.data?.message || error.message;
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.clear();
            window.location.href = '/login';
          } else {
            toast.error(`Error: ${message}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    return () => abortController.abort();
  }, [currentPage]);

  const Pagination = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 mt-8"
    >
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <FiChevronLeft className="w-5 h-5" />
        Previous
      </button>
      
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              currentPage === i + 1
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-white border hover:bg-indigo-50 text-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        Next
        <FiChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FiCreditCard className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-500 mt-1">
                Track all your financial activities in one place
              </p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
  {loading ? (
    <div className="p-8 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
      ))}
    </div>
  ) : (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header row - changed to grid */}
      <div className="grid grid-cols-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="text-left">Date</div>
        <div className="text-center">Amount</div>
        <div className="text-right">Type</div>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <motion.div
              key={transaction.date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 px-6 py-4 hover:bg-indigo-50 transition-colors"
            >
              <div className="text-left">{transaction.date}</div>
              <div className={`text-center font-medium ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{transaction.amount}
              </div>
              <div className="text-right capitalize">{transaction.type}</div>
            </motion.div>
          ))
        ) : (
          <div className="p-6 sm:p-12 text-center">
            <div className="inline-block p-3 sm:p-4 mb-3 sm:mb-4 bg-indigo-100 rounded-full">
              <FiCreditCard className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
            </div>
            <h4 className="text-sm sm:text-base text-gray-600 font-medium">
              No transactions found
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
              Your transaction history will appear here
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )}
</div>

        {totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
};

export default TransactionHistory;