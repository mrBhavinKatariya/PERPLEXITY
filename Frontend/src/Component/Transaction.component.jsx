
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiCheckCircle,
    FiCreditCard,
    FiXCircle,
    FiClock,
    FiCopy,
    FiSearch,
    FiFilter,
    FiArrowDown,
    FiArrowUp,
    FiChevronLeft,
    FiChevronRight
  } from 'react-icons/fi';
  import { motion } from 'framer-motion';


  const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/users/transactions`, {
          params: {
            page: currentPage,
            search: searchQuery,
            status: filterStatus,
            sortBy: sortConfig.key,
            sortDir: sortConfig.direction
          }
        });
        
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, searchQuery, filterStatus, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination controls
    const Pagination = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 mt-8"
    >
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
            } transition-all`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
        {/* Enhanced Header */}
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

        {/* Modern Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="py-2.5 px-4 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFilter className="text-indigo-600" />
            <span>Sorted by: {sortConfig.key} ({sortConfig.direction})</span>
          </div>
        </motion.div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex grid-cols-4  justify-between  px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <button
                  className="flex items-center gap-2 text-left"
                  onClick={() => requestSort('date')}
                >
                  Date
                  {sortConfig.key === 'date' && (
                    sortConfig.direction === 'asc' ? 
                    <FiArrowUp className="w-4 h-4" /> : 
                    <FiArrowDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="flex items-center gap-2 text-left"
                  onClick={() => requestSort('amount')}
                >
                  Amount
                  {sortConfig.key === 'amount' && (
                    sortConfig.direction === 'asc' ? 
                    <FiArrowUp className="w-4 h-4" /> : 
                    <FiArrowDown className="w-4 h-4" />
                  )}
                </button>
                <div>Status</div>
                <div>Transaction </div>
              </div>

              <div className="divide-y divide-gray-100">
  {transactions && transactions.length > 0 ? (
    transactions.map((transaction) => (
      <motion.div
        key={transaction._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 hover:bg-indigo-50 transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(transaction.createdAt).toLocaleTimeString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">₹{transaction.amount}</span>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : transaction.status === 'failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {transaction.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600">{transaction.transactionId}</span>
          <FiCopy
            className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => navigator.clipboard.writeText(transaction.transactionId)}
          />
        </div>
      </motion.div>
    ))
  ) : (
    <div className="p-12 text-center">
      <div className="inline-block p-4 mb-4 bg-indigo-100 rounded-full">
        <FiCreditCard className="w-12 h-12 text-indigo-600" />
      </div>
      <h4 className="text-gray-600 font-medium">No transactions found</h4>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your filters or make a new transaction
      </p>
    </div>
  )}
</div>

{/* <div className="divide-y divide-gray-100">
  {transactions && transactions.length > 0 ? (
    transactions.map((transaction) => (
      <motion.div
        key={transaction._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-indigo-50 transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(transaction.createdAt).toLocaleTimeString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">₹{transaction.amount}</span>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : transaction.status === 'failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {transaction.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600">{transaction.transactionId}</span>
          <FiCopy
            className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => navigator.clipboard.writeText(transaction.transactionId)}
          />
        </div>
      </motion.div>
    ))
  ) : (
    <div className="p-12 text-center">
      <div className="inline-block p-4 mb-4 bg-indigo-100 rounded-full">
        <FiCreditCard className="w-12 h-12 text-indigo-600" />
      </div>
      <h4 className="text-gray-600 font-medium">No transactions found</h4>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your filters or make a new transaction
      </p>
    </div>
  )}
</div> */}
            </motion.div>
          )}
        </div>

        {totalPages > 1 && <Pagination />}
      </div>
    </div>
  );
};


export default TransactionHistory;

            