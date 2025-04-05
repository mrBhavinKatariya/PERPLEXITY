import { useEffect, useState } from 'react';
import { HiCurrencyRupee, HiUserCircle, HiCheckBadge, HiGift } from 'react-icons/hi2';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

const ReferralEarnings = () => {
  const [userData, setUserData] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  // Fetch current user and referral data together
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view data');
          return;
        }

        // Parallel API calls
        const [userResponse, earningsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/v1/users/current-user`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/v1/users/referral/earnings`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Set user data
        setUserData({
          ...userResponse.data.data,
          balance: userResponse.data.data.balance || 0
        });

        // Set referral data
        setTotalEarnings(earningsResponse.data.totalEarnings || 0);
        setEarnings(earningsResponse.data.earnings || []);
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data formatting functions
  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton height={150} className="rounded-xl" />
          <Skeleton height={150} className="rounded-xl" />
        </div>
        <Skeleton count={5} height={80} className="mb-4 rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Total Referral Earnings</h2>
              <p className="text-4xl font-semibold flex items-center">
                <HiCurrencyRupee className="mr-2 w-8 h-8" />
                {formatCurrency(totalEarnings)}
              </p>
            </div>
            <HiGift className="w-16 h-16 opacity-75" />
          </div>
        </div>

        {/* User Balance Card */}
        <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Balance</h2>
              <p className="text-4xl font-semibold flex items-center">
                <HiCurrencyRupee className="mr-2 w-8 h-8" />
                {formatCurrency(userData?.balance)}
              </p>
            </div>
            <HiUserCircle className="w-16 h-16 opacity-75" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold p-6 border-b border-gray-100">
          Referral Transactions
        </h3>

        {earnings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No referral earnings yet
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {earnings.map((earning) => (
              <div key={earning._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <HiUserCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {earning.referredUser?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(earning.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-green-600">
                      <HiCheckBadge className="w-5 h-5" />
                      <span className="font-semibold">
                        +{formatCurrency(earning.amount)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Commission Earned
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralEarnings;