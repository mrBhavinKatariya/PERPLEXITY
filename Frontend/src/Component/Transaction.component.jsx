import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiCheckCircle, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCreditCard,
  FiLoader
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const API_URL =
  import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      // Get current user
      const userResponse = await axios.get(
        `${API_URL}/api/v1/users/current-user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const userId = userResponse.data.data._id;
      setCurrentUserId(userId);

      // Fetch transactions
      const response = await axios.get(
        `${API_URL}/api/v1/users/transactions-history/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: 10 }
        }
      );

      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
      setIsPageChanging(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setIsPageChanging(true);
    setCurrentPage(newPage);
  };

  // Skeleton loader for table rows
  const SkeletonRow = () => (
    <motion.tr 
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </td>
    </motion.tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiCheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-500 mt-1">
                All your financial transactions in one place
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transaction Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <SkeletonRow key={index} />
                    ))}
                  </>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <motion.tr
                      key={transaction.transactionId || transaction._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
  {transaction.date ? (
    new Date(
      // Convert DD/MM/YYYY to YYYY-MM-DD format
      transaction.date.split('/').reverse().join('-')
    ).toLocaleDateString('en-IN')
  ) : (
    <span className="text-red-500">Invalid Date</span>
  )}
</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{transaction.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {transaction.transactionId || transaction._id?.slice(-8) || 'N/A'}
                      </td>
                    </motion.tr>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || isPageChanging}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  currentPage === 1 || isPageChanging
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isPageChanging && currentPage > 1 ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiChevronLeft className="w-5 h-5" />
                )}
                Previous
              </motion.button>
              
              <div className="text-sm text-gray-600">
                {isPageChanging ? (
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Loading...
                  </motion.div>
                ) : (
                  `Page ${currentPage} of ${totalPages}`
                )}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || isPageChanging}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  currentPage === totalPages || isPageChanging
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                {isPageChanging && currentPage < totalPages ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <FiChevronRight className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;