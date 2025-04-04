import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiDollarSign,
  FiCreditCard,
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FaChartLine } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "https://perplexity-bd2d.onrender.com";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    phone: "",
    accountNumber: "",
    ifscCode: "",
    UPIId: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setTransactionsLoading(true);
        
        // Fetch user data
        const userResponse = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userId = userResponse.data.data._id;
        setCurrentUserId(userId);
        setBalance(userResponse.data.data.balance || 0);

        // Fetch transactions
        const transactionsResponse = await axios.get(
          `${API_URL}/api/v1/users/transactions-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page: currentPage,
              limit: 10
            }
          }
        );

        console.log("Transactions Response:", transactionsResponse.data);
        
        setTransactions(transactionsResponse.data.transactions || []);
        setTotalPages(transactionsResponse.data.totalPages || 1);

        // Set bank accounts
        if (userResponse.data.data.bankAccounts) {
          setBankAccounts(
            userResponse.data.data.bankAccounts.map((account) => ({
              fundAccountId: account.fundAccountId,
              last4: account.accountNumber?.slice(-4) || '****',
              bankName: account.bankName || "Bank",
              accountNumber: account.accountNumber,
              UPIId: account.UPIId,
              ifsc: account.ifsc
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load user data");
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchUserData();
  }, [currentPage]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const selectedBankAccount = bankAccounts.find(
        (acc) => acc.fundAccountId === selectedAccount
      );

      if (!selectedBankAccount) {
        toast.error("Selected account not found");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/v1/users/withdraw`,
        {
          userId: currentUserId,
          amount: parseFloat(amount),
          accountNumber: selectedBankAccount.accountNumber,
          UPIId: selectedBankAccount.UPIId,
          ifsc: selectedBankAccount.ifsc,
          fundAccountId: selectedAccount,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      if (response.data.success) {
        toast.success("Withdrawal initiated successfully!");
        setBalance((prev) => prev - parseFloat(amount));
        setAmount("");
        // Refresh transactions
        const transactionsResponse = await axios.get(
          `${API_URL}/api/v1/users/transactions-history/${currentUserId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            params: { page: 1, limit: 10 }
          }
        );
        setTransactions(transactionsResponse.data.transactions || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newAccount.email)) {
        return toast.error("Invalid email address");
      }
      if (!/^[6-9]\d{9}$/.test(newAccount.phone)) {
        return toast.error("Invalid Indian phone number");
      }
      if (newAccount.UPIId && !/^[a-zA-Z0-9.-]+@[a-zA-Z]+$/.test(newAccount.UPIId)) {
        setError('Invalid UPI ID format (e.g., name@bank)');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/v1/users/fund-account`,
        {
          userId: currentUserId,
          ifsc: newAccount.ifscCode,
          UPIId: newAccount.UPIId,
          ...newAccount,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      if (response.data.success) {
        toast.success("Bank account added successfully!");
        setBankAccounts([
          ...bankAccounts,
          {
            fundAccountId: response.data.fundAccountId,
            last4: newAccount.accountNumber.slice(-4),
            bankName: response.data.bankName || "Bank",
            accountNumber: newAccount.accountNumber,
            UPIId: newAccount.UPIId,
            ifsc: newAccount.ifscCode
          }
        ]);
        setNewAccount({
          name: "",
          phone: "",
          email: "",
          accountNumber: "",
          ifscCode: "",
          UPIId: "",
        });
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setError("Invalid IFSC Code in Bank Account.");
      } else {
        toast.error(error.response?.data?.message || "Failed to add account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
                  <span className="absolute left-3 top-3 text-gray-400">₹</span>
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
                  {bankAccounts.map((account) => (
                    <option
                      key={account.fundAccountId}
                      value={account.fundAccountId}
                    >
                      {account.bankName} ****{account.last4}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedAccount || !amount || isLoading}
              >
                {isLoading ? "Processing..." : "Initiate Withdrawal"}
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
                  <label className="block text-sm font-medium text-gray-600">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.name}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.email}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.phone}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, phone: e.target.value })
                    }
                    pattern="[6-9]{1}[0-9]{9}"
                    title="10-digit Indian phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.accountNumber}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        accountNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.ifscCode}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        ifscCode: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newAccount.UPIId}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, UPIId: e.target.value })
                    }
                    placeholder="yourname@upi"
                    pattern="^[a-zA-Z0-9.-]+@[a-zA-Z]+$"
                    title="Enter a valid UPI ID (e.g., example@upi)"
                  />
                </div>

                {error && (
                  <div className="mb-4 mt-[10px] p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg flex items-center animate-fade-in">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding Account...
                  </div>
                ) : (
                  "Save Bank Account"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiCheckCircle className="w-6 h-6 text-purple-600" /> Transaction History
          </h3>
          {transactionsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
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
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
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
                          {transaction._id?.slice(-8) || 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-400"
                      >
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;